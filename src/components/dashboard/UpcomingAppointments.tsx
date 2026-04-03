import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockAppointments = [
  { id: '1', leadName: 'João Silva', date: '2026-04-04', time: '14:00', status: 'confirmed' as const },
  { id: '2', leadName: 'Maria Oliveira', date: '2026-04-04', time: '16:30', status: 'confirmed' as const },
  { id: '3', leadName: 'Carlos Souza', date: '2026-04-05', time: '09:00', status: 'pending' as const },
  { id: '4', leadName: 'Lucia Ferreira', date: '2026-04-05', time: '11:00', status: 'confirmed' as const },
];

function relativeDay(dateStr: string) {
  const today = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
}

export function UpcomingAppointments() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" />
        Próximos Agendamentos
      </h3>
      <div className="space-y-3">
        {mockAppointments.map((a) => (
          <div key={a.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{a.leadName}</p>
                <p className="text-xs text-muted-foreground">
                  {relativeDay(a.date)} às {a.time}
                </p>
              </div>
            </div>
            <Badge className={cn(
              'rounded-full text-xs',
              a.status === 'confirmed'
                ? 'bg-accent/10 text-accent border-accent/20'
                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            )}>
              {a.status === 'confirmed' ? (
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Confirmado</span>
              ) : (
                'Pendente'
              )}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
