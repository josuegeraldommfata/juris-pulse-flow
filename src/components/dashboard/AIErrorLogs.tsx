import { AlertTriangle, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockLogs = [
  { id: '1', date: '2026-04-03 14:32', leadName: 'Pedro Lima', type: 'no_answer' as const, message: 'IA não soube responder sobre prazo prescricional de ação revisional.', severity: 'high' as const },
  { id: '2', date: '2026-04-03 11:15', leadName: 'Ana Costa', type: 'frustration' as const, message: 'Lead demonstrou frustração após 3ª pergunta repetida sobre documentos.', severity: 'medium' as const },
  { id: '3', date: '2026-04-02 16:40', leadName: 'Carlos Souza', type: 'hallucination' as const, message: 'IA informou prazo incorreto de 5 anos para ação trabalhista (correto: 2 anos).', severity: 'critical' as const },
  { id: '4', date: '2026-04-02 09:20', leadName: 'Maria Oliveira', type: 'no_answer' as const, message: 'IA não conseguiu classificar área jurídica do caso.', severity: 'low' as const },
];

const severityMap = {
  critical: { label: 'Crítico', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  high: { label: 'Alto', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  medium: { label: 'Médio', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  low: { label: 'Baixo', className: 'bg-muted text-muted-foreground border-border' },
};

const typeMap = {
  no_answer: 'Sem Resposta',
  frustration: 'Lead Frustrado',
  hallucination: 'Alucinação',
};

export function AIErrorLogs() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
        Logs de Erro da IA
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Conversas para revisão de prompt</p>
      <div className="space-y-3">
        {mockLogs.map((log) => (
          <div key={log.id} className="p-3 bg-secondary/30 rounded-xl border border-border/50">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-foreground">{log.leadName}</span>
                <Badge className={`rounded-full text-[10px] ${severityMap[log.severity].className}`}>
                  {severityMap[log.severity].label}
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{log.date}</span>
            </div>
            <p className="text-xs text-muted-foreground ml-5">{log.message}</p>
            <Badge variant="outline" className="ml-5 mt-1 rounded-full text-[10px] border-border">
              {typeMap[log.type]}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
