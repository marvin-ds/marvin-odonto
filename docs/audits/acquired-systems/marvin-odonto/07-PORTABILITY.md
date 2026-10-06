# 07 — PORTABILITY

---

## Portability Score

```
PORTABILITY_SCORE: 68/100
CLASSIFICAÇÃO: MIGRATION_REQUIRED
```

### Breakdown por bloco

| Bloco | Peso | Pontuação | Raciocínio |
|---|---|---|---|
| Código | 20% | 18/20 | Código portável, bem estruturado. -2 pela minificação do server/index.ts |
| Banco | 15% | 9/15 | Schema reproduzível, mas SQLite → Postgres exige conversão de triggers e tipos |
| Backend | 15% | 11/15 | Hono é portável; lógica é pura. -4 pelo sql-adapter acoplado ao Blink SDK |
| Auth | 10% | 5/10 | Shim de compat existe, mas auth é 100% Blink por baixo |
| APIs externas | 10% | 10/10 | ZERO dependências externas obrigatórias |
| Infraestrutura | 10% | 4/10 | Frontend + backend hospedados no Blink; zero config de deploy independente |
| Assets | 5% | 4/5 | Assets mínimos; apenas 1 imagem de demo |
| Configuração | 5% | 3/5 | VITE_BLINK_* vars; sem .env.example |
| Observabilidade | 5% | 2/5 | console.error apenas; sem logs estruturados, sem monitoring |
| Documentação | 5% | 2/5 | README é guia de uso do Blink; sem doc técnica de arquitetura |

**Total: 68/100 — MIGRATION_REQUIRED**

---

## Migration Map

| Componente atual | Dependência atual | Destino sugerido | Complexidade | Risco | Ação |
|---|---|---|---|---|---|
| `@blinkdotnew/sdk` auth | Blink Auth | Supabase Auth | S | BAIXO | REPLACE |
| Blink SQLite DB | Blink managed DB | Supabase Postgres OU Cloudflare D1 | M (Postgres) / XS (D1) | MÉDIO | REPLACE |
| `sql-adapter.ts` | Blink db client | Supabase client nativo | S | BAIXO | REPLACE |
| `context.ts` verifyToken | `blink.auth.verifyToken` | `supabase.auth.getUser(token)` | XS | BAIXO | REPLACE |
| Backend hosting | Blink edge function | Vercel Edge / Cloudflare Workers | S | BAIXO | REPLACE |
| Frontend hosting | Blink CDN | Vercel / Netlify | XS | BAIXO | REPLACE |
| `cron-auth.ts` | Lovable artifact (orphan) | DELETE | XS | NENHUM | REMOVE |
| `_migration/supabase-types.ts` | Artifact of old attempt | DELETE | XS | NENHUM | REMOVE |
| SQLite triggers (bootstrap.sql) | SQLite syntax | Postgres functions/triggers | M | MÉDIO | REBUILD |
| CORS `origin: '*'` | Permissivo | Restringir para domínio prod | XS | BAIXO | FIX |

---

## Dependency Exit Plan

### @blinkdotnew/sdk

```
CURRENT_DEPENDENCY: @blinkdotnew/sdk
WHY_IT_EXISTS: Auth + DB client + hosting providos pela plataforma Blink
WHAT_BREAKS_WITHOUT_IT: Tudo — auth, banco, backend, frontend
REPLACEMENT_OPTION: Supabase Auth + Supabase DB OU Cloudflare (D1 + Workers + Zero-Trust)
MIGRATION_DIFFICULTY: S (auth) + M (banco SQLite→Postgres) = M total
RISK: BAIXO — toda a lógica está isolada atrás de adaptadores
```

### Blink SQLite Database

```
CURRENT_DEPENDENCY: Blink managed SQLite
WHY_IT_EXISTS: Banco provido automaticamente pela plataforma
WHAT_BREAKS_WITHOUT_IT: Toda persistência de dados
REPLACEMENT_OPTION A: Supabase Postgres — schema.sql precisa conversão de tipos + triggers
REPLACEMENT_OPTION B: Cloudflare D1 — SQLite-compatível, triggers idênticos, migração ~zero
MIGRATION_DIFFICULTY: XS (D1) | M (Postgres)
RISK: BAIXO (D1) | MÉDIO (Postgres — triggers precisam ser reescritos como PL/pgSQL)
```

### Blink Hosting

```
CURRENT_DEPENDENCY: *.blinkusercontent.com / *.backend.blink.new
WHY_IT_EXISTS: Deploy automático pela plataforma
WHAT_BREAKS_WITHOUT_IT: Sistema offline
REPLACEMENT_OPTION: Vercel (frontend + edge functions) / Netlify / Cloudflare Pages + Workers
MIGRATION_DIFFICULTY: XS
RISK: BAIXO
```

---

## Esforço Total de Independência

| Área | Estimativa |
|---|---|
| Frontend (troca auth + compat shim) | XS |
| Backend (sql-adapter + context.ts) | S |
| Database (schema SQLite → Postgres) | M |
| Database (schema SQLite → D1) | XS |
| Infrastructure (deploy Vercel/Netlify) | XS |
| Security (CORS, CSP, env vars) | XS |
| QA (ajuste de testes + smoke) | S |
| **Total (via Supabase Postgres)** | **M** |
| **Total (via Cloudflare D1)** | **S** |
