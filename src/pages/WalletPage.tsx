import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, Repeat } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { TokenPurchaseModal } from '@/components/dashboard/TokenPurchaseModal';
import { PlanosAssinatura } from '@/components/payment/PlanosAssinatura';
import { mockConsumptionHistory } from '@/data/mockData';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function WalletPage() {
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Wallet className="h-6 w-6 text-accent" />
          Wallet & Tokens
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie seus créditos e assinaturas</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}>
        <WalletCard onBuyTokens={() => setPurchaseOpen(true)} />
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn}>
        <Tabs defaultValue="comprar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="comprar" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Comprar Tokens
            </TabsTrigger>
            <TabsTrigger value="planos" className="gap-2">
              <Repeat className="h-4 w-4" />
              Planos Mensais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comprar" className="mt-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4 text-center">Recarga Avulsa de Tokens</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Compre tokens quando precisar. Sem compromisso mensal.
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={() => setPurchaseOpen(true)}
                  className="glass-card-hover rounded-2xl p-6 border-2 border-primary hover:border-accent transition-all cursor-pointer max-w-sm"
                >
                  <div className="text-center space-y-3">
                    <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">Checkout Transparente</h4>
                    <p className="text-sm text-muted-foreground">
                      Pague com Cartão, Pix ou Boleto
                    </p>
                    <p className="text-sm text-primary font-semibold">
                      🔥 A partir de R$ 29,90
                    </p>
                  </div>
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground mb-3">Ou use o link rápido de recarga:</p>
                <a
                  href="https://pay.cakto.com.br/3fh4f98_861635"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
                >
                  💳 Recarga de 50 Tokens (Link Cakto)
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="planos" className="mt-6">
            <PlanosAssinatura />
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Histórico de Consumo</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left pb-3 font-medium">Data</th>
                  <th className="text-left pb-3 font-medium">Lead</th>
                  <th className="text-left pb-3 font-medium">Ação</th>
                  <th className="text-right pb-3 font-medium">Custo</th>
                  <th className="text-right pb-3 font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {mockConsumptionHistory.map((h) => (
                  <tr key={h.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 text-muted-foreground">{new Date(h.date).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 text-foreground font-medium">{h.lead}</td>
                    <td className="py-3 text-muted-foreground">{h.action}</td>
                    <td className="py-3 text-right text-red-400">-{h.cost}</td>
                    <td className="py-3 text-right text-accent font-medium">{h.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <TokenPurchaseModal open={purchaseOpen} onClose={() => setPurchaseOpen(false)} />
    </div>
  );
}
