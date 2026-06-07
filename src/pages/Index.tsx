import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Scale,
  ShieldCheck,
  Users,
  ArrowLeft,
  Loader2,
  Check,
  HelpCircle,
  MessageSquare,
  Brain,
  LayoutDashboard,
  Plug,
  ArrowRight,
  Menu,
  X,
  Star,
  Sparkles,
  Lock,
  Workflow,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"whatsapp" | "documents" | "crm">("whatsapp");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      toast.success(`Bem-vindo ao Portal ${selectedRole === "admin" ? "Administrativo" : "do Integrador"}`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenLogin = (role: AppRole) => {
    setSelectedRole(role);
    setEmail(role === "admin" ? "admin@advocatus.com" : "joao@teste.com");
    setPassword(role === "admin" ? "32080910" : "teste123");
    setIsLoginOpen(true);
  };

  // Depoimentos Fictícios com Fotos Reais do Unsplash (15 avaliações com fotos coerentes por gênero)
  const testimonials = [
    {
      name: "Dr. Guilherme Cavalcanti",
      role: "Sócio Sênior na Mendes & Cavalcanti Advogados",
      text: "A automação de WhatsApp da Advocatus transformou nosso atendimento inicial. Conseguimos qualificar leads jurídicos 24 horas por dia, 7 dias por semana. O retorno sobre o investimento foi imediato.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dra. Beatriz Meireles",
      role: "Especialista em Direito do Trabalho",
      text: "O copiloto de geração de petições é fantástico. Economizo horas de pesquisa e redação em casos trabalhistas complexos. Além disso, o pipeline do Kanban nos dá total controle sobre os novos contratos.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dr. Renato Ramos",
      role: "Diretor da Ramos & Associados Direito Criminal",
      text: "Excelente plataforma de integração. A conexão nativa com a Evolution API e os fluxos automáticos do n8n nos permitiram escalar as operações de nosso escritório sem inflar os custos de suporte.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dra. Carla Mendes",
      role: "Especialista em Direito Civil e Família",
      text: "A facilidade de uso do painel me surpreendeu. O suporte ao cliente do Advocatus também é fora de série, tirando todas as dúvidas sobre as conexões com as APIs de forma célere.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dr. Roberto Souza",
      role: "Advogado Especialista em Direito Previdenciário",
      text: "Com o Advocatus conseguimos automatizar os requerimentos administrativos do nosso escritório previdenciário. Os clientes se sentem acolhidos com as respostas rápidas via chatbot.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dra. Fernanda Lima",
      role: "Consultora Tributária na Lima Advocacia",
      text: "Redigir contestações tributárias agora leva minutos em vez de dias. A base de dados jurídica que alimenta a Inteligência Artificial é muito robusta e sempre precisa nos fundamentos.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dr. André Santos",
      role: "Sócio no Santos & Consultores Associados",
      text: "Excelente ferramenta para triagem de contencioso em massa. Conseguimos qualificar as demandas antes mesmo do primeiro contato humano, filtrando o que realmente é viável.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dra. Mariana Costa",
      role: "Socia-Diretora na Costa & Associados Família",
      text: "O Advocatus nos deu o controle que faltava na nossa banca de Direito de Família. O Kanban ajuda a manter todos os prazos organizados e os clientes atualizados sobre as etapas.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dr. Felipe Oliveira",
      role: "Advogado de Direito Imobiliário corporativo",
      text: "Integrar a plataforma com o Google Sheets via webhook foi moleza. Agora todo novo lead qualificado pela IA cai direto na nossa planilha de prospecção corporativa automaticamente.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dra. Juliana Castro",
      role: "Advogada Especialista em Direito Ambiental",
      text: "O sistema de créditos e carteira é super transparente. Compramos recargas de tokens apenas quando necessitamos de análises em massa de processos ambientais volumosos.",
      avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dr. Marcos Azevedo",
      role: "Especialista em Direito do Consumidor",
      text: "Conseguimos aumentar nossa taxa de fechamento de contratos em 40%. O contato imediato do chatbot com quem nos procura pelo site faz toda a diferença para o cliente.",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dra. Patrícia Rocha",
      role: "Sócia na Rocha Propriedade Intelectual",
      text: "Usamos para gerar contratos de confidencialidade e termos de uso de forma ágil para nossos clientes de startups. A qualidade e formatação da peça são impecáveis.",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dr. Ricardo Vieira",
      role: "Pioneiro em Direito Digital e Proteção de Dados",
      text: "Uma solução inovadora e em total conformidade com a OAB. Recomendo para todos os colegas que buscam modernizar a advocacia sem perder a ética e a segurança da informação.",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dra. Sofia Alencar",
      role: "Especialista em Direito Médico e da Saúde",
      text: "No Direito Médico, cada detalhe conta. A triagem automática entende a urgência de cada caso e notifica nosso plantão imediatamente para os casos mais graves no WhatsApp.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Dr. Thiago Martins",
      role: "Advogado Criminalista e Eleitoral",
      text: "Tivemos uma excelente experiência com a API Evolution acoplada ao Advocatus. Sem quedas de conexão, sem atraso no envio das respostas automáticas aos leads.",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  // FAQ itens
  const faqItems = [
    {
      q: "Como a IA cria as petições e documentos?",
      a: "Nossa IA é alimentada por modelos de linguagem de ponta calibrados com a legislação brasileira e jurisprudências dos tribunais superiores (STF, STJ, TST). Basta descrever os fatos e a base legal para receber uma petição completa formatada em segundos."
    },
    {
      q: "É possível integrar com meu próprio número de WhatsApp?",
      a: "Sim! A plataforma suporta conexões nativas com a Evolution API (Baileys/WhatsApp Oficial). Você pode escanear o QR Code direto no nosso painel e começar a responder seus clientes automaticamente em poucos minutos."
    },
    {
      q: "A plataforma está em conformidade com a LGPD?",
      a: "Sim, segurança e privacidade são nossas prioridades. Todos os dados de clientes, conversas de WhatsApp e petições geradas são criptografados de ponta a ponta e armazenados em servidores altamente seguros de nuvem, em total conformidade com a Lei Geral de Proteção de Dados."
    },
    {
      q: "Consigo integrar a Advocatus com outras ferramentas?",
      a: "Absolutamente. Oferecemos suporte completo para conexões via webhooks, n8n, Make (antigo Integromat), Google Sheets e outros sistemas externos para integrar o Advocatus ao ecossistema existente no seu escritório."
    }
  ];

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-x-hidden selection:bg-primary/20">
      <div className="h-16" />

      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 dark:bg-primary/3" />
      <div className="absolute top-[60%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10 dark:bg-emerald-500/3" />

      {/* HEADER / NAVBAR */}
      <header className="fixed top-0 left-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Scale className="h-5 w-5 text-slate-900" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 dark:bg-gradient-to-r dark:from-white dark:to-neutral-300">
              Advocatus
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => handleScrollTo("features")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Funcionalidades</button>
            <button onClick={() => handleScrollTo("demo")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Demonstração</button>
            <button onClick={() => handleScrollTo("testimonials")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Depoimentos</button>
            <button onClick={() => handleScrollTo("pricing")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Preços</button>
            <button onClick={() => handleScrollTo("faq")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">FAQ</button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              className="rounded-xl border-border hover:bg-muted"
              onClick={() => handleOpenLogin("integrador")}
            >
              Portal Integrador
            </Button>
            <Button 
              className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-md shadow-primary/10"
              onClick={() => handleOpenLogin("admin")}
            >
              Master Admin
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground hover:bg-muted rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
              <button onClick={() => handleScrollTo("features")} className="text-left py-2 text-sm font-medium text-muted-foreground hover:text-primary">Funcionalidades</button>
              <button onClick={() => handleScrollTo("demo")} className="text-left py-2 text-sm font-medium text-muted-foreground hover:text-primary">Demonstração</button>
              <button onClick={() => handleScrollTo("testimonials")} className="text-left py-2 text-sm font-medium text-muted-foreground hover:text-primary">Depoimentos</button>
              <button onClick={() => handleScrollTo("pricing")} className="text-left py-2 text-sm font-medium text-muted-foreground hover:text-primary">Preços</button>
              <button onClick={() => handleScrollTo("faq")} className="text-left py-2 text-sm font-medium text-muted-foreground hover:text-primary">FAQ</button>
              <div className="border-t border-border/40 pt-4 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="rounded-xl w-full"
                  onClick={() => { handleOpenLogin("integrador"); setMobileMenuOpen(false); }}
                >
                  Portal Integrador
                </Button>
                <Button 
                  className="rounded-xl w-full bg-primary text-primary-foreground"
                  onClick={() => { handleOpenLogin("admin"); setMobileMenuOpen(false); }}
                >
                  Master Admin
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3 w-3 animate-spin" /> Copiloto Jurídico Inteligente
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-foreground">
            Acelere seu escritório jurídico com <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-indigo-600 dark:from-amber-400 dark:to-primary">Inteligência Artificial</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-normal">
            Triagem automática de novos clientes no WhatsApp, geração instantânea de petições complexas e CRM Kanban integrado. Economize tempo e escale a produtividade do seu escritório hoje.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground px-8 font-semibold w-full sm:w-auto shadow-xl shadow-primary/15 hover:scale-102 transition-transform duration-200"
              onClick={() => handleScrollTo("pricing")}
            >
              Começar Agora Gratuitamente <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl border-border px-8 font-semibold w-full sm:w-auto hover:bg-muted"
              onClick={() => handleScrollTo("demo")}
            >
              Ver Demonstração
            </Button>
          </div>
        </motion.div>

        {/* HERO DASHBOARD MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-16 md:mt-24 relative max-w-5xl mx-auto rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl p-2.5 sm:p-4 md:p-6"
        >
          <div className="absolute -top-3 left-4 flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          
          {/* Simulated App Screenshot / UI elements */}
          <div className="rounded-xl overflow-hidden border border-border/30 bg-background/50 aspect-[16/10] flex flex-col text-left">
            <div className="h-10 border-b border-border/30 px-4 flex items-center justify-between bg-card/50">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-md bg-amber-500/20 flex items-center justify-center"><Scale className="h-3 w-3 text-amber-500" /></div>
                <span className="text-xs font-semibold">Advocatus Workspace - Advocacia Silva &amp; Silva</span>
              </div>
              <div className="h-4 w-40 rounded-full bg-muted/60 animate-pulse" />
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Simulated Sidebar */}
              <div className="w-44 border-r border-border/20 p-2 space-y-1.5 hidden sm:block bg-card/10">
                {[LayoutDashboard, MessageSquare, Users, Brain, Coins, Plug].map((Icon, idx) => (
                  <div key={idx} className={`h-8 rounded-lg flex items-center gap-2.5 px-2.5 text-xs ${idx === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{["Painel", "WhatsApp", "Leads & Contatos", "Copiloto IA", "Créditos", "Integrações"][idx]}</span>
                  </div>
                ))}
              </div>

              {/* Simulated Content Dashboard */}
              <div className="flex-1 p-4 overflow-hidden space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[{ t: "Leads Ativos", v: "148", c: "text-primary bg-primary/5 border-primary/20" },
                    { t: "Petições Criadas", v: "1.240", c: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20" },
                    { t: "Taxa de Conversão", v: "92.4%", c: "text-amber-500 bg-amber-500/5 border-amber-500/20" }
                  ].map((stat, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border ${stat.c} flex flex-col justify-between`}>
                      <span className="text-[10px] text-muted-foreground font-semibold">{stat.t}</span>
                      <span className="text-lg font-bold text-foreground mt-1">{stat.v}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-100px)]">
                  {/* Simulated Triagem Recente */}
                  <div className="border border-border/40 rounded-xl p-3 bg-card/30 flex flex-col justify-between overflow-hidden">
                    <div className="flex justify-between items-center pb-2 border-b border-border/20">
                      <span className="text-xs font-bold">Triagem WhatsApp Recente</span>
                      <span className="text-[9px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">Quente</span>
                    </div>
                    <div className="flex-1 py-2 space-y-2 text-xs overflow-y-auto">
                      <div className="p-2 rounded bg-muted/40">
                        <p className="font-bold text-[10px] text-primary">Cliente (Dr. Pedro Santos):</p>
                        <p className="text-[10px] italic">"Fui demitido há 2 semanas sem justa causa e não recebi minhas verbas rescisórias..."</p>
                      </div>
                      <div className="p-2 rounded bg-primary/5 border border-primary/10">
                        <p className="font-bold text-[10px] text-amber-500">IA Advocatus:</p>
                        <p className="text-[10px]">"Com base no relato, identificamos possíveis verbas pendentes de rescisão imotivada (aviso prévio, 13º proporcional, férias...). Gostaria de agendar uma consulta?"</p>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Petições Status */}
                  <div className="border border-border/40 rounded-xl p-3 bg-card/30 flex flex-col justify-between">
                    <span className="text-xs font-bold pb-2 border-b border-border/20 block">Gerador de Peças - Copiloto IA</span>
                    <div className="flex-1 py-3 flex flex-col justify-center items-center text-center space-y-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center"><Check className="h-4 w-4 text-emerald-500" /></div>
                      <p className="text-xs font-semibold">Petição Trabalhista Gerada</p>
                      <p className="text-[10px] text-muted-foreground">Documento pronto e revisado de acordo com a CLT Art. 477</p>
                      <div className="flex gap-2 w-full pt-1">
                        <div className="h-6 flex-1 rounded bg-secondary text-[9px] font-bold flex items-center justify-center cursor-pointer">Visualizar PDF</div>
                        <div className="h-6 flex-1 rounded bg-primary text-[9px] text-primary-foreground font-bold flex items-center justify-center cursor-pointer">Editar Doc</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-muted/40 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tudo o que seu escritório precisa para faturar mais e trabalhar menos
            </h2>
            <p className="text-base text-muted-foreground">
              Combinamos CRM clássico com a mais alta tecnologia de Inteligência Artificial do mercado jurídico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare className="h-6 w-6 text-indigo-500" />}
              title="Atendimento WhatsApp com IA"
              description="Sincronize seu WhatsApp atual. Nosso chatbot qualifica clientes, entende o caso jurídico e faz a triagem antes de encaminhar para você."
            />
            <FeatureCard 
              icon={<Brain className="h-6 w-6 text-amber-500" />}
              title="Copiloto de Petições & Peças"
              description="Insira os fatos ocorridos e obtenha petições iniciais, contestações e recursos completos fundamentados e prontos em segundos."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="h-6 w-6 text-blue-500" />}
              title="CRM Jurídico / Kanban"
              description="Visualize o status de cada lead jurídico em colunas dinâmicas. Identifique na hora as consultas que possuem maior chance de fechamento."
            />
            <FeatureCard 
              icon={<Plug className="h-6 w-6 text-emerald-500" />}
              title="Integrações sem Limites"
              description="Conecte seu CRM com Make, n8n, Google Sheets ou Evolution API. Dispare ações automáticas a cada mudança de estágio do lead."
            />
            <FeatureCard 
              icon={<Coins className="h-6 w-6 text-amber-500" />}
              title="Carteira & Controle de Créditos"
              description="Gerencie o faturamento e os créditos de sua IA. Compre recargas de tokens ou alterne assinaturas de forma transparente no painel."
            />
            <FeatureCard 
              icon={<Workflow className="h-6 w-6 text-purple-500" />}
              title="Automação Completa de Fluxos"
              description="Envie contratos de honorários digitais, agende notificações automáticas e nunca mais perca o prazo com novos clientes."
            />
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO SHOWCASE SECTION */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sinta o poder do Advocatus em tempo real
          </h2>
          <p className="text-base text-muted-foreground">
            Explore as principais ferramentas do painel e veja como funciona a nossa triagem inteligente.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center gap-2 sm:gap-4 p-1.5 rounded-2xl bg-muted max-w-lg mx-auto mb-10 border border-border/40">
          {[
            { id: "whatsapp", label: "WhatsApp Chatbot", icon: MessageSquare },
            { id: "documents", label: "Copiloto de Petições", icon: Brain },
            { id: "crm", label: "CRM Kanban", icon: LayoutDashboard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="glass-card rounded-2xl border border-border/50 max-w-4xl mx-auto overflow-hidden shadow-xl min-h-[360px] flex flex-col md:flex-row">
          
          <AnimatePresence mode="wait">
            {activeTab === "whatsapp" && (
              <motion.div
                key="whatsapp-demo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-6 flex flex-col justify-between bg-card/30"
              >
                <div>
                  <div className="flex items-center gap-3 pb-3 border-b border-border/40 mb-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">W</div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Triagem IA - Evolution API</h4>
                      <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Online e Monitorando
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 text-xs">
                    <div className="bg-muted p-3 rounded-2xl max-w-[85%] text-foreground">
                      <p className="font-bold text-[10px] text-indigo-500 mb-0.5">Potencial Cliente:</p>
                      Olá, gostaria de saber se tenho direito a receber seguro-desemprego. Fui dispensado da firma ontem sem justa causa, trabalhei lá por 18 meses.
                    </div>
                    <div className="bg-primary/10 border border-primary/20 p-3 rounded-2xl max-w-[85%] ml-auto text-foreground">
                      <p className="font-bold text-[10px] text-amber-500 mb-0.5">Advocatus Assistente IA:</p>
                      Olá! Com base no seu relato de 18 meses de trabalho e dispensa sem justa causa, você cumpre os requisitos para receber o seguro-desemprego. O prazo para dar entrada é de 7 a 120 dias a contar da demissão. Gostaria de agendar um atendimento presencial ou virtual com nossos advogados para analisarmos a documentação e dar entrada?
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
                  <span>💡 Triagem automatizada de direito trabalhista configurada.</span>
                  <span className="font-semibold text-primary">Lead qualificado como QUENTE (95%)</span>
                </div>
              </motion.div>
            )}

            {activeTab === "documents" && (
              <motion.div
                key="documents-demo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-6 flex flex-col justify-between bg-card/30"
              >
                <div>
                  <h4 className="text-sm font-bold text-foreground pb-3 border-b border-border/40 mb-4">Geração Copiloto IA</h4>
                  <div className="space-y-4 text-xs">
                    <div>
                      <Label className="text-[10px] text-muted-foreground font-bold uppercase mb-1.5 block">Fatos relatados pelo cliente</Label>
                      <div className="p-3 bg-muted rounded-xl text-foreground italic border border-border/40">
                        "Contrato temporário estendido sem registro em carteira e sem pagamento de adicional noturno das 22h às 5h durante 8 meses."
                      </div>
                    </div>

                    <div>
                      <Label className="text-[10px] text-muted-foreground font-bold uppercase mb-1.5 block">Fundamento Legal (Extraído pela IA)</Label>
                      <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg font-mono text-[10px] flex items-center gap-2">
                        <Check className="h-3 w-3" /> CLT Artigo 73 - Adicional Noturno e CLT Artigo 3º - Vínculo Empregatício.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Petição trabalhista de rescisão indireta gerada.</span>
                  <Button size="sm" className="h-8 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-bold">Ver Peça Completa</Button>
                </div>
              </motion.div>
            )}

            {activeTab === "crm" && (
              <motion.div
                key="crm-demo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-6 flex flex-col justify-between bg-card/30"
              >
                <div>
                  <h4 className="text-sm font-bold text-foreground pb-3 border-b border-border/40 mb-4">Pipeline do Escritório (Kanban)</h4>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="space-y-2 p-1.5 rounded-lg bg-muted/55 border border-border/30">
                      <span className="font-bold text-muted-foreground block text-[9px] uppercase">Triagem</span>
                      <div className="p-2 bg-card rounded shadow-sm border border-border/30">
                        <span className="font-bold text-foreground block">Lucas Almeida</span>
                        <span className="text-[8px] text-red-500 font-bold block mt-1 uppercase">Trabalhista</span>
                      </div>
                    </div>

                    <div className="space-y-2 p-1.5 rounded-lg bg-muted/55 border border-border/30">
                      <span className="font-bold text-muted-foreground block text-[9px] uppercase">Aguardando Doc</span>
                      <div className="p-2 bg-card rounded shadow-sm border border-primary/30 ring-1 ring-primary/10">
                        <span className="font-bold text-foreground block">Juliana Ribeiro</span>
                        <span className="text-[8px] text-amber-500 font-bold block mt-1 uppercase">Previdenciário</span>
                      </div>
                    </div>

                    <div className="space-y-2 p-1.5 rounded-lg bg-muted/55 border border-border/30">
                      <span className="font-bold text-muted-foreground block text-[9px] uppercase">Contrato Emitido</span>
                      <div className="p-2 bg-card rounded shadow-sm border border-border/30">
                        <span className="font-bold text-foreground block">Roberto Lima</span>
                        <span className="text-[8px] text-indigo-500 font-bold block mt-1 uppercase">Civil</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
                  <span>💡 Arraste e solte seus contatos para disparar webhooks automáticos.</span>
                  <span className="font-bold text-primary">Mover para Contrato</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 bg-muted/40 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Aprovado por quem está na linha de frente jurídica
            </h2>
            <p className="text-base text-muted-foreground">
              Veja a opinião de advogados que automatizaram seus escritórios e alcançaram resultados expressivos.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Contêiner de slides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((offset) => {
                const idx = (testimonialIdx + offset) % testimonials.length;
                const test = testimonials[idx];
                return (
                  <motion.div
                    key={`${test.name}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`glass-card rounded-2xl p-6 border border-border/40 hover:border-primary/30 transition-all flex flex-col justify-between shadow-lg bg-card/25 min-h-[220px] ${
                      offset === 1 ? "hidden md:flex" : offset === 2 ? "hidden lg:flex" : "flex"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex gap-0.5">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-foreground italic leading-relaxed min-h-[90px]">
                        "{test.text}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/20">
                      <img
                        src={test.avatar}
                        alt={test.name}
                        className="h-10 w-10 rounded-full border border-primary/20 object-cover shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{test.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-medium">{test.role}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Controles do Slideshow */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-border/60 hover:bg-muted"
                onClick={() => setTestimonialIdx((prev) => (prev - 3 + testimonials.length) % testimonials.length)}
                title="Depoimentos Anteriores"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              {/* Indicadores de Página (dots) */}
              <div className="flex gap-2">
                {[0, 3, 6, 9, 12].map((startIdx, dotIdx) => {
                  const isActive = Math.floor(testimonialIdx / 3) === dotIdx;
                  return (
                    <button
                      key={dotIdx}
                      onClick={() => setTestimonialIdx(startIdx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isActive ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      title={`Página ${dotIdx + 1}`}
                    />
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-border/60 hover:bg-muted"
                onClick={() => setTestimonialIdx((prev) => (prev + 3) % testimonials.length)}
                title="Próximos Depoimentos"
              >
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Planos sob medida para qualquer tamanho de banca
          </h2>
          <p className="text-base text-muted-foreground">
            Escolha o plano ideal e comece a automatizar seus atendimentos e petições hoje mesmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plano Iniciante */}
          <PricingCard
            title="Iniciante"
            price="149"
            description="Ideal para advogados autônomos que buscam iniciar na inteligência artificial jurídica."
            features={[
              "1 Canal de WhatsApp Ativo",
              "Até 50 petições geradas/mês",
              "CRM Kanban completo",
              "Suporte por e-mail",
              "Acesso à API Evolution Básica"
            ]}
            buttonText="Começar Iniciante"
            onClick={() => handleOpenLogin("integrador")}
          />

          {/* Plano Pro */}
          <PricingCard
            title="Profissional"
            price="240"
            description="Recomendado para escritórios em crescimento que exigem automação contínua."
            features={[
              "3 Canais de WhatsApp Ativos",
              "Petições geradas ILIMITADAS",
              "CRM Kanban com automações",
              "Suporte prioritário via WhatsApp",
              "Integrações nativas (Make/n8n)",
              "Prioridade no processamento de IA"
            ]}
            isPopular
            buttonText="Assinar Plano Pro"
            onClick={() => handleOpenLogin("integrador")}
          />

          {/* Plano Enterprise */}
          <PricingCard
            title="Enterprise"
            price="Custom"
            description="Para grandes escritórios que necessitam de soluções e integrações personalizadas."
            features={[
              "Canais de WhatsApp ilimitados",
              "Petições geradas ILIMITADAS",
              "IA treinada com banco próprio",
              "Webhooks e APIs dedicadas",
              "Gerente de conta exclusivo",
              "SLA de atendimento de 99.9%"
            ]}
            buttonText="Falar com Especialista"
            onClick={() => handleOpenLogin("admin")}
          />
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-muted/40 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Perguntas Frequentes
            </h2>
            <p className="text-base text-muted-foreground">
              Esclareça suas dúvidas gerais sobre a plataforma Advocatus, segurança e funcionamento.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="glass-card rounded-xl border border-border/40 overflow-hidden bg-card/20 transition-all duration-200">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-foreground"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-primary" /> {item.q}
                    </span>
                    <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 pt-0 text-xs sm:text-sm text-muted-foreground border-t border-border/20 leading-relaxed bg-card/10">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-background py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Scale className="h-4 w-4 text-slate-900" />
            </div>
            <span className="font-bold text-base tracking-tight">Advocatus</span>
          </div>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Advocatus. Todos os direitos reservados. Em conformidade com a LGPD e o Código de Ética da OAB.
          </p>

          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="/terms" className="hover:text-primary transition-colors">Termos de Serviço</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL (Radix / custom overlays using Framer Motion) */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsLoginOpen(false)}
            />

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md z-10"
            >
              <Card className="glass-card border-border/80 shadow-2xl relative">
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <CardHeader>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      {selectedRole === "admin" ? <ShieldCheck className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    </div>
                    <CardTitle className="text-xl">Acesso {selectedRole === "admin" ? "Master Admin" : "Integrador"}</CardTitle>
                  </div>
                  <CardDescription>
                    Insira as credenciais para acessar o painel {selectedRole === "admin" ? "administrativo" : "do escritório"}.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="modal-email">E-mail</Label>
                      <Input
                        id="modal-email"
                        type="email"
                        placeholder="nome@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-muted/40 border-border rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modal-password">Senha</Label>
                      <Input
                        id="modal-password"
                        type="password"
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-muted/40 border-border rounded-xl"
                      />
                    </div>
                    
                    {/* Exibe aviso de credenciais para desenvolvimento */}
                    <div className="p-2.5 bg-primary/5 border border-primary/20 rounded-xl text-[10px] text-muted-foreground">
                      <span className="font-bold text-primary block mb-0.5">Credenciais de Teste:</span>
                      E-mail: <span className="font-mono">{email}</span><br />
                      Senha: <span className="font-mono">{password}</span> (pressione acessar)
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-2">
                    <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-5 shadow-lg shadow-primary/20" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Acessar Sistema"}
                    </Button>
                    <div className="text-[10px] text-muted-foreground">
                      Acesso Master Admin é exclusivo e não pode ser alternado no painel.
                    </div>

                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente do Card de Funcionalidade
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="glass-card rounded-2xl p-6 border border-border/40 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] bg-card/30 flex flex-col space-y-3 shadow-md">
    <div className="p-3 rounded-xl bg-background/80 w-fit shadow-inner border border-border/40">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-foreground tracking-tight">{title}</h3>
    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

// Componente do Card de Preços
const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  buttonText,
  onClick
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  onClick: () => void;
}) => (
  <div
    className={`glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border relative bg-card/25 shadow-xl hover:scale-[1.01] transition-transform ${
      isPopular 
        ? "border-primary ring-2 ring-primary/20 md:-translate-y-2 scale-102" 
        : "border-border/60"
    }`}
  >
    {isPopular && (
      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
        Mais Escolhido
      </span>
    )}
    
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed min-h-[40px]">{description}</p>
      </div>

      <div className="flex items-baseline gap-1 py-2 border-y border-border/20">
        {price !== "Custom" ? (
          <>
            <span className="text-2xl font-bold text-foreground">R$</span>
            <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">{price}</span>
            <span className="text-xs text-muted-foreground font-medium">/mês</span>
          </>
        ) : (
          <span className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight py-1">Sob Consulta</span>
        )}
      </div>

      <ul className="space-y-3 text-xs sm:text-sm">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center gap-2.5 text-foreground">
            <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
              <Check className="h-3 w-3" />
            </div>
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </div>

    <Button
      onClick={onClick}
      className={`w-full rounded-2xl h-12 text-sm font-bold mt-8 transition-colors ${
        isPopular
          ? "bg-primary hover:bg-primary/95 text-primary-foreground"
          : "bg-muted hover:bg-muted/90 text-foreground border border-border"
      }`}
    >
      {buttonText}
    </Button>
  </div>
);

export default Index;
