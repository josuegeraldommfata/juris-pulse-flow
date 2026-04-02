import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Eye, Columns3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockLeads } from '@/data/mockData';
import { LeadScoreBadge } from '@/components/dashboard/LeadScoreBadge';
import { ConversationModal } from '@/components/dashboard/ConversationModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function LeadsPage() {
  const [conversationOpen, setConversationOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState('');

  const openConversation = (name: string) => {
    setSelectedLead(name);
    setConversationOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Filter className="h-6 w-6 text-primary" />
          Triagem de Leads
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Leads processados pela IA com score de urgência</p>
      </motion.div>

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
                {mockLeads.map((lead) => (
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
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:bg-primary/10 rounded-xl gap-1"
                        onClick={() => openConversation(lead.name)}
                      >
                        <Eye className="h-3.5 w-3.5" /> Ver Conversa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <ConversationModal
        open={conversationOpen}
        onClose={() => setConversationOpen(false)}
        leadName={selectedLead}
      />
    </div>
  );
}
