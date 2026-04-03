import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Props {
  score: 'hot' | 'warm' | 'cold';
  confidence?: number;
}

export function LeadConfidenceBar({ score, confidence }: Props) {
  const pct = confidence ?? (score === 'hot' ? 85 : score === 'warm' ? 55 : 25);
  const label = pct >= 75 ? 'Ganho Certo' : pct >= 50 ? 'Viável' : 'Incerto';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">Confiança IA</span>
        <span className={cn(
          'text-[10px] font-bold',
          pct >= 75 ? 'text-accent' : pct >= 50 ? 'text-yellow-400' : 'text-muted-foreground'
        )}>
          {pct}% — {label}
        </span>
      </div>
      <Progress
        value={pct}
        className="h-1.5 bg-secondary"
      />
    </div>
  );
}
