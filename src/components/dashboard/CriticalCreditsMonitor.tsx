import { AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockUsers } from '@/data/mockData';
import { toast } from 'sonner';

export function CriticalCreditsMonitor() {
  const criticalUsers = mockUsers.filter(u => u.tokensAvailable < 100);

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-destructive" />
        Créditos Críticos
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Clientes com menos de 100 tokens</p>
      {criticalUsers.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">Todos os clientes têm saldo suficiente ✅</p>
      ) : (
        <div className="space-y-3">
          {criticalUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-xl">
              <div>
                <p className="text-sm font-medium text-foreground">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.office}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 rounded-full">
                  {u.tokensAvailable} tokens
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:bg-primary/10 rounded-xl gap-1"
                  onClick={() => {
                    toast.success(`Notificação enviada para ${u.name}`);
                  }}
                >
                  <Send className="h-3 w-3" /> Notificar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
