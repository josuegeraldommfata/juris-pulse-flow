const { getCatalogEntry, listCatalog } = require('./documentCatalog');
const { renderStructure } = require('./templateEngine');

function buildQualificacao(campos) {
  return [
    campos.cliente_nome ? 'brasileiro(a)' : null,
    campos.cliente_cpf ? `inscrito(a) no CPF nº ${campos.cliente_cpf}` : null,
    campos.cliente_rg ? `portador(a) do RG nº ${campos.cliente_rg}` : null,
    campos.cliente_estado_civil ? campos.cliente_estado_civil : null,
    campos.cliente_profissao ? campos.cliente_profissao : null,
    campos.cliente_endereco ? `residente em ${campos.cliente_endereco}` : null,
  ].filter(Boolean).join(', ') || '[QUALIFICAÇÃO]';
}

function extractCampos(dados = {}) {
  if (dados.campos && typeof dados.campos === 'object') {
    return { ...dados.campos };
  }

  const c = dados.cliente || {};
  const p = dados.processo || {};
  const ct = dados.conteudo || {};

  return {
    cliente_nome: c.nome,
    cliente_cpf: c.cpf,
    cliente_endereco: c.endereco,
    parte_contraria: p.parte_contraria,
    valor_causa: p.valor_causa,
    comarca: p.comarca,
    vara: p.vara,
    numero_processo: p.numero_processo,
    relato_fatos: ct.relato_fatos,
    pedidos: ct.pedidos,
    fundamentos_juridicos: ct.fundamentos_juridicos,
    ...dados,
  };
}

