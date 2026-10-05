import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap, Calendar, Users, DollarSign, TrendingUp, Brain, Shield,
  CheckCircle2, Sparkles, Star, Clock, ArrowRight, ChevronRight,
  Stethoscope, Activity, MessageCircle, FileText,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OdontoControl AI — Gestão inteligente para clínicas odontológicas" },
      { name: "description", content: "Agenda, pacientes, financeiro, tratamentos e sugestões para acompanhar oportunidades — tudo em um só lugar." },
      { property: "og:title", content: "OdontoControl AI" },
      { property: "og:description", content: "Sua clínica odontológica com gestão inteligente." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Calendar,   t: "Agenda Inteligente",         d: "Gerencie todos os atendimentos com visão diária, por profissional e status em tempo real." },
  { icon: Users,      t: "Gestão de Pacientes",        d: "Ficha completa com histórico de consultas, tratamentos, orçamentos e jornada do paciente." },
  { icon: DollarSign, t: "Controle Financeiro",        d: "Receitas, despesas, faturamento e inadimplência em um painel limpo e direto." },
  { icon: TrendingUp, t: "Orçamentos & Tratamentos",   d: "Crie orçamentos, acompanhe tratamentos em andamento e recupere pacientes parados." },
  { icon: Brain,      t: "AI Growth Engine",           d: "Regras identificam oportunidades e sugerem mensagens para você revisar e enviar pelo WhatsApp." },
  { icon: Shield,     t: "Equipe & Acessos",           d: "Convide colaboradores, defina papéis e controle permissões por módulo." },
];

const STEPS = [
  { n: 1, t: "Cadastre sua clínica",  d: "Configure os dados da clínica, profissionais e procedimentos." },
  { n: 2, t: "Cadastre sua agenda",    d: "Cadastre pacientes e organize os atendimentos em um só painel." },
  { n: 3, t: "Ative o AI Growth",     d: "Consulte sugestões baseadas no histórico da clínica e nos orçamentos em aberto." },
  { n: 4, t: "Recupere receita",      d: "Abra a conversa no WhatsApp, revise a mensagem e acompanhe o retorno do paciente." },
];

const TURBO = [
  "Prontuário eletrônico com histórico",
  "Anamnese odontológica completa",
  "Orçamentos com PDF imprimível",
  "Tratamentos com status e datas",
  "Convênios e código TUSS",
  "Booking público /agendar/sua-clinica",
  "Personalização da marca da clínica",
];

const PAINS = [
  "Pacientes inativos sem follow-up",
  "Orçamentos enviados que ninguém cobra",
  "Agenda confusa e cheia de furos",
  "Sem dados de retenção por dentista",
  "Faturamento manual em planilhas",
  "Acompanhamento de pacientes sem organização",
];

const TESTIMONIALS = [
 {nome:'Agenda organizada',clinica:'Rotina de atendimento',txt:'Consulte os horários de cada profissional e registre os atendimentos.'},
 {nome:'Orçamento acompanhado',clinica:'Tratamentos e financeiro',txt:'Ao aprovar um orçamento, gere o tratamento e o lançamento financeiro vinculado.'},
 {nome:'Paciente próximo',clinica:'Acompanhamento manual',txt:'Use sugestões de mensagem para retomar uma conversa no WhatsApp.'},
];

const PLANOS = [
 {name:'Básico',price:197,items:['Agenda e pacientes','Prontuário e histórico','Orçamentos imprimíveis']},
 {name:'Profissional',price:397,items:['Gestão da clínica','Tratamentos e financeiro','Sugestões de acompanhamento','Agendamento público'],featured:true},
 {name:'Personalizado',price:697,items:['Marca da clínica','Equipe e permissões','Condições comerciais a definir']},
];

const FAQ = [
 {q:'Preciso instalar algo?',a:'O aplicativo é acessado pelo navegador. Você pode explorar a demonstração sem cadastro.'},
 {q:'Como funciona o acesso da equipe?',a:'O administrador cadastra o email e o perfil. A pessoa entra com sua própria conta e verifica o email para receber o acesso.'},
 {q:'As mensagens são enviadas automaticamente?',a:'Não. O sistema prepara sugestões e abre o WhatsApp para você revisar e enviar.'},
 {q:'Os preços desta página já fazem cobranças?',a:'Não. Esta é uma oferta de exemplo personalizável. Pagamentos e condições comerciais devem ser definidos pelo responsável pelo sistema.'},
];

