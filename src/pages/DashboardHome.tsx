import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Brain, BarChart3, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } })
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [blurValues] = useState(false);
  
  const { data: stats } = useQuery({
    queryKey: ['integrator-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await apiService.getIntegratorStats(user.id);
      return res.data;
    },
    enabled: !!user?.id
  });

  const metrics = [
    { label: 'Total de Leads', value: stats?.totalLeads || 0, icon: Users, color: 'text-primary' },
    { label: 'Em Triagem', value: parseInt(stats?.leadsByStage?.find((s: any) => s.stage === 'triagem')?.count || '0'), icon: MessageSquare, color: 'text-accent' },
    { label: 'Docs Pendentes', value: parseInt(stats?.leadsByStage?.find((s: any) => s.stage === 'documentacao')?.count || '0'), icon: Brain, color: 'text-amber-500' },
    { label: 'Conversão', value: '12%', icon: BarChart3, color: 'text-emerald-500' },
  ];

  return (
    <div className={`space-y-6 max-w-7xl mx-auto ${blurValues ? 'blur-values' : ''}`}>
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo, {user?.name || 'Doutor(a)'}</h1>
            <p className="text-sm text-muted-foreground mt-1">Aqui está o resumo do seu fluxo jurídico hoje.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div key={metric.label} initial="hidden" animate="visible" custom={i + 1} variants={fadeIn}>
            <div className="glass-card-hover rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-secondary/50 ${metric.color}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial="hidden" animate="visible" custom={5} variants={fadeIn} className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-6">Volume por Estágio</h3>
            <div className="h-[250px] flex items-end justify-between gap-4">
               {['triagem', 'documentacao', 'aguardando', 'contrato'].map((stage) => {
                 const count = parseInt(stats?.leadsByStage?.find((s: any) => s.stage === stage)?.count || '0');
                 const height = stats?.totalLeads ? (count / stats.totalLeads) * 100 : 5;
                 return (
                  <div key={stage} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all duration-500 relative min-h-[10px]"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {count}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase">{stage}</span>
                  </div>
                 );
               })}
            </div>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={6} variants={fadeIn} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 gap-2">
              <button className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Ver Agenda</span>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">Exportar Relatório</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
