# 04 — DEPENDENCIES

---

## Dependências Runtime Críticas

| Dependência | Categoria | Obrigatória | Substituível | Lock-in | Custo | Evidência |
|---|---|---|---|---|---|---|
| `@blinkdotnew/sdk` | Platform Runtime | SIM | SIM (Supabase) | ALTO | Plano Blink Pro necessário | `package.json`, `blink/client.ts` |
| Blink DB (SQLite) | Database | SIM | SIM (D1 / Supabase Postgres) | ALTO | Incluso no Blink | `sql-adapter.ts`, `schema.sql` |
| Blink Auth | Auth | SIM | SIM (Supabase Auth / Clerk) | ALTO | Incluso no Blink | `context.ts`, `client.ts` |
| Blink Hosting (backend) | Infra | SIM | SIM (Vercel Edge / CF Workers) | ALTO | Plano Blink Pro | `BLINK_BACKEND_URL` |
| Blink Hosting (frontend) | Infra | SIM | SIM (Vercel / Netlify) | ALTO | Plano Blink | `*.blinkusercontent.com` |

## Dependências Runtime — Sem Lock-in

| Dependência | Categoria | Obrigatória | Substituível | Custo | Evidência |
|---|---|---|---|---|---|
| `hono` | Backend framework | SIM | SIM (Express, Fastify) | Free/OSS | `server/index.ts` |
| `react` + `react-dom` 19 | Frontend | SIM | MODERADO (Vue, Svelte) | Free/OSS | `package.json` |
| `@tanstack/react-router` | Routing | SIM | SIM | Free/OSS | `package.json` |
| `@tanstack/react-query` | Data fetching | SIM | SIM | Free/OSS | `package.json` |
| `zod` | Validation | SIM | SIM | Free/OSS | `public-booking.ts` |
| `@radix-ui/*` | UI primitives | SIM | SIM | Free/OSS | `package.json` |
| `tailwindcss` | Styling | SIM | SIM | Free/OSS | `package.json` |
| `recharts` | Charts | SIM | SIM | Free/OSS | `Dashboard.tsx` |

## Dependências de Build

| Dependência | Uso |
|---|---|
| `vite` 7 | Build frontend |
| `esbuild` | Bundle backend |
| `typescript` 5.8 | Compilação |
| `tsx` | Testes sem transpilar |
| `eslint` + `prettier` | Qualidade |

## APIs Externas

**NENHUMA API externa obrigatória para funcionamento básico.**

| Serviço | Uso | Status |
|---|---|---|
| WhatsApp | Links manuais apenas (não API) | Opcional — sem custo |
| Email | Sem envio automático | AUSENTE |
| Google Maps | Ausente | AUSENTE |
| Pagamentos | Ausente | AUSENTE |
| SMS | Ausente | AUSENTE |
| OpenAI / Anthropic | Ausente | AUSENTE |

## Platform Lock-in — Lista Exata

**Se a conta Blink for desligada hoje, para de funcionar:**

1. Autenticação de usuários (login/logout/signup)
2. Banco de dados (todos os dados clínicos)
3. Backend functions (todas as operações de escrita e leitura)
4. Hospedagem do frontend
5. Sistema de senhas e recuperação

**O que CONTINUA funcionando sem Blink:**

1. O código-fonte (totalmente portável)
2. O schema do banco (reproduzível)
3. Os testes de domínio (SQLite in-memory)
4. O build (frontend + backend bundle)

## Saúde dos Pacotes

- Versões: todas recentes e mantidas
- Sem dependências diretas de Git
- Sem scripts pós-install suspeitos
- `@blinkdotnew/sdk` não tem repositório público verificável (pacote proprietário)
- `tailwindcss` v4 + `@tailwindcss/vite`: versão nova, algumas breaking changes vs v3, mas estável
