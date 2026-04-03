import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, TrendingUp, Filter, MessageSquare, EyeOff, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TokenPurchaseModal } from '@/components/dashboard/TokenPurchaseModal';
import { mockLeads, mockConsumptionHistory } from '@/data/mockData';
import { LeadScoreBadge } from '@/components/dashboard/LeadScoreBadge';
import { LeadConfidenceBar } from '@/components/dashboard/LeadConfidenceBar';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { FeeCalculator } from '@/components/dashboard/FeeCalculator';
import { ROICard } from '@/components/dashboard/ROICard';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { LeadOriginChart } from '@/components/dashboard/LeadOriginChart';
import { HotLeadAlert } from '@/components/dashboard/HotLeadAlert';
import { DiscardReasonsChart } from '@/components/dashboard/DiscardReasonsChart';
import { AISuccessRate } from '@/components/dashboard/AISuccessRate';
import { TokenConsumptionChart } from '@/components/dashboard/TokenConsumptionChart';
import { ClientRanking } from '@/components/dashboard/ClientRanking';
import { CriticalCreditsMonitor } from '@/components/dashboard/CriticalCreditsMonitor';
import { ConversationHeatmap } from '@/components/dashboard/ConversationHeatmap';
import { AIErrorLogs } from '@/components/dashboard/AIErrorLogs';
import { Button } from '@/components/ui/button';

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
  const [blurValues, setBlurValues] = useState(false);
  const isAdmin = user?.role === 'admin';

  return (
    <div className={`space-y-6 max-w-7xl mx-auto ${blurValues ? 'blur-values' : ''}`}>
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user?.office} — {isAdmin ? 'Painel Administrativo' : 'Visão geral do sistema'}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5"
            onClick={() => setBlurValues(!blurValues)}
          >
            {blurValues ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {blurValues ? 'Mostrar Valores' : 'Esconder Valores'}
          </Button>
        </div>
      </motion.div>

      {/* Hot Lead Alert - Integrador only */}
      {!isAdmin && (
        <motion.div initial="hidden" animate="visible" custom={0.5} variants={fadeIn}>
          <HotLeadAlert />
        </motion.div>
      )}

      {/* Wallet + ROI row */}
      {!isAdmin && (
        <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <WalletCard onBuyTokens={() => setPurchaseOpen(true)} />
          <ROICard leadsProcessed={150} />
        </motion.div>
      )}

      {/* Stats */}
      <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard title="Leads Processados" value="150" subtitle="Último mês" icon={Filter} variant="electric" />
        <StatsCard title="Tokens Consumidos" value={user?.tokensConsumed?.toString() || '0'} subtitle="Total" icon={Zap} variant="emerald" />
        <StatsCard title="Taxa de Conversão" value="34%" subtitle="+5% vs. mês anterior" icon={TrendingUp} />
        <StatsCard title="Instâncias Ativas" value="2" subtitle="WhatsApp" icon={MessageSquare} variant="electric" />
      </motion.div>

      {/* Admin-specific widgets */}
      {isAdmin && (
        <>
          <motion.div initial="hidden" animate="visible" custom={2.5} variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <AISuccessRate />
            <TokenConsumptionChart />
          </motion.div>
          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <ClientRanking />
            <CriticalCreditsMonitor />
          </motion.div>
          <motion.div initial="hidden" animate="visible" custom={3.5} variants={fadeIn}>
            <ConversationHeatmap />
          </motion.div>
          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeIn}>
            <AIErrorLogs />
          </motion.div>
        </>
      )}

      {/* Integrador-specific widgets */}
      {!isAdmin && (
        <>
          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <UpcomingAppointments />
            <LeadOriginChart />
          </motion.div>
          <motion.div initial="hidden" animate="visible" custom={3.5} variants={fadeIn}>
            <DiscardReasonsChart />
          </motion.div>
        </>
      )}

      {/* Recent leads with confidence */}
      <motion.div initial="hidden" animate="visible" custom={4.5} variants={fadeIn}>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Leads Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left pb-3 font-medium">Lead</th>
                  <th className="text-left pb-3 font-medium">Assunto</th>
                  <th className="text-left pb-3 font-medium">Score / Confiança</th>
                  <th className="text-left pb-3 font-medium">Data</th>
                  {!isAdmin && <th className="text-right pb-3 font-medium">Ação</th>}
                </tr>
              </thead>
              <tbody>
                {mockLeads.slice(0, 4).map((lead) => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 font-medium text-foreground">{lead.name}</td>
                    <td className="py-3 text-muted-foreground">{lead.subject}</td>
                    <td className="py-3 min-w-[160px]">
                      <LeadScoreBadge score={lead.score} />
                      <div className="mt-1.5">
                        <LeadConfidenceBar score={lead.score} />
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{new Date(lead.date).toLocaleDateString('pt-BR')}</td>
                    {!isAdmin && (
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-1"
                          onClick={() => {
                            const msg = `Olá ${lead.name}, sou ${user?.name}, a minha assistente me passou seu caso sobre "${lead.subject}". Como posso ajudá-lo(a)?`;
                            window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                        >
                          Assumir Agora
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Performance Chart */}
      <motion.div initial="hidden" animate="visible" custom={5} variants={fadeIn}>
        <PerformanceChart />
      </motion.div>

      {/* Fee Calculator - Integrador only */}
      {!isAdmin && (
        <motion.div initial="hidden" animate="visible" custom={6} variants={fadeIn}>
          <FeeCalculator />
        </motion.div>
      )}

      {/* Consumption history */}
      <motion.div initial="hidden" animate="visible" custom={7} variants={fadeIn}>
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
                    <td className="py-3 text-right text-destructive blur-target">-{h.cost}</td>
                    <td className="py-3 text-right text-accent font-medium blur-target">{h.balance}</td>
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
