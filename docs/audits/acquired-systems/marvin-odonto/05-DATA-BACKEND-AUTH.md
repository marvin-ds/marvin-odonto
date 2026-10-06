# 05 — DATA, BACKEND & AUTH

---

## Banco de Dados

### Engine

```
FORNECEDOR: Blink (gerenciado)
ENGINE: SQLite
LOCAÇÃO: Cloud Blink (não acessível diretamente)
```

### Schema — 14 Tabelas

| Tabela | Descrição | Multi-tenant |
|---|---|---|
| `app_config` | Configurações globais do sistema | NÃO (global) |
| `clinica` | Clínicas (tenants) | — |
| `paciente` | Pacientes da clínica | `clinica_id` |
| `profissional` | Dentistas/profissionais | `clinica_id` |
| `procedimento` | Catálogo de procedimentos | `clinica_id` |
| `consulta` | Agendamentos | `clinica_id` |
| `financeiro` | Lançamentos financeiros | `clinica_id` |
| `orcamento` | Orçamentos | `clinica_id` |
| `tratamento` | Tratamentos em andamento | `clinica_id` |
| `historico_clinica` | Prontuário/histórico | `clinica_id` |
| `membro_equipe` | Equipe da clínica (autorizados) | `clinica_id` |
| `profiles` | Mapeamento userId → email | — |
| `user_roles` | Roles globais (super_admin) | — |
| `template_owner` | Controle do proprietário do template | — |

### Reproducibilidade do Banco

```
REPRODUCIBILITY: YES

Evidência:
- scripts/native/schema.sql — DDL completo (CREATE TABLE + índices)
- scripts/native/bootstrap.sql — dados iniciais + triggers de negócio
- tests/domain.test.ts usa DatabaseSync(":memory:") + ambos arquivos — CONFIRMADO funcional
```

**Pergunta crítica**: "Um novo dev, com acesso legítimo, consegue reconstruir o banco do zero?"
**Resposta**: `YES` — basta executar `schema.sql` + `bootstrap.sql` em qualquer SQLite.

### Triggers de Negócio (confirmados em bootstrap.sql)

- `native_orcamento_approve` — aprovação cria tratamento + lançamento financeiro atomicamente
- `native_orcamento_approved_lock` — orçamento aprovado não pode ser modificado
- `native_orcamento_insert_pending` — não pode inserir orçamento já aprovado
- `native_orcamento_delete_lock` — orçamento aprovado não pode ser deletado
- Triggers de FK: `ref_*_INSERT` e `ref_*_UPDATE` para todas as tabelas relacionadas

### Dados Existentes

```
BANCO: vazio por padrão — cada cópia/instância inicia limpa
DADOS_DO_CRIADOR: NÃO há transferência de dados entre instâncias
SEEDS_NECESSÁRIOS: NÃO (bootstrap.sql cria apenas app_config com defaults)
DEMO_DATA: frontend-only (src/lib/demo-seed.ts) — não persistido
```

---

## Backend

### Rotas Confirmadas

| Rota | Método | Auth | Função |
|---|---|---|---|
| `/health` | GET | Anônimo | Health check + DB connected |
| `/api/bootstrap` | GET | Obrigatório | Estado inicial (clinica, membro, isSuperAdmin) |
| `/api/query` | POST | Obrigatório | Executor genérico de queries RBAC |
| `/api/public/booking` | POST | Anônimo | Agendamento público (catalog/slots/book) |
| `/api/onboarding` | POST | Obrigatório | Criar clínica (onboarding) |
| `/api/master/clinic` | POST | Obrigatório (master) | Criar clínica (via painel master) |

### Executor de Queries (`/api/query`)

O backend expõe um único endpoint `POST /api/query` que aceita um `QuerySpec`:
```typescript
{
  table: string
  action: 'select' | 'insert' | 'update' | 'delete'
  filters: FilterSpec[]
  payload?: Record<string, unknown>
  columns?: string
  orders?: OrderSpec[]
  limit?: number
  offset?: number
  cardinality?: 'one' | 'maybe'
  head?: boolean
}
```

**Segurança**: O `Database.scope()` injeta automaticamente `clinica_id = ?` em TODA query. Impossível acessar dados de outra clínica pelo endpoint `/api/query`.

---

## Autenticação

```
PROVIDER: Blink Auth (email/password)
MECANISMO: JWT (Bearer token)
VERIFICAÇÃO: blink.auth.verifyToken(token) no backend
SIGNUP: email/password
RECOVERY: blink.auth.sendPasswordResetEmail()
CHANGE_PASSWORD: blink.auth.changePassword() ou confirmPasswordReset()
OAUTH: NÃO configurado
MAGIC_LINK: NÃO configurado
SSO: NÃO
```

### Portabilidade da Auth

A `src/integrations/supabase/client.ts` implementa um shim completo de compatibilidade:
- `auth.getUser()` → wraps `blink.auth.currentUser()`
- `auth.signInWithPassword()` → wraps `blink.auth.signInWithEmail()`
- `auth.signUp()` → wraps `blink.auth.signUp()`
- `auth.signOut()` → wraps `blink.auth.signOut()`
- `auth.onAuthStateChange()` → wraps `blink.auth.onAuthStateChanged()`
- `auth.updateUser()` → wraps `blink.auth.changePassword()` / `confirmPasswordReset()`

**Implicação**: substituir por Supabase Auth real requer mudar apenas `src/integrations/supabase/client.ts`. Todo o app usa `supabase.auth.*` que já está abstraído.

---

## Autorização (RBAC)

### Roles disponíveis

```
super_admin  → painel Master, pode operar em qualquer clínica
owner        → proprietário da clínica, acesso total ao tenant
admin        → admin da clínica
dentista     → dentista (lê/escreve pacientes, consultas, tratamentos, orçamentos)
recepcionista→ agenda consultas, gerencia pacientes e orçamentos
auxiliar     → acesso básico a pacientes e consultas
financeiro   → acesso a financeiro apenas
```

### writeRoles por tabela (CONFIRMADO no código)

```typescript
clinica:           ['owner','admin']
membro_equipe:     ['owner']
profissional:      ['owner','admin']
procedimento:      ['owner','admin']
paciente:          ['owner','admin','dentista','recepcionista','auxiliar']
consulta:          ['owner','admin','dentista','recepcionista']
historico_clinica: ['owner','admin','dentista']
tratamento:        ['owner','admin','dentista']
orcamento:         ['owner','admin','dentista','recepcionista']
financeiro:        ['owner','admin','financeiro']
```

**Classificação de segurança**: GOOD. RBAC server-side, verificado por teste.

---

## Storage

```
STORAGE_PROVIDER: NENHUM (nativo)
FOTOS_PROFISSIONAL: logo_url / foto_url são TEXT (URLs externas)
UPLOADS: NÃO implementado no sistema atual
BUCKETS: NENHUM
```

Não existe mecanismo de upload de arquivos. `logo_url` e `foto_url` armazenam apenas URLs — presumivelmente configuradas manualmente ou via URL externa. Sem evidência de Blink Storage sendo usado.
