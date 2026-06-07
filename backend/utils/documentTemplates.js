// 📄 TEMPLATES DE DOCUMENTOS JURÍDICOS

const TEMPLATES_DOCUMENTOS = {
  peticao_inicial: {
    nome: "Petição Inicial",
    custo_tokens: 2,
    template: (dados) => `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${dados.vara || '[VARA]'} DA COMARCA DE ${dados.comarca || '[COMARCA]'}

${dados.nomeAutor || '[NOME DO AUTOR]'}, ${dados.qualificacaoAutor || '[QUALIFICAÇÃO]'}, vem, respeitosamente, à presença de Vossa Excelência, por meio de seu advogado que esta subscreve, propor a presente

AÇÃO ${dados.tipoAcao || '[TIPO DA AÇÃO]'}

em face de ${dados.nomeReu || '[NOME DO RÉU]'}, ${dados.qualificacaoReu || '[QUALIFICAÇÃO]'}, pelos fatos e fundamentos jurídicos a seguir expostos:

I - DOS FATOS

${dados.fatos || '[NARRATIVA DOS FATOS]'}

II - DO DIREITO

${dados.fundamentacao || '[FUNDAMENTAÇÃO JURÍDICA]'}

III - DOS PEDIDOS

Diante do exposto, requer a Vossa Excelência:

a) A citação do(a) Requerido(a) para, querendo, apresentar contestação, sob pena de revelia;

b) ${dados.pedidos || '[PEDIDOS ESPECÍFICOS]'};

c) A condenação do(a) Requerido(a) ao pagamento das custas processuais e honorários advocatícios.

Dá-se à causa o valor de R$ ${dados.valorCausa || '[VALOR]'}.

Termos em que,
Pede deferimento.

${dados.cidade || '[CIDADE]'}, ${new Date().toLocaleDateString('pt-BR')}.

____________________________________
${dados.advogado || '[NOME DO ADVOGADO]'}
OAB/${dados.ufOab || 'XX'} ${dados.numeroOab || '[NÚMERO]'}
`
  },

  contestacao: {
    nome: "Contestação",
    custo_tokens: 2,
    template: (dados) => `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DA ${dados.vara || '[VARA]'} DA COMARCA DE ${dados.comarca || '[COMARCA]'}

Processo nº ${dados.numeroProcesso || '[NÚMERO DO PROCESSO]'}

${dados.nomeReu || '[NOME DO RÉU]'}, já qualificado(a) nos autos da ação em epígrafe, vem, respeitosamente, à presença de Vossa Excelência, por meio de seu advogado que esta subscreve, apresentar

CONTESTAÇÃO

em face da ação proposta por ${dados.nomeAutor || '[NOME DO AUTOR]'}, pelas razões de fato e de direito a seguir aduzidas:

I - PRELIMINARMENTE

${dados.preliminares || '[PRELIMINARES, SE HOUVER]'}

II - DO MÉRITO

${dados.merito || '[ARGUMENTAÇÃO DE MÉRITO]'}

III - DOS PEDIDOS

Diante do exposto, requer a Vossa Excelência:

a) O acolhimento das preliminares arguidas, com a extinção do processo sem resolução do mérito;

b) Subsidiariamente, a total improcedência dos pedidos formulados na inicial;

c) A condenação do(a) Autor(a) ao pagamento das custas processuais e honorários advocatícios.

Termos em que,
Pede deferimento.

${dados.cidade || '[CIDADE]'}, ${new Date().toLocaleDateString('pt-BR')}.

____________________________________
${dados.advogado || '[NOME DO ADVOGADO]'}
OAB/${dados.ufOab || 'XX'} ${dados.numeroOab || '[NÚMERO]'}
`
  },

  recurso: {
    nome: "Recurso (Apelação/Agravo)",
    custo_tokens: 2,
    template: (dados) => `
EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) DESEMBARGADOR(A) RELATOR(A) DO ${dados.tribunal || '[TRIBUNAL]'}

Processo nº ${dados.numeroProcesso || '[NÚMERO DO PROCESSO]'}

${dados.nomeRecorrente || '[NOME DO RECORRENTE]'}, já qualificado(a) nos autos em epígrafe, inconformado(a) com a r. decisão proferida, vem, respeitosamente, à presença de Vossa Excelência, por meio de seu advogado que esta subscreve, interpor

${dados.tipoRecurso || 'APELAÇÃO'}

nos termos dos artigos 1.009 e seguintes do CPC, pelas razões de fato e de direito a seguir expostas:

I - DO CABIMENTO

${dados.cabimento || '[FUNDAMENTAÇÃO DO CABIMENTO DO RECURSO]'}

II - DOS FATOS

${dados.fatos || '[RESUMO DOS FATOS RELEVANTES]'}

III - DO DIREITO

${dados.fundamentacao || '[FUNDAMENTAÇÃO JURÍDICA DO RECURSO]'}

IV - DOS PEDIDOS

Ante o exposto, requer a Vossa Excelência:

a) O conhecimento e provimento do presente recurso;

b) ${dados.pedidos || '[PEDIDOS ESPECÍFICOS]'};

c) A reforma da decisão recorrida.

Termos em que,
Pede deferimento.

${dados.cidade || '[CIDADE]'}, ${new Date().toLocaleDateString('pt-BR')}.

____________________________________
${dados.advogado || '[NOME DO ADVOGADO]'}
OAB/${dados.ufOab || 'XX'} ${dados.numeroOab || '[NÚMERO]'}
`
  },

  contrato: {
    nome: "Contrato",
    custo_tokens: 2,
    template: (dados) => `
CONTRATO DE ${dados.tipoContrato || '[TIPO DE CONTRATO]'}

Pelo presente instrumento particular, de um lado:

CONTRATANTE: ${dados.contratante || '[NOME DO CONTRATANTE]'}, ${dados.qualificacaoContratante || '[QUALIFICAÇÃO]'};

E de outro lado:

CONTRATADO: ${dados.contratado || '[NOME DO CONTRATADO]'}, ${dados.qualificacaoContratado || '[QUALIFICAÇÃO]'};

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de ${dados.tipoContrato || '[TIPO]'}, que se regerá pelas cláusulas seguintes:

CLÁUSULA PRIMEIRA – DO OBJETO

${dados.objeto || '[DESCRIÇÃO DO OBJETO DO CONTRATO]'}

CLÁUSULA SEGUNDA – DO VALOR E FORMA DE PAGAMENTO

${dados.valor || '[VALOR E CONDIÇÕES DE PAGAMENTO]'}

CLÁUSULA TERCEIRA – DAS OBRIGAÇÕES DAS PARTES

${dados.obrigacoes || '[OBRIGAÇÕES DE CADA PARTE]'}

CLÁUSULA QUARTA – DO PRAZO

${dados.prazo || '[PRAZO DE VIGÊNCIA DO CONTRATO]'}

CLÁUSULA QUINTA – DA RESCISÃO

${dados.rescisao || '[CONDIÇÕES DE RESCISÃO]'}

CLÁUSULA SEXTA – DO FORO

Fica eleito o foro da comarca de ${dados.foro || '[CIDADE]'} para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.

E, por estarem assim justos e contratados, firmam o presente instrumento em 02 (duas) vias de igual teor e forma, na presença das testemunhas abaixo.

${dados.cidade || '[CIDADE]'}, ${new Date().toLocaleDateString('pt-BR')}.

_____________________________          _____________________________
${dados.contratante || '[CONTRATANTE]'}          ${dados.contratado || '[CONTRATADO]'}

TESTEMUNHAS:

_____________________________          _____________________________
Nome: [TESTEMUNHA 1]                   Nome: [TESTEMUNHA 2]
CPF:                                   CPF:
`
  },

  procuracao: {
    nome: "Procuração",
    custo_tokens: 1,
    template: (dados) => `
PROCURAÇÃO

OUTORGANTE: ${dados.outorgante || '[NOME DO OUTORGANTE]'}, ${dados.qualificacao || '[QUALIFICAÇÃO COMPLETA]'}.

OUTORGADO: ${dados.outorgado || '[NOME DO ADVOGADO]'}, advogado(a), inscrito(a) na OAB/${dados.ufOab || 'XX'} sob o nº ${dados.numeroOab || '[NÚMERO]'}.

PODERES: O(A) OUTORGANTE confere ao(à) OUTORGADO(A) poderes para o foro em geral, com as cláusulas "ad judicia" e "extra judicia", podendo representá-lo(a) perante quaisquer Juízos, Instâncias ou Tribunais, em qualquer ação, processo ou procedimento, seja qual for a sua natureza, fase ou grau de jurisdição em que se encontre, conferindo-lhe, ainda, poderes especiais para ${dados.poderesEspeciais || 'confessar, transigir, desistir, firmar compromisso, receber e dar quitação, requerer, alegar, contestar, reconvir, variar, produzir provas, requerer o que for de direito, apresentar recursos ordinários e extraordinários, interpor embargos, renunciar ao direito em que se funda a ação, receber citação inicial, substabelescer com ou sem reservas, requerer levantamento de alvarás e praticar todos os demais atos necessários ao bom e fiel desempenho deste mandato'}.

${dados.cidade || '[CIDADE]'}, ${new Date().toLocaleDateString('pt-BR')}.

____________________________________
${dados.outorgante || '[OUTORGANTE]'}
`
  },

  declaracao: {
    nome: "Declaração",
    custo_tokens: 1,
    template: (dados) => `
DECLARAÇÃO

Eu, ${dados.declarante || '[NOME DO DECLARANTE]'}, ${dados.qualificacao || '[QUALIFICAÇÃO]'}, DECLARO para os devidos fins de direito que:

${dados.conteudo || '[CONTEÚDO DA DECLARAÇÃO]'}

Por ser expressão da verdade, firmo a presente declaração.

${dados.cidade || '[CIDADE]'}, ${new Date().toLocaleDateString('pt-BR')}.

____________________________________
${dados.declarante || '[DECLARANTE]'}
${dados.documentoDeclarante || '[CPF/RG]'}
`
  }
};

function gerarDocumento(tipo, dados) {
  const template = TEMPLATES_DOCUMENTOS[tipo];
  
  if (!template) {
    throw new Error(`Template '${tipo}' não encontrado`);
  }
  
  return {
    nome: template.nome,
    conteudo: template.template(dados),
    custoTokens: template.custo_tokens,
    dataGeracao: new Date().toISOString()
  };
}

function listarTemplates() {
  return Object.keys(TEMPLATES_DOCUMENTOS).map(key => ({
    id: key,
    nome: TEMPLATES_DOCUMENTOS[key].nome,
    custoTokens: TEMPLATES_DOCUMENTOS[key].custo_tokens
  }));
}

module.exports = {
  TEMPLATES_DOCUMENTOS,
  gerarDocumento,
  listarTemplates
};
