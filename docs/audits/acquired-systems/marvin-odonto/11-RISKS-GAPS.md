# 11 — RISKS & GAPS

---

## Registro de Riscos

### CRITICAL (bloqueia adoção imediata)

**RISK-C1: Dependência total do Blink**
```
DESCRIÇÃO: Auth, banco, backend e frontend dependem 100% da plataforma Blink.
           Se a Blink desligar, mudar preços, ou descontinuar o plano, o sistema para.
PROBABILIDADE: MÉDIA (Blink é startup; ciclo de vida incerto)
IMPACTO: CATASTRÓFICO — zero dados acessíveis
MITIGAÇÃO: Migrar para Supabase/Cloudflare antes do lançamento comercial
STATUS: Aberto — não mitigado até migração completa
```

**RISK-C2: LGPD — Dados de Saúde sem Compliance**
```
DESCRIÇÃO: Sistema armazena CPF, RG, alergias, doenças, prontuário clínico.
           Art. 11 LGPD exige tratamento especial para dados de saúde.
           Nenhum mecanismo de consentimento, portabilidade ou exclusão implementado.
PROBABILIDADE: ALTA (se operar comercialmente)
IMPACTO: ALTO — multa ANPD, responsabilidade civil, reputação
MITIGAÇÃO: Consultoria jurídica + implementação de:
           1. Termo de consentimento no agendamento público
           2. Endpoint de exportação de dados do paciente
           3. Endpoint de exclusão (right to be forgotten)
           4. Política de privacidade publicada
STATUS: Aberto — blocker para lançamento
```

---

### HIGH (resolve antes do lançamento)

**RISK-H1: CORS wildcard em produção**
```
DESCRIÇÃO: cors({ origin: '*' }) no backend
IMPACTO: Qualquer domínio pode fazer requisições ao backend
MITIGAÇÃO: Restringir para domínio de produção conhecido
ESFORÇO: 2h
```

**RISK-H2: Rate limiting ausente no endpoint público**
```
DESCRIÇÃO: /api/public/booking sem limite de requisições
IMPACTO: Spam de agendamentos falsos; consumo de recursos; poluição de dados
MITIGAÇÃO: Middleware de rate limit (hono-rate-limiter ou Cloudflare WAF)
ESFORÇO: 4h
```

**RISK-H3: Chave pública de template hardcoded**
```
DESCRIÇÃO: publishableKey e projectId hardcoded como fallback em client.ts
IMPACTO: Build sem env vars aponta para projeto original do template
MITIGAÇÃO: Remover fallbacks; adicionar validação de env vars no startup
ESFORÇO: 1h
```

---

### MODERATE

**RISK-M1: Sem CI/CD — nenhum scan automático de segurança**
```
DESCRIÇÃO: Sem pipeline de CI. Dependências vulneráveis passariam despercebidas.
MITIGAÇÃO: GitHub Actions com npm audit + eslint security na PR
ESFORÇO: S
```

**RISK-M2: Triggers SQLite precisam conversão para PostgreSQL**
```
DESCRIÇÃO: 4 triggers de negócio (aprovação de orçamento) em sintaxe SQLite.
           PostgreSQL usa PL/pgSQL — sintaxe diferente.
IMPACTO: Se migrar para Postgres sem converter: lógica crítica de negócio silenciosamente quebrada
MITIGAÇÃO: Reescrever triggers como funções PL/pgSQL + testes de regressão
           OU migrar para Cloudflare D1 (SQLite-compatível, triggers idênticos)
ESFORÇO: M (Postgres) / XS (D1)
```

**RISK-M3: sessionStorage para clinicaId**
```
DESCRIÇÃO: X-Clinic-Id vem de sessionStorage — XSS poderia trocar contexto de clínica
IMPACTO: Super-admin poderia ser redirecionado para clínica errada
MITIGAÇÃO: Backend já valida o header — risco residual baixo para usuários normais
ESFORÇO: XS (apenas para super_admin)
```

