import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, TrendingUp, Filter, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TokenPurchaseModal } from '@/components/dashboard/TokenPurchaseModal';
import { mockLeads, mockConsumptionHistory } from '@/data/mockData';
import { LeadScoreBadge } from '@/components/dashboard/LeadScoreBadge';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{user?.office} — Visão geral do sistema</p>
      </motion.div>

      {/* Wallet */}
      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}>
        <WalletCard onBuyTokens={() => setPurchaseOpen(true)} />
      </motion.div>

      {/* Stats */}
      <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard title="Leads Processados" value="150" subtitle="Último mês" icon={Filter} variant="electric" />
        <StatsCard title="Tokens Consumidos" value={user?.tokensConsumed?.toString() || '0'} subtitle="Total" icon={Zap} variant="emerald" />
        <StatsCard title="Taxa de Conversão" value="34%" subtitle="+5% vs. mês anterior" icon={TrendingUp} />
        <StatsCard title="Instâncias Ativas" value="2" subtitle="WhatsApp" icon={MessageSquare} variant="electric" />
      </motion.div>

      {/* Recent leads */}
      <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Leads Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left pb-3 font-medium">Lead</th>
                  <th className="text-left pb-3 font-medium">Assunto</th>
                  <th className="text-left pb-3 font-medium">Score</th>
                  <th className="text-left pb-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {mockLeads.slice(0, 4).map((lead) => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 font-medium text-foreground">{lead.name}</td>
                    <td className="py-3 text-muted-foreground">{lead.subject}</td>
                    <td className="py-3"><LeadScoreBadge score={lead.score} /></td>
                    <td className="py-3 text-muted-foreground">{new Date(lead.date).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Performance Chart */}
      <motion.div initial="hidden" animate="visible" custom={4} variants={fadeIn}>
        <PerformanceChart />
      </motion.div>

      {/* Fee Calculator */}
      <motion.div initial="hidden" animate="visible" custom={5} variants={fadeIn}>
        <FeeCalculator />
      </motion.div>

      {/* Recent consumption */}
      <motion.div initial="hidden" animate="visible" custom={6} variants={fadeIn}>
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
