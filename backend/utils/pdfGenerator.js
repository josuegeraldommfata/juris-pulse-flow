const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// =============================================================
// 📄 GERADOR DE RELATÓRIOS PDF - ADVOCATUS IA
// =============================================================

// Configurações de estilo
const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#f59e0b',
  text: '#1f2937',
  lightGray: '#f3f4f6',
  white: '#ffffff'
};

const FONTS = {
  regular: 'Helvetica',
  bold: 'Helvetica-Bold',
  italic: 'Helvetica-Oblique'
};

// =============================================================
// 📊 DOSSIÊ COMPLETO DE LEAD
// =============================================================

const gerarDossieLead = async (leadData, userData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Header com logo e título
      adicionarHeader(doc, 'DOSSIÊ COMPLETO DE LEAD', userData);
      
      // Informações do lead
      adicionarSecaoLead(doc, leadData);
      
      // Conversas
      if (leadData.conversas && leadData.conversas.length > 0) {
        adicionarSecaoConversas(doc, leadData.conversas);
      }
      
      // Processos relacionados
      if (leadData.processos && leadData.processos.length > 0) {
        adicionarSecaoProcessos(doc, leadData.processos);
      }
      
      // Análise de IA
      if (leadData.analise_ia) {
        adicionarSecaoAnaliseIA(doc, leadData.analise_ia);
      }
      
      // Rodapé
      adicionarRodape(doc, userData);
      
      doc.end();
      
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// =============================================================
// 📋 RELATÓRIO DE PROCESSOS
// =============================================================

const gerarRelatorioProcessos = async (processos, userData, filtros, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Header
      adicionarHeader(doc, 'RELATÓRIO DE PROCESSOS JUDICIAIS', userData);
      
      // Filtros aplicados
      adicionarSecaoFiltros(doc, filtros);
      
      // Estatísticas gerais
      adicionarEstatisticasProcessos(doc, processos);
      
      // Lista de processos
      processos.forEach((processo, index) => {
        if (index > 0 && index % 3 === 0) {
          doc.addPage();
        }
        adicionarProcessoDetalhado(doc, processo);
      });
      
      adicionarRodape(doc, userData);
      doc.end();
      
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// =============================================================
// 📊 RELATÓRIO MENSAL DE ATIVIDADES
// =============================================================

const gerarRelatorioMensal = async (dados, userData, mes, ano, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Header
      adicionarHeader(doc, `RELATÓRIO MENSAL - ${mes}/${ano}`, userData);
      
      // KPIs principais
      adicionarKPIs(doc, dados.kpis);
      
      // Gráfico de leads (simulado com barras)
      adicionarGraficoLeads(doc, dados.leads_por_dia);
      
      // Tokens consumidos
      adicionarSecaoTokens(doc, dados.tokens);
      
      // Top 5 leads
      adicionarTop5Leads(doc, dados.top_leads);
      
      // Processos consultados
      adicionarProcessosConsultados(doc, dados.processos_mes);
      
      adicionarRodape(doc, userData);
      doc.end();
      
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// =============================================================
// 🎨 FUNÇÕES DE LAYOUT E DESIGN
// =============================================================

const adicionarHeader = (doc, titulo, userData) => {
  // Logo/marca (simulado)
  doc.rect(50, 30, 60, 40).fill(COLORS.primary);
  doc.fontSize(12).fillColor(COLORS.white).text('ADVOCATUS', 55, 45);
  doc.fontSize(8).text('IA', 85, 55);
  
  // Título principal
  doc.fontSize(18).fillColor(COLORS.text).text(titulo, 130, 35);
  
  // Informações do usuário
  doc.fontSize(10).fillColor(COLORS.secondary)
    .text(`${userData.nome} - OAB: ${userData.oab || 'N/A'}`, 130, 55)
    .text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 400, 35)
    .text(`Página 1`, 400, 50);
  
  // Linha separadora
  doc.moveTo(50, 85).lineTo(545, 85).stroke(COLORS.lightGray);
  
  return 100; // Retorna posição Y para continuar
};

const adicionarSecaoLead = (doc, lead) => {
  let yPos = 120;
  
  // Título da seção
  doc.fontSize(14).fillColor(COLORS.primary).text('INFORMAÇÕES DO LEAD', 50, yPos);
  yPos += 25;
  
  // Box com fundo
  doc.rect(50, yPos, 495, 120).fill(COLORS.lightGray).stroke();
  yPos += 15;
  
  // Informações básicas
  doc.fontSize(10).fillColor(COLORS.text);
  
  const infoItems = [
    [`Nome:`, lead.nome || 'N/A'],
    [`Telefone:`, lead.telefone || 'N/A'], 
    [`E-mail:`, lead.email || 'N/A'],
    [`Área Jurídica:`, lead.area || 'Não classificada'],
    [`Status:`, lead.status || 'Novo'],
    [`Score de Confiança:`, `${lead.score_confianca || 0}/100`],
    [`Data de Cadastro:`, new Date(lead.data_criacao).toLocaleDateString('pt-BR')],
    [`Origem:`, lead.origem || 'WhatsApp']
  ];
  
  let col1Y = yPos;
  let col2Y = yPos;
  
  infoItems.forEach((item, index) => {
    if (index < 4) {
      doc.font(FONTS.bold).text(item[0], 60, col1Y, { width: 200 });
      doc.font(FONTS.regular).text(item[1], 140, col1Y, { width: 200 });
      col1Y += 20;
    } else {
      doc.font(FONTS.bold).text(item[0], 310, col2Y, { width: 200 });
      doc.font(FONTS.regular).text(item[1], 390, col2Y, { width: 200 });
      col2Y += 20;
    }
  });
  
  return yPos + 120;
};

const adicionarSecaoConversas = (doc, conversas) => {
  let yPos = doc.y + 30;
  
  // Verificar se precisa de nova página
  if (yPos > 700) {
    doc.addPage();
    yPos = 50;
  }
  
  doc.fontSize(14).fillColor(COLORS.primary).text('HISTÓRICO DE CONVERSAS', 50, yPos);
  yPos += 25;
  
  conversas.slice(0, 10).forEach((conversa, index) => {
    if (yPos > 720) {
      doc.addPage();
      yPos = 50;
    }
    
    // Background alternado
    if (index % 2 === 0) {
      doc.rect(50, yPos - 5, 495, 25).fill('#f8f9fa').stroke();
    }
    
    doc.fontSize(9).fillColor(COLORS.text);
    
    const dataFormatada = new Date(conversa.created_at).toLocaleString('pt-BR');
    const sentido = conversa.sentido === 'incoming' ? '📥' : '📤';
    
    doc.text(`${sentido} ${dataFormatada}`, 60, yPos);
    doc.text(conversa.conteudo.substring(0, 80) + (conversa.conteudo.length > 80 ? '...' : ''), 200, yPos, { width: 300 });
    
    yPos += 25;
  });
  
  return yPos;
};

const adicionarSecaoProcessos = (doc, processos) => {
  let yPos = doc.y + 30;
  
  if (yPos > 700) {
    doc.addPage();
    yPos = 50;
  }
  
  doc.fontSize(14).fillColor(COLORS.primary).text('PROCESSOS RELACIONADOS', 50, yPos);
  yPos += 25;
  
  processos.forEach(processo => {
    if (yPos > 680) {
      doc.addPage();
      yPos = 50;
    }
    
    // Box do processo
    doc.rect(50, yPos, 495, 80).fill(COLORS.lightGray).stroke();
    yPos += 10;
    
    doc.fontSize(10).fillColor(COLORS.text);
    doc.font(FONTS.bold).text('Número:', 60, yPos);
    doc.font(FONTS.regular).text(processo.numero_processo, 110, yPos);
    
    doc.font(FONTS.bold).text('Tribunal:', 300, yPos);
    doc.font(FONTS.regular).text(processo.tribunal, 350, yPos);
    yPos += 15;
    
    doc.font(FONTS.bold).text('Classe:', 60, yPos);
    doc.font(FONTS.regular).text(processo.classe || 'N/A', 110, yPos, { width: 180 });
    
    doc.font(FONTS.bold).text('Status:', 300, yPos);
    doc.font(FONTS.regular).text(processo.status || 'Ativo', 350, yPos);
    yPos += 15;
    
    doc.font(FONTS.bold).text('Assunto:', 60, yPos);
    doc.font(FONTS.regular).text(processo.assunto || 'N/A', 110, yPos, { width: 400 });
    yPos += 35;
  });
  
  return yPos;
};

const adicionarSecaoAnaliseIA = (doc, analise) => {
  let yPos = doc.y + 30;
  
  if (yPos > 650) {
    doc.addPage();
    yPos = 50;
  }
  
  doc.fontSize(14).fillColor(COLORS.primary).text('ANÁLISE DE INTELIGÊNCIA ARTIFICIAL', 50, yPos);
  yPos += 25;
  
  // Box da análise
  doc.rect(50, yPos, 495, 150).fill('#f0f9ff').stroke(COLORS.primary);
  yPos += 15;
  
  doc.fontSize(10).fillColor(COLORS.text);
  doc.font(FONTS.bold).text('Área Jurídica Identificada:', 60, yPos);
  doc.font(FONTS.regular).text(analise.area || 'Não classificada', 200, yPos);
  yPos += 20;
  
  doc.font(FONTS.bold).text('Agente Especializado:', 60, yPos);
  doc.font(FONTS.regular).text(analise.agente || 'N/A', 200, yPos);
  yPos += 20;
  
  doc.font(FONTS.bold).text('Nível de Confiança:', 60, yPos);
  doc.font(FONTS.regular).text(`${analise.confianca || 0}%`, 200, yPos);
  yPos += 20;
  
  doc.font(FONTS.bold).text('Recomendações:', 60, yPos);
  yPos += 15;
  doc.font(FONTS.regular).text(analise.recomendacoes || 'Nenhuma recomendação disponível.', 60, yPos, { 
    width: 470, 
    align: 'justify' 
  });
  
  return yPos + 60;
};

const adicionarKPIs = (doc, kpis) => {
  let yPos = 120;
  
  doc.fontSize(14).fillColor(COLORS.primary).text('INDICADORES PRINCIPAIS', 50, yPos);
  yPos += 30;
  
  // 4 KPIs em caixas
  const kpiData = [
    { label: 'Total de Leads', value: kpis.total_leads || 0, color: COLORS.primary },
    { label: 'Taxa Conversão', value: `${kpis.taxa_conversao || 0}%`, color: COLORS.accent },
    { label: 'Tokens Consumidos', value: kpis.tokens_consumidos || 0, color: '#ef4444' },
    { label: 'Processos Consultados', value: kpis.processos_consultados || 0, color: '#10b981' }
  ];
  
  const boxWidth = 110;
  const spacing = 130;
  
  kpiData.forEach((kpi, index) => {
    const xPos = 50 + (index * spacing);
    
    // Caixa colorida
    doc.rect(xPos, yPos, boxWidth, 60).fill(kpi.color);
    
    // Valor grande
    doc.fontSize(18).fillColor(COLORS.white).text(kpi.value, xPos + 10, yPos + 15, { 
      width: boxWidth - 20, 
      align: 'center' 
    });
    
    // Label
    doc.fontSize(9).text(kpi.label, xPos + 10, yPos + 40, { 
      width: boxWidth - 20, 
      align: 'center' 
    });
  });
  
  return yPos + 80;
};

const adicionarRodape = (doc, userData) => {
  const pageHeight = doc.page.height;
  
  // Linha separadora
  doc.moveTo(50, pageHeight - 60).lineTo(545, pageHeight - 60).stroke(COLORS.lightGray);
  
  // Informações do rodapé
  doc.fontSize(8).fillColor(COLORS.secondary);
  doc.text('Advocatus IA - Sistema de Gestão Jurídica com Inteligência Artificial', 50, pageHeight - 45);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 50, pageHeight - 30);
  doc.text(`${userData.nome} - ${userData.email}`, 350, pageHeight - 45);
  doc.text('www.advocatusia.com.br', 350, pageHeight - 30);
};

// =============================================================
// 🚀 FUNÇÕES PRINCIPAIS DE EXPORTAÇÃO
// =============================================================

const gerarPDFBuffer = async (tipo, dados, userData, opcoes = {}) => {
  const filename = `${tipo}_${Date.now()}.pdf`;
  const outputPath = path.join(__dirname, '..', 'temp', filename);
  
  // Garantir que a pasta temp existe
  const tempDir = path.dirname(outputPath);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  let pdfPath;
  
  switch (tipo) {
    case 'dossie':
      pdfPath = await gerarDossieLead(dados, userData, outputPath);
      break;
    case 'processos':
      pdfPath = await gerarRelatorioProcessos(dados.processos, userData, dados.filtros, outputPath);
      break;
    case 'mensal':
      pdfPath = await gerarRelatorioMensal(dados, userData, opcoes.mes, opcoes.ano, outputPath);
      break;
    default:
      throw new Error('Tipo de relatório não suportado');
  }
  
  // Ler o arquivo como buffer
  const buffer = fs.readFileSync(pdfPath);
  
  // Limpar arquivo temporário
  fs.unlinkSync(pdfPath);
  
  return {
    buffer,
    filename,
    contentType: 'application/pdf'
  };
};

module.exports = {
  gerarDossieLead,
  gerarRelatorioProcessos,
  gerarRelatorioMensal,
  gerarPDFBuffer
};