import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const PLANOS = [
  {
    id: 'starter',
    nome: 'Plano Starter',
    preco: 110.00,
    tokens: 500,
    features: [
      '500 tokens/mês',
      '1 instância WhatsApp',
      'Todos os 12 agentes de IA',
      'Geração de documentos',
      'Scraping de processos',
      'Suporte por email'
    ],
    link: 'https://pay.cakto.com.br/t6n34bz_860946',
    icone: Zap,
    popular: false,
    cor: 'primary'
  },
  {
    id: 'pro',
    nome: 'Plano Professional',
    preco: 240.00,
    tokens: 1500,
    features: [
      '1500 tokens/mês',
      '3 instâncias WhatsApp',
      'Todos os 12 agentes de IA',
      'Geração ilimitada de documentos',
      'Scraping ilimitado',
      'Análise avançada de leads',
      'Relatórios em PDF',
      'Suporte prioritário'
    ],
    link: 'https://pay.cakto.com.br/3e7qnqw_860950',
    icone: Crown,
    popular: true,
    cor: 'accent'
  }
];

export function PlanosAssinatura() {
  const [processando, setProcessando] = useState<string | null>(null);

  const handleAssinar = (plano: typeof PLANOS[0]) => {
    setProcessando(plano.id);
    
    toast.info(`Redirecionando para checkout seguro da Cakto...`);
    
    // Pequeno delay para o usuário ver o feedback
    setTimeout(() => {
      window.open(plano.link, '_blank');
      setProcessando(null);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Planos Mensais</h2>
        <p className="text-muted-foreground">
          Assinatura recorrente com tokens mensais. Cancele quando quiser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANOS.map((plano, index) => {
          const Icon = plano.icone;
          
          return (
            <motion.div
              key={plano.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative glass-card rounded-2xl p-8 ${
                plano.popular ? 'ring-2 ring-accent glow-emerald' : ''
              }`}
            >
              {plano.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  ⭐ Mais Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <div className={`h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plano.popular ? 'bg-accent/20' : 'bg-primary/20'
                }`}>
                  <Icon className={`h-8 w-8 ${plano.popular ? 'text-accent' : 'text-primary'}`} />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{plano.nome}</h3>
                
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-4xl font-bold text-gradient-electric">
                    R$ {plano.preco.toFixed(0)}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {plano.tokens} tokens inclusos
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plano.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${
                      plano.popular ? 'text-accent' : 'text-primary'
                    }`} />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleAssinar(plano)}
                disabled={processando === plano.id}
                className={`w-full h-12 rounded-xl font-semibold ${
                  plano.popular
                    ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {processando === plano.id ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Redirecionando...
                  </>
                ) : (
                  <>
                    Assinar Agora
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                🔒 Pagamento seguro via Cakto. Cancele quando quiser.
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          💡 Prefere comprar tokens avulsos? Use a opção "Comprar Tokens" na aba Wallet
        </p>
      </div>
    </div>
  );
}
