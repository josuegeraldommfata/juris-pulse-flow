import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'electric' | 'emerald' | 'default';
}

export function StatsCard({ title, value, subtitle, icon: Icon, variant = 'default' }: Props) {
  return (
    <div className={cn(
      'glass-card-hover rounded-2xl p-5',
      variant === 'electric' && 'glow-electric',
      variant === 'emerald' && 'glow-emerald',
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <p className={cn(
            'text-2xl font-bold mt-1',
            variant === 'electric' && 'text-gradient-electric',
            variant === 'emerald' && 'text-gradient-emerald',
            variant === 'default' && 'text-foreground',
          )}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn(
          'h-10 w-10 rounded-xl flex items-center justify-center',
          variant === 'electric' ? 'bg-primary/10' : variant === 'emerald' ? 'bg-accent/10' : 'bg-secondary',
        )}>
          <Icon className={cn(
            'h-5 w-5',
            variant === 'electric' ? 'text-primary' : variant === 'emerald' ? 'text-accent' : 'text-muted-foreground',
          )} />
        </div>
      </div>
    </div>
  );
}
