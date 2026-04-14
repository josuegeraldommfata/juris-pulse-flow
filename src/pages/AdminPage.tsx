import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Database, Activity, Server, AlertCircle, Loader2, Gauge, HardDrive, Cpu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function AdminPage() {
  // Busca Estatísticas Globais (Admin)
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await apiService.getAdminStats();
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  const systemMetrics = [
    { label: 'Advogados Ativos', value: stats?.totalClients || 0, icon: Users, color: 'text-primary' },
    { label: 'Total de Leads', value: stats?.systemLeads || 0, icon: Database, color: 'text-accent' },
    { label: 'Saúde da API', value: stats?.apiHealth || 'Healthy', icon: Activity, color: 'text-emerald-500' },
    { label: 'Servidores', value: '1 Ativo', icon: Server, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Painel de Administração
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Controle total da infraestrutura JurisAI</p>
        </div>
        <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 gap-1 px-3 py-1">
          <Gauge className="h-3 w-3" /> Modo Master
        </Badge>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial="hidden"
            animate="visible"
            custom={i + 1}
            variants={fadeIn}
            className="glass-card-hover rounded-2xl p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-secondary/50 ${metric.color}`}>
                <metric.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
                <p className="text-xl font-bold text-foreground">{metric.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial="hidden" animate="visible" custom={5} variants={fadeIn} className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Uso de Recursos</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> CPU Usage</span>
                <span className="text-primary font-bold">12%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '12%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" /> Storage</span>
                <span className="text-accent font-bold">45%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={6} variants={fadeIn} className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Alertas de Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-400/5 border border-red-400/10 rounded-xl">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-xs text-red-200">Evolution API instance "leadsprospect" sem token master.</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-400/5 border border-emerald-400/10 rounded-xl">
              <Activity className="h-4 w-4 text-emerald-400" />
              <p className="text-xs text-emerald-200">Banco de Dados PostgreSQL operando normalmente.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
