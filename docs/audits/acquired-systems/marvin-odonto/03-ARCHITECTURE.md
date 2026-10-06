# 03 — ARCHITECTURE

---

## Arquitetura Observada

```
USUÁRIO (browser)
        ↓
   FRONTEND (React 19 + TanStack Router + Vite)
   Hospedado no Blink (blinkusercontent.com / blinkpowered.com)
        ↓
   BLINK AUTH (email/password, JWT)
        ↓ token Bearer
   BACKEND (Hono — edge function no Blink)
   URL: https://LAST8CHARS.backend.blink.new
        ↓
   BLINK DATABASE (SQLite gerenciado)
   Acesso via @blinkdotnew/sdk blink.db
        ↓
   EXTERNAL (NENHUM obrigatório)
   WhatsApp: link manual apenas
```

### Camadas internas (Frontend)

```
src/
├── blink/
│   ├── client.ts       → createClient(@blinkdotnew/sdk) — singleton Blink
│   └── backend.ts      → callBackend() — HTTP para /api/*
│
├── integrations/supabase/
│   ├── client.ts       → supabase = { from: wrap(callBackend), auth: wrap(blink.auth) }
│   └── compat.ts       → createBlinkDataClient() — shim Supabase→Blink
│
├── lib/
│   └── auth.tsx        → AuthProvider — usa supabase.auth (que é blink.auth por baixo)
│
├── routes/
│   ├── app/*           → área autenticada (clínica)
│   ├── master/*        → área super-admin
│   ├── demo/*          → demo local sem autenticação
│   └── agendar.$slug   → agendamento público
│
└── components/         → shadcn/ui + componentes de domínio
```

### Camadas internas (Backend)

```
backend/index.ts        → bundle ESM compilado (gerado por build:backend)
server/
├── index.ts            → Hono app — rotas: /health, /api/bootstrap,
│                          /api/query, /api/public/booking,
│                          /api/onboarding, /api/master/clinic
└── native/
    ├── context.ts      → makeContext() — auth + identidade + DB
    ├── database.ts     → classe Database — executor de queries com RBAC
    ├── schema.ts       → mapa de colunas por tabela
    ├── sql-adapter.ts  → adaptador blink.db → interface SQL padrão
    ├── bootstrap.ts    → inicialização do banco na primeira chamada
    ├── clinic.ts       → createClinic() — cadastro atômico
    ├── owner.ts        → ownerEligible() — lógica de super-admin
    └── public-booking.ts → agendamento público sem autenticação
```

---

## Fluxo de Autenticação

```
1. Usuário → blink.auth.signInWithEmail(email, password)
2. Blink retorna JWT
3. Frontend inclui JWT em Bearer header em todas as chamadas
4. Backend: blink.auth.verifyToken(token) → { userId, email, projectId }
5. Backend verifica OWNER_PROJECT_ID === BLINK_PROJECT_ID (anti-template-clone)
6. Backend carrega roles do banco → monta Identity { userId, email, master, clinicaId, role }
7. Todas as queries passam por Database.scope() → injeta clinica_id automaticamente
```

---

## Multi-tenancy

```
Modelo: clinica_id em cada tabela + scope injection no backend

Tenant isolation:
- CONFIRMADO por teste: "cada clínica enxerga somente seus pacientes" ✅
- CONFIRMADO: "referências entre clínicas são rejeitadas inclusive no banco" ✅
- Triggers SQLite reforçam FKs dentro da mesma clínica
```

---

## Arquitetura Independente Sugerida (sem Blink)

```
USUÁRIO (browser)
        ↓
   FRONTEND (mesmo código React — deploy em Vercel/Netlify)
        ↓
   SUPABASE AUTH (substituição 1:1 — só muda client.ts)
        ↓ token JWT Supabase
   BACKEND (mesmo Hono — deploy como Vercel Edge Function / Cloudflare Worker)
        ↓
   SUPABASE POSTGRES (substituição do SQLite — exige converter schema)
   OU: Cloudflare D1 (SQLite compatível — migração praticamente zero)
        ↓
   EXTERNAL (igual — sem mudança)
```

### Componentes para migração

| Componente | Ação | Esforço |
|---|---|---|
| `src/blink/client.ts` | Substituir por `createClient(@supabase/supabase-js)` | XS |
| `src/blink/backend.ts` | Manter — chamadas HTTP são agnósticas | KEEP |
| `src/integrations/supabase/client.ts` | Usar cliente Supabase real | XS |
| `src/integrations/supabase/compat.ts` | Remover shim, usar Supabase nativo | S |
| `server/native/sql-adapter.ts` | Adaptar para Supabase client ou Postgres | S |
| `server/native/context.ts` | Trocar `blink.auth.verifyToken` por `supabase.auth.getUser` | XS |
| `scripts/native/schema.sql` | Converter SQLite → PostgreSQL (tipos, triggers) | M |
| `scripts/native/bootstrap.sql` | Converter triggers SQLite → Postgres functions | M |
| Deploy frontend | Vercel / Netlify | XS |
| Deploy backend | Vercel Edge Functions / Cloudflare Workers | S |

**Alternativa de menor esforço**: Cloudflare D1 (SQLite-compatível) + Cloudflare Workers. Reduziria a migração do banco de M para XS.