function Landing() {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* NAVBAR */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-premium">
              <Zap className="size-5 text-white" />
            </div>
            <span className="font-bold text-lg">OdontoControl <span className="text-gradient-primary">AI</span></span>
          </Link>
          <nav className="flex items-center gap-1">
            <a href="#features" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hidden md:inline">Features</a>
            <a href="#ai" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hidden md:inline">AI Growth</a>
            <a href="#precos" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hidden md:inline">Preços</a>
            <Button asChild variant="ghost"><Link to="/entrar">Entrar</Link></Button>
            <Button asChild className="gradient-primary text-white shadow-premium hover:opacity-90">
              <Link to="/demo/Dashboard">Ver demonstração</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-cyan-soft" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl -z-0" />
        <div className="relative max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium mb-6 animate-fade-in">
            <Sparkles className="size-3" /> SISTEMA COMPLETO PARA CLÍNICAS ODONTOLÓGICAS
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] animate-fade-in">
            Gerencie sua clínica com<br />
            <span className="text-gradient-primary">gestão inteligente</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            Agenda, pacientes, financeiro, tratamentos e sugestões para acompanhar oportunidades — tudo em um só lugar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
            <Button asChild size="lg" className="gradient-primary text-white shadow-premium hover:opacity-90 h-12 px-6 text-base">
              <Link to="/demo/Dashboard">Ver demonstração ao vivo <ArrowRight className="size-4 ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
              <Link to="/entrar">Quero este sistema</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-5">Sem cadastro · Dados fictícios · Acesso imediato</p>
        </div>

        {/* Stats */}
        <div className="bg-primary/5 border-y border-primary/10">
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ["Agenda", "atendimentos organizados"],
              ["Pacientes", "histórico centralizado"],
              ["Financeiro", "receitas e despesas"],
              ["Equipe", "permissões de acesso"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-3xl md:text-4xl font-extrabold text-gradient-primary">{n}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAINS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">A sua clínica vive perdendo dinheiro nessas situações?</h2>
          <p className="text-muted-foreground mt-3">Se algum desses problemas te soa familiar, o OdontoControl resolve.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {PAINS.map((p) => (
            <div key={p} className="flex gap-3 items-start p-5 rounded-xl bg-card border shadow-card">
              <div className="size-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <span className="text-destructive font-bold">✕</span>
              </div>
              <span className="text-sm font-medium pt-1">{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mb-3">RECURSOS</div>
          <h2 className="text-3xl md:text-4xl font-bold">Tudo o que sua clínica precisa em um único sistema</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <Card key={f.t} className="border-0 shadow-card shadow-card-hover">
              <CardContent className="p-6">
                <div className="size-12 rounded-xl gradient-primary flex items-center justify-center shadow-premium mb-4">
                  <f.icon className="size-6 text-white" />
                </div>
                <h3 className="font-bold text-lg">{f.t}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TURBO SECTION */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 text-primary px-3 py-1 text-xs font-medium mb-4">TURBOSAAS</div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Organize em 4 passos. <span className="text-gradient-primary">Acompanhe cada oportunidade.</span></h2>
            <div className="mt-8 space-y-5">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <div className="size-10 rounded-lg gradient-primary flex items-center justify-center font-bold shrink-0">{s.n}</div>
                  <div>
                    <div className="font-semibold">{s.t}</div>
                    <div className="text-sm text-white/70 mt-0.5">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-7 border border-white/10">
            <div className="text-xs font-medium text-primary mb-3">INCLUSO EM TODOS OS PLANOS</div>
            <ul className="space-y-3">
              {TURBO.map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* AI GROWTH */}
      <section id="ai" className="bg-primary/5 py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-3 py-1 text-xs font-medium mb-4">
              <Brain className="size-3" /> AI GROWTH ENGINE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Um painel que <span className="text-gradient-primary">mostra oportunidades</span> para acompanhar</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Ao abrir o AI Growth, o sistema analisa seus dados com regras para identificar pacientes inativos e orçamentos parados. As mensagens são sugestões para envio manual. Os valores ao lado são exemplos fictícios.
            </p>
            <Button asChild size="lg" className="gradient-primary text-white shadow-premium mt-6">
              <Link to="/demo/AIGrowth">Ver sugestões na demonstração <ArrowRight className="size-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { icon: Star,  color: "text-amber-500 bg-amber-50",  t: "5 pacientes VIP sem retorno",      c: "+R$ 8.500", a: "Reativar agora" },
              { icon: Clock, color: "text-sky-500 bg-sky-50",       t: "8 orçamentos parados há 14 dias",  c: "+R$ 23.400", a: "Preparar acompanhamento" },
              { icon: Users, color: "text-emerald-500 bg-emerald-50", t: "Horário fraco: ter/qui 13-15h",  c: "+R$ 4.200", a: "Criar campanha" },
            ].map((it) => (
              <Card key={it.t} className="border-0 shadow-card shadow-card-hover">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`size-12 rounded-xl flex items-center justify-center ${it.color}`}>
                    <it.icon className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{it.t}</div>
                    <div className="text-xs text-emerald-600 font-bold mt-0.5">{it.c} potencial</div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Veja como usar no dia a dia</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <Card key={t.nome} className="border-0 shadow-card">
              <CardContent className="p-6">
                
                <p className="text-sm leading-relaxed">{t.txt}</p>
                <div className="mt-5 pt-5 border-t flex items-center gap-3">
                  <div className="size-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    {t.nome.split(" ")[1]?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.nome}</div>
                    <div className="text-xs text-muted-foreground">{t.clinica}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="precos" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mb-3">PLANOS</div>
          <h2 className="text-3xl md:text-4xl font-bold">Exemplo de oferta — personalize seus planos</h2>
          <p className="text-muted-foreground mt-3">Valores ilustrativos para o seu SaaS. Defina sua oferta e condições antes de vender.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {PLANOS.map((p) => (
            <Card key={p.name} className={p.featured ? "border-0 gradient-primary text-white shadow-premium scale-105 relative" : "border-0 shadow-card"}>
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary text-xs font-bold px-3 py-1 rounded-full shadow">MAIS POPULAR</div>
              )}
              <CardContent className="p-7">
                <div className={`text-sm font-bold uppercase tracking-wide ${p.featured ? "text-white/80" : "text-muted-foreground"}`}>{p.name}</div>
                <div className="text-5xl font-extrabold mt-2">R${p.price}<span className={`text-base font-normal ${p.featured ? "text-white/80" : "text-muted-foreground"}`}>/mês</span></div>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-2"><CheckCircle2 className={`size-4 mt-0.5 shrink-0 ${p.featured ? "text-white" : "text-primary"}`} />{i}</li>
                  ))}
                </ul>
                <Button asChild className={`w-full mt-7 ${p.featured ? "bg-white text-primary hover:bg-white/90" : "gradient-primary text-white"}`}>
                  <Link to="/entrar">Começar agora</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Perguntas frequentes</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-xl border bg-card shadow-card overflow-hidden">
              <summary className="cursor-pointer p-5 font-semibold flex items-center justify-between hover:bg-muted/30">
                {f.q}
                <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
              </summary>
              <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Brain className="size-12 mx-auto mb-5 text-primary" />
          <h2 className="text-3xl md:text-5xl font-extrabold">Pronto para organizar sua clínica?</h2>
          <p className="text-white/70 mt-4 text-lg">Explore a demonstração com dados fictícios e conheça as funções do sistema.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button asChild size="lg" className="gradient-primary text-white shadow-premium h-12 px-7 text-base">
              <Link to="/demo/Dashboard">Ver demonstração ao vivo</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 h-12 px-7 text-base">
              <Link to="/demo/Agenda">Conhecer a agenda</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white/60 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center"><Zap className="size-4 text-white" /></div>
            <span>© {new Date().getFullYear()} OdontoControl AI</span>
          </div>
          <div className="flex gap-5">
            <Link to="/demo/Dashboard">Demo</Link>
            <Link to="/entrar">Entrar</Link>
            <a href="#precos">Preços</a>
            <a href="#ai">AI Growth</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// keep imports referenced
void Stethoscope; void Activity; void MessageCircle; void FileText;

