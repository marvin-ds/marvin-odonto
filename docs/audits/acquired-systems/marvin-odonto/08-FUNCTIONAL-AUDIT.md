# 08 — FUNCTIONAL AUDIT

---

## O que este sistema faz

**OdontoControl** é um sistema de gestão para clínicas odontológicas (dental management SaaS) multi-tenant, voltado para clínicas de pequeno e médio porte no Brasil.

---

## Funcionalidades Confirmadas por Evidência

### Área da Clínica (autenticado)

| Módulo | Evidência | Status |
|---|---|---|
| Dashboard com KPIs | `src/routes/app/Dashboard.tsx` | EXISTS |
| Agenda de consultas | `src/routes/app/Agenda.tsx`, tabela `consulta` | EXISTS |
| Pacientes + prontuário | `src/routes/app/Pacientes.tsx`, tabela `paciente`, `historico_clinica` | EXISTS |
| Profissionais | `src/routes/app/Profissionais.tsx`, tabela `profissional` | EXISTS |
| Procedimentos (catálogo) | `src/routes/app/Procedimentos.tsx`, tabela `procedimento` | EXISTS |
| Orçamentos | `src/routes/app/Orcamentos.tsx`, tabela `orcamento` | EXISTS |
| Tratamentos | `src/routes/app/Tratamentos.tsx`, tabela `tratamento` | EXISTS |
| Financeiro | `src/routes/app/Financeiro.tsx`, tabela `financeiro` | EXISTS |
| Relatórios | `src/routes/app/Relatorios.tsx` | EXISTS |
| Equipe | `src/routes/app/Equipe.tsx`, tabela `membro_equipe` | EXISTS |
| Configurações | `src/routes/app/Configuracoes.tsx` | EXISTS |
| Onboarding | `src/routes/app/Onboarding.tsx` | EXISTS |
| "AI Growth" | `src/routes/app/AIGrowth.tsx` | EXISTS (sem IA real) |

### Área Master (super-admin)

| Módulo | Evidência |
|---|---|
| Painel Master | `src/routes/master/painel.tsx` |
| Lista de clínicas | `src/routes/master/listaClinicas.tsx` |
| Nova clínica | `src/routes/master/novaClinica.tsx` |
| Clínicas suspensas | `src/routes/master/clinicasSuspensas.tsx` |
| Configurações master | `src/routes/master/configuracoes.tsx` |

### Agendamento Público

- URL: `/agendar/:slug`
- Sem autenticação necessária
- Fluxo: catalog → slots → book
- Valida disponibilidade de horário server-side
- Preço e duração vêm do servidor (não manipuláveis pelo cliente)
- Não expõe lista de pacientes existentes
- Confirmado por teste: ✅

### Modo Demo

- `src/routes/demo/*` — todas as telas com dados fictícios locais
- Funciona sem conta/login

---

## Promessa vs Realidade

### "AI Growth"

```
PROMISE: "IA" sugere crescimento inteligente da clínica

OBSERVED: Módulo que analisa dados da própria clínica para gerar sugestões
          - Pacientes sem consulta há 90+ dias
          - Orçamentos pendentes há 7+ dias
          - Tratamentos paralisados há 90+ dias
          - Procedimentos com baixa demanda

PROVEN: 100% baseado em queries no banco local. Zero chamada de IA.
        O componente nomeou errado — é analytics de regras, não IA.

CLASSIFICAÇÃO: USEFUL mas MISLEADING no nome
```

### WhatsApp

```
PROMISE: Integração WhatsApp para contato com pacientes

OBSERVED: Geração de link wa.me/ com texto pré-preenchido

PROVEN: Link manual. Não há API do WhatsApp Business, não há Evolution API,
        não há envio automático de mensagens.
```

### Sistema de Cobrança

```
PROMISE: Controle financeiro da clínica

OBSERVED: Lançamentos manuais de receita/despesa, parcelas informativas

PROVEN: SEM gateway de pagamento. Cobrança manual no Master.
        Parcelas são informativas (não geram cobranças automáticas).
```

---

## Jornada do Usuário Principal

```
1. OWNER cadastra clínica (via Master ou onboarding)
2. Owner configura profissionais e procedimentos
3. Owner cadastra equipe (recepcionista, dentistas)
4. Clínica recebe link público de agendamento (/agendar/slug)
5. Paciente agenda pelo link público (sem login)
6. Recepcionista vê agenda, confirma consultas
7. Dentista registra prontuário após consulta
8. Sistema gera orçamento → owner aprova → cria tratamento + lançamento financeiro
9. Financeiro acompanha receitas/despesas
10. Owner usa "AI Growth" para identificar oportunidades de reativação
```

---

## O que NÃO existe

- Gateway de pagamento (Stripe, MercadoPago, etc.)
- Envio automático de emails (confirmação, lembrete)
- SMS/WhatsApp automático
- Prontuário odontológico com odontograma (mapa dental visual)
- Imagens de raio-X ou anexos de prontuário (não há storage)
- Telemedicina / teleconsulta
- Integração com planos de saúde/convênios (só campo de texto)
- Relatórios avançados com exportação
- App mobile
- IA real (apesar do nome "AI Growth")
- Notificações push
- Multi-localidade (uma clínica = uma localização)

---

## Avaliação de UX (baseada em código, sem render visual)

| Aspecto | Avaliação | Evidência |
|---|---|---|
| Onboarding | PRESENTE | `src/routes/app/Onboarding.tsx` existe |
| Estados vazios | INFERIDO presente | CrudPage.tsx tem estrutura para isso |
| Loading states | TanStack Query lida nativamente | `useQuery` em toda app |
| Modo demo | PRESENTE | `src/routes/demo/*` completo |
| Trial/billing banner | PRESENTE | `src/components/TrialBanner.tsx` |
| Responsividade | PROVÁVEL | Tailwind + shadcn/ui mobile-first |
| Formulários | Padronizados | `react-hook-form` + Zod validation |
| PDF de orçamento | PRESENTE | `src/components/OrcamentoPdf.tsx` |
| QR code (agendamento) | PRESENTE | `qrcode.react` em `booking-link-card.tsx` |

**UX_ASSESSMENT**: ACCEPTABLE a GOOD para um sistema de gestão B2B.
