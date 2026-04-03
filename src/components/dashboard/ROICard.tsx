import { Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  leadsProcessed: number;
  minutesPerLead?: number;
}

export function ROICard({ leadsProcessed, minutesPerLead = 5 }: Props) {
  const totalMinutes = leadsProcessed * minutesPerLead;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card-hover rounded-2xl p-5 glow-emerald relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Economia de Tempo (ROI)
          </p>
          <p className="text-2xl font-bold text-gradient-emerald mt-1">
            {hours}h {mins > 0 ? `${mins}min` : ''}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Esta semana a IA economizou <strong className="text-accent">{hours} horas</strong> de triagem manual
          </p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Clock className="h-5 w-5 text-accent" />
        </div>
      </div>
    </motion.div>
  );
}
