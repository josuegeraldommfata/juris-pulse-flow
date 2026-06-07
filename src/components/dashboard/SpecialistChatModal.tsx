import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, Shield, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { LegalMarkdownContent } from '@/lib/legalMarkdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AI_AVATAR_BY_KEY } from './aiAvatarMap';

export type SpecialistId =
  | 'trabalhista'
  | 'civil'
  | 'familia'
  | 'penal'
  | 'empresarial'
  | 'previdenciario'
  | 'consumidor'
  | 'tributario'
  | 'imobiliario'
  | 'administrativo';

const SPECIALISTS: Record<SpecialistId, { title: string; area: string; tone: string }> = {
  trabalhista: {
    title: 'Dr. Trabalhista AI',
    area: 'Direito do Trabalho',
    tone: 'atuar como advogado especialista em Direito do Trabalho, focado em CLT, rescisão, verbas rescisórias, horas extras, adicional de insalubridade/periculosidade e pedidos correlatos.',
  },
  civil: {
    title: 'Dra. Civil AI',
    area: 'Direito Civil',
    tone: 'atuar como advogado especialista em Direito Civil, focado em contratos, responsabilidade civil, obrigações, indenizações, danos materiais/morais e tutela de direitos.',
  },
  familia: {
    title: 'Dra. Família AI',
    area: 'Direito de Família',
    tone: 'atuar como advogado especialista em Direito de Família, focado em divórcio, guarda, alimentos, regulamentação de visitas, partilha de bens e medidas protetivas.',
  },
  penal: {
    title: 'Dr. Penal AI',
    area: 'Direito Penal',
    tone: 'atuar como advogado especialista em Direito Penal, focado em tipicidade, atipicidade, dosimetria da pena, medidas cautelares e defesa técnica.',
  },
  empresarial: {
    title: 'Dr. Empresarial AI',
    area: 'Direito Empresarial',
    tone: 'atuar como advogado especialista em Direito Empresarial, focado em contratos empresariais, societário, acordos, due diligence e prevenção de riscos jurídicos.',
  },

  previdenciario: {
    title: 'Dr. Previdência AI',
    area: 'Direito Previdenciário',
    tone: 'atuar como advogado especialista em Direito Previdenciário, com foco em INSS, aposentadorias, auxílios, BPC/LOAS, revisão de benefícios, carência e perícia.',
  },

  consumidor: {
    title: 'Dra. Consumidor AI',
    area: 'Direito do Consumidor',
    tone: 'atuar como advogado especialista em Direito do Consumidor (CDC), com foco em negativação indevida, vícios e defeitos, práticas abusivas, cobranças, bancos e planos de saúde.',
  },

  tributario: {
    title: 'Dra. Tributário AI',
    area: 'Direito Tributário',
    tone: 'atuar como advogado especialista em Direito Tributário, com foco em execuções fiscais, embargos, parcelamentos, planejamento tributário, compensação e defesas administrativas.',
  },

  imobiliario: {
    title: 'Dr. Imobiliário AI',
    area: 'Direito Imobiliário',
    tone: 'atuar como advogado especialista em Direito Imobiliário e Registral, com foco em locação, despejo, usucapião, compra e venda, regularização e IPTU.',
  },

  administrativo: {
    title: 'Dra. Administrativo AI',
    area: 'Direito Administrativo',
    tone: 'atuar como advogado especialista em Direito Administrativo, com foco em licitações, concurso público, servidor público, contratos administrativos, improbidade e controle dos atos administrativos.',
  },
};

type Msg = { role: 'user' | 'assistant'; content: string };

function buildPersonaPrompt(specialistId: SpecialistId, userMessage: string) {
  const spec = SPECIALISTS[specialistId];
  return [
    'Você é um assistente jurídico. Importante: responda em português (Brasil).',
    'Atue como advogado(a) e forneça orientações práticas, com linguagem clara e direta.',
    'Inclua: (1) análise inicial do caso; (2) pontos de atenção/risco; (3) próximos passos recomendados; (4) sugestões de documentos/provas.',
    `Especialista selecionado: ${spec.title} - ${spec.area}.`,
    `Estilo/escopo: ${spec.tone}`,
    'Restrições: não invente leis/decisões específicas; se não souber, diga que precisa de mais informações.',
    'Formatação: NÃO use tabelas markdown (linhas com |). Prefira listas numeradas ou com bullets. Use **negrito** para títulos de seção (ex.: **Análise inicial**, **Próximos passos**). Separe seções com linha em branco.',
    '',
    `Mensagem do usuário: ${userMessage}`,
  ].join('\n');
}

