export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select';

export interface FormFieldDef {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
  section: 'cliente' | 'advogado' | 'processo' | 'partes' | 'conteudo' | 'especifico';
}

export const FORM_FIELDS: Record<string, FormFieldDef> = {
  cliente_nome: { id: 'cliente_nome', label: 'Nome completo', type: 'text', required: true, section: 'cliente', placeholder: 'João da Silva' },
  cliente_cpf: { id: 'cliente_cpf', label: 'CPF', type: 'text', section: 'cliente', placeholder: '000.000.000-00' },
  cliente_rg: { id: 'cliente_rg', label: 'RG', type: 'text', section: 'cliente', placeholder: '00.000.000-0' },
  cliente_endereco: { id: 'cliente_endereco', label: 'Endereço completo', type: 'text', section: 'cliente', placeholder: 'Rua, nº, bairro, cidade/UF' },
  cliente_estado_civil: { id: 'cliente_estado_civil', label: 'Estado civil', type: 'text', section: 'cliente', placeholder: 'Solteiro(a), casado(a)...' },
  cliente_profissao: { id: 'cliente_profissao', label: 'Profissão', type: 'text', section: 'cliente', placeholder: 'Advogado(a), autônomo(a)...' },
  cliente_email: { id: 'cliente_email', label: 'E-mail', type: 'text', section: 'cliente', placeholder: 'cliente@email.com' },
  cliente_telefone: { id: 'cliente_telefone', label: 'Telefone', type: 'text', section: 'cliente', placeholder: '(11) 99999-9999' },

  advogado_nome: { id: 'advogado_nome', label: 'Nome do advogado', type: 'text', section: 'advogado', placeholder: 'Dr. Carlos Advogado' },
  advogado_oab_uf: { id: 'advogado_oab_uf', label: 'OAB/UF', type: 'text', section: 'advogado', placeholder: 'SP' },
  advogado_oab_numero: { id: 'advogado_oab_numero', label: 'Nº OAB', type: 'text', section: 'advogado', placeholder: '123.456' },

  numero_processo: { id: 'numero_processo', label: 'Número do processo', type: 'text', section: 'processo', placeholder: '0000000-00.0000.0.00.0000' },
  comarca: { id: 'comarca', label: 'Comarca', type: 'text', section: 'processo', placeholder: 'São Paulo' },
  vara: { id: 'vara', label: 'Vara / Juízo', type: 'text', section: 'processo', placeholder: '1ª Vara Cível' },
  tribunal: { id: 'tribunal', label: 'Tribunal', type: 'text', section: 'processo', placeholder: 'TJSP, TRT-2, TRF-3...' },
  valor_causa: { id: 'valor_causa', label: 'Valor da causa', type: 'text', section: 'processo', placeholder: 'R$ 10.000,00' },

  parte_contraria: { id: 'parte_contraria', label: 'Parte contrária / Réu', type: 'text', section: 'partes', placeholder: 'Nome da pessoa ou empresa' },
  qualificacao_reu: { id: 'qualificacao_reu', label: 'Qualificação da parte contrária', type: 'textarea', rows: 2, section: 'partes', placeholder: 'CNPJ, endereço, representante legal...' },
  autoridade_coatora: { id: 'autoridade_coatora', label: 'Autoridade coatora', type: 'text', section: 'partes', placeholder: 'Nome e cargo da autoridade' },

  relato_fatos: { id: 'relato_fatos', label: 'Relato dos fatos', type: 'textarea', required: true, rows: 5, section: 'conteudo', placeholder: 'Descreva detalhadamente os fatos...' },
  pedidos: { id: 'pedidos', label: 'Pedidos', type: 'textarea', rows: 4, section: 'conteudo', placeholder: 'Liste os pedidos formulados...' },
  fundamentos_juridicos: { id: 'fundamentos_juridicos', label: 'Fundamentos jurídicos', type: 'textarea', rows: 4, section: 'conteudo', placeholder: 'Base legal, doutrina e jurisprudência...' },
  preliminares: { id: 'preliminares', label: 'Preliminares', type: 'textarea', rows: 3, section: 'conteudo', placeholder: 'Preliminares de contestação, se houver...' },
  provas: { id: 'provas', label: 'Provas / Documentos', type: 'textarea', rows: 3, section: 'conteudo', placeholder: 'Documentos, testemunhas, perícias...' },
  decisao_recorrida: { id: 'decisao_recorrida', label: 'Decisão recorrida', type: 'textarea', rows: 3, section: 'conteudo', placeholder: 'Transcreva ou resuma a decisão impugnada...' },
  pedido_liminar: { id: 'pedido_liminar', label: 'Pedido liminar / tutela', type: 'textarea', rows: 3, section: 'conteudo', placeholder: 'Urgência, fumus boni iuris, periculum in mora...' },

  tipo_acao: { id: 'tipo_acao', label: 'Tipo da ação / peça', type: 'text', section: 'especifico', placeholder: 'Ex.: INDENIZATÓRIA POR DANOS MORAIS' },
  titulo_executivo: { id: 'titulo_executivo', label: 'Título executivo', type: 'textarea', rows: 2, section: 'especifico', placeholder: 'Cheque, nota promissória, contrato, sentença...' },
  valor_execucao: { id: 'valor_execucao', label: 'Valor da execução / débito', type: 'text', section: 'especifico', placeholder: 'R$ 0,00' },
  calculo_execucao: { id: 'calculo_execucao', label: 'Memória de cálculo', type: 'textarea', rows: 4, section: 'especifico', placeholder: 'Principal, juros, multa, honorários...' },

  data_admissao: { id: 'data_admissao', label: 'Data de admissão', type: 'date', section: 'especifico' },
  data_demissao: { id: 'data_demissao', label: 'Data de demissão / rescisão', type: 'date', section: 'especifico' },
  cargo: { id: 'cargo', label: 'Cargo / função', type: 'text', section: 'especifico', placeholder: 'Analista, operador...' },
  salario: { id: 'salario', label: 'Último salário', type: 'text', section: 'especifico', placeholder: 'R$ 0,00' },
  jornada: { id: 'jornada', label: 'Jornada de trabalho', type: 'text', section: 'especifico', placeholder: '8h/dia, escala 12x36...' },
  verbas_pleiteadas: { id: 'verbas_pleiteadas', label: 'Verbas pleiteadas', type: 'textarea', rows: 4, section: 'especifico', placeholder: 'Horas extras, FGTS, aviso prévio...' },

  nb_beneficio: { id: 'nb_beneficio', label: 'Nº do benefício (NB)', type: 'text', section: 'especifico', placeholder: '000.000.000-0' },
  tipo_beneficio: { id: 'tipo_beneficio', label: 'Tipo de benefício', type: 'text', section: 'especifico', placeholder: 'Aposentadoria, BPC, auxílio-doença...' },
  data_der: { id: 'data_der', label: 'DER (data de entrada do requerimento)', type: 'date', section: 'especifico' },
  cid_deficiencia: { id: 'cid_deficiencia', label: 'CID / deficiência (se aplicável)', type: 'text', section: 'especifico', placeholder: 'CID F84.0' },
  renda_familiar: { id: 'renda_familiar', label: 'Renda familiar per capita', type: 'text', section: 'especifico', placeholder: 'R$ 0,00' },
  tempo_contribuicao: { id: 'tempo_contribuicao', label: 'Tempo de contribuição', type: 'text', section: 'especifico', placeholder: '35 anos, 15 anos de carência...' },

  data_casamento: { id: 'data_casamento', label: 'Data do casamento', type: 'date', section: 'especifico' },
  regime_bens: { id: 'regime_bens', label: 'Regime de bens', type: 'text', section: 'especifico', placeholder: 'Comunhão parcial, separação total...' },
  filhos: { id: 'filhos', label: 'Filhos (nomes e idades)', type: 'textarea', rows: 2, section: 'especifico', placeholder: 'Maria, 8 anos; Pedro, 5 anos' },
  acordo_familia: { id: 'acordo_familia', label: 'Acordo (guarda, visitas, alimentos, bens)', type: 'textarea', rows: 5, section: 'especifico', placeholder: 'Termos do acordo entre as partes...' },
  valor_alimentos: { id: 'valor_alimentos', label: 'Valor dos alimentos', type: 'text', section: 'especifico', placeholder: 'R$ 0,00 (30% do salário mínimo...)' },
  inventariante: { id: 'inventariante', label: 'Inventariante nomeado', type: 'text', section: 'especifico', placeholder: 'Nome do inventariante' },
  bens_heranca: { id: 'bens_heranca', label: 'Bens do espólio', type: 'textarea', rows: 4, section: 'especifico', placeholder: 'Imóveis, contas, veículos...' },
  falecido_nome: { id: 'falecido_nome', label: 'Nome do falecido(a)', type: 'text', section: 'especifico', placeholder: 'Nome completo do de cujus' },
  data_obito: { id: 'data_obito', label: 'Data do óbito', type: 'date', section: 'especifico' },

  empresa_reu: { id: 'empresa_reu', label: 'Empresa / fornecedor réu', type: 'text', section: 'especifico', placeholder: 'Banco X, Operadora Y...' },
  contrato_consumo: { id: 'contrato_consumo', label: 'Contrato / produto / serviço', type: 'textarea', rows: 3, section: 'especifico', placeholder: 'Cartão, plano, voo, produto defeituoso...' },
  dano_consumidor: { id: 'dano_consumidor', label: 'Dano sofrido', type: 'textarea', rows: 3, section: 'especifico', placeholder: 'Negativação, cobrança indevida, atraso...' },

  imovel_endereco: { id: 'imovel_endereco', label: 'Endereço do imóvel', type: 'text', section: 'especifico', placeholder: 'Rua, nº, matrícula...' },
  matricula_imovel: { id: 'matricula_imovel', label: 'Matrícula do imóvel', type: 'text', section: 'especifico', placeholder: 'Registro de imóveis' },
  valor_aluguel: { id: 'valor_aluguel', label: 'Valor do aluguel / débito', type: 'text', section: 'especifico', placeholder: 'R$ 0,00' },
  tempo_posse: { id: 'tempo_posse', label: 'Tempo de posse / usucapião', type: 'text', section: 'especifico', placeholder: '15 anos de posse mansa e pacífica' },

  paciente_nome: { id: 'paciente_nome', label: 'Nome do paciente / réu', type: 'text', section: 'especifico', placeholder: 'Nome do paciente' },
  tipo_prisao: { id: 'tipo_prisao', label: 'Tipo de constrangimento', type: 'text', section: 'especifico', placeholder: 'Prisão preventiva, flagrante...' },
  artigo_imputado: { id: 'artigo_imputado', label: 'Artigo / imputação', type: 'text', section: 'especifico', placeholder: 'Art. 155 CP' },

  outorgante: { id: 'outorgante', label: 'Outorgante', type: 'text', section: 'especifico', placeholder: 'Nome do outorgante' },
  outorgado: { id: 'outorgado', label: 'Outorgado (advogado)', type: 'text', section: 'especifico', placeholder: 'Nome do advogado outorgado' },
  poderes_especiais: { id: 'poderes_especiais', label: 'Poderes especiais', type: 'textarea', rows: 4, section: 'especifico', placeholder: 'Confessar, transigir, desistir, receber...' },
  substabelecente: { id: 'substabelecente', label: 'Substabelecente', type: 'text', section: 'especifico', placeholder: 'Advogado que substabelece' },
  substabelecido: { id: 'substabelecido', label: 'Substabelecido', type: 'text', section: 'especifico', placeholder: 'Advogado substabelecido' },
  reservas_poderes: { id: 'reservas_poderes', label: 'Reserva de poderes', type: 'select', section: 'especifico', options: [{ value: 'com_reserva', label: 'Com reserva de iguais poderes' }, { value: 'sem_reserva', label: 'Sem reserva de poderes' }] },

  objeto_contrato: { id: 'objeto_contrato', label: 'Objeto do contrato', type: 'textarea', rows: 3, section: 'especifico', placeholder: 'Prestação de serviços, honorários...' },
  valor_contrato: { id: 'valor_contrato', label: 'Valor / honorários', type: 'text', section: 'especifico', placeholder: 'R$ fixo ou % êxito' },
  prazo_contrato: { id: 'prazo_contrato', label: 'Prazo / vigência', type: 'text', section: 'especifico', placeholder: '12 meses, até trânsito em julgado...' },
  clausulas_contrato: { id: 'clausulas_contrato', label: 'Cláusulas principais', type: 'textarea', rows: 4, section: 'especifico', placeholder: 'Obrigações, rescisão, foro...' },

  prazo_notificacao: { id: 'prazo_notificacao', label: 'Prazo para cumprimento', type: 'text', section: 'especifico', placeholder: '15 dias' },
  orgao_administrativo: { id: 'orgao_administrativo', label: 'Órgão administrativo', type: 'text', section: 'especifico', placeholder: 'INSS, Prefeitura, Detran...' },
  assunto_parecer: { id: 'assunto_parecer', label: 'Assunto do parecer', type: 'text', section: 'especifico', placeholder: 'Consulta sobre...' },
  conclusao_parecer: { id: 'conclusao_parecer', label: 'Conclusão desejada / consulta', type: 'textarea', rows: 3, section: 'especifico', placeholder: 'Qual a orientação jurídica buscada?' },

  socios: { id: 'socios', label: 'Sócios / quotistas', type: 'textarea', rows: 3, section: 'especifico', placeholder: 'Nome, CPF, participação...' },
  capital_social: { id: 'capital_social', label: 'Capital social', type: 'text', section: 'especifico', placeholder: 'R$ 0,00' },
  objeto_social: { id: 'objeto_social', label: 'Objeto social', type: 'textarea', rows: 3, section: 'especifico', placeholder: 'Atividade da empresa...' },
};

export const SECTION_LABELS: Record<FormFieldDef['section'], string> = {
  cliente: 'Dados do Cliente / Autor',
  advogado: 'Dados do Advogado',
  processo: 'Dados do Processo',
  partes: 'Partes Envolvidas',
  conteudo: 'Conteúdo Jurídico',
  especifico: 'Informações Específicas',
};

export const SECTION_ICONS = {
  cliente: 'Users',
  advogado: 'Briefcase',
  processo: 'Scale',
  partes: 'Users',
  conteudo: 'FileText',
  especifico: 'ClipboardList',
} as const;
