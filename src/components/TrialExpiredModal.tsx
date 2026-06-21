import { motion } from 'framer-motion';
import { Lock, Rocket, Star, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PLANS = [
  {
    id: 'starter',
    name: 'Iniciante',
    price: 'R$ 149',
    period: '/mês',
    icon: Star,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    features: ['1 Canal WhatsApp', 'Até 50 petições/mês', 'CRM Kanban'],
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 'R$ 240',
    period: '/mês',
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/40',
    popular: true,
    features: ['3 Canais WhatsApp', 'Petições ILIMITADAS', 'Integrações n8n/Make'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Sob Consulta',
    period: '',
    icon: Crown,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
    features: ['WhatsApp ilimitado', 'IA personalizada', 'SLA 99.9%'],
  },
];

export function TrialExpiredModal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = (planId: string) => {
    // Redireciona para checkout ou contato
    if (planId === 'enterprise') {
      window.open('https://wa.me/5511999999999?text=Quero+conhecer+o+plano+Enterprise+do+Advocatus', '_blank');
    } else {
      // Redireciona para página de pagamento com plano pré-selecionado
      navigate(`/?upgrade=${planId}#pricing`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-3xl mx-4"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex p-4 bg-red-500/10 rounded-2xl mb-4"
          >
            <Lock className="h-10 w-10 text-red-400" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Seu trial de 3 dias expirou
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Olá, <span className="font-semibold text-foreground">{user?.name}</span>! Esperamos que tenha aproveitado o Advocatus.
            Escolha um plano para continuar automatizando seu escritório.
          </p>
        </div>

        {/* Cards dos planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className={`relative rounded-2xl border p-6 flex flex-col gap-4 ${plan.border} ${plan.popular ? 'ring-2 ring-primary/30 scale-[1.02]' : ''} bg-card/40`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                    MAIS POPULAR
                  </div>
                )}
                <div className={`p-2.5 rounded-xl ${plan.bg} w-fit`}>
                  <Icon className={`h-5 w-5 ${plan.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                  <p className="text-2xl font-extrabold text-foreground mt-1">
                    {plan.price}<span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                  </p>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full ${plan.color.replace('text-', 'bg-')}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full rounded-xl font-semibold ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20' : 'variant-outline border border-border'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  {plan.id === 'enterprise' ? 'Falar com Especialista' : 'Assinar Agora'}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Tem dúvidas?{' '}
          <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Fale com nosso suporte
          </a>
          {' '}·{' '}
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground underline">
            Sair da conta
          </button>
        </p>
      </motion.div>
    </div>
  );
}
