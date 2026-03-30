import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { TokenPurchaseModal } from '@/components/dashboard/TokenPurchaseModal';
import { mockConsumptionHistory } from '@/data/mockData';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function WalletPage() {
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Wallet className="h-6 w-6 text-accent" />
          Wallet & Tokens
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie seus créditos de consumo</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}>
        <WalletCard onBuyTokens={() => setPurchaseOpen(true)} />
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn}>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Log de Consumo</h3>
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
