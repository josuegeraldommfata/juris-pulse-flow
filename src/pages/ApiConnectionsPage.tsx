import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plug, Wifi, WifiOff, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

interface Webhook {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'GET';
  status: 'online' | 'offline' | 'unknown';
  lastPing: string;
  description: string;
}

const mockWebhooks: Webhook[] = [
  { id: '1', name: 'Entrada de Leads', url: '/webhook/leads-entry', method: 'POST', status: 'online', lastPing: '2026-04-02T10:30:00', description: 'Recebe novos leads da Evolution API processados pelo n8n' },
  { id: '2', name: 'Triagem IA', url: '/webhook/ai-triage', method: 'POST', status: 'online', lastPing: '2026-04-02T10:28:00', description: 'Dispara análise de IA para qualificação de leads' },
  { id: '3', name: 'Notificação de Score', url: '/webhook/score-notify', method: 'POST', status: 'offline', lastPing: '2026-04-01T18:00:00', description: 'Envia alerta quando lead atinge score Hot' },
  { id: '4', name: 'Atualização Kanban', url: '/webhook/kanban-update', method: 'POST', status: 'online', lastPing: '2026-04-02T10:25:00', description: 'Sincroniza movimentação de cards do Kanban' },
  { id: '5', name: 'Exportação de Dossiê', url: '/webhook/export-dossie', method: 'GET', status: 'unknown', lastPing: '', description: 'Gera arquivo de dossiê do lead para download' },
];

export default function ApiConnectionsPage() {
  const [webhooks, setWebhooks] = useState(mockWebhooks);
  const [testing, setTesting] = useState<string | null>(null);

  const testConnection = async (id: string) => {
    setTesting(id);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000));
    const success = Math.random() > 0.25;
    setWebhooks((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: success ? 'online' : 'offline', lastPing: new Date().toISOString() }
          : w
      )
    );
    if (success) {
      toast.success(`Webhook "${webhooks.find((w) => w.id === id)?.name}" respondeu 200 OK`);
    } else {
      toast.error(`Webhook "${webhooks.find((w) => w.id === id)?.name}" retornou erro de conexão`);
    }
    setTesting(null);
  };

  const statusConfig = {
    online: { label: 'Online', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
    offline: { label: 'Offline', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
    unknown: { label: 'Não testado', color: 'bg-muted text-muted-foreground border-border', icon: WifiOff },
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Plug className="h-6 w-6 text-primary" />
          Conexões de API
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Monitore o status dos webhooks de integração com n8n</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn} className="space-y-4">
        {webhooks.map((webhook) => {
          const cfg = statusConfig[webhook.status];
          const StatusIcon = cfg.icon;
          const isTesting = testing === webhook.id;

          return (
            <div key={webhook.id} className="glass-card rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground">{webhook.name}</h3>
                    <Badge variant="outline" className={`rounded-full text-xs ${cfg.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {cfg.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{webhook.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span className="font-mono bg-secondary/50 px-2 py-0.5 rounded">{webhook.method} {webhook.url}</span>
                    {webhook.lastPing && (
                      <span>Último ping: {new Date(webhook.lastPing).toLocaleString('pt-BR')}</span>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                  disabled={isTesting}
                  onClick={() => testConnection(webhook.id)}
                >
                  {isTesting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  {isTesting ? 'Testando...' : 'Testar Conexão'}
                </Button>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
