import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Brain, MessageSquare, FileText, Upload, CheckCircle2, XCircle,
  Clock, ExternalLink, Flame, Thermometer, Snowflake, Shield, AlertTriangle, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { mockLeads, mockConversation, mockLeadDocuments, mockAIAnalysis } from '@/data/mockData';
import { LeadScoreBadge } from '@/components/dashboard/LeadScoreBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = mockLeads.find((l) => l.id === id) || mockLeads[0];
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      toast.success('Análise da IA concluída!');
    }, 3000);
  };

  const handleApproveDoc = (docId: string) => {
    toast.success('Documento aprovado com sucesso!');
  };

  const whatsappLink = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Olá ${lead.name}, sou advogado(a) e a nossa IA identificou seu caso sobre "${lead.subject}". Gostaria de conversar sobre como posso ajudá-lo(a).`
  )}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
            <p className="text-sm text-muted-foreground">{lead.phone} · {lead.area}</p>
          </div>
          <LeadScoreBadge score={lead.score} />
        </div>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button className="bg-[hsl(var(--emerald))] hover:bg-[hsl(var(--emerald))]/90 text-white rounded-xl gap-2 glow-emerald">
            <ExternalLink className="h-4 w-4" />
            Assumir no WhatsApp
          </Button>
        </a>
      </motion.div>

      {/* AI Summary Card */}
      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}>
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Resumo da IA</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Área Jurídica</p>
              <p className="font-semibold text-foreground">{lead.area}</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Urgência</p>
              <LeadScoreBadge score={lead.score} />
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Possui Advogado</p>
              <Badge variant={lead.hasLawyer ? 'destructive' : 'default'} className="rounded-full">
                {lead.hasLawyer ? 'Sim' : 'Não'}
              </Badge>
            </div>
          </div>
          {analyzed && (
            <p className="text-sm text-muted-foreground">{mockAIAnalysis.resumo}</p>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn}>
        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList className="bg-secondary/50 rounded-xl">
            <TabsTrigger value="chat" className="rounded-lg gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Chat SDR</TabsTrigger>
            <TabsTrigger value="docs" className="rounded-lg gap-1.5"><FileText className="h-3.5 w-3.5" />Documentos</TabsTrigger>
            <TabsTrigger value="analysis" className="rounded-lg gap-1.5"><Brain className="h-3.5 w-3.5" />Análise IA</TabsTrigger>
          </TabsList>

          {/* Chat History */}
          <TabsContent value="chat">
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-foreground text-sm">Conversa do SDR com o Cliente</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {mockConversation.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'assistant'
                        ? 'bg-secondary text-foreground rounded-bl-md'
                        : 'bg-primary/20 text-foreground rounded-br-md'
                    }`}>
                      {msg.role === 'assistant' && (
                        <span className="text-xs text-primary font-medium block mb-1">🤖 SDR IA</span>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="docs">
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">Documentos do Lead</h3>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 border-dashed border-border">
                  <Upload className="h-3.5 w-3.5" />
                  Upload
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mockLeadDocuments.map((doc) => (
                  <div key={doc.id} className="glass-card-hover rounded-xl p-4 space-y-2 cursor-pointer">
                    <div className="h-24 rounded-lg bg-secondary/50 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'outline'}
                        className="rounded-full text-[10px]"
                      >
                        {doc.status === 'approved' ? 'Aprovado' : doc.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </Badge>
                      {doc.status === 'pending' && (
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] text-[hsl(var(--emerald))]" onClick={() => handleApproveDoc(doc.id)}>
                          <CheckCircle2 className="h-3 w-3 mr-1" />Aprovar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Analysis */}
          <TabsContent value="analysis">
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">Análise de Documentos por IA</h3>
                <Button size="sm" className="rounded-xl gap-1.5" onClick={handleAnalyze} disabled={analyzing}>
                  <Brain className="h-3.5 w-3.5" />
                  {analyzing ? 'Analisando...' : 'Reanalisar'}
                </Button>
              </div>

              {/* Drop zone */}
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Arraste documentos aqui ou clique para enviar</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG até 10MB</p>
              </div>

              {analyzing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Processando IA...
                  </div>
                  <Skeleton className="h-20 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                </div>
              ) : analyzed ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{mockAIAnalysis.resumo}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-[hsl(var(--emerald))]">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-sm font-medium">Pontos Fortes</span>
                      </div>
                      <ul className="space-y-1.5">
                        {mockAIAnalysis.pontosFortes.map((p, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-[hsl(var(--emerald))] mt-0.5 shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-card rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-destructive">
                        <ThumbsDown className="h-4 w-4" />
                        <span className="text-sm font-medium">Pontos Fracos</span>
                      </div>
                      <ul className="space-y-1.5">
                        {mockAIAnalysis.pontosFracos.map((p, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <AlertTriangle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Valor Estimado da Causa</p>
                    <p className="text-lg font-bold text-[hsl(var(--emerald))]">
                      R$ {mockAIAnalysis.valorEstimado.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
