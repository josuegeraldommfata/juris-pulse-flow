import { motion } from 'framer-motion';
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { mockSystemHealth } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const statusConfig = {
  online: { icon: CheckCircle2, label: 'Online', className: 'bg-[hsl(var(--emerald))]/10 text-[hsl(var(--emerald))] border-[hsl(var(--emerald))]/20' },
  warning: { icon: AlertTriangle, label: 'Instável', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  offline: { icon: XCircle, label: 'Offline', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function SystemStatusPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Status do Sistema
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Monitoramento de serviços e conexões</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => toast.success('Status atualizado!')}>
          <RefreshCw className="h-3.5 w-3.5" /> Atualizar
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSystemHealth.map((service, i) => {
          const config = statusConfig[service.status];
          const Icon = config.icon;
          return (
            <motion.div key={service.name} initial="hidden" animate="visible" custom={i + 1} variants={fadeIn}>
              <div className="glass-card-hover rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm">{service.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Latência</p>
                    <p className="text-sm font-medium text-foreground">{service.latency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Uptime</p>
                    <p className="text-sm font-medium text-[hsl(var(--emerald))]">{service.uptime}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Último check: {new Date(service.lastCheck).toLocaleString('pt-BR')}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
