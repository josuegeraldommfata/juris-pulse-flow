import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { FileText, Download, Coins, Calendar, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PDFExportButtonProps {
  leadId?: string;
  leadName?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const PDFExportButton = ({ leadId, leadName, variant = "outline", size = "sm" }: PDFExportButtonProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const exportLeadPDF = async () => {
    if (!leadId) {
      toast({
        title: "Erro",
        description: "ID do lead não encontrado",
        variant: "destructive"
      });
      return;
    }

    if (!user?.tokensAvailable || user.tokensAvailable < 1) {
      toast({
        title: "Tokens insuficientes",
        description: "Você precisa de 1 token para exportar o dossiê em PDF",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/leads/${leadId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ formato: 'pdf' })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      // Criar link de download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `dossie_${leadName || 'lead'}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF gerado!",
        description: "Dossiê do lead exportado com sucesso. 1 token utilizado."
      });

    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar PDF. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportProcessosRelatorio = async () => {
    if (!user?.tokensAvailable || user.tokensAvailable < 2) {
      toast({
        title: "Tokens insuficientes", 
        description: "Você precisa de 2 tokens para gerar o relatório de processos",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/processos/relatorio-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          filtros: {
            // Adicionar filtros se necessário
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio_processos_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Relatório gerado!",
        description: "Relatório de processos exportado. 2 tokens utilizados."
      });

    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportRelatorioMensal = async () => {
    if (!user?.tokensAvailable || user.tokensAvailable < 3) {
      toast({
        title: "Tokens insuficientes",
        description: "Você precisa de 3 tokens para gerar o relatório mensal",
        variant: "destructive"
      });
      return;
    }

    const now = new Date();
    const mes = now.getMonth() + 1;
    const ano = now.getFullYear();

    setIsLoading(true);

    try {
      const response = await fetch('/api/relatorio-mensal-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ mes, ano })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório mensal');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `relatorio_mensal_${mes}_${ano}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Relatório mensal gerado!",
        description: "Relatório mensal exportado. 3 tokens utilizados."
      });

    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar relatório mensal. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (leadId) {
    // Botão simples para dossiê específico
    return (
      <Button
        variant={variant}
        size={size}
        onClick={exportLeadPDF}
        disabled={isLoading}
        className="min-w-[100px]"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
            <span className="text-xs">PDF...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            <span className="text-xs">PDF</span>
            <div className="flex items-center ml-1">
              <Coins className="h-3 w-3" />
              <span className="text-xs">1</span>
            </div>
          </div>
        )}
      </Button>
    );
  }

  // Menu dropdown para relatórios gerais
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              Gerando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Relatórios PDF
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportProcessosRelatorio}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span>Relatório de Processos</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="h-3 w-3" />
              2
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={exportRelatorioMensal}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Relatório Mensal</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="h-3 w-3" />
              3
            </div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Coins className="h-3 w-3" />
            <span>Tokens disponíveis: {user?.tokensAvailable || 0}</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PDFExportButton;