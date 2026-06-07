const groqAIService = require('../services/groqAIService');
const { gerarDocumento, normalizeDados } = require('../utils/documentTemplates');
const { getDocumentTypeLabels } = require('../utils/documentCatalog');

const DOCUMENT_TYPE_LABELS = getDocumentTypeLabels();

async function chat(req, res) {
  try {
    const body = req.body || {};
    const { message } = body;

    console.log('AI chat body:', {
      hasBody: !!body,
      hasMessage: typeof message === 'string',
      messageLength: typeof message === 'string' ? message.length : null,
      timeoutMs: body?.timeoutMs,
    });

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Campo "message" é obrigatório.' });
    }

    const responseText = await groqAIService.chatCompletion({
      message: message.trim(),
      timeoutMs: req.body?.timeoutMs,
    });

    return res.json({ success: true, response: responseText });
  } catch (err) {
    console.error('AI chat error:', {
      message: err?.message,
      stack: err?.stack,
    });

    const isTimeout = typeof err?.message === 'string' && err.message.toLowerCase().includes('timeout');
    const status = isTimeout ? 504 : 500;

    return res.status(status).json({
      success: false,
      error: isTimeout ? 'Timeout ao processar solicitação da IA.' : 'Erro ao processar solicitação da IA.',
    });
  }
}

async function buildDocument(tipo, dados = {}) {
  if (!tipo || typeof tipo !== 'string') {
    throw new Error('Campo "tipo" é obrigatório.');
  }

  const baseDoc = gerarDocumento(tipo, dados);
  const mapped = normalizeDados(tipo, dados);
  const tipoLabel = DOCUMENT_TYPE_LABELS[tipo] || tipo;

  const prompt = [
    `Você é um advogado brasileiro experiente. Gere um documento jurídico profissional do tipo "${tipoLabel}".`,
    'Regras obrigatórias:',
    '- Use estrutura formal brasileira com seções numeradas em algarismos romanos (I, II, III...).',
    '- Linguagem técnica, clara e adequada ao foro.',
    '- Preencha todos os campos com base nos dados fornecidos; onde faltar informação, use placeholder entre colchetes [ASSIM].',
    '- NÃO use markdown, tabelas com |, asteriscos ou formatação especial — apenas texto puro.',
    '- Inclua qualificação das partes, fatos, fundamentação, pedidos e fecho com data e assinatura.',
    '',
    'Dados do formulário:',
    JSON.stringify(mapped, null, 2),
    '',
    'Modelo estrutural de referência (melhore e complete com os dados reais):',
    baseDoc.conteudo,
    '',
    'Retorne APENAS o texto final do documento, pronto para protocolo.',
  ].join('\n');

  let conteudo = baseDoc.conteudo;

  try {
    conteudo = await groqAIService.chatCompletion({
      message: prompt,
      temperature: 0.4,
      max_completion_tokens: 4096,
      timeoutMs: 60000,
    });
  } catch (aiErr) {
    console.warn('AI document enhancement fallback:', aiErr?.message);
  }

  return {
    documento: conteudo.trim(),
    nome: baseDoc.nome,
    tokensUsados: baseDoc.custoTokens,
  };
}

async function generateDocument(req, res) {
  try {
    const { tipo, dados } = req.body || {};
    const result = await buildDocument(tipo, dados);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('Generate document error:', err?.message);
    const status = err.message?.includes('obrigatório') ? 400 : 500;
    return res.status(status).json({ success: false, error: err?.message || 'Erro ao gerar documento.' });
  }
}

module.exports = {
  chat,
  generateDocument,
  buildDocument,
};


