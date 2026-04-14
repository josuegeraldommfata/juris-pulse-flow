import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Eye, Columns3, Download, Search, X, ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { LeadScoreBadge } from '@/components/dashboard/LeadScoreBadge';
import { LeadConfidenceBar } from '@/components/dashboard/LeadConfidenceBar';
import { ConversationModal } from '@/components/dashboard/ConversationModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function LeadsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversationOpen, setConversationOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState('');

  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Busca Leads Reais do Banco
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await apiService.getLeads(user.id);
      return response.data;
    },
    enabled: !!user?.id,
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead: any) => {
      if (scoreFilter !== 'all' && lead.score !== scoreFilter) return false;
      if (statusFilter !== 'all' && (lead.kanban_stage || lead.kanbanStage) !== statusFilter) return false;
      if (dateFrom && new Date(lead.created_at || lead.date) < new Date(dateFrom)) return false;
      const dateEnd = dateTo ? new Date(dateTo + 'T23:59:59') : null;
      if (dateEnd && new Date(lead.created_at || lead.date) > dateEnd) return false;
      return true;
    });
  }, [leads, scoreFilter, statusFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setScoreFilter('all');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = scoreFilter !== 'all' || statusFilter !== 'all' || dateFrom || dateTo;

  const exportDossie = () => {
    const header = 'Nome,Telefone,Assunto,Score,Status,Área Jurídica,Data\n';
    const rows = filteredLeads.map((l: any) =>
      `"${l.name}","${l.phone}","${l.subject}","${l.score}","${l.kanban_stage}","${l.area}","${new Date(l.created_at || l.date).toLocaleDateString('pt-BR')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-juridicos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Dossiê exportado com sucesso!');
  };

  const handleAssumir = (lead: any) => {
    const msg = `Olá ${lead.name}, sou ${user?.name}, a minha assistente me passou seu caso sobre "${lead.subject}". Gostaria de conversar.`;
    const url = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Filter className="h-6 w-6 text-primary" />
          Triagem de Leads
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Leads reais capturados e processados pela sua IA</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => navigate('/dashboard/kanban')}>
            <Columns3 className="h-3.5 w-3.5" /> Ver Kanban
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => setShowFilters(!showFilters)}>
            <Search className="h-3.5 w-3.5" /> {showFilters ? 'Ocultar Filtros' : 'Filtros Avançados'}
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 border-accent/30 text-accent hover:bg-accent/10" onClick={exportDossie}>
            <Download className="h-3.5 w-3.5" /> Exportar Dossiê
          </Button>
        </div>
      </motion.div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card rounded-2xl p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Score</label>
              <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} className="bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="all">Todos</option>
                <option value="hot">🔥 Hot</option>
                <option value="warm">🟡 Warm</option>
                <option value="cold">🔵 Cold</option>
              </select>
            </div>
            {/* Outros filtros... */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="rounded-xl gap-1 text-muted-foreground" onClick={clearFilters}>
                <X className="h-3.5 w-3.5" /> Limpar
              </Button>
            )}
          </div>
        </motion.div>
      )}

      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn} className="glass-card rounded-2xl p-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-xs border-b border-border">
                <th className="text-left pb-3 font-medium">Lead</th>
                <th className="text-left pb-3 font-medium">Assunto</th>
                <th className="text-left pb-3 font-medium">Score</th>
                <th className="text-left pb-3 font-medium">Status / Fase</th>
                <th className="text-left pb-3 font-medium">Data</th>
                <th className="text-right pb-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead: any) => {
                const mappedScore = lead.score_val > 80 ? 'hot' : lead.score_val > 40 ? 'warm' : 'cold';
                return (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3">
                      <p className="font-medium text-foreground">{lead.name || 'S/ nome'}</p>
                      <p className="text-xs text-muted-foreground">{lead.phone}</p>
                    </td>
                    <td className="py-3 text-muted-foreground truncate max-w-[200px]">{lead.subject}</td>
                    <td className="py-3">
                      <LeadScoreBadge score={mappedScore} />
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="rounded-full text-[10px] uppercase border-border">
                        {lead.kanban_stage || 'Triagem'}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">
                      {new Date(lead.created_at || lead.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="text-primary rounded-xl" onClick={() => navigate(`/dashboard/leads/${lead.id}`)}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> Ver
                        </Button>
                        <Button size="sm" className="bg-accent text-accent-foreground rounded-xl" onClick={() => handleAssumir(lead)}>
                           <ExternalLink className="h-3.5 w-3.5 mr-1" /> Assumir
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <ConversationModal open={conversationOpen} onClose={() => setConversationOpen(false)} leadName={selectedLead} />
    </div>
  );
}
