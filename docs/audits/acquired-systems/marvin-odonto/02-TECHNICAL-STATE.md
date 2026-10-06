# 02 — TECHNICAL STATE

---

## Estado do Repositório

```
repository: https://github.com/marvin-ds/marvin-odonto
project_path: /home/user/marvin-odonto
branch: claude/modest-ritchie-gf4kvu (audit branch)
branch_main: main
HEAD: 715c1ad — "fix: remove png lfs rule"
working_tree: CLEAN
untracked_files: NONE
commits_total: 3
commits_ahead_main: 0 (audit branch = main)
tags: NENHUM
default_branch: main
```

### Histórico Git

```
715c1ad  fix: remove png lfs rule
79d1a97  Update from Blink - 2026-10-05T10:20:42.652Z
e701e9c  chore: initialize main branch
```

**Observação**: 3 commits apenas. O commit `79d1a97` é um export automático da Blink (formato padrão de exportação da plataforma). O commit inicial é bootstrapping. O repositório foi criado muito recentemente (2026-10-05).

---

## Stack Verificada por Evidência

| Camada | Tecnologia | Evidência |
|---|---|---|
| Linguagem | TypeScript 5.8 | `package.json` devDependencies |
| Frontend framework | React 19 | `package.json` |
| Roteamento | TanStack Router 1.168 | `package.json`, `src/routeTree.gen.ts` |
| Estado assíncrono | TanStack Query 5 | `package.json` |
| Build tool | Vite 7.3 | `vite.config.ts` |
| Estilização | Tailwind CSS 4 | `vite.config.ts` |
| UI primitives | Radix UI | `package.json` (20+ pacotes) |
| Componentes | shadcn/ui | `components.json`, `src/components/ui/` |
| Backend framework | Hono 4.7 | `package.json`, `server/index.ts` |
| Runtime backend | Edge/ESM (Blink) | `build-backend.mjs` target browser |
| Banco de dados | SQLite (Blink managed) | `schema.sql` (SQLite syntax), `DatabaseSync` em tests |
| Auth | Blink Auth | `@blinkdotnew/sdk`, `blink.auth.*` |
| Validação | Zod 4 | `package.json` |
| Gráficos | Recharts 3 | `package.json` |
| Testes | Node.js `--test` built-in | `package.json scripts.test` |
| Package manager | npm | `package-lock.json` presente |

---

## Execução Local

| Etapa | Resultado | Detalhe |
|---|---|---|
| `npm install` | ✅ PASS | Dependências instaladas sem erros |
| `npm run typecheck` | ✅ PASS | Zero erros TypeScript |
| `npm run build:backend` | ✅ PASS | Bundle ESM gerado em `backend/index.ts` |
| `npm run build` | ✅ PASS | Frontend compilado em 11.4s |
| `npm test` | ✅ 13/13 PASS | Todos os testes de domínio passam |
| `npm run dev` (preview) | ⚠️ PARTIAL | UI carrega mas funcionalidade exige VITE_BLINK_PROJECT_ID + conta Blink ativa |

```
LOCAL_EXECUTION: PARTIAL
BLOCKERS:
- Funcionalidade runtime exige conta Blink ativa
- VITE_BLINK_PROJECT_ID e VITE_BLINK_PUBLISHABLE_KEY não estão no .env
- Backend hospedado no Blink não está disponível sem credenciais
```

---

## Qualidade de Engenharia

### Estrutura e Modularidade

O projeto segue uma estrutura clara:
- `server/native/` — lógica de domínio pura (testável sem infraestrutura)
- `src/blink/` — adaptador Blink (isolado, substituível)
- `src/integrations/supabase/` — shim de compatibilidade (abstrai Blink para API Supabase)
- `src/routes/` — páginas organizadas por seção (`app/`, `demo/`, `master/`)
- `shared/query.ts` — builder de queries compartilhado frontend/backend

### Pontos positivos

1. **Testes de domínio com in-memory SQLite** — os testes rodam sem nenhuma dependência externa. Isso é raro e excelente.
2. **Compat shim** — a camada `src/integrations/supabase/` abstrai a auth e o cliente de banco. Substituir Blink por Supabase real exige mudar apenas essa camada.
3. **RBAC server-side** — as permissões são verificadas no backend, não no frontend.
4. **Triggers SQLite para regras de negócio** — aprovação de orçamento → cria tratamento + financeiro é atômica via trigger.
5. **Hono** — backend framework leve e portável (roda em qualquer edge runtime).
6. **`shared/query.ts`** — builder de queries compartilhado entre frontend e backend evita duplicação.

### Pontos negativos

1. **`server/index.ts` minificado** — o arquivo foi exportado do Blink já minificado (uma linha). Dificulta leitura direta, mas o código real está em `server/native/*.ts` que é legível.
2. **`cron-auth.ts` órfão** — arquivo Lovable sem uso. Dead code que causa confusão.
3. **`_migration/supabase-types.ts`** — tipos Supabase gerados automaticamente que não correspondem ao banco SQLite atual. Indicam tentativa anterior (abortada) de migração para Supabase.
4. **Chunk grande no build** — `index-X2tC8xMn.js` tem 608KB (Recharts). Aviso no build, mas não é bloqueio.
5. **Sem CI/CD** — nenhum arquivo `.github/workflows/` encontrado.
6. **`demo-seed.ts`** — dados de demonstração hardcoded no frontend.

```
TECHNICAL_QUALITY: GOOD
```

---

## Reprodutibilidade

```
REPRODUCIBILITY: MOSTLY_REPRODUCIBLE

REQUIRES:
- Conta Blink ativa com projeto criado
- Secrets: OWNER_PROJECT_ID, OWNER_EMAIL, BLINK_PROJECT_ID, BLINK_SECRET_KEY
- Build vars: VITE_BLINK_PROJECT_ID, VITE_BLINK_PUBLISHABLE_KEY, VITE_BLINK_BACKEND_URL

SEM BLINK:
- Lógica de domínio (testes): FULLY_REPRODUCIBLE
- Build (frontend + backend bundle): FULLY_REPRODUCIBLE
- Sistema funcionando: NOT_REPRODUCIBLE
```
