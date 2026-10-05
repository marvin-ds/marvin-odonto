import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { callBackend } from "@/blink/backend";
type Session=any;type User=any;
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export type Membro = {
  id: string;
  clinica_id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
};

export type Clinica = {
  id: string;
  nome: string;
  slug: string | null;
  status: string;
  status_cobranca: "ativo" | "inadimplente" | "suspenso";
  trial_ate: string | null;
  plano: string;
  valor_mensal: number;
  cor_primaria: string | null;
  logo_url: string | null;
};

type AuthCtx = {
  session: Session | null;
  user: User | null;
  membro: Membro | null;
  clinica: Clinica | null;
  clinicaId: string | null;
  isSuperAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [membro, setMembro] = useState<Membro | null>(null);
  const [clinica, setClinica] = useState<Clinica | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();

  const loadAll = async (uid: string | undefined, email: string | undefined) => {
    if (!uid) {
      setMembro(null); setClinica(null); setIsSuperAdmin(false); return;
    }
    const result=await callBackend('/api/bootstrap');
    setMembro(result.membro);setClinica(result.clinica);setIsSuperAdmin(result.isSuperAdmin);

  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e:any, s:any) => {
      setSession(s);
      setTimeout(() => { loadAll(s?.user?.id, s?.user?.email ?? undefined).catch(console.error).finally(()=>setLoading(false)); qc.clear(); }, 0);
    });
    supabase.auth.getSession().then(({ data }:any) => {
      setSession(data.session);
      loadAll(data.session?.user?.id, data.session?.user?.email ?? undefined).catch(console.error).finally(() => setLoading(false));
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{const color=clinica?.cor_primaria;if(color&&/^#[0-9a-f]{6}$/i.test(color))document.documentElement.style.setProperty('--brand',color);return()=>{document.documentElement.style.removeProperty('--brand')}},[clinica?.cor_primaria]);
  const signOut = async () => { await supabase.auth.signOut(); };
  const refresh = async () => { await loadAll(session?.user?.id, session?.user?.email ?? undefined); };

  return (
    <Ctx.Provider value={{
      session, user: session?.user ?? null, membro, clinica,
      clinicaId: membro?.clinica_id ?? null, isSuperAdmin, loading, signOut, refresh,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

