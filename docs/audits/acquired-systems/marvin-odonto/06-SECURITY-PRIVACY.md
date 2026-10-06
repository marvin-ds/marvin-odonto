# 06 — SECURITY & PRIVACY

---

## Análise de Segurança

### P0 CRITICAL

Nenhum encontrado.

### P1 HIGH

**SEC-H1: Sem HTTPS enforceado em CORS**
```
Localização: server/index.ts
Evidência: cors({ origin: '*', ... })
Risco: CORS aberto permite que qualquer origin faça requests ao backend
Mitigação: Em produção Blink, o backend está em *.backend.blink.new — origin wildcard é aceitável
           para um edge function com auth via JWT. Porém ao migrar, restringir para origins conhecidas.
Severidade: P1 em migração; P3 no contexto Blink atual.
```

**SEC-H2: Arquivo Lovable órfão com referência a secrets**
```
Localização: src/integrations/supabase/cron-auth.ts
Evidência: process.env['LOVABLE_CRON_SECRET'] — variável de outra plataforma
Risco: BAIXO — arquivo não está importado em nenhum lugar do projeto.
       Mas indica que segredos de outra plataforma (Lovable) podem ter existido.
Ação recomendada: Deletar o arquivo. É dead code e cria confusão.
```

### P2 MODERATE

**SEC-M1: Chave publicável do template hardcoded**
```
Localização: src/blink/client.ts:4
Evidência: publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_08jRWkfnjJp8LfEktRPaTJWEqJQqdBPE'
           projectId: ... || 'odontocont-template-para-e7np747o'
Risco: Se um dev fizer build sem configurar as env vars, o sistema apontará para o
       projeto original do template. Isso poderia expor dados ou criar confusão.
Mitigação: O sistema já valida isso em backend.ts: verifica se o hostname pertence ao projeto.
           Porém a chave pública do template está no código — qualquer um pode usá-la para
           fazer chamadas de auth ao projeto original.
```

**SEC-M2: sessionStorage para clinicaId**
```
Localização: src/blink/backend.ts
Evidência: sessionStorage.getItem('odonto-clinic') → Header X-Clinic-Id
Risco: O clinicaId ativo é armazenado em sessionStorage. Um XSS poderia trocar esse valor
       e forçar o master a operar em outra clínica sem perceber.
Mitigação: O backend já valida: apenas super_admin usa X-Clinic-Id; outros usuários
           só têm acesso à própria clínica pelo membro_equipe.
Severidade: P2 apenas para super_admin que usa multi-clinic switching.
```

### P3 LOW

**SEC-L1: Sem rate limiting no agendamento público**
```
Localização: server/index.ts — /api/public/booking
Evidência: Sem middleware de rate limit na rota pública
Risco: Spam de agendamentos — dados falsos de pacientes
Mitigação: Blink pode ter rate limiting na borda; não verificável sem acesso
```

**SEC-L2: Sem CSP configurado**
```
Evidência: vite.config.ts — sem Content-Security-Policy
Risco: XSS menos mitigado
```

### P4 INFORMATIONAL

**SEC-I1: Sem CI/CD — sem scan automático de vulnerabilidades**
**SEC-I2: Sem dependency audit configurado (npm audit não está no pipeline)**

---

## Pontos Positivos de Segurança (CONFIRMADOS)

✅ **Todas as 14 tabelas têm `read: deny, write: deny`** no SDK público (security-policy.json)
✅ **SQL público proibido** (`raw_sql.allowed: false`)
✅ **Tenant isolation verificado por testes** (11 dos 13 testes cobrem isolamento e autorização)
✅ **Triggers SQLite impedem operações inconsistentes** (FK entre clínicas rejeitada no banco)
✅ **Primeiro visitante não vira Master** (ownerEligible() requer email verificado + OWNER_PROJECT_ID correto)
✅ **Owner da clínica não pode se promover a super_admin** (user_roles.insert bloqueado para não-master)
✅ **Orçamento aprovado é imutável** (trigger BEFORE UPDATE)
✅ **Email do membro só é vinculado ao user_id após verificação** (email_verified=1)
✅ **Proprietário da clínica não pode ser deletado** (membro com role=owner protegido)

---

## Privacidade e LGPD

### Dados Pessoais Coletados

| Tipo | Tabela | Campo | Sensível |
|---|---|---|---|
| Nome | paciente | nome | — |
| CPF | paciente | cpf | SIM — identificador único |
| RG | paciente | rg | SIM |
| Data de nascimento | paciente | data_nascimento | SIM |
| Telefone | paciente | telefone | SIM |
| Email | paciente | email | SIM |
| Endereço | paciente | endereco (JSON) | SIM |
| Alergias | paciente | alergias | SIM — dado de saúde |
| Doenças preexistentes | paciente | doencas_preexistentes | SIM — dado de saúde |
| Medicamentos em uso | paciente | medicamentos_uso | SIM — dado de saúde |
| Observações anamnese | paciente | observacoes_anamnese | SIM — dado de saúde |
| Prontuário | historico_clinica | descricao | SIM — dado de saúde |

### Dados financeiros

| Tipo | Tabela | Campo |
|---|---|---|
| Valor de procedimentos | orcamento, financeiro | valor, total |
| Forma de pagamento | financeiro | forma_pagamento |

### Avaliação LGPD

```
LGPD_REVIEW_REQUIRED: SIM

Razões:
1. Dados de saúde (Art. 11 LGPD — dados sensíveis — tratamento mais restritivo)
2. CPF, RG armazenados
3. Ausência de mecanismos explícitos de: consentimento, portabilidade, exclusão, anonimização
4. Sem política de privacidade implementada no sistema
5. Agendamento público coleta nome + telefone sem consentimento explícito

Nota: Este sistema opera dados de PACIENTES de terceiros (clínicas são o controlador;
      Marvin seria o operador). Responsabilidade contratual deve ser definida.
```

**Não emitindo parecer jurídico definitivo.** Revisão com advogado especializado em LGPD é necessária antes de operar com dados reais de pacientes.
