import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, QrCode, Wifi, WifiOff, RotateCcw, LogOut, Loader2, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function WhatsAppPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);

  // Busca as instâncias reais da Evolution API
  const { data: instances, isLoading, isError } = useQuery({
    queryKey: ['whatsapp-instances'],
    queryFn: async () => {
      const response = await apiService.getInstances();
      const data = response.data?.instances || response.data;
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 10000,
  });

  // Mutação para Criar Instância (Escalabilidade SaaS)
  const createMutation = useMutation({
    mutationFn: (data: { name: string, userId: number }) => apiService.createInstance(data.name, data.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-instances'] });
      toast.success('🤖 Robô Jurídico inicializado! Agora é só conectar.');
    },
    onError: (error: any) => {
      toast.error(`Falha ao criar robô: ${error.message}`);
    }
  });

  const handleAutoCreate = () => {
    if (!user?.id) {
        toast.error('Você precisa estar logado para criar um robô.');
        return;
    }
    const instanceName = `dra._${Math.floor(Math.random() * 1000)}`;
    createMutation.mutate({ name: instanceName, userId: user.id });
  };

  // Mutação para Gerar QR Code
  const qrMutation = useMutation({
    mutationFn: (name: string) => apiService.generateQRCode(name),
    onSuccess: (response) => {
      if (response.data?.base64) {
        setQrCode(response.data.base64);
        toast.success("QR Code gerado com sucesso!");
      }
    },
    onError: (err: any) => {
      console.error('Erro QR:', err);
      toast.error("Erro ao gerar QR Code. Verifique se a instância está aberta.");
    },
  });

  // Mutação para Desconectar
  const disconnectMutation = useMutation({
    mutationFn: (name: string) => apiService.disconnectInstance(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-instances'] });
      setQrCode(null);
      toast.success("Instância desconectada");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Sincronizando com Evolution API...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center p-6 glass-card rounded-3xl border-red-500/20 max-w-md mx-auto">
        <WifiOff className="h-12 w-12 text-red-500 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-white mb-2">Erro de Conexão</h3>
        <p className="text-muted-foreground mb-6">
          Não conseguimos falar com a Evolution API. 
          <br/>
          <span className="text-red-400 font-mono text-xs mt-2 block">
            Dica: Verifique se sua API_KEY no .env do backend está correta.
          </span>
        </p>
        <Button onClick={() => window.location.reload()} variant="outline" className="border-border">
          <RotateCcw className="h-4 w-4 mr-2" /> Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" /> Gestão WhatsApp Real
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seu assistente jurídico automático</p>
        </div>
        
        <Button 
          onClick={handleAutoCreate} 
          disabled={createMutation.isPending}
          className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 rounded-xl"
        >
          {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          Novo Robô
        </Button>
      </motion.div>

      {instances.length === 0 && !createMutation.isPending && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl border-dashed border-primary/20">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
             <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nenhum robô ativo</h2>
          <p className="text-muted-foreground mb-6 max-w-xs text-center">Clique em "Novo Robô" para começar a atender seus clientes automaticamente.</p>
          <Button onClick={handleAutoCreate} size="lg" className="rounded-2xl px-8 shadow-xl shadow-primary/20">
             🔥 Começar Agora
          </Button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instances?.map((inst: any, i: number) => {
          const data = inst.instance || inst;
          const name = data.instanceName || data.name || 'Instância';
          const id = data.instanceId || data.id || 'N/A';
          const status = data.status || data.connectionStatus || 'close';
          const owner = data.owner || data.number;

          return (
            <motion.div key={name + i} initial="hidden" animate="visible" custom={i + 1} variants={fadeIn}>
              <div className="glass-card-hover rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground truncate max-w-[150px]">{name}</h3>
                    <p className="text-xs text-muted-foreground">ID: {id}</p>
                  </div>
                  <Badge className={cn(
                    'rounded-full',
                    status === 'open'
                      ? 'bg-accent/10 text-accent border-accent/20'
                      : 'bg-red-500/10 text-red-100 border-red-500/20'
                  )}>
                    {status === 'open' ? (
                      <><Wifi className="h-3 w-3 mr-1" /> Conectado</>
                    ) : (
                      <><WifiOff className="h-3 w-3 mr-1" /> Desconectado</>
                    )}
                  </Badge>
                </div>

                {owner && (
                  <p className="text-sm text-foreground mb-3">📱 {owner.replace('@s.whatsapp.net', '')}</p>
                )}

                {qrMutation.isPending && (
                  <div className="flex flex-col items-center justify-center py-8 bg-secondary/30 rounded-xl mb-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">Buscando QR Code Real...</p>
                  </div>
                )}

                {qrCode && status !== 'open' && (
                  <div className="flex flex-col items-center py-6 bg-secondary/30 rounded-xl mb-4">
                    <div className="bg-white p-2 rounded-lg mb-3">
                      <img src={qrCode} alt="WhatsApp QR Code" className="h-44 w-44" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 text-center px-4">Escaneie para conectar.</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {status !== 'open' && (
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-1"
                      onClick={() => qrMutation.mutate(name)}
                      disabled={qrMutation.isPending}
                    >
                      <QrCode className="h-3.5 w-3.5" /> {qrCode ? 'Novo QR Code' : 'Conectar WhatsApp'}
                    </Button>
                  )}
                  {status === 'open' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-xl gap-1 border-border text-red-100 hover:text-red-500" 
                        onClick={() => disconnectMutation.mutate(name)}
                        disabled={disconnectMutation.isPending}
                      >
                        <LogOut className="h-3.5 w-3.5" /> Logout
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl gap-1 border-border" onClick={() => apiService.restartInstance(name)}>
                        <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3">Sincronizado com Evolution API v2.3.7</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
