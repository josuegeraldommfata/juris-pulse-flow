import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockLeads } from '@/data/mockData';
import { motion } from 'framer-motion';

export function HotLeadAlert() {
  const urgentLeads = mockLeads.filter(l => l.score === 'hot');
  if (urgentLeads.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-4 border border-destructive/30 bg-destructive/5 overflow-hidden"
    >
      {/* Pulse effect */}
      <div className="absolute inset-0 rounded-2xl animate-pulse bg-destructive/5 pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-destructive">
              ⚠️ {urgentLeads.length} Leads Urgentes aguardando sua ação!
            </p>
            <div className="mt-2 space-y-1">
              {urgentLeads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="flex items-center gap-2">
                  <span className="text-xs text-foreground font-medium">{lead.name}</span>
                  <span className="text-xs text-muted-foreground">— {lead.subject}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-primary hover:text-primary"
                    onClick={() => {
                      const url = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${lead.name}, sou do escritório. Como posso ajudar com "${lead.subject}"?`)}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" /> WhatsApp
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
