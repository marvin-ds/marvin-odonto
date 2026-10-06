# 10 — FINANCIAL VIABILITY

---

## Premissas

```
CÂMBIO_REFERÊNCIA: USD 1 = BRL 5.50 (outubro 2026)
MODELO: SaaS B2B mensal, faturamento por clínica
REGIÃO: Brasil (mercado primário)
NOTA: Todas as estimativas são projeções — não há dados financeiros reais do sistema atual
```

---

## CAPEX — Custo de Adoção

### Migração da Plataforma Blink

| Item | Estimativa | Referência |
|---|---|---|
| Backend: sql-adapter + context.ts | 8h engenharia | Simples (adaptadores isolados) |
| Auth: shim client.ts (Blink → Supabase real) | 4h engenharia | Shim já existe |
| Schema SQLite → PostgreSQL (via Supabase) | 20h engenharia | Triggers precisam reescrita PL/pgSQL |
| Frontend: ajuste env vars + deploy | 4h engenharia | Minimal |
| QA + testes pós-migração | 12h engenharia | Rerun dos 13 testes + smoke |
| Setup infraestrutura Vercel + Supabase | 4h DevOps | Config inicial |
| **Total Migração** | **52h** | ~1.5 semanas/1 engenheiro |

**Custo Migração (estimado)**: R$15.000–R$25.000 (tempo de eng sênior)

### Dívida Técnica a Resolver Antes do Lançamento

| Item | Estimativa | Prioridade |
|---|---|---|
| Rate limiting na rota pública | 4h | P1 — launch blocker |
| CORS restrito a domínio prod | 2h | P1 |
| LGPD básico (termos, consentimento) | 8h + advogado | P0 legal |
| Deletar cron-auth.ts e _migration/ | 1h | Limpeza |
| Renomear "AI Growth" | 2h | Honestidade de marketing |
| **Total Dívida Crítica** | **~17h + custo jurídico** | |

**CAPEX Total Estimado**: R$20.000–R$40.000 (incluindo consultoria LGPD)

---

## OPEX — Custo Operacional Mensal

### Infraestrutura (por escala)

| Tier | Clínicas | Supabase | Vercel | Total/mês |
|---|---|---|---|---|
| Bootstrap | 0–50 | Free | Hobby R$0 | ~R$0–R$55 |
| Early | 50–200 | Pro US$25 | Pro US$20 | ~R$248/mês |
| Growth | 200–1000 | Pro US$25 + addons | Pro US$20 | ~R$440–R$880/mês |
| Scale | 1000+ | Team US$599 | Team US$150 | ~R$4.100/mês |

**Observação**: SQLite → PostgreSQL no Supabase Pro tem limite de 8GB de banco; para >500 clínicas ativas com dados completos, pode ser necessário plano Team.

### Suporte e Manutenção

| Item | Custo/mês estimado | Observação |
|---|---|---|
| Engenharia (bug fixes, features) | R$8.000–R$15.000 | 0.5–1 dev dedicado |
| Suporte ao cliente (CS) | R$3.000–R$6.000 | 1 pessoa part-time |
| Marketing/vendas | R$5.000–R$20.000 | Variável por crescimento |
| **OPEX Total (early-stage)** | **~R$16.000–R$41.000/mês** | |

---

## Revenue Model

### Precificação Sugerida

| Plano | Preço | Target |
|---|---|---|
| Básico | R$99/mês | 1 dentista, sem agendamento online |
| Profissional | R$179/mês | Até 3 dentistas, agendamento online |
| Clínica | R$299/mês | Ilimitado + relatórios + priority support |
| Bundle Marvin | R$399/mês | Clínica + presença digital Marvin |

### Cenários de Break-Even

#### Cenário Conservador (ticket médio R$149)

| Métrica | Mês 6 | Mês 12 | Mês 24 |
|---|---|---|---|
| Clínicas ativas | 30 | 80 | 200 |
| MRR | R$4.470 | R$11.920 | R$29.800 |
| OPEX mínimo | R$16.000 | R$18.000 | R$22.000 |
| Break-even? | NÃO | NÃO | SIM |

**Break-even conservador**: ~Mês 18–20 com ~130 clínicas

#### Cenário Realista (ticket médio R$199 + bundle)

| Métrica | Mês 6 | Mês 12 | Mês 24 |
|---|---|---|---|
| Clínicas ativas | 50 | 150 | 400 |
| MRR | R$9.950 | R$29.850 | R$79.600 |
| OPEX | R$18.000 | R$22.000 | R$35.000 |
| Break-even? | NÃO | SIM | LUCRO |

**Break-even realista**: ~Mês 10–12 com ~110 clínicas

#### Cenário Otimista (bundle Marvin como principal canal)

| Métrica | Mês 6 | Mês 12 | Mês 24 |
|---|---|---|---|
| Clínicas ativas | 100 | 300 | 800 |
| MRR | R$39.900 | R$119.700 | R$319.200 |
| OPEX | R$20.000 | R$30.000 | R$55.000 |
| Break-even? | SIM | LUCRO | ESCALA |

**Break-even otimista**: Mês 6–8 aproveitando base de clientes Marvin existentes

---

## Unit Economics (Cenário Realista)

```
LTV (Life Time Value):
  Churn estimado: 3–5%/mês (setor SBSMB Brasil)
  LTV médio (3% churn, R$199): R$199 / 0.03 = R$6.633

CAC (Customer Acquisition Cost):
  Canal Marvin (upsell): R$150–R$300 (baixo — cliente já existe)
  Canal inbound (SEO/demo): R$400–R$800
  Canal outbound/vendas: R$800–R$1.500
  CAC médio estimado: R$400

LTV/CAC: R$6.633 / R$400 = 16.6x

AVALIAÇÃO: EXCELENTE (benchmark SaaS saudável é >3x)
```

---

## Riscos Financeiros

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Churn alto (clínicas costumam abandonar SaaS) | MÉDIA | ALTO | Onboarding forte + suporte proativo |
| Custo de suporte cresce com base | ALTA | MÉDIO | Documentação, self-service, automação |
| Competição agressiva de preços | MÉDIA | MÉDIO | Bundle Marvin como moat |
| LGPD enforcement (dados de saúde) | BAIXA-MÉDIA | ALTO | Consultoria jurídica antes do lançamento |
| Custo de migração maior que estimado | MÉDIA | BAIXO | Cloudflare D1 elimina reescrita de triggers |

---

## Comparativo: Build vs Buy vs Adapt

| Opção | Custo | Tempo | Risco |
|---|---|---|---|
| **Adapt** (este sistema) | R$20K–R$40K CAPEX | 2–3 meses | BAIXO |
| Build from scratch | R$200K–R$500K | 12–18 meses | ALTO |
| Comprar concorrente (white-label) | R$50K–R$200K/ano | 1 mês | MÉDIO (dependência) |
| Integração com Clinicorp/OdontCloud (API) | R$0 CAPEX + royalty | Imediato | MÉDIO (lock-in externo) |

**Conclusão FinOps**: Adaptar este sistema é a opção de menor custo total e menor risco.
O custo de migração é recuperado em ~6 meses com 50 clínicas pagantes.
