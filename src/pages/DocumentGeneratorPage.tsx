import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LegalDocumentPreview } from '@/components/documents/LegalDocumentPreview';
import { DocumentDynamicForm, validateDocumentForm } from '@/components/documents/DocumentDynamicForm';
import {
  DOCUMENT_CATALOG,
  DOCUMENT_CATEGORIES,
  getDocumentById,
  getEmptyFormForDocument,
  type DocumentCategory,
} from '@/config/documentCatalog';
import {
  Download, Wand2, Coins, AlertCircle, CheckCircle, Copy, Brain,
  Building, Home, Shield, Briefcase, Users, FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { SpecialistId } from '@/components/dashboard/SpecialistChatModal';
import { useSpecialistChat } from '@/contexts/SpecialistChatContext';

const DocumentGeneratorPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { openChat } = useSpecialistChat();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [generatedDocumentName, setGeneratedDocumentName] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'todos'>('todos');

  const selectedDoc = getDocumentById(selectedDocId);
  const filteredDocs =
    categoryFilter === 'todos'
      ? DOCUMENT_CATALOG
      : DOCUMENT_CATALOG.filter((d) => d.category === categoryFilter);

  const agents = [
    { id: 'trabalhista', name: 'Dr. Trabalhista AI', area: 'Direito do Trabalho', icon: Building },
    { id: 'civil', name: 'Dra. Civil AI', area: 'Direito Civil', icon: Users },
    { id: 'familia', name: 'Dra. Família AI', area: 'Direito de Família', icon: Home },
    { id: 'penal', name: 'Dr. Penal AI', area: 'Direito Penal', icon: Shield },
    { id: 'empresarial', name: 'Dr. Empresarial AI', area: 'Direito Empresarial', icon: Briefcase },

    // novos agentes (backend já suporta)
    { id: 'previdenciario', name: 'Dr. Previdenciário AI', area: 'Direito Previdenciário', icon: Shield },
    { id: 'consumidor', name: 'Dr. Consumidor AI', area: 'Direito do Consumidor', icon: Users },
    { id: 'tributario', name: 'Dra. Tributário AI', area: 'Direito Tributário', icon: Coins },
    { id: 'imobiliario', name: 'Dr. Imobiliário AI', area: 'Direito Imobiliário', icon: Building },
    { id: 'administrativo', name: 'Dra. Administrativo AI', area: 'Direito Administrativo', icon: FileText },
  ];

  const handleSelectDocument = (docId: string) => {
    setSelectedDocId(docId);
    const empty = getEmptyFormForDocument(docId);
    const doc = getDocumentById(docId);
    if (doc?.defaultTipoAcao) {
      empty.tipo_acao = doc.defaultTipoAcao;
    }
    setFormValues(empty);
    setGeneratedDocument(null);
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const generateDocument = async () => {
    if (!selectedDocId) return;

    const errors = validateDocumentForm(selectedDocId, formValues);
    if (errors.length) {
      toast({
        title: 'Campos obrigatórios',
        description: `Preencha: ${errors.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    const tokensCost = selectedDoc?.tokens ?? 2;
    if (!user?.tokensAvailable || user.tokensAvailable < tokensCost) {
      toast({
        title: 'Tokens insuficientes',
        description: `Você precisa de ${tokensCost} tokens.`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          tipo: selectedDocId,
          dados: { campos: formValues },
        }),
      });

      if (!response.ok) throw new Error('Erro ao gerar documento');
      const data = await response.json();

      if (data.success) {
        setGeneratedDocument(data.documento);
        setGeneratedDocumentName(data.nome || selectedDoc?.name || null);
        toast({
          title: 'Documento gerado!',
          description: `${data.nome} criado. ${data.tokensUsados} tokens utilizados.`,
        });
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha ao gerar documento.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedDocument) {
      navigator.clipboard.writeText(generatedDocument);
      toast({ title: 'Copiado!', description: 'Documento copiado.' });
    }
  };

  const downloadDocument = () => {
    if (!generatedDocument) return;
    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDocId}_${formValues.cliente_nome || 'documento'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gerador de Documentos IA</h1>
          <Badge variant="secondary" className="ml-auto">
            <Coins className="h-4 w-4 mr-1" />
            {user?.tokensAvailable || 0} tokens
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Biblioteca com {DOCUMENT_CATALOG.length} peças jurídicas parametrizadas — cível, trabalhista, família, previdenciário, consumidor, penal e mais
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Biblioteca de Peças
                <Badge variant="secondary" className="ml-auto text-xs font-normal">
                  {filteredDocs.length} modelos
                </Badge>
              </CardTitle>
              <ScrollArea className="w-full">
                <div className="flex flex-wrap gap-2 pt-2 pb-1">
                  {DOCUMENT_CATEGORIES.map((cat) => (
                    <Button
                      key={cat.id}
                      type="button"
                      variant={categoryFilter === cat.id ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full text-xs h-7 shrink-0"
                      onClick={() => setCategoryFilter(cat.id)}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[765px] pr-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredDocs.map((docType) => {
                    const Icon = docType.icon;
                    return (
                      <Card
                        key={docType.id}
                        className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                          selectedDocId === docType.id
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => handleSelectDocument(docType.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-sm leading-tight">{docType.name}</h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{docType.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-[10px] px-1.5">
                                  <Coins className="h-3 w-3 mr-0.5" />
                                  {docType.tokens}
                                </Badge>
                                <Badge variant="secondary" className="text-[10px] px-1.5 truncate max-w-[120px]">
                                  {docType.agent}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {selectedDocId && (
            <DocumentDynamicForm
              documentId={selectedDocId}
              values={formValues}
              onChange={handleFieldChange}
            />
          )}

          {selectedDocId && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">Gerar {selectedDoc?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Agente: {selectedDoc?.agent} — {selectedDoc?.tokens} tokens
                    </p>
                  </div>
                  <Button onClick={generateDocument} disabled={isLoading} className="min-w-[140px]">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Gerando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4" />
                        Gerar Documento
                      </span>
                    )}
                  </Button>
                </div>
                {user?.tokensAvailable !== undefined && selectedDoc && user.tokensAvailable < selectedDoc.tokens && (
                  <div className="flex items-center gap-2 p-3 mt-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">Tokens insuficientes.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-5 w-5" />
                Agentes Especialistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className={`p-3 rounded-lg border ${
                      selectedDoc?.agent === agent.name ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{agent.name}</span>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl h-7 text-xs" onClick={() => openChat(agent.id as SpecialistId)}>
                        Chat
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{agent.area}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {generatedDocument && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Documento Gerado
                  </span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}><Copy className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={downloadDocument}><Download className="h-4 w-4" /></Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LegalDocumentPreview
                  content={generatedDocument}
                  documentType={generatedDocumentName || selectedDocId}
                  clientName={formValues.cliente_nome}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentGeneratorPage;