async function callSpecialistAI(specialistId: SpecialistId, userMessage: string): Promise<string> {
  const prompt = buildPersonaPrompt(specialistId, userMessage);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch('http://localhost:3001/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt, timeoutMs: 30000 } ),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data?.response || data?.message || JSON.stringify(data);
  } catch {
    const spec = SPECIALISTS[specialistId];
    return `(${spec.title})\n\nEntendi sua dúvida. Para eu orientar com precisão, preciso de mais detalhes: \n- O que aconteceu (resumo objetivo)?\n- Datas relevantes (início, término, notificações)?\n- Existe algum documento ou decisão em mãos?\n\nCom essas informações, eu preparo um roteiro de próximos passos e uma lista do que reunir.`;
  }
}

export function SpecialistChatModal({
  open,
  onClose,
  specialistId,
}: {
  open: boolean;
  onClose: () => void;
  specialistId: SpecialistId;
}) {
  const spec = SPECIALISTS[specialistId];
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    setMessages([
      {
        role: 'assistant',
        content: `Olá! Eu sou ${spec.title}, especialista em ${spec.area}. Conte sua situação e eu vou te orientar com próximos passos e pontos de atenção.`,
      },
    ]);
    setInput('');
  }, [open, specialistId]);

  useEffect(() => {
    // garante que a conversa role para o fim sem cortar mensagens
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isSending]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const send = async () => {
    if (!canSend) return;
    const userText = input.trim();

    setInput('');
    setIsSending(true);
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);

    try {
      const reply = await callSpecialistAI(specialistId, userText);

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

      // garante scroll depois que a mensagem chega
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente em instantes.' },
      ]);

      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex flex-col sm:max-w-2xl glass-card border-border h-[85vh] max-h-[85vh] overflow-hidden p-0 gap-0 [&>button:last-child]:hidden">
        <DialogHeader className="flex-shrink-0 p-4 border-b border-border/40">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                {spec.title} — {spec.area}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Tire dúvidas e peça orientação jurídica especializada.
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0">
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-background/20">
            {messages.map((m, idx) => (
              <div key={idx} className={cn('flex gap-3', m.role === 'assistant' ? '' : 'flex-row-reverse')}>
                <div
                  className={cn(
                    'h-8 w-8 flex items-center justify-center flex-shrink-0 ring-1',
                    m.role === 'assistant'
                      ? 'ring-primary/20'
                      : 'bg-accent/20 text-accent-foreground ring-accent/20 rounded-full'
                  )}
                >
                  {m.role === 'assistant' ? (
                    <Avatar className="h-8 w-8 ring-1 ring-primary/20">
                      <AvatarImage src={AI_AVATAR_BY_KEY[specialistId]} alt={spec.title} className="object-cover" />
                      <AvatarFallback>{spec.title.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <span className="text-xs font-bold">Você</span>
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[85%] p-3 rounded-2xl text-sm',
                    m.role === 'assistant' ? 'bg-secondary text-foreground rounded-tl-none' : 'bg-primary/10 text-foreground rounded-tr-none whitespace-pre-wrap'
                  )}
                >
                  {m.role === 'assistant' ? <LegalMarkdownContent content={m.content} /> : m.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 rounded-2xl bg-secondary text-foreground text-sm">Aguardando resposta...</div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 p-4 border-t border-border/40 bg-background">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua dúvida (ex.: estou sendo dispensado sem justa causa, quais verbas posso pedir?)"
                  rows={3}
                  className="bg-muted/40 border-border rounded-2xl resize-none"
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      void send();
                    }
                  }}
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">Dica: enviar com Ctrl+Enter (ou clique no botão).</p>
                  <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5">
                    Especialista: {spec.title}
                  </Badge>
                </div>
              </div>

              <Button
                onClick={() => void send()}
                disabled={!canSend}
                className="h-11 w-11 rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
