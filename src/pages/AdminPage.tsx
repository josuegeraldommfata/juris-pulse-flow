import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Zap, Wifi, Plus, Loader2 } from 'lucide-react';
import { mockUsers, mockInstances } from '@/data/mockData';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers);
  const [injectModal, setInjectModal] = useState<{ userId: string; userName: string } | null>(null);
  const [injectAmount, setInjectAmount] = useState('');
  const [injecting, setInjecting] = useState(false);

  const handleInject = () => {
    if (!injectModal || !injectAmount) return;
    setInjecting(true);
    setTimeout(() => {
      const amount = parseInt(injectAmount);
      setUsers(prev => prev.map(u =>
        u.id === injectModal.userId
          ? { ...u, tokensAvailable: u.tokensAvailable + amount }
          : u
      ));
      setInjecting(false);
      setInjectModal(null);
      setInjectAmount('');
    }, 1000);
  };

  const totalTokens = users.reduce((acc, u) => acc + u.tokensConsumed, 0);
  const totalRevenue = (totalTokens * 0.25).toFixed(2);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Painel Administrativo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gestão global de usuários, tokens e instâncias</p>
      </motion.div>

      {/* Global metrics */}
      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard title="Usuários Ativos" value={users.filter(u => u.status === 'active').length.toString()} icon={Users} variant="electric" />
        <StatsCard title="Faturamento Total" value={`R$ ${totalRevenue}`} icon={DollarSign} variant="emerald" />
        <StatsCard title="Tokens Consumidos" value={totalTokens.toLocaleString()} icon={Zap} />
        <StatsCard title="Instâncias Ativas" value={mockInstances.filter(i => i.status === 'connected').length.toString()} icon={Wifi} variant="electric" />
      </motion.div>

      {/* Users table */}
      <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn}>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Gestão de Usuários</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left pb-3 font-medium">Usuário</th>
                  <th className="text-left pb-3 font-medium">Escritório</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-right pb-3 font-medium">Disponível</th>
                  <th className="text-right pb-3 font-medium">Consumido</th>
                  <th className="text-right pb-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3">
                      <p className="font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">{u.office}</td>
                    <td className="py-3">
                      <Badge className={cn(
                        'rounded-full text-xs',
                        u.status === 'active'
                          ? 'bg-accent/10 text-accent border-accent/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      )}>
                        {u.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-accent font-bold">{u.tokensAvailable}</td>
                    <td className="py-3 text-right text-muted-foreground">{u.tokensConsumed}</td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-1"
                        onClick={() => setInjectModal({ userId: u.id, userName: u.name })}
                      >
                        <Plus className="h-3 w-3" /> Adicionar Saldo
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Instance health */}
      <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Saúde das Instâncias (Evolution API)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockInstances.map((inst) => (
              <div key={inst.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">{inst.displayName}</p>
                  <p className="text-xs text-muted-foreground">{inst.name}</p>
                </div>
                <Badge className={cn(
                  'rounded-full',
                  inst.status === 'connected'
                    ? 'bg-accent/10 text-accent border-accent/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                )}>
                  {inst.status === 'connected' ? 'Online' : 'Offline'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Inject tokens modal */}
      <Dialog open={!!injectModal} onOpenChange={() => { setInjectModal(null); setInjectAmount(''); }}>
        <DialogContent className="sm:max-w-sm glass-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Injetar Tokens</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Adicionar saldo para <strong className="text-foreground">{injectModal?.userName}</strong></p>
          <Input
            type="number"
            placeholder="Quantidade de tokens"
            value={injectAmount}
            onChange={(e) => setInjectAmount(e.target.value)}
            className="bg-secondary border-border rounded-xl"
          />
          <Button
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
            onClick={handleInject}
            disabled={!injectAmount || injecting}
          >
            {injecting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Processando...
              </span>
            ) : (
              'Confirmar Injeção'
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
