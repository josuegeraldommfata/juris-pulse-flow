import { useState } from 'react';
import { motion } from 'framer-motion';
import { Columns3, GripVertical, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { kanbanColumns, type KanbanStage } from '@/data/mockData';
import { LeadScoreBadge } from '@/components/dashboard/LeadScoreBadge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function KanbanPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [draggedLead, setDraggedLead] = useState<any | null>(null);
  const [dragOverCol, setDragOverCol] = useState<KanbanStage | null>(null);

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

  // Mutação para Atualizar o Estágio no Banco
  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: number; stage: string }) => 
      apiService.updateLeadStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success("Lead movido com sucesso!");
    },
    onError: () => toast.error("Erro ao salvar mudança de estágio"),
  });

  const handleDragStart = (lead: any) => setDraggedLead(lead);
  const handleDragEnd = () => { setDraggedLead(null); setDragOverCol(null); };

  const handleDrop = (stage: KanbanStage) => {
    if (!draggedLead) return;
    updateStageMutation.mutate({ id: draggedLead.id, stage });
    setDraggedLead(null);
    setDragOverCol(null);
  };

  const columnColors: Record<KanbanStage, string> = {
    triagem: 'border-t-primary',
    documentacao: 'border-t-amber-500',
    aguardando: 'border-t-purple-500',
    contrato: 'border-t-[hsl(var(--emerald))]',
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Columns3 className="h-6 w-6 text-primary" />
          Kanban — Jornada do Cliente
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie leads reais capturados pelo robô</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colLeads = leads.filter((l: any) => (l.kanban_stage || l.kanbanStage) === col.id);
            const isOver = dragOverCol === col.id;
            return (
              <div
                key={col.id}
                className={`glass-card rounded-2xl p-4 min-h-[400px] border-t-2 ${columnColors[col.id]} transition-all ${
                  isOver ? 'ring-2 ring-primary/40 bg-primary/5' : ''
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.id); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(col.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{col.title}</h3>
                  <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                    {colLeads.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colLeads.map((lead: any) => {
                    const mappedScore = lead.score_val > 80 ? 'hot' : lead.score_val > 40 ? 'warm' : 'cold';
                    return (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead)}
                        onDragEnd={handleDragEnd}
                        className="glass-card-hover rounded-xl p-3 cursor-grab active:cursor-grabbing space-y-2 select-none"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm font-medium text-foreground truncate">{lead.name || 'Cliente s/nome'}</span>
                          </div>
                          <LeadScoreBadge score={mappedScore} />
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{lead.subject || 'Nenhuma descrição'}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(lead.created_at || lead.date).toLocaleDateString('pt-BR')}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[10px] text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                          >
                            <Eye className="h-3 w-3 mr-0.5" /> Ver
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {colLeads.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-xl text-[10px] text-muted-foreground">
                      Sem leads nesta fase
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
