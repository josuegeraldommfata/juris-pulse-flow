import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, QrCode, Wifi, WifiOff, RotateCcw, LogOut, Loader2, Plus, Bot, X, Sparkles, Trash2 } from 'lucide-react';
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
  const [qrInstanceName, setQrInstanceName] = useState<string | null>(null);
  const [qrCountdown, setQrCountdown] = useState<number>(0);
  const qrTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Modal de criação
  const [showModal, setShowModal] = useState(false);
  const [botDisplayName, setBotDisplayName] = useState('');
  const [botInstanceName, setBotInstanceName] = useState('');

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

  // ─── QR CODE AUTO-REFRESH ─────────────────────────────────────
  // O QR do WhatsApp expira em ~60s. Renovamos a cada 30s automaticamente.
  const stopQrRefresh = () => {
    if (qrTimerRef.current) {
      clearInterval(qrTimerRef.current);
      qrTimerRef.current = null;
    }
    setQrCountdown(0);
  };

  const startQrRefresh = (instanceName: string) => {
    stopQrRefresh();
    setQrInstanceName(instanceName);
    setQrCountdown(30);
    qrTimerRef.current = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          // Renova QR automaticamente antes de expirar
          apiService.generateQRCode(instanceName).then((response) => {
            const data = response.data;
            const codePayload = data?.base64 || data?.qrcode?.base64 || data?.code || data?.qr;
            if (codePayload) {
              setQrCode(codePayload);
            }
          }).catch(() => {/* silencia refresh automático */});
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => stopQrRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ──────────────────────────────────────────────────────────────

  // Mutação para Criar Instância (Escalabilidade SaaS)
  const createMutation = useMutation({
    mutationFn: (data: { name: string; userId: number; botName: string }) =>
      apiService.createInstance(data.name, data.userId, data.botName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-instances'] });
      toast.success(`🤖 "${botDisplayName}" inicializado! Agora é só conectar.`);
      setShowModal(false);
      setBotDisplayName('');
      setBotInstanceName('');
    },
    onError: (error: any) => {
      toast.error(`Falha ao criar robô: ${error.message}`);
    },
  });

  // Gera nome técnico da instância a partir do nome do bot
  const handleBotNameChange = (value: string) => {
    setBotDisplayName(value);
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 30);
    setBotInstanceName(slug || 'robo_juridico');
  };

  const handleCreate = () => {
    if (!user?.id) {
      toast.error('Você precisa estar logado.');
      return;
    }
    if (!botDisplayName.trim()) {
      toast.error('Digite o nome do assistente.');
      return;
    }
    const uniqueName = `${botInstanceName}_${Date.now().toString().slice(-4)}`;
    createMutation.mutate({
      name: uniqueName,
      userId: user.id,
      botName: botDisplayName.trim(),
    });
  };

  // Mutação para Gerar QR Code
  const qrMutation = useMutation({
    mutationFn: (name: string) => apiService.generateQRCode(name),
    onSuccess: (response, instanceName) => {
      const data = response.data;
      const codePayload =
        data?.base64 ||
        data?.qrcode?.base64 ||
        data?.code ||
        data?.qr;

      if (codePayload) {
        setQrCode(codePayload);
        startQrRefresh(instanceName); // inicia/reinicia o auto-refresh
        toast.success('QR Code gerado! Escaneie rápido — expira em 30s.');
      } else {
        console.warn('QR Code response sem base64:', JSON.stringify(data));
        toast.error('QR Code ainda não disponível. Aguarde alguns segundos e tente novamente.');
      }
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.details?.message || err?.message || 'Erro desconhecido';
      console.error('Erro QR:', err?.response?.data || err);
      toast.error(`Erro ao gerar QR Code: ${detail}`);
    },
  });

  // Mutação para Desconectar
  const disconnectMutation = useMutation({
    mutationFn: (name: string) => apiService.disconnectInstance(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-instances'] });
      setQrCode(null);
      stopQrRefresh();
      toast.success('Instância desconectada');
    },
  });

  // Mutação para Deletar (Evolution + banco)
  const deleteMutation = useMutation({
    mutationFn: (name: string) => apiService.deleteInstance(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-instances'] });
      setQrCode(null);
      stopQrRefresh();
      toast.success('Robô deletado com sucesso');
    },
    onError: (error: any) => {
      const errData = error?.response?.data;
      const errMessage = errData?.error || errData?.message || error?.message || 'Erro desconhecido ao deletar robô';
      toast.error(`Falha ao deletar robô: ${errMessage}`);
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
          <br />
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
          onClick={() => setShowModal(true)}
          disabled={createMutation.isPending}
          className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Robô
        </Button>
      </motion.div>

      {/* ===== MODAL DE CRIAÇÃO ===== */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-md mx-4 glass-card rounded-3xl p-8 border border-primary/20 shadow-2xl shadow-primary/10"
            >
              {/* Fechar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Ícone */}
              <div className="flex flex-col items-center mb-6">
                <div className="p-4 bg-primary/10 rounded-2xl mb-3">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Criar Novo Robô</h2>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  O nome que você definir será como a IA se apresentará aos clientes
                </p>
              </div>

              {/* Campo: Nome do Assistente */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Sparkles className="h-3.5 w-3.5 inline mr-1 text-primary" />
                  Nome do Assistente (como a IA se apresenta)
                </label>
                <input
                  type="text"
                  value={botDisplayName}
                  onChange={(e) => handleBotNameChange(e.target.value)}
                  placeholder='Ex: Dra. Ana Silva, Dr. Carlos, Jurídico Fácil...'
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este nome será enviado ao n8n e usado pela IA nas respostas
                </p>
              </div>

              {/* Preview do nome técnico */}
              {botInstanceName && (
                <div className="mb-6 p-3 bg-secondary/30 rounded-xl border border-border/50">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono text-primary">ID interno:</span>{' '}
                    <span className="font-mono text-xs">{botInstanceName}_XXXX</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="font-mono text-primary">n8n recebe:</span>{' '}
                    <span className="font-mono text-xs">botName={botDisplayName}</span>
                  </p>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-border"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 rounded-xl shadow-lg shadow-primary/20"
                  onClick={handleCreate}
                  disabled={createMutation.isPending || !botDisplayName.trim()}
                >
                  {createMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Criando...</>
                  ) : (
                    <><Bot className="h-4 w-4 mr-2" /> Criar Robô</>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {(instances ?? []).length === 0 && !createMutation.isPending && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl border-dashed border-primary/20">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nenhum robô ativo</h2>
          <p className="text-muted-foreground mb-6 max-w-xs text-center">Clique em "Novo Robô" e dê um nome ao seu assistente jurídico.</p>
          <Button onClick={() => setShowModal(true)} size="lg" className="rounded-2xl px-8 shadow-xl shadow-primary/20">
            🔥 Começar Agora
          </Button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(instances ?? []).map((inst: any, i: number) => {
          const data = inst.instance || inst;
          const name = data.instanceName || data.name || 'Instância';
          const status = data.status || data.connectionStatus || 'close';
          const owner = data.owner || data.number;
          // Tenta extrair o nome amigável do nome técnico (remove sufixo _XXXX)
          const friendlyName = name.replace(/_\d{4}$/, '').replace(/_/g, ' ');

          return (
            <motion.div key={name + i} initial="hidden" animate="visible" custom={i + 1} variants={fadeIn}>
              <div className="glass-card-hover rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground truncate max-w-[180px] capitalize">{friendlyName}</h3>
                    <p className="text-xs text-muted-foreground">🤖 Robô Jurídico</p>
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

                {qrMutation.isPending && qrInstanceName === name && (
                  <div className="flex flex-col items-center justify-center py-8 bg-secondary/30 rounded-xl mb-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                  </div>
                )}

                {qrCode && qrInstanceName === name && status !== 'open' && (
                  <div className="flex flex-col items-center py-4 bg-secondary/30 rounded-xl mb-4">
                    <div className="bg-white p-2 rounded-lg mb-3 shadow-lg">
                      {qrCode.startsWith('data:image') || (qrCode.length > 500 && !qrCode.includes('@')) ? (
                        <img src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`} alt="WhatsApp QR Code" className="h-64 w-64" />
                      ) : (
                        <QRCodeSVG value={qrCode} size={256} level="Q" includeMargin={true} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn(
                        'h-2 w-2 rounded-full',
                        qrCountdown > 10 ? 'bg-green-400 animate-pulse' : 'bg-red-400 animate-ping'
                      )} />
                      <p className={cn(
                        'text-xs font-mono font-semibold',
                        qrCountdown > 10 ? 'text-green-400' : 'text-red-400'
                      )}>
                        {qrCountdown > 0 ? `Renova em ${qrCountdown}s` : 'Renovando...'}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground text-center px-4">
                      Abra o WhatsApp → ⋮ → Dispositivos vinculados → Vincular dispositivo
                    </p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {status !== 'open' && (
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-1"
                      onClick={() => qrMutation.mutate(name)}
                      disabled={qrMutation.isPending && qrInstanceName === name}
                    >
                      <QrCode className="h-3.5 w-3.5" /> {qrCode && qrInstanceName === name ? 'Novo QR Code' : 'Conectar WhatsApp'}
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

                  {/* Deletar robô (Evolution + banco) */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl gap-1 border-border text-red-100 hover:text-red-500"
                    onClick={() => {
                      const ok = window.confirm(`Deletar o robô "${friendlyName}"? Isso vai remover a instância no Evolution e no banco.`);
                      if (!ok) return;
                      deleteMutation.mutate(name);
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Deletar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Sincronizado com Evolution API</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