function normalizeDados(tipo, dados = {}) {
  const entry = getCatalogEntry(tipo);
  const campos = extractCampos(dados);
  const qualificacao = buildQualificacao(campos);

  const mapped = {
    nomeAutor: campos.cliente_nome || '[NOME DO AUTOR]',
    qualificacaoAutor: qualificacao,
    nomeReu: campos.parte_contraria || campos.empresa_reu || '[NOME DO RÉU]',
    qualificacaoReu: campos.qualificacao_reu || '[QUALIFICAÇÃO DO RÉU]',
    numeroProcesso: campos.numero_processo || '[NÚMERO DO PROCESSO]',
    comarca: campos.comarca || '[COMARCA]',
    vara: campos.vara || '[VARA]',
    tribunal: campos.tribunal || '[TRIBUNAL]',
    valorCausa: campos.valor_causa || campos.valor_execucao || '[VALOR]',
    valorExecucao: campos.valor_execucao || campos.valor_causa || '[VALOR]',
    cidade: campos.comarca || '[CIDADE]',
    fatos: campos.relato_fatos || '[NARRATIVA DOS FATOS]',
    pedidos: campos.pedidos || '[PEDIDOS]',
    fundamentacao: campos.fundamentos_juridicos || '[FUNDAMENTAÇÃO JURÍDICA]',
    preliminares: campos.preliminares || campos.fundamentos_juridicos || '[PRELIMINARES]',
    merito: campos.relato_fatos || '[MÉRITO]',
    provas: campos.provas || '[PROVAS]',
    decisaoRecorrida: campos.decisao_recorrida || campos.relato_fatos || '[DECISÃO RECORRIDA]',
    pedidoLiminar: campos.pedido_liminar || campos.pedidos || '[PEDIDO LIMINAR]',
    tipoAcao: campos.tipo_acao || entry?.defaultTipoAcao || '[TIPO DA AÇÃO]',
    tituloExecutivo: campos.titulo_executivo || '[TÍTULO EXECUTIVO]',
    calculoExecucao: campos.calculo_execucao || '[CÁLCULO]',
    advogado: campos.advogado_nome || '[ADVOGADO]',
    advogado_nome: campos.advogado_nome,
    ufOab: campos.advogado_oab_uf,
    advogado_oab_uf: campos.advogado_oab_uf,
    numeroOab: campos.advogado_oab_numero,
    advogado_oab_numero: campos.advogado_oab_numero,
    dataAdmissao: campos.data_admissao,
    dataDemissao: campos.data_demissao,
    cargo: campos.cargo,
    salario: campos.salario,
    jornada: campos.jornada,
    verbasPleiteadas: campos.verbas_pleiteadas || campos.pedidos,
    tipoBeneficio: campos.tipo_beneficio || entry?.defaultTipoAcao,
    nbBeneficio: campos.nb_beneficio,
    dataDer: campos.data_der,
    tempoContribuicao: campos.tempo_contribuicao,
    cidDeficiencia: campos.cid_deficiencia,
    rendaFamiliar: campos.renda_familiar,
    dataCasamento: campos.data_casamento,
    regimeBens: campos.regime_bens,
    filhos: campos.filhos,
    acordoFamilia: campos.acordo_familia || campos.pedidos,
    valorAlimentos: campos.valor_alimentos,
    falecidoNome: campos.falecido_nome,
    dataObito: campos.data_obito,
    inventariante: campos.inventariante,
    bensHeranca: campos.bens_heranca,
    empresaReu: campos.empresa_reu || campos.parte_contraria,
    contratoConsumo: campos.contrato_consumo,
    danoConsumidor: campos.dano_consumidor,
    imovelEndereco: campos.imovel_endereco,
    matriculaImovel: campos.matricula_imovel,
    valorAluguel: campos.valor_aluguel,
    tempoPosse: campos.tempo_posse,
    paciente: campos.paciente_nome || campos.cliente_nome,
    autoridadeCoatora: campos.autoridade_coatora || campos.parte_contraria,
    tipoPrisao: campos.tipo_prisao,
    artigoImputado: campos.artigo_imputado,
    outorgante: campos.outorgante || campos.cliente_nome,
    outorgado: campos.outorgado || campos.advogado_nome,
    poderesEspeciais: campos.poderes_especiais,
    substabelecente: campos.substabelecente,
    substabelecido: campos.substabelecido,
    reservasPoderes: campos.reservas_poderes,
    prazoNotificacao: campos.prazo_notificacao,
    assuntoParecer: campos.assunto_parecer,
    conclusaoParecer: campos.conclusao_parecer,
    objetoContrato: campos.objeto_contrato || campos.relato_fatos,
    valorContrato: campos.valor_contrato || campos.valor_causa,
    prazoContrato: campos.prazo_contrato,
    clausulasContrato: campos.clausulas_contrato,
    socios: campos.socios,
    capitalSocial: campos.capital_social,
    objetoSocial: campos.objeto_social,
    orgaoAdministrativo: campos.orgao_administrativo,
    preposto: campos.pedidos,
    declarante: campos.cliente_nome,
    conteudo: campos.relato_fatos,
    sinteseDefesa: campos.fundamentos_juridicos,
    nomeRecorrente: campos.cliente_nome,
    cabimento: campos.fundamentos_juridicos,
    contratante: campos.cliente_nome,
    contratado: campos.parte_contraria,
    objeto: campos.objeto_contrato || campos.relato_fatos,
    valor: campos.valor_contrato || campos.valor_causa,
    obrigacoes: campos.clausulas_contrato || campos.pedidos,
    camposRaw: campos,
  };

  return mapped;
}

function gerarDocumento(tipo, dados) {
  const entry = getCatalogEntry(tipo);
  if (!entry) {
    throw new Error(`Template '${tipo}' não encontrado`);
  }

  const mapped = normalizeDados(tipo, dados);
  const conteudo = renderStructure(entry.structure, mapped, entry.nome.toUpperCase());
  
  return {
    nome: entry.nome,
    conteudo,
    custoTokens: entry.custo_tokens,
    dataGeracao: new Date().toISOString(),
  };
}

function listarTemplates() {
  return listCatalog();
}

module.exports = {
  gerarDocumento,
  listarTemplates,
  normalizeDados,
};
