import { useState } from 'react';
import { motion } from 'framer-motion';
import { Columns3, GripVertical, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockLeads, kanbanColumns, type KanbanStage } from '@/data/mockData';
import { LeadScoreBadge } from '@/components/dashboard/LeadScoreBadge';
import { Button } from '@/components/ui/button';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

interface Lead {
  id: string; name: string; phone: string; subject: string;
  score: 'hot' | 'warm' | 'cold'; status: string; date: string;
  tokenCost: number; area: string; hasLawyer: boolean; kanbanStage: KanbanStage;
}

export default function KanbanPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(mockLeads as Lead[]);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverCol, setDragOverCol] = useState<KanbanStage | null>(null);

  const handleDragStart = (lead: Lead) => setDraggedLead(lead);
  const handleDragEnd = () => { setDraggedLead(null); setDragOverCol(null); };

  const handleDrop = (stage: KanbanStage) => {
    if (!draggedLead) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === draggedLead.id ? { ...l, kanbanStage: stage } : l))
    );
    setDraggedLead(null);
    setDragOverCol(null);
  };

  const columnColors: Record<KanbanStage, string> = {
    triagem: 'border-t-primary',
    documentacao: 'border-t-amber-500',
    aguardando: 'border-t-purple-500',
    contrato: 'border-t-[hsl(var(--emerald))]',
  };

  return (
    <div className="space-y-6 max-w-full mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Columns3 className="h-6 w-6 text-primary" />
          Kanban — Jornada do Cliente
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Arraste os cards para atualizar o estágio</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colLeads = leads.filter((l) => l.kanbanStage === col.id);
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
                  <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                  <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                    {colLeads.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead)}
                      onDragEnd={handleDragEnd}
                      className="glass-card-hover rounded-xl p-3 cursor-grab active:cursor-grabbing space-y-2 select-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{lead.name}</span>
                        </div>
                        <LeadScoreBadge score={lead.score} />
                      </div>
                      <p className="text-xs text-muted-foreground">{lead.subject}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(lead.date).toLocaleDateString('pt-BR')}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-primary"
                          onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-0.5" /> Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                  {colLeads.length === 0 && (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      Arraste leads aqui
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
