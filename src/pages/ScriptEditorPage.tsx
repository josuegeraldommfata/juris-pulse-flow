import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

interface Script {
  id: string;
  stage: string;
  label: string;
  content: string;
  field: 'welcome_message' | 'data_collection' | 'closing_message';
}

const defaultScripts: Script[] = [
  {
    id: '1',
    stage: 'Boas-vindas',
    label: 'Mensagem inicial enviada ao lead',
    field: 'welcome_message',
    content: `Olá! 👋 Seja bem-vindo(a) ao atendimento do escritório **Silva & Silva Advocacia**.\n\nSou o assistente virtual e estou aqui para entender melhor o seu caso e agilizar o seu atendimento.\n\nPara começar, poderia me informar:\n- Seu **nome completo**\n- O **assunto** que deseja tratar\n\nFique tranquilo(a), todas as informações são sigilosas. 🔒`,
  },
  {
    id: '2',
    stage: 'Coleta de Dados',
    label: 'Perguntas de qualificação do lead',
    field: 'data_collection',
    content: `Obrigado pelas informações, **{{nome}}**! 📋\n\nPara que possamos analisar seu caso com precisão, preciso de mais alguns dados:\n\n1. Você já possui um **advogado** acompanhando este caso?\n2. Qual a **data aproximada** do ocorrido?\n3. Possui algum **documento** relacionado (contrato, notificação, etc.)?\n4. Em uma escala de 1 a 10, qual a **urgência** do seu caso?\n\nSe preferir, pode enviar fotos dos documentos diretamente aqui. 📎`,
  },
  {
    id: '3',
    stage: 'Agendamento',
    label: 'Mensagem de encerramento e próximos passos',
    field: 'closing_message',
    content: `Perfeito, **{{nome}}**! ✅\n\nCom base nas informações coletadas, seu caso foi classificado como **{{urgencia}}** na área de **{{area_juridica}}**.\n\n📅 **Próximos passos:**\n- Um de nossos advogados especialistas entrará em contato em até **24 horas**\n- Caso tenha documentos pendentes, envie por aqui antes da consulta\n\nAgradecemos a confiança! Se precisar de algo antes, é só chamar. 💼`,
  },
];

export default function ScriptEditorPage() {
  const [scripts, setScripts] = useState(defaultScripts);
  const [activeTab, setActiveTab] = useState('1');
  const [saving, setSaving] = useState(false);

  const activeScript = scripts.find((s) => s.id === activeTab)!;

  const updateContent = (content: string) => {
    setScripts((prev) => prev.map((s) => (s.id === activeTab ? { ...s, content } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaving(false);
    toast.success(`Roteiro "${activeScript.stage}" salvo com sucesso`, {
      description: `Campo ${activeScript.field} atualizado`,
    });
  };

  const handleReset = () => {
    const original = defaultScripts.find((s) => s.id === activeTab)!;
    updateContent(original.content);
    toast.info('Texto restaurado para o padrão');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Roteiro de Atendimento
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Edite as mensagens que a IA SDR envia em cada etapa do atendimento</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}>
        {/* Tab bar */}
        <div className="flex gap-2 mb-4">
          {scripts.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === s.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:bg-secondary/50 border border-transparent'
              }`}
            >
              {s.stage}
            </button>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{activeScript.stage}</h3>
              <p className="text-xs text-muted-foreground">{activeScript.label}</p>
            </div>
            <Badge variant="outline" className="rounded-full text-xs font-mono border-border">
              {activeScript.field}
            </Badge>
          </div>

          {/* Rich text area with formatting toolbar */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-1 px-3 py-2 bg-secondary/30 border-b border-border">
              <button className="px-2 py-1 rounded text-xs font-bold text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">B</button>
              <button className="px-2 py-1 rounded text-xs italic text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">I</button>
              <span className="w-px h-4 bg-border mx-1" />
              <button className="px-2 py-1 rounded text-xs text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">📎 Variável</button>
              <button className="px-2 py-1 rounded text-xs text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">😀 Emoji</button>
            </div>
            <textarea
              value={activeScript.content}
              onChange={(e) => updateContent(e.target.value)}
              className="w-full min-h-[280px] p-4 bg-transparent text-foreground text-sm leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground font-mono"
              placeholder="Digite o roteiro de atendimento..."
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Variáveis disponíveis: <code className="bg-secondary/50 px-1.5 py-0.5 rounded">{'{{nome}}'}</code>{' '}
            <code className="bg-secondary/50 px-1.5 py-0.5 rounded">{'{{urgencia}}'}</code>{' '}
            <code className="bg-secondary/50 px-1.5 py-0.5 rounded">{'{{area_juridica}}'}</code>{' '}
            <code className="bg-secondary/50 px-1.5 py-0.5 rounded">{'{{telefone}}'}</code>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={handleReset}>
              <RotateCcw className="h-3.5 w-3.5" /> Restaurar Padrão
            </Button>
            <Button size="sm" className="rounded-xl gap-1.5" onClick={handleSave} disabled={saving}>
              <Save className="h-3.5 w-3.5" /> {saving ? 'Salvando...' : 'Salvar Roteiro'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