**RISK-M4: Sem testes de integração end-to-end**
```
DESCRIÇÃO: 13 testes cobrem apenas domínio (SQLite in-memory). Nenhum teste de UI, API HTTP, ou fluxo completo.
IMPACTO: Regressões em frontend/API passam invisíveis
MITIGAÇÃO: Playwright + vitest para rotas críticas
ESFORÇO: M
```

---

### LOW

**RISK-L1: Código minificado do backend**
```
DESCRIÇÃO: server/index.ts está minificado — dificulta manutenção e debugging
IMPACTO: Debug de produção é mais difícil; stack traces menos úteis
MITIGAÇÃO: Configurar source maps no esbuild
ESFORÇO: XS
```

**RISK-L2: Sem logs estruturados / observabilidade**
```
DESCRIÇÃO: Apenas console.error(). Sem Sentry, sem structured logging, sem métricas.
IMPACTO: Diagnóstico de problemas em produção é cego
MITIGAÇÃO: Sentry (frontend + backend) + structured logs
ESFORÇO: S
```

**RISK-L3: Sem .env.example**
```
DESCRIÇÃO: Nenhum arquivo de exemplo das variáveis de ambiente necessárias
IMPACTO: Onboarding de novos devs demorado; risco de commit acidental de secrets
MITIGAÇÃO: Criar .env.example com placeholders
ESFORÇO: XS
```

---

## Gaps Funcionais (vs. mercado)

| Gap | Importância no Mercado | Custo para Adicionar | Prioridade |
|---|---|---|---|
| Odontograma visual (mapa dental) | ALTA — padrão esperado | M–L | P1 |
| Lembretes automáticos (WhatsApp/Email) | MUITO ALTA | S (com Marvin infra) | P0 |
| Integração planos de saúde/convênios | ALTA | M | P2 |
| Exportação de relatórios (PDF/Excel) | MÉDIA | S | P2 |
| Assinatura digital de documentos | MÉDIA | M | P3 |
| Telemedicina/teleconsulta | BAIXA | L | P4 |
| App mobile | ALTA | L | P3 |
| Notificações push | BAIXA | S | P4 |
| Raio-X / uploads de arquivos | MÉDIA | S (com storage) | P2 |
| Multi-localidade por clínica | BAIXA | M | P4 |

---

## Gaps de Observabilidade

```
MONITORAMENTO_DE_ERROS: AUSENTE (sem Sentry ou equivalente)
LOGS_ESTRUTURADOS: AUSENTE (console.error apenas)
MÉTRICAS_DE_NEGÓCIO: AUSENTE (sem analytics de produto)
HEALTH_CHECK: PRESENTE (/health endpoint)
ALERTAS: AUSENTE
DASHBOARDS: AUSENTE
RASTREABILIDADE: AUSENTE (sem correlation IDs nas requisições)
```

**Impacto**: Sistema cego em produção. O primeiro incidente sério levará horas de debugging.

---

## Supply Chain Concerns

```
@blinkdotnew/sdk:
  - Pacote proprietário sem repositório público verificável
  - Nenhuma auditoria de código possível
  - Se Blink descontinuar, o pacote para de funcionar ou muda silenciosamente

Avaliação: RISCO DE SUPPLY CHAIN — justifica migração como prioridade
```

---

## Resumo de Risco Geral

```
RISCO_GERAL: MÉDIO-ALTO (pré-migração) → BAIXO-MÉDIO (pós-migração + LGPD)

BLOQUEADORES_DE_LANÇAMENTO:
  1. Migração da plataforma Blink (RISK-C1)
  2. LGPD básico implementado (RISK-C2)
  3. Rate limiting endpoint público (RISK-H2)
  4. CORS restrito (RISK-H1)

CRONOGRAMA_ESTIMADO_ATÉ_LANÇAMENTO: 8–12 semanas
```
