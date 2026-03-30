import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, QrCode, Wifi, WifiOff, RotateCcw, LogOut, Loader2 } from 'lucide-react';
import { mockInstances } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function WhatsAppPage() {
  const [instances, setInstances] = useState(mockInstances);
  const [qrLoading, setQrLoading] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);

  const handleGenerateQR = (name: string) => {
    setQrLoading(name);
    setTimeout(() => {
      setQrLoading(null);
      setShowQR(name);
    }, 2000);
  };

  const handleConnect = (name: string) => {
    setShowQR(null);
    setInstances(prev => prev.map(inst =>
      inst.name === name ? { ...inst, status: 'connected' as const, phone: '+55 11 99999-0001' } : inst
    ));
  };

  const handleDisconnect = (name: string) => {
    setInstances(prev => prev.map(inst =>
      inst.name === name ? { ...inst, status: 'disconnected' as const, phone: '' } : inst
    ));
    setShowQR(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Gestão WhatsApp
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie suas instâncias da Evolution API</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instances.map((inst, i) => (
          <motion.div key={inst.name} initial="hidden" animate="visible" custom={i + 1} variants={fadeIn}>
            <div className="glass-card-hover rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{inst.displayName}</h3>
                  <p className="text-xs text-muted-foreground">{inst.name}</p>
                </div>
                <Badge className={cn(
                  'rounded-full',
                  inst.status === 'connected'
                    ? 'bg-accent/10 text-accent border-accent/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                )}>
                  {inst.status === 'connected' ? (
                    <><Wifi className="h-3 w-3 mr-1" /> Conectado</>
                  ) : (
                    <><WifiOff className="h-3 w-3 mr-1" /> Desconectado</>
                  )}
                </Badge>
              </div>

              {inst.phone && (
                <p className="text-sm text-foreground mb-3">📱 {inst.phone}</p>
              )}

              {/* QR Code area */}
              {qrLoading === inst.name && (
                <div className="flex flex-col items-center justify-center py-8 bg-secondary/30 rounded-xl mb-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                  <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                </div>
              )}

              {showQR === inst.name && (
                <div className="flex flex-col items-center py-6 bg-secondary/30 rounded-xl mb-4">
                  <div className="h-40 w-40 bg-foreground rounded-lg flex items-center justify-center mb-3">
                    <QrCode className="h-32 w-32 text-background" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Escaneie com seu WhatsApp</p>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl" onClick={() => handleConnect(inst.name)}>
                    Simular Conexão
                  </Button>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {inst.status === 'disconnected' && !showQR && (
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-1"
                    onClick={() => handleGenerateQR(inst.name)}
                    disabled={qrLoading === inst.name}
                  >
                    <QrCode className="h-3.5 w-3.5" /> Gerar QR Code
                  </Button>
                )}
                {inst.status === 'connected' && (
                  <>
                    <Button size="sm" variant="outline" className="rounded-xl gap-1 border-border" onClick={() => handleDisconnect(inst.name)}>
                      <LogOut className="h-3.5 w-3.5" /> Desconectar
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl gap-1 border-border">
                      <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
                    </Button>
                  </>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Última atividade: {new Date(inst.lastActivity).toLocaleString('pt-BR')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
