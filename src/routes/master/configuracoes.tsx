import{createFileRoute}from'@tanstack/react-router';import{PageHeader}from'@/components/PageHeader';import{Card,CardContent}from'@/components/ui/card';
export const Route=createFileRoute('/master/configuracoes')({component:Page});
function Page(){return <><PageHeader title="Configurações do sistema" description="Como funcionam os acessos e integrações deste modelo"/><div className="grid md:grid-cols-2 gap-4">{[
['Acesso da equipe','Cadastre o email em Equipe e compartilhe o link de acesso. O titular entra com sua própria conta e confirma o email. Não são geradas senhas pelo administrador.'],
['Mensagens e emails','Os links de WhatsApp abrem mensagens para revisar e enviar manualmente. Boas-vindas e lembretes por email não estão configurados. Emails de login e recuperação são gerenciados pela autenticação Blink.'],
['Cobrança','O painel permite controlar planos, valores e situação de cobrança manualmente. Nenhum pagamento é processado automaticamente.'],
['AI Growth','As sugestões usam regras sobre os dados da clínica. Não há chamada de modelo de IA nem diagnóstico clínico. Integrações adicionais podem ser configuradas separadamente.'],
].map(([title,body])=><Card key={title}><CardContent className="p-6 space-y-3"><h2 className="font-semibold text-primary">{title}</h2><p className="text-sm text-muted-foreground">{body}</p></CardContent></Card>)}</div></>}
