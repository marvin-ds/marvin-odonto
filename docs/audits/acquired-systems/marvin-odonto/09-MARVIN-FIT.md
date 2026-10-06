# 09 — MARVIN FIT

---

## Contexto: O que é Marvin

Marvin é uma operadora de serviços digitais para o segmento odontológico brasileiro, com foco em:
- Presença local digital para clínicas (SEO, GBP, reputação)
- CRM e automação de relacionamento com pacientes
- Ferramentas de gestão operacional

O OdontoControl (este sistema) se posiciona dentro do pilar de **gestão operacional de clínicas**.

---

## Framework: ENCONTRAR → ENTENDER → CONFIAR → CHAMAR

*(Adaptado de SKILL-COM-01 para contexto de fit estratégico)*

### ENCONTRAR — A clínica consegue descobrir o produto?

```
SITUAÇÃO_ATUAL: Sistema sem marca independente — chamado "OdontoControl"
                URL dependente do Blink (*.blinkusercontent.com)
                Zero presença própria — SEO, domínio, landing page: INEXISTENTES

PARA USO_MARVIN:
  - Marvin já tem capacidade de construir presença digital
  - Sistema pode ser oferecido como produto Marvin com marca própria
  - Canal de distribuição Marvin elimina a dependência de ENCONTRAR orgânico do sistema

SCORE_ENCONTRAR: 3/10 (sistema atual) → 8/10 (sob Marvin com distribuição própria)
```

### ENTENDER — A clínica entende o que o produto faz?

```
FORÇA:
  - Módulos bem nomeados: Agenda, Pacientes, Financeiro, Tratamentos
  - Onboarding implementado (src/routes/app/Onboarding.tsx)
  - Modo Demo funcional (sem cadastro)
  - QR code para link de agendamento

FRAQUEZA:
  - "AI Growth" é misleading — não é IA
  - Sem landing page explicativa
  - Sem documentação de usuário

SCORE_ENTENDER: 6/10
```

### CONFIAR — A clínica confia o suficiente para usar?

```
FORÇA:
  - Isolamento de dados por clínica comprovado por testes
  - HTTPS implícito via Blink hosting
  - Fluxo de aprovação de orçamento controlado

FRAQUEZA:
  - Sem política de privacidade implementada
  - Sem termos de uso
  - Sem SLA ou garantia de uptime comunicada
  - LGPD compliance não endereçado
  - Lock-in em plataforma Blink sem notoriedade no mercado

SCORE_CONFIAR: 4/10 (atual) → 7/10 (após migração + LGPD básico)
```

### CHAMAR — A clínica usa regularmente e indica?

```
ANÁLISE:
  - Produto funcional para fluxo diário (agenda + pacientes + financeiro)
  - Agendamento público é diferencial relevante para clínicas pequenas
  - Ausência de automações (email, WhatsApp real) limita retenção
  - Sem notificações, sem app mobile — baixo engajamento passivo

SCORE_CHAMAR: 5/10
```

### Score Composto ENCONTRAR/ENTENDER/CONFIAR/CHAMAR

```
Atual:    (3 + 6 + 4 + 5) / 4 = 4.5/10
Marvin:   (8 + 6 + 7 + 6) / 4 = 6.75/10
```

---

## Classificação do Ativo

### Modo de Uso Potencial

| Modalidade | Viabilidade | Observação |
|---|---|---|
| Produto standalone (SaaS independente) | ALTA | Requer migração de plataforma |
| Módulo dentro de produto Marvin maior | ALTA | Mais eficiente que standalone |
| Micro-SaaS para nicho dental | ALTA | Mercado existe e está mal atendido |
| Ferramenta interna Marvin | BAIXA | Marvin não é uma clínica |
| Lead magnet gratuito | MÉDIA | Versão freemium poderia gerar leads |
| White-label para parceiros | MÉDIA | Arquitetura multi-tenant suporta |
| DISCARD | BAIXA | Muito valor para descartar |

**Recomendação de posicionamento**: Micro-SaaS / produto standalone sob marca Marvin.

---

## Análise de Mercado

### Tamanho do Mercado

```
DENTISTAS_BRASIL: ~340.000 (CFO 2024)
CLINICAS_ALVO: ~80.000 (pequeno/médio porte, sem sistema ou sistema ruim)
TICKET_MEDIO_SAAS_DENTAL: R$89–R$299/mês (players de mercado)
TAM_ESTIMADO: ~R$85M–R$288M/ano (addressable)
```

