import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Flame, ExternalLink } from 'lucide-react';
import { mockLeads } from '@/data/mockData';

const hotLeadNames = mockLeads.filter((l) => l.score === 'hot');

export function HotLeadNotifier() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // Simulate a hot lead arriving after 5s
    const timer = setTimeout(() => {
      const lead = hotLeadNames[Math.floor(Math.random() * hotLeadNames.length)];
      if (!lead) return;

      const whatsappUrl = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Olá ${lead.name}, sou do escritório. Vi que você tem uma questão sobre "${lead.subject}". Como posso ajudar?`
      )}`;

      toast('🔥 Lead Hot Detectado!', {
        description: `${lead.name} — ${lead.subject}`,
        duration: 12000,
        action: {
          label: 'Abrir WhatsApp',
          onClick: () => window.open(whatsappUrl, '_blank'),
        },
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
