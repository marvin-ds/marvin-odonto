# 01 — PROVENANCE

---

## Origem

| Campo | Evidência | Classificação |
|---|---|---|
| Plataforma original | `@blinkdotnew/sdk` em package.json; `blink-tagger.plugin.mjs`; BLINK_ALUNOS.md; URL pattern `*.backend.blink.new` | CONFIRMED |
| Nome original | OdontoControl | CONFIRMED (`package.json: "name": "odontocontrol-blink"`) |
| Artefato Lovable presente | `src/integrations/supabase/cron-auth.ts` contém `LOVABLE_CRON_SECRET` | CONFIRMED |
| Modelo template | README menciona "Abra o modelo e clique em Remix" — este é um remix de template público Blink | CONFIRMED |
| Autoria original | Desconhecida | UNKNOWN |

---

## Artefato Lovable Órfão

`src/integrations/supabase/cron-auth.ts` é um arquivo gerado automaticamente por **Lovable** (não Blink). Ele referencia `LOVABLE_CRON_SECRET` e `LOVABLE_CRON_SECRET_PREVIOUS`. Esse arquivo provavelmente veio de uma versão anterior do sistema exportada do Lovable e foi carregado para o Blink.

**Status**: Não referenciado em nenhum arquivo do projeto. Código morto (dead code).

**Risco**: Baixo isoladamente — mas indica que o sistema pode ter passado por Lovable antes do Blink. Nenhuma dependência funcional com Lovable foi encontrada no estado atual.

---

## Componentes de terceiros

| Componente | Categoria | Licença Aparente | Revisão Necessária |
|---|---|---|---|
| `@blinkdotnew/sdk` | Core runtime | Proprietário Blink | SIM |
| `hono` | Backend framework | MIT | NÃO |
| `@tanstack/react-router` + `react-query` | Frontend | MIT | NÃO |
| `@radix-ui/*` | UI primitives | MIT | NÃO |
| `tailwindcss` | Styling | MIT | NÃO |
| `zod` | Validation | MIT | NÃO |
| `shadcn/ui` (components) | UI components | MIT | NÃO |
| `recharts` | Charts | MIT | NÃO |
| `date-fns` | Date utils | MIT | NÃO |
| `react-hook-form` | Forms | MIT | NÃO |
| `lucide-react` | Icons | ISC | NÃO |

---

## Classificação de propriedade

```
OWNERSHIP_CLEAR: código-fonte (exceto SDK Blink)
THIRD_PARTY_DEPENDENCIES: @blinkdotnew/sdk (proprietário)
LICENSE_REVIEW_REQUIRED: @blinkdotnew/sdk — termos de uso do Blink se aplicam ao runtime
OWNERSHIP_PARTIAL: sistema opera em infraestrutura Blink
```

---

## Assets

- `public/favicon.svg` — ícone genérico (dente estilizado)
- `public/icons.svg` — sprite de ícones
- `src/assets/hero.png` — imagem de demo
- Sem fonts proprietárias

Nenhum asset de terceiros requer revisão jurídica adicional.
