import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Eye, Columns3, Download, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockLeads } from '@/data/mockData';
import { LeadScoreBadge } from '@/components/dashboard/LeadScoreBadge';
import { ConversationModal } from '@/components/dashboard/ConversationModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function LeadsPage() {
  const navigate = useNavigate();
  const [conversationOpen, setConversationOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState('');

  // Filters
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredLeads = useMemo(() => {
    return mockLeads.filter((lead) => {
      if (scoreFilter !== 'all' && lead.score !== scoreFilter) return false;
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (dateFrom && new Date(lead.date) < new Date(dateFrom)) return false;
      if (dateTo && new Date(lead.date) > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [scoreFilter, statusFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setScoreFilter('all');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = scoreFilter !== 'all' || statusFilter !== 'all' || dateFrom || dateTo;

  const exportDossie = () => {
    const header = 'Nome,Telefone,Assunto,Score,Status,Área Jurídica,Tem Advogado,Data\n';
    const rows = filteredLeads.map((l) =>
      `"${l.name}","${l.phone}","${l.subject}","${l.score}","${l.status}","${l.area}","${l.hasLawyer ? 'Sim' : 'Não'}","${new Date(l.date).toLocaleDateString('pt-BR')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dossie-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Dossiê exportado com sucesso!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Filter className="h-6 w-6 text-primary" />
          Triagem de Leads
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Leads processados pela IA com score de urgência</p>
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

      {/* Advanced Filters */}
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
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="all">Todos</option>
                <option value="triado">Triado</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Data início</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Data fim</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="rounded-xl gap-1 text-muted-foreground" onClick={clearFilters}>
                <X className="h-3.5 w-3.5" /> Limpar
              </Button>
            )}
          </div>
          {hasActiveFilters && (
            <p className="text-xs text-muted-foreground mt-2">{filteredLeads.length} lead(s) encontrado(s)</p>
          )}
        </motion.div>
      )}

      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}>
        <div className="glass-card rounded-2xl p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left pb-3 font-medium">Lead</th>
                  <th className="text-left pb-3 font-medium">Telefone</th>
                  <th className="text-left pb-3 font-medium">Assunto</th>
                  <th className="text-left pb-3 font-medium">Score</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Data</th>
                  <th className="text-right pb-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 font-medium text-foreground">{lead.name}</td>
                    <td className="py-3 text-muted-foreground">{lead.phone}</td>
                    <td className="py-3 text-muted-foreground">{lead.subject}</td>
                    <td className="py-3"><LeadScoreBadge score={lead.score} /></td>
                    <td className="py-3">
                      <Badge variant="outline" className="rounded-full text-xs border-border">
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{new Date(lead.date).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 rounded-xl gap-1" onClick={() => navigate(`/dashboard/leads/${lead.id}`)}>
                        <Eye className="h-3.5 w-3.5" /> Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">Nenhum lead encontrado com os filtros aplicados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <ConversationModal open={conversationOpen} onClose={() => setConversationOpen(false)} leadName={selectedLead} />
    </div>
  );
}
