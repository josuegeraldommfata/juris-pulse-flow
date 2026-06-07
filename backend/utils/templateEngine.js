const D = (d, k, fb) => (d[k] && String(d[k]).trim()) || fb;
const DT = () => new Date().toLocaleDateString('pt-BR');
const SIG = (d) => `\n____________________________________\n${D(d, 'advogado', D(d, 'advogado_nome', '[ADVOGADO]'))}\nOAB/${D(d, 'ufOab', D(d, 'advogado_oab_uf', 'XX'))} ${D(d, 'numeroOab', D(d, 'advogado_oab_numero', '[Nº]'))}`;
const HC = (d) => `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${D(d, 'vara', '[VARA]')} DA COMARCA DE ${D(d, 'comarca', '[COMARCA]')}`;
const HT = (d) => `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DO TRABALHO DA ${D(d, 'vara', '[VT]')} DE ${D(d, 'comarca', '[COMARCA]')}`;
const HB = (d) => `EXCELENTÍSSIMO(A) SENHOR(A) DESEMBARGADOR(A) RELATOR(A) DO ${D(d, 'tribunal', '[TRIBUNAL]')}`;

const STRUCTURES = {
  peticao_inicial: (d, n) => `${HC(d)}\n\n${D(d, 'nomeAutor', '[AUTOR]')}, ${D(d, 'qualificacaoAutor', '[QUALIFICAÇÃO]')}, propõe AÇÃO ${D(d, 'tipoAcao', n)} contra ${D(d, 'nomeReu', '[RÉU]')}.\n\nI - DOS FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - DO DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIII - DAS PROVAS\n${D(d, 'provas', '[PROVAS]')}\n\nIV - DOS PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}\n\nValor: R$ ${D(d, 'valorCausa', '[VALOR]')}.\n${D(d, 'cidade', '[CIDADE]')}, ${DT()}.${SIG(d)}`,
  contestacao: (d) => `${HC(d)}\nProcesso nº ${D(d, 'numeroProcesso', '[Nº]')}\n\nCONTESTAÇÃO\n\nI - PRELIMINARES\n${D(d, 'preliminares', '[PRELIMINARES]')}\n\nII - MÉRITO\n${D(d, 'merito', D(d, 'fatos', '[MÉRITO]'))}\n\nIII - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}\n${DT()}.${SIG(d)}`,
  replica: (d) => `${HC(d)}\nProcesso nº ${D(d, 'numeroProcesso', '[Nº]')}\n\nRÉPLICA\n\nI - SÍNTESE DA DEFESA\n${D(d, 'sinteseDefesa', '[SÍNTESE]')}\n\nII - IMPUGNAÇÃO\n${D(d, 'fatos', '[IMPUGNAÇÃO]')}\n\nIII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIV - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  reconvencao: (d, n) => STRUCTURES.peticao_inicial(d, n || 'RECONVENÇÃO'),
  impugnacao: (d) => STRUCTURES.contestacao(d),
  recurso_apelacao: (d, n) => `${HB(d)}\nProcesso nº ${D(d, 'numeroProcesso', '[Nº]')}\n\n${n || 'APELAÇÃO'}\n\nI - DECISÃO\n${D(d, 'decisaoRecorrida', D(d, 'fatos', '[DECISÃO]'))}\n\nII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIII - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  agravo_instrumento: (d) => `${HB(d)}\nProcesso nº ${D(d, 'numeroProcesso', '[Nº]')}\n\nAGRAVO DE INSTRUMENTO\n\nI - CABIMENTO\n${D(d, 'cabimento', D(d, 'fundamentacao', '[CABIMENTO]'))}\n\nII - DECISÃO\n${D(d, 'decisaoRecorrida', D(d, 'fatos', '[DECISÃO]'))}\n\nIII - EFEITO\n${D(d, 'pedidoLiminar', '[EFEITO]')}\n\nIV - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  agravo_interno: (d) => STRUCTURES.agravo_instrumento(d),
  embargos_declaracao: (d) => `${HC(d)}\nProcesso nº ${D(d, 'numeroProcesso', '[Nº]')}\n\nEMBARGOS DE DECLARAÇÃO\n\nI - DECISÃO\n${D(d, 'decisaoRecorrida', D(d, 'fatos', '[DECISÃO]'))}\n\nII - VÍCIO\n${D(d, 'fundamentacao', '[VÍCIO]')}\n\nIII - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  tutela_antecipada: (d) => `${HC(d)}\n\nTUTELA DE URGÊNCIA\n\nI - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - PROBABILIDADE DO DIREITO\n${D(d, 'fundamentacao', '[FUMUS]')}\n\nIII - PERIGO\n${D(d, 'pedidoLiminar', '[PERICULUM]')}\n\nIV - PEDIDO\n${D(d, 'pedidos', '[PEDIDO]')}${SIG(d)}`,
  mandado_seguranca: (d) => `${HC(d)}\n\nMANDADO DE SEGURANÇA contra ${D(d, 'autoridadeCoatora', '[AUTORIDADE]')}\n\nI - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - DIREITO LÍQUIDO E CERTO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIII - LIMINAR\n${D(d, 'pedidoLiminar', '[LIMINAR]')}\n\nIV - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  cumprimento_sentenca: (d) => `${HC(d)}\nProcesso nº ${D(d, 'numeroProcesso', '[Nº]')}\n\nCUMPRIMENTO DE SENTENÇA\n\nI - TÍTULO\n${D(d, 'tituloExecutivo', D(d, 'fatos', '[TÍTULO]'))}\n\nII - CÁLCULO\n${D(d, 'calculoExecucao', '[CÁLCULO]')}\n\nIII - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}\nValor: R$ ${D(d, 'valorExecucao', D(d, 'valorCausa', '[VALOR]'))}.${SIG(d)}`,
  execucao_titulo: (d) => STRUCTURES.cumprimento_sentenca(d),
  impugnacao_cumprimento: (d) => `${HC(d)}\nProcesso nº ${D(d, 'numeroProcesso', '[Nº]')}\n\nIMPUGNAÇÃO AO CUMPRIMENTO\n\nI - CUMPRIMENTO\n${D(d, 'fatos', '[CUMPRIMENTO]')}\n\nII - DEFESA\n${D(d, 'fundamentacao', '[DEFESA]')}\n\nIII - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  reclamacao_trabalhista: (d) => `${HT(d)}\n\nRECLAMAÇÃO TRABALHISTA — ${D(d, 'nomeAutor', '[RECLAMANTE]')} vs ${D(d, 'nomeReu', '[RECLAMADO]')}\n\nI - CONTRATO\nAdmissão: ${D(d, 'dataAdmissao', '[DATA]')} | Demissão: ${D(d, 'dataDemissao', '[DATA]')} | Cargo: ${D(d, 'cargo', '[CARGO]')} | Salário: ${D(d, 'salario', '[SALÁRIO]')}\n\nII - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nIII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIV - VERBAS\n${D(d, 'verbasPleiteadas', D(d, 'pedidos', '[VERBAS]'))}${SIG(d)}`,
  contestacao_trabalhista: (d) => `${HT(d)}\nProcesso nº ${D(d, 'numeroProcesso', '[Nº]')}\n\nCONTESTAÇÃO TRABALHISTA\n\nI - PRELIMINARES\n${D(d, 'preliminares', '[PRELIMINARES]')}\n\nII - MÉRITO\n${D(d, 'fatos', '[MÉRITO]')}\n\nIII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIV - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  replica_trabalhista: (d) => STRUCTURES.replica(d),
  calculos_trabalhistas: (d) => `MEMÓRIA DE CÁLCULO\nProcesso: ${D(d, 'numeroProcesso', '[Nº]')}\n\nI - PARÂMETROS\n${D(d, 'dataAdmissao', '')} a ${D(d, 'dataDemissao', '')} | Salário: ${D(d, 'salario', '[SALÁRIO]')}\n\nII - VERBAS\n${D(d, 'verbasPleiteadas', '[VERBAS]')}\n\nIII - CÁLCULO\n${D(d, 'calculoExecucao', '[CÁLCULO]')}${SIG(d)}`,
  recurso_ordinario: (d) => STRUCTURES.recurso_apelacao(d, 'RECURSO ORDINÁRIO'),
  agravo_peticao: (d) => STRUCTURES.agravo_instrumento(d),
  embargos_execucao: (d) => STRUCTURES.impugnacao_cumprimento(d),
  previdenciario_inicial: (d, n) => `${HC(d)}\n\nAÇÃO PREVIDENCIÁRIA — ${D(d, 'tipoBeneficio', D(d, 'tipoAcao', n))}\nNB: ${D(d, 'nbBeneficio', '[NB]')} | DER: ${D(d, 'dataDer', '[DER]')}\n\nI - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIII - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  familia_peticao: (d, n) => `${HC(d)}\n\n${D(d, 'tipoAcao', n || 'AÇÃO DE FAMÍLIA')}\n${D(d, 'nomeAutor', '[AUTOR]')} vs ${D(d, 'nomeReu', '[RÉU]')}\n\nI - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - ACORDO/PEDIDOS\n${D(d, 'acordoFamilia', D(d, 'pedidos', '[PEDIDOS]'))}\n\nIII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nAlimentos: ${D(d, 'valorAlimentos', '[VALOR]')}${SIG(d)}`,
  consumidor_inicial: (d, n) => `${HC(d)}\n\nAÇÃO ${D(d, 'tipoAcao', n || 'DE CONSUMO')} — ${D(d, 'empresaReu', D(d, 'nomeReu', '[FORNECEDOR]'))}\n\nI - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - PRODUTO/SERVIÇO\n${D(d, 'contratoConsumo', '[PRODUTO]')}\n\nIII - DANO\n${D(d, 'danoConsumidor', '[DANO]')}\n\nIV - DIREITO\n${D(d, 'fundamentacao', '[CDC]')}\n\nV - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  imobiliario_inicial: (d, n) => `${HC(d)}\n\nAÇÃO ${D(d, 'tipoAcao', n || 'IMOBILIÁRIA')}\nImóvel: ${D(d, 'imovelEndereco', '[ENDEREÇO]')}\n\nI - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIII - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  habeas_corpus: (d) => `${HB(d)}\n\nHABEAS CORPUS — ${D(d, 'paciente', D(d, 'nomeAutor', '[PACIENTE]'))}\n\nI - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIII - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  liberacao_provisoria: (d) => STRUCTURES.habeas_corpus(d),
  revogacao_prisao: (d) => STRUCTURES.habeas_corpus(d),
  resposta_acusacao: (d) => STRUCTURES.contestacao(d),
  memorial: (d) => `${HC(d)}\nProcesso nº ${D(d, 'numeroProcesso', '[Nº]')}\n\nMEMORIAL\n\nI - SÍNTESE\n${D(d, 'fatos', '[SÍNTESE]')}\n\nII - MÉRITO\n${D(d, 'fundamentacao', '[MÉRITO]')}\n\nIII - PROVAS\n${D(d, 'provas', '[PROVAS]')}\n\nIV - PEDIDOS\n${D(d, 'pedidos', '[PEDIDOS]')}${SIG(d)}`,
  recurso_sentido_estrito: (d) => STRUCTURES.recurso_apelacao(d, 'RECURSO EM SENTIDO ESTRITO'),
  apelacao_criminal: (d) => STRUCTURES.recurso_apelacao(d, 'APELAÇÃO CRIMINAL'),
  recurso_inominado: (d) => STRUCTURES.recurso_apelacao(d, 'RECURSO INOMINADO'),
  procuracao: (d) => `PROCURAÇÃO\n\nOUTORGANTE: ${D(d, 'outorgante', D(d, 'nomeAutor', '[OUTORGANTE]'))}\nOUTORGADO: ${D(d, 'outorgado', D(d, 'advogado_nome', '[ADVOGADO]'))} OAB/${D(d, 'advogado_oab_uf', 'XX')} ${D(d, 'advogado_oab_numero', '[Nº]')}\n\nPODERES: ${D(d, 'poderesEspeciais', '[PODERES]')}\n\n${DT()}.`,
  substabelecimento: (d) => `SUBSTABELECIMENTO\n\nDe: ${D(d, 'substabelecente', '[SUBSTABELECANTE]')}\nPara: ${D(d, 'substabelecido', '[SUBSTABELECIDO]')}\nProcesso: ${D(d, 'numeroProcesso', '[Nº]')}\nPoderes: ${D(d, 'poderesEspeciais', '[PODERES]')}\nReserva: ${D(d, 'reservasPoderes', 'com reserva')}\n${DT()}.`,
  notificacao_extrajudicial: (d) => `NOTIFICAÇÃO EXTRAJUDICIAL\n\nDe: ${D(d, 'nomeAutor', '[NOTIFICANTE]')}\nPara: ${D(d, 'nomeReu', '[NOTIFICADO]')}\n\nI - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - FUNDAMENTO\n${D(d, 'fundamentacao', '[FUNDAMENTO]')}\n\nIII - REQUERIMENTO (${D(d, 'prazoNotificacao', '[PRAZO]')} dias)\n${D(d, 'pedidos', '[REQUERIMENTO]')}${SIG(d)}`,
  parecer_juridico: (d) => `PARECER JURÍDICO — ${D(d, 'assuntoParecer', '[ASSUNTO]')}\n\nI - RELATÓRIO\n${D(d, 'fatos', '[RELATÓRIO]')}\n\nII - FUNDAMENTAÇÃO\n${D(d, 'fundamentacao', '[FUNDAMENTAÇÃO]')}\n\nIII - CONCLUSÃO\n${D(d, 'conclusaoParecer', D(d, 'pedidos', '[CONCLUSÃO]'))}${SIG(d)}`,
  declaracao: (d) => `DECLARAÇÃO\n\n${D(d, 'declarante', D(d, 'nomeAutor', '[DECLARANTE]'))}, declara:\n\n${D(d, 'conteudo', D(d, 'fatos', '[CONTEÚDO]'))}\n\n${DT()}.`,
  contrato: (d) => `CONTRATO\n\nPartes: ${D(d, 'nomeAutor', '[1]')} e ${D(d, 'nomeReu', '[2]')}\n\nI - OBJETO\n${D(d, 'objetoContrato', D(d, 'objeto', '[OBJETO]'))}\n\nII - VALOR\n${D(d, 'valorContrato', D(d, 'valor', '[VALOR]'))}\n\nIII - PRAZO\n${D(d, 'prazoContrato', '[PRAZO]')}\n\nIV - CLÁUSULAS\n${D(d, 'clausulasContrato', '[CLÁUSULAS]')}\n\nForo: ${D(d, 'comarca', '[COMARCA]')}. ${DT()}.`,
  contrato_honorarios: (d) => STRUCTURES.contrato(d),
  acordo_extrajudicial: (d) => `TERMO DE ACORDO\n\nPartes: ${D(d, 'nomeAutor', '[1]')} e ${D(d, 'nomeReu', '[2]')}\n\nI - OBJETO\n${D(d, 'fatos', '[OBJETO]')}\n\nII - OBRIGAÇÕES\n${D(d, 'pedidos', '[OBRIGAÇÕES]')}\n\nIII - VALOR\n${D(d, 'valorContrato', '[VALOR]')}\n\nIV - QUITAÇÃO\n${D(d, 'fundamentacao', '[QUITAÇÃO]')}\n${DT()}.`,
  confissao_divida: (d) => `CONFISSÃO DE DÍVIDA\n\nDevedor: ${D(d, 'nomeAutor', '[DEVEDOR]')} | Credor: ${D(d, 'nomeReu', '[CREDOR]')}\n\nI - DÍVIDA\n${D(d, 'fatos', '[DÍVIDA]')}\n\nII - PARCELAMENTO\n${D(d, 'calculoExecucao', D(d, 'valorContrato', '[VALOR]'))}\n${DT()}.`,
  distrato: (d) => `DISTRATO\n\nPartes: ${D(d, 'nomeAutor', '[1]')} e ${D(d, 'nomeReu', '[2]')}\n\nI - MOTIVO\n${D(d, 'fatos', '[MOTIVO]')}\n\nII - OBRIGAÇÕES\n${D(d, 'pedidos', '[OBRIGAÇÕES]')}\n\nIII - QUITAÇÃO\n${D(d, 'fundamentacao', '[QUITAÇÃO]')}\n${DT()}.`,
  contrato_social: (d) => `CONTRATO SOCIAL\n\nSócios: ${D(d, 'socios', '[SÓCIOS]')}\nCapital: ${D(d, 'capitalSocial', '[CAPITAL]')}\nObjeto: ${D(d, 'objetoSocial', D(d, 'objetoContrato', '[OBJETO]'))}\n\n${D(d, 'clausulasContrato', '[CLÁUSULAS]')}\n${DT()}.`,
  alteracao_contratual: (d) => `ALTERAÇÃO CONTRATUAL\n${STRUCTURES.contrato_social(d)}`,
  distrato_social: (d) => `DISTRATO SOCIAL\n${STRUCTURES.distrato(d)}`,
  recuperacao_judicial: (d, n) => STRUCTURES.peticao_inicial(d, n || 'RECUPERAÇÃO JUDICIAL'),
  requerimento_administrativo: (d) => `REQUERIMENTO ADMINISTRATIVO\n\nRequerente: ${D(d, 'nomeAutor', '[NOME]')}\nÓrgão: ${D(d, 'orgaoAdministrativo', '[ÓRGÃO]')}\n\nI - FATOS\n${D(d, 'fatos', '[FATOS]')}\n\nII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIII - PEDIDO\n${D(d, 'pedidos', '[PEDIDO]')}\n${DT()}.`,
  recurso_administrativo: (d) => `RECURSO ADMINISTRATIVO\n\nÓrgão: ${D(d, 'orgaoAdministrativo', '[ÓRGÃO]')}\nBenefício: ${D(d, 'tipoBeneficio', '[BENEFÍCIO]')}\n\nI - DECISÃO\n${D(d, 'fatos', '[DECISÃO]')}\n\nII - DIREITO\n${D(d, 'fundamentacao', '[DIREITO]')}\n\nIII - PEDIDO\n${D(d, 'pedidos', '[PEDIDO]')}\n${DT()}.`,
  carta_preposicao: (d) => `CARTA DE PREPOSIÇÃO\n\nEmpresa: ${D(d, 'nomeReu', '[EMPRESA]')}\nProcesso: ${D(d, 'numeroProcesso', '[Nº]')}\nPreposto: ${D(d, 'preposto', D(d, 'pedidos', '[PREPOSTO]'))}\n${DT()}.`,
};

function renderStructure(structureId, dados, nomeDocumento) {
  const fn = STRUCTURES[structureId];
  if (!fn) return STRUCTURES.peticao_inicial(dados, nomeDocumento);
  return fn(dados, nomeDocumento);
}

module.exports = { STRUCTURES, renderStructure };
