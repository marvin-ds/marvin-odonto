import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { resetarSenhaAdmin } from "@/lib/clinica-admin.functions";
import { sendPasswordResetEmail } from "@/lib/email-client";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { brl, dateBR } from "@/lib/format";
import { toast } from "sonner";
import { MoreHorizontal, KeyRound, AlertTriangle, Copy } from "lucide-react";

export const Route = createFileRoute("/master/listaClinicas")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const resetFn = resetarSenhaAdmin;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [newCreds, setNewCreds] = useState<null | { email: string; senha: string }>(null);
  const [busy, setBusy] = useState(false);

  const { data: rows = [] } = useQuery({
    queryKey: ["master-clinicas"],
    queryFn: async () => (await supabase.from("clinica").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const setStatus = async (id: string, status_cobranca: "ativo" | "inadimplente" | "suspenso") => {
    const { error } = await supabase.from("clinica").update({ status_cobranca, ...(status_cobranca === "ativo" ? {status:"ativo"}: {}) }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Atualizado"); qc.invalidateQueries({ queryKey: ["master-clinicas"] }); }
  };


  return (
    <>
      <PageHeader title="Clínicas" description="Todas as clínicas da plataforma" />
      <DataTable
        rows={rows as any[]}
        searchKeys={["nome" as any, "owner_email" as any, "cnpj" as any]}
        columns={[
          { key: "nome", header: "Nome" },
          { key: "owner_email", header: "Admin" },
          { key: "plano", header: "Plano", render: (r: any) => <Badge>{r.plano}</Badge> },
          { key: "valor_mensal", header: "MRR", render: (r: any) => brl(r.valor_mensal) },
          { key: "status_cobranca", header: "Cobrança", render: (r: any) => <Badge variant={r.status_cobranca === "ativo" ? "default" : "destructive"}>{r.status_cobranca}</Badge> },
          { key: "created_at", header: "Criada", render: (r: any) => dateBR(r.created_at) },
          {
            key: "_a", header: "", className: "w-12 text-right", render: (r: any) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatus(r.id, "ativo")}>Ativar cobrança</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatus(r.id, "inadimplente")}>Marcar inadimplente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatus(r.id, "suspenso")} className="text-red-600">Suspender</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()=>{sessionStorage.setItem('odonto-clinic',r.id);window.location.assign('/app/Dashboard')}}>Abrir clínica</DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>{navigator.clipboard.writeText(`${window.location.origin}/entrar\nEntre com o email ${r.owner_email}.`);toast.success('Instruções de acesso copiadas')}}>Copiar instruções de acesso</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
        ]}
      />

    </>
  );
}