### Competidores Principais

| Sistema | Preço | Observação |
|---|---|---|
| Clinicorp | R$189–R$499/mês | Líder de mercado, complexo |
| OdontCloud | R$129–R$299/mês | Popular, baseado em nuvem |
| Prontuário Fácil | R$89–R$159/mês | Simples, sem agendamento online |
| Odontosystem | R$149–R$249/mês | Legado, instalação local |
| iDental | R$99–R$199/mês | Novo, bem avaliado |

### Diferencial Competitivo Potencial

```
FORÇA_ATUAL:
  ✅ Agendamento online público sem cadastro do paciente
  ✅ Multi-tenant nativo (escala com baixo custo operacional)
  ✅ Interface moderna (React 19, Tailwind 4, shadcn/ui)
  ✅ Zero dependências de API externas (funciona offline-first)
  ✅ PDF de orçamento integrado

LACUNAS_VS_MERCADO:
  ❌ Sem odontograma visual (padrão de mercado)
  ❌ Sem integração com planos de saúde/convênios
  ❌ Sem envio automático de lembretes
  ❌ Sem assinatura digital de documentos
  ❌ Sem relatórios exportáveis
```

---

## Fit com Capacidades Marvin

| Capacidade Marvin | Relevância para OdontoControl | Sinergia |
|---|---|---|
| Presença digital / SEO | Marketing do produto + integração GBP clínica | ALTA |
| CRM / relacionamento | Complementa (paciente inativo alert) | ALTA |
| Gestão de reputação | Reviews de clínicas indicadas no sistema | MÉDIA |
| Automação WhatsApp | Preenche lacuna crítica do sistema | ALTA |
| Infraestrutura técnica | Migração, hosting, deploy | ALTA |

**Conclusão de Fit**: Nível ALTO. O OdontoControl complementa o portfólio Marvin e resolve
uma necessidade real do cliente-alvo (clínica odontológica pequena/média). As lacunas do
sistema (WhatsApp automático, reputação online) são exatamente onde Marvin tem capacidade.

---

## MARVIN_OPPORTUNITY_SCORE

```
CRITÉRIO                          PESO    NOTA    PARCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Qualidade técnica do código        15%     78      11.7
Portabilidade / independência      15%     68       10.2
Completude funcional               15%     70       10.5
Segurança                          10%     75        7.5
Fit estratégico com Marvin         20%     82       16.4
Tamanho e acessibilidade do mercado 10%   75        7.5
Custo de adoção / migração         15%     62        9.3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARVIN_OPPORTUNITY_SCORE:                  73.1/100

CLASSIFICAÇÃO: ALTO — Ativo com valor real e fit estratégico claro
```

### Interpretação do Score

- **73/100** = ativo acima da linha de corte para ADOPT/ADAPT
- Maior penalização: custo de migração (Blink → infra independente) e portabilidade
- Maior força: fit estratégico e qualidade técnica do núcleo de negócio
- Score subiria para ~82 após migração completa da plataforma

---

## Riscos de Fit

1. **Canibalização de esforço**: Construir/manter um SaaS dental distrai da proposta central Marvin
2. **Suporte a produto**: Clínicas precisarão de onboarding e suporte — novo custo operacional
3. **Compliance regulatório**: LGPD dental (dados de saúde) requer atenção jurídica especializada
4. **Roadmap divergente**: Necessidades das clínicas podem puxar em direção oposta às prioridades Marvin

---

## Recomendação de Posicionamento

```
POSICIONAMENTO_SUGERIDO: "Gestão completa para sua clínica, integrada com sua presença digital"

PROPOSTA_VALOR:
  1. Sistema de gestão (este código, migrado)
  2. + Agendamento online com link público
  3. + Lembretes automáticos por WhatsApp (integração a adicionar)
  4. + Presença no Google (GBP — capacidade já existente na Marvin)
  5. + Relatórios de crescimento (AI Growth + dados de reputação)

PÚBLICO_ALVO: Clínicas de 1–5 dentistas sem sistema ou insatisfeitas com sistema atual
TICKET_TARGET: R$149–R$249/mês (premium vs concorrentes básicos por causa do bundle)
```
