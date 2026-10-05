# OdontoControl na Blink — sua cópia

1. Abra o modelo e clique em **Remix**. As telas e a **Demonstração** permitem conhecer o sistema sem inserir dados reais.
2. Cole o comando abaixo, trocando apenas seu email. O backend deste modelo usa recursos do Blink Pro. Se seu plano bloquear a instalação, a Blink deve explicar o bloqueio e aguardar sua decisão — não assinar nem ativar hospedagem automaticamente.
3. Se aparecer **Adicionar Segredos**, informe `OWNER_PROJECT_ID` com o ID desta cópia e `OWNER_EMAIL` com o email que você usará no aplicativo. Não use o ID do modelo original.
4. Abra a prévia em nova aba e clique em **Entrar ou criar minha conta**. Use o mesmo email definido acima. O login do aplicativo é separado do login do editor.
5. No painel Master, use **Nova clínica**. Para testar sua própria clínica, cadastre o seu email como administrador. Em **Clínicas → menu → Abrir clínica**, cadastre profissionais e procedimentos, depois teste o agendamento público.
6. Personalize marca, valores e planos. A publicação em domínio de produção é uma escolha separada; confira os custos exibidos pela Blink.

## Prompt para colar

Ative esta cópia do OdontoControl seguindo BLINK_ALUNOS.md. Meu email de administrador é SEU_EMAIL_AQUI. Preserve as telas e funções existentes. Configure login, banco e backend DESTA cópia. Se o plano bloquear o backend, explique e aguarde minha decisão. Entregue o link de acesso e os próximos cliques.

## Instalação técnica — para a IA

- O código já está pronto. Não recriar telas, não gerar imagens nem migrar para Supabase.
- Usar exclusivamente o ID, a chave pública e os recursos do projeto atual; nunca apontar para o backend do modelo original. Não copiar dados de pacientes, usuários, proprietário ou segredos.
- Configurar `OWNER_PROJECT_ID` com o ID atual e `OWNER_EMAIL` com o email fornecido. Nunca herdar `OWNER_USER_ID` do original. Somente a identidade com email verificado pode assumir o Master; o primeiro visitante não vira administrador.
- Aplicar `scripts/native/security-policy.json`: as 14 tabelas da aplicação devem ter `read: deny` e `write: deny` no SDK público; SQL público proibido. O backend controla clínica e permissões.
- Implantar **somente `backend/index.ts`** como função `index`. Os arquivos `server/` são fontes, não funções separadas. Após editar o backend, executar `npm run build:backend`.
- O backend prepara automaticamente esquema e triggers na primeira chamada. `server/native/bootstrap.ts` contém comandos completos para `blink.db.batch`. Não enviar os triggers ao CLI `db exec/query`, que pode separá-los incorretamente.
- Definir `VITE_BLINK_PROJECT_ID`, `VITE_BLINK_PUBLISHABLE_KEY` e `VITE_BLINK_BACKEND_URL` no ambiente de construção. A URL será `https://ULTIMOS_8_CARACTERES_DO_ID.backend.blink.new`.
- Executar `npm install`, `npm run build` e disponibilizar a prévia. Conferir `/health` com banco conectado e `/api/bootstrap` com `configured: true`. Salvar a versão com todos os arquivos.
- Depois que o titular entrar, conferir Master e cadastro da clínica. Equipe cadastrada por email entra com conta própria; vínculo só ocorre após verificar o email. Não gerar ou redefinir senha de outra pessoa.

## O que está incluído

Agenda, pacientes, prontuário, profissionais, procedimentos, orçamentos, tratamentos, financeiro, relatórios, equipe, painel Master e agendamento público. Aprovar um orçamento gera um tratamento e um lançamento financeiro do valor total; quantidade de parcelas é informativa, não emite cobranças parceladas automaticamente.

A demonstração usa dados fictícios locais. O banco da cópia inicia vazio. Os dados de cada clínica ficam separados. Horários públicos padrão: 08h–12h e 14h–18h, fuso de São Paulo; respeitam a duração e reservas do profissional.

O AI Growth preserva sugestões baseadas em regras e dados da clínica; não é diagnóstico clínico nem uma integração com modelo de IA. WhatsApp usa links para envio manual. Nenhum email de boas-vindas ou lembrete é enviado automaticamente. Não exige chaves Evolution, Google ou OpenAI para o funcionamento básico.

Cobrança da clínica é controlada manualmente no Master. Não existe gateway de pagamento ligado neste modelo. Configure uma integração separada se desejar cobrança automática. O plano da clínica/SaaS é diferente do plano da Blink.
