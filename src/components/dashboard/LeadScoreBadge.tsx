import { cn } from '@/lib/utils';
import { Flame, Thermometer, Snowflake } from 'lucide-react';

type Score = 'hot' | 'warm' | 'cold';

const config: Record<Score, { label: string; icon: typeof Flame; className: string }> = {
  hot: { label: 'Urgente', icon: Flame, className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  warm: { label: 'Morno', icon: Thermometer, className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  cold: { label: 'Frio', icon: Snowflake, className: 'bg-blue-400/10 text-blue-300 border-blue-400/20' },
};

export function LeadScoreBadge({ score }: { score: Score }) {
  const c = config[score];
  const Icon = c.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border', c.className)}>
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}
