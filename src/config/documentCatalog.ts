import {
  FileText, Shield, Scale, Briefcase, Users, Mail, BookOpen, Gavel, ScrollText,
  Handshake, FileSignature, Zap, Building, Home, ClipboardList, FileMinus,
  Landmark, Heart, Baby, Wallet, Plane, ShoppingCart, Key, Hammer, Lock,
  type LucideIcon,
} from 'lucide-react';

export type DocumentCategory =
  | 'civil' | 'execucao' | 'trabalhista' | 'previdenciario' | 'familia'
  | 'consumidor' | 'empresarial' | 'imobiliario' | 'penal' | 'extrajudicial'
  | 'administrativo' | 'contratos';

export interface DocumentCatalogEntry {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tokens: number;
  agent: string;
  category: DocumentCategory;
  structure: string;
  fields: string[];
  fieldOverrides?: Record<string, Partial<{ label: string; placeholder: string; required: boolean }>>;
  defaultTipoAcao?: string;
}

function doc(
  id: string, name: string, category: DocumentCategory, structure: string,
  agent: string, fields: string[], description: string, tokens = 2,
  icon: LucideIcon = FileText, extras?: Partial<DocumentCatalogEntry>,
): DocumentCatalogEntry {
  return { id, name, description, icon, tokens, agent, category, structure, fields, ...extras };
}

const CIVIL_INICIAL = ['cliente_nome','cliente_cpf','cliente_rg','cliente_endereco','cliente_estado_civil','cliente_profissao','advogado_nome','advogado_oab_uf','advogado_oab_numero','comarca','vara','valor_causa','parte_contraria','qualificacao_reu','tipo_acao','relato_fatos','fundamentos_juridicos','pedidos','provas'];
const CIVIL_RESPOSTA = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','numero_processo','comarca','vara','parte_contraria','preliminares','relato_fatos','fundamentos_juridicos','pedidos'];
const CIVIL_RECURSO = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','numero_processo','tribunal','comarca','decisao_recorrida','relato_fatos','fundamentos_juridicos','pedidos'];
const TRAB_INICIAL = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','comarca','vara','valor_causa','parte_contraria','qualificacao_reu','data_admissao','data_demissao','cargo','salario','jornada','relato_fatos','verbas_pleiteadas','fundamentos_juridicos','pedidos'];
const TRAB_RESPOSTA = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','numero_processo','comarca','vara','parte_contraria','preliminares','relato_fatos','fundamentos_juridicos','pedidos'];
const PREV_INICIAL = ['cliente_nome','cliente_cpf','cliente_endereco','cliente_profissao','advogado_nome','advogado_oab_uf','advogado_oab_numero','comarca','vara','tipo_beneficio','nb_beneficio','data_der','tempo_contribuicao','cid_deficiencia','renda_familiar','relato_fatos','fundamentos_juridicos','pedidos','provas'];
const FAMILIA = ['cliente_nome','cliente_cpf','cliente_endereco','cliente_estado_civil','advogado_nome','advogado_oab_uf','advogado_oab_numero','comarca','vara','parte_contraria','qualificacao_reu','data_casamento','regime_bens','filhos','acordo_familia','valor_alimentos','relato_fatos','fundamentos_juridicos','pedidos'];
const CONSUMIDOR = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','comarca','vara','valor_causa','empresa_reu','parte_contraria','contrato_consumo','dano_consumidor','relato_fatos','fundamentos_juridicos','pedidos','provas'];
const EXECUCAO = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','numero_processo','comarca','vara','parte_contraria','titulo_executivo','valor_execucao','calculo_execucao','relato_fatos','fundamentos_juridicos','pedidos'];
const IMOBILIARIO = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','comarca','vara','valor_causa','parte_contraria','imovel_endereco','matricula_imovel','valor_aluguel','tempo_posse','relato_fatos','fundamentos_juridicos','pedidos'];
const PENAL = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','tribunal','comarca','vara','numero_processo','paciente_nome','autoridade_coatora','tipo_prisao','artigo_imputado','relato_fatos','fundamentos_juridicos','pedidos'];
const EXTRAJUD = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','parte_contraria','comarca','relato_fatos','fundamentos_juridicos','pedidos'];
const CONTRATO = ['cliente_nome','cliente_cpf','cliente_endereco','parte_contraria','qualificacao_reu','comarca','objeto_contrato','valor_contrato','prazo_contrato','clausulas_contrato','relato_fatos','pedidos'];
const ADMIN = ['cliente_nome','cliente_cpf','cliente_endereco','advogado_nome','advogado_oab_uf','advogado_oab_numero','orgao_administrativo','comarca','relato_fatos','fundamentos_juridicos','pedidos','provas'];

export const DOCUMENT_CATEGORIES: { id: DocumentCategory | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' }, { id: 'civil', label: 'Cível' }, { id: 'execucao', label: 'Execução' },
  { id: 'trabalhista', label: 'Trabalhista' }, { id: 'previdenciario', label: 'Previdenciário' },
  { id: 'familia', label: 'Família' }, { id: 'consumidor', label: 'Consumidor' },
  { id: 'empresarial', label: 'Empresarial' }, { id: 'imobiliario', label: 'Imobiliário' },
  { id: 'penal', label: 'Penal' }, { id: 'extrajudicial', label: 'Extrajudicial' },
  { id: 'administrativo', label: 'Administrativo' }, { id: 'contratos', label: 'Contratos' },
];

export const DOCUMENT_CATALOG: DocumentCatalogEntry[] = [
  doc('peticao_inicial','Petição Inicial Cível','civil','peticao_inicial','Dra. Civil AI',CIVIL_INICIAL,'Peça inaugural para ações cíveis',2,FileText,{defaultTipoAcao:'CÍVEL'}),
  doc('contestacao','Contestação','civil','contestacao','Dra. Civil AI',CIVIL_RESPOSTA,'Resposta do réu à petição inicial',2,Shield),
  doc('replica','Réplica à Contestação','civil','replica','Dra. Civil AI',[...CIVIL_RESPOSTA.filter(f=>f!=='preliminares')],'Impugnação à contestação',2,FileText),
  doc('reconvencao','Reconvenção','civil','reconvencao','Dra. Civil AI',CIVIL_INICIAL,'Pedido contraposto pelo réu',2,FileText,{defaultTipoAcao:'RECONVENÇÃO'}),
  doc('impugnacao','Impugnação','civil','impugnacao','Dra. Civil AI',CIVIL_RESPOSTA,'Impugnação a atos processuais',2,Shield),
  doc('agravo_instrumento','Agravo de Instrumento','civil','agravo_instrumento','Dra. Civil AI',[...CIVIL_RECURSO,'pedido_liminar'],'Recurso contra decisão interlocutória',2,Scale),
  doc('agravo_interno','Agravo Interno','civil','agravo_interno','Dra. Civil AI',CIVIL_RECURSO,'Recurso contra decisão monocrática',2,Scale),
  doc('recurso','Apelação Cível','civil','recurso_apelacao','Dra. Civil AI',CIVIL_RECURSO,'Recurso contra sentença',2,Scale),
  doc('embargos_declaracao','Embargos de Declaração','civil','embargos_declaracao','Dra. Civil AI',['cliente_nome','advogado_nome','advogado_oab_uf','advogado_oab_numero','numero_processo','comarca','vara','decisao_recorrida','relato_fatos','fundamentos_juridicos','pedidos'],'Correção de omissão/contradição',1,ScrollText),
  doc('acao_cobranca','Ação de Cobrança','civil','peticao_inicial','Dra. Civil AI',CIVIL_INICIAL,'Cobrança de dívida',2,Wallet,{defaultTipoAcao:'DE COBRANÇA'}),
  doc('acao_monitoria','Ação Monitória','civil','peticao_inicial','Dra. Civil AI',[...CIVIL_INICIAL,'titulo_executivo'],'Procedimento monitório',2,FileText,{defaultTipoAcao:'MONITÓRIA'}),
  doc('acao_danos_morais','Danos Morais','civil','peticao_inicial','Dra. Civil AI',CIVIL_INICIAL,'Indenização por dano moral',2,Heart,{defaultTipoAcao:'INDENIZATÓRIA POR DANOS MORAIS'}),
  doc('acao_danos_materiais','Danos Materiais','civil','peticao_inicial','Dra. Civil AI',CIVIL_INICIAL,'Indenização por dano material',2,Wallet,{defaultTipoAcao:'INDENIZATÓRIA POR DANOS MATERIAIS'}),
  doc('acao_obrigacao_fazer','Obrigação de Fazer','civil','peticao_inicial','Dra. Civil AI',[...CIVIL_INICIAL,'pedido_liminar'],'Obrigar parte a realizar ato',2,Hammer,{defaultTipoAcao:'DE OBRIGAÇÃO DE FAZER'}),
  doc('tutela_antecipada','Tutela de Urgência','civil','tutela_antecipada','Dra. Civil AI',[...CIVIL_INICIAL,'pedido_liminar'],'Tutela antecipada ou de urgência',2,Zap),
  doc('mandado_seguranca','Mandado de Segurança','civil','mandado_seguranca','Dra. Civil AI',[...CIVIL_INICIAL,'autoridade_coatora','pedido_liminar'],'Proteção contra ato ilegal',2,Gavel),
  doc('cumprimento_sentenca','Cumprimento de Sentença','execucao','cumprimento_sentenca','Dra. Civil AI',EXECUCAO,'Execução de sentença',2,Scale),
  doc('execucao_titulo_extrajudicial','Execução de Título Extrajudicial','execucao','execucao_titulo','Dra. Civil AI',EXECUCAO,'Execução de título executivo',2,FileSignature),
  doc('impugnacao_cumprimento','Impugnação ao Cumprimento','execucao','impugnacao_cumprimento','Dra. Civil AI',EXECUCAO,'Defesa na fase de cumprimento',2,Shield),
  doc('reclamacao_trabalhista','Reclamação Trabalhista','trabalhista','reclamacao_trabalhista','Dr. Trabalhista AI',TRAB_INICIAL,'Ação trabalhista',2,Building),
  doc('contestacao_trabalhista','Contestação Trabalhista','trabalhista','contestacao_trabalhista','Dr. Trabalhista AI',TRAB_RESPOSTA,'Defesa do reclamado',2,Shield),
  doc('replica_trabalhista','Réplica Trabalhista','trabalhista','replica_trabalhista','Dr. Trabalhista AI',TRAB_RESPOSTA,'Réplica trabalhista',2,FileText),
  doc('calculos_trabalhistas','Cálculos Trabalhistas','trabalhista','calculos_trabalhistas','Dr. Trabalhista AI',['cliente_nome','numero_processo','comarca','vara','data_admissao','data_demissao','salario','verbas_pleiteadas','calculo_execucao','relato_fatos','pedidos'],'Memória de cálculo',2,ClipboardList),
  doc('recurso_ordinario','Recurso Ordinário','trabalhista','recurso_ordinario','Dr. Trabalhista AI',CIVIL_RECURSO,'Recurso trabalhista',2,Scale),
  doc('agravo_peticao','Agravo de Petição','trabalhista','agravo_peticao','Dr. Trabalhista AI',[...CIVIL_RECURSO,'calculo_execucao'],'Recurso na execução trabalhista',2,Scale),
  doc('embargos_execucao','Embargos à Execução','trabalhista','embargos_execucao','Dr. Trabalhista AI',EXECUCAO,'Embargos do executado',2,Shield),
  doc('pedido_horas_extras','Pedido de Horas Extras','trabalhista','reclamacao_trabalhista','Dr. Trabalhista AI',TRAB_INICIAL,'Horas extras e reflexos',2,Building,{defaultTipoAcao:'HORAS EXTRAS'}),
  doc('rescisao_indireta','Rescisão Indireta','trabalhista','reclamacao_trabalhista','Dr. Trabalhista AI',TRAB_INICIAL,'Rescisão indireta',2,Building,{defaultTipoAcao:'RESCISÃO INDIRETA'}),
  doc('acidente_trabalho','Acidente de Trabalho','trabalhista','reclamacao_trabalhista','Dr. Trabalhista AI',[...TRAB_INICIAL,'cid_deficiencia'],'Acidente/doença ocupacional',2,Building,{defaultTipoAcao:'ACIDENTE DE TRABALHO'}),
  doc('carta_preposicao','Carta de Preposição','trabalhista','carta_preposicao','Dr. Trabalhista AI',['parte_contraria','numero_processo','comarca','vara','pedidos','relato_fatos'],'Preposto em audiência',1,Users),
  doc('aposentadoria_idade','Aposentadoria por Idade','previdenciario','previdenciario_inicial','Dra. Civil AI',PREV_INICIAL,'Aposentadoria por idade',2,Landmark,{defaultTipoAcao:'APOSENTADORIA POR IDADE'}),
  doc('aposentadoria_invalidez','Aposentadoria por Invalidez','previdenciario','previdenciario_inicial','Dra. Civil AI',PREV_INICIAL,'Aposentadoria por invalidez',2,Landmark,{defaultTipoAcao:'APOSENTADORIA POR INVALIDEZ'}),
  doc('auxilio_doenca','Auxílio-Doença','previdenciario','previdenciario_inicial','Dra. Civil AI',PREV_INICIAL,'Benefício por incapacidade temporária',2,Landmark,{defaultTipoAcao:'AUXÍLIO-DOENÇA'}),
  doc('bpc_loas','BPC/LOAS','previdenciario','previdenciario_inicial','Dra. Civil AI',PREV_INICIAL,'Benefício assistencial',2,Heart,{defaultTipoAcao:'BPC/LOAS'}),
  doc('pensao_morte','Pensão por Morte','previdenciario','previdenciario_inicial','Dra. Civil AI',[...PREV_INICIAL,'falecido_nome','data_obito'],'Pensão por morte',2,Landmark,{defaultTipoAcao:'PENSÃO POR MORTE'}),
  doc('revisao_beneficio','Revisão de Benefício','previdenciario','previdenciario_inicial','Dra. Civil AI',PREV_INICIAL,'Revisão previdenciária',2,ScrollText,{defaultTipoAcao:'REVISÃO DE BENEFÍCIO'}),
  doc('recurso_administrativo_inss','Recurso Administrativo INSS','previdenciario','recurso_administrativo','Dra. Civil AI',[...ADMIN,'nb_beneficio','tipo_beneficio'],'Recurso contra INSS',2,Landmark),
  doc('mandado_seguranca_previdenciario','MS Previdenciário','previdenciario','mandado_seguranca','Dra. Civil AI',[...PREV_INICIAL,'autoridade_coatora','pedido_liminar'],'MS contra INSS',2,Gavel),
  doc('divorcio_consensual','Divórcio Consensual','familia','familia_peticao','Dra. Família AI',FAMILIA,'Divórcio amigável',2,Home),
  doc('divorcio_litigioso','Divórcio Litigioso','familia','familia_peticao','Dra. Família AI',FAMILIA,'Divórcio contencioso',2,Home,{defaultTipoAcao:'DIVÓRCIO LITIGIOSO'}),
  doc('guarda_compartilhada','Guarda Compartilhada','familia','familia_peticao','Dra. Família AI',FAMILIA,'Guarda compartilhada',2,Baby,{defaultTipoAcao:'GUARDA COMPARTILHADA'}),
  doc('regulamentacao_visitas','Regulamentação de Visitas','familia','familia_peticao','Dra. Família AI',FAMILIA,'Regulamentação de visitas',2,Baby,{defaultTipoAcao:'REGULAMENTAÇÃO DE VISITAS'}),
  doc('pensao_alimenticia','Pensão Alimentícia','familia','familia_peticao','Dra. Família AI',FAMILIA,'Fixação de alimentos',2,Heart,{defaultTipoAcao:'ALIMENTOS'}),
  doc('revisional_alimentos','Revisional de Alimentos','familia','familia_peticao','Dra. Família AI',FAMILIA,'Revisão de alimentos',2,Heart,{defaultTipoAcao:'REVISIONAL DE ALIMENTOS'}),
  doc('exoneracao_alimentos','Exoneração de Alimentos','familia','familia_peticao','Dra. Família AI',FAMILIA,'Exoneração de alimentos',2,Heart,{defaultTipoAcao:'EXONERAÇÃO DE ALIMENTOS'}),
  doc('inventario','Inventário','familia','familia_peticao','Dra. Família AI',[...FAMILIA,'falecido_nome','data_obito','inventariante','bens_heranca'],'Inventário judicial',2,ClipboardList,{defaultTipoAcao:'INVENTÁRIO'}),
  doc('arrolamento','Arrolamento','familia','familia_peticao','Dra. Família AI',[...FAMILIA,'falecido_nome','data_obito','bens_heranca'],'Arrolamento sumário',2,ClipboardList,{defaultTipoAcao:'ARROLAMENTO'}),
  doc('uniao_estavel','União Estável','familia','familia_peticao','Dra. Família AI',FAMILIA,'Reconhecimento de união estável',2,Heart,{defaultTipoAcao:'UNIÃO ESTÁVEL'}),
  doc('dissolucao_uniao_estavel','Dissolução de União Estável','familia','familia_peticao','Dra. Família AI',FAMILIA,'Dissolução de união estável',2,Heart,{defaultTipoAcao:'DISSOLUÇÃO DE UNIÃO ESTÁVEL'}),
  doc('interdicao','Interdição','familia','familia_peticao','Dra. Família AI',[...FAMILIA,'cid_deficiencia'],'Ação de interdição',2,Lock,{defaultTipoAcao:'INTERDIÇÃO'}),
  doc('curatela','Curatela','familia','familia_peticao','Dra. Família AI',FAMILIA,'Curatela',2,Lock,{defaultTipoAcao:'CURATELA'}),
  doc('acao_contra_banco','Ação contra Banco','consumidor','consumidor_inicial','Dra. Civil AI',CONSUMIDOR,'Ação contra banco',2,Wallet,{defaultTipoAcao:'CONTRA BANCO'}),
  doc('acao_contra_telefonia','Ação contra Telefonia','consumidor','consumidor_inicial','Dra. Civil AI',CONSUMIDOR,'Ação contra operadora',2,ShoppingCart,{defaultTipoAcao:'CONTRA TELEFONIA'}),
  doc('acao_contra_companhia_aerea','Ação contra Companhia Aérea','consumidor','consumidor_inicial','Dra. Civil AI',CONSUMIDOR,'Atraso, cancelamento, bagagem',2,Plane,{defaultTipoAcao:'CONTRA COMPANHIA AÉREA'}),
  doc('negativacao_indevida','Negativação Indevida','consumidor','consumidor_inicial','Dra. Civil AI',CONSUMIDOR,'Exclusão e danos morais',2,Shield,{defaultTipoAcao:'NEGATIVAÇÃO INDEVIDA'}),
  doc('cobranca_indevida','Cobrança Indevida','consumidor','consumidor_inicial','Dra. Civil AI',CONSUMIDOR,'Repetição de indébito',2,Wallet,{defaultTipoAcao:'COBRANÇA INDEVIDA'}),
  doc('vicio_produto','Vício do Produto','consumidor','consumidor_inicial','Dra. Civil AI',CONSUMIDOR,'Defeito em produto',2,ShoppingCart,{defaultTipoAcao:'VÍCIO DO PRODUTO'}),
  doc('vicio_servico','Vício do Serviço','consumidor','consumidor_inicial','Dra. Civil AI',CONSUMIDOR,'Defeito em serviço',2,ShoppingCart,{defaultTipoAcao:'VÍCIO DO SERVIÇO'}),
  doc('danos_morais_consumidor','Danos Morais ao Consumidor','consumidor','consumidor_inicial','Dra. Civil AI',CONSUMIDOR,'Dano moral CDC',2,Heart,{defaultTipoAcao:'DANOS MORAIS — CDC'}),
  doc('recurso_inominado','Recurso Inominado (JEC)','consumidor','recurso_inominado','Dra. Civil AI',CIVIL_RECURSO,'Recurso JEC',2,Scale),
  doc('contrato_social','Contrato Social','empresarial','contrato_social','Dr. Empresarial AI',[...CONTRATO,'socios','capital_social','objeto_social'],'Constituição de sociedade',2,Briefcase),
  doc('alteracao_contratual','Alteração Contratual','empresarial','alteracao_contratual','Dr. Empresarial AI',[...CONTRATO,'socios','capital_social'],'Alteração societária',2,Briefcase),
  doc('distrato_social','Distrato Social','empresarial','distrato_social','Dr. Empresarial AI',[...CONTRATO,'socios'],'Extinção de sociedade',2,FileMinus),
  doc('recuperacao_judicial','Recuperação Judicial','empresarial','recuperacao_judicial','Dr. Empresarial AI',[...CIVIL_INICIAL,'calculo_execucao'],'Recuperação judicial',2,Briefcase,{defaultTipoAcao:'RECUPERAÇÃO JUDICIAL'}),
  doc('cobranca_empresarial','Cobrança Empresarial','empresarial','peticao_inicial','Dr. Empresarial AI',CIVIL_INICIAL,'Cobrança B2B',2,Wallet,{defaultTipoAcao:'COBRANÇA EMPRESARIAL'}),
  doc('execucao_empresarial','Execução Empresarial','empresarial','execucao_titulo','Dr. Empresarial AI',EXECUCAO,'Execução empresarial',2,Scale),
  doc('usucapiao','Usucapião','imobiliario','imobiliario_inicial','Dra. Civil AI',IMOBILIARIO,'Usucapião de imóvel',2,Key,{defaultTipoAcao:'USUCAPIÃO'}),
  doc('despejo','Despejo','imobiliario','imobiliario_inicial','Dra. Civil AI',IMOBILIARIO,'Ação de despejo',2,Home,{defaultTipoAcao:'DESPEJO'}),
  doc('cobranca_aluguel','Cobrança de Aluguel','imobiliario','imobiliario_inicial','Dra. Civil AI',IMOBILIARIO,'Cobrança de aluguéis',2,Wallet,{defaultTipoAcao:'COBRANÇA DE ALUGUEL'}),
  doc('acao_possessoria','Ação Possessória','imobiliario','imobiliario_inicial','Dra. Civil AI',IMOBILIARIO,'Proteção possessória',2,Key,{defaultTipoAcao:'POSSESSÓRIA'}),
  doc('reintegracao_posse','Reintegração de Posse','imobiliario','imobiliario_inicial','Dra. Civil AI',IMOBILIARIO,'Reintegração de posse',2,Key,{defaultTipoAcao:'REINTEGRAÇÃO DE POSSE'}),
  doc('imissao_posse','Imissão na Posse','imobiliario','imobiliario_inicial','Dra. Civil AI',IMOBILIARIO,'Imissão na posse',2,Key,{defaultTipoAcao:'IMISSÃO NA POSSE'}),
  doc('adjudicacao_compulsoria','Adjudicação Compulsória','imobiliario','imobiliario_inicial','Dra. Civil AI',IMOBILIARIO,'Adjudicação compulsória',2,Key,{defaultTipoAcao:'ADJUDICAÇÃO COMPULSÓRIA'}),
  doc('habeas_corpus','Habeas Corpus','penal','habeas_corpus','Dr. Penal AI',PENAL,'Liberdade de locomoção',2,Shield),
  doc('liberacao_provisoria','Liberdade Provisória','penal','liberacao_provisoria','Dr. Penal AI',PENAL,'Liberação provisória',2,Lock),
  doc('revogacao_prisao_preventiva','Revogação de Prisão Preventiva','penal','revogacao_prisao','Dr. Penal AI',PENAL,'Revogação de prisão',2,Lock),
  doc('resposta_acusacao','Resposta à Acusação','penal','resposta_acusacao','Dr. Penal AI',PENAL,'Defesa preliminar penal',2,Shield),
  doc('memorial','Memoriais / Alegações Finais','penal','memorial','Dr. Penal AI',[...CIVIL_RESPOSTA,'provas'],'Alegações finais',2,ClipboardList),
  doc('recurso_sentido_estrito','Recurso em Sentido Estrito','penal','recurso_sentido_estrito','Dr. Penal AI',CIVIL_RECURSO,'RSE penal',2,Scale),
  doc('apelacao_criminal','Apelação Criminal','penal','apelacao_criminal','Dr. Penal AI',CIVIL_RECURSO,'Apelação criminal',2,Scale),
  doc('procuracao','Procuração Ad Judicia','extrajudicial','procuracao','Dra. Civil AI',['cliente_nome','cliente_cpf','cliente_endereco','cliente_rg','outorgante','outorgado','advogado_nome','advogado_oab_uf','advogado_oab_numero','poderes_especiais','comarca'],'Procuração judicial',1,Users),
  doc('procuracao_poderes_especiais','Procuração c/ Poderes Especiais','extrajudicial','procuracao','Dra. Civil AI',['cliente_nome','cliente_cpf','cliente_endereco','outorgante','outorgado','advogado_nome','advogado_oab_uf','advogado_oab_numero','poderes_especiais','comarca'],'Procuração especial',1,Users),
  doc('substabelecimento','Substabelecimento','extrajudicial','substabelecimento','Dra. Civil AI',['substabelecente','substabelecido','advogado_oab_uf','advogado_oab_numero','numero_processo','poderes_especiais','reservas_poderes','comarca'],'Substabelecimento de poderes',1,Users),
  doc('notificacao_extrajudicial','Notificação Extrajudicial','extrajudicial','notificacao_extrajudicial','Dra. Civil AI',[...EXTRAJUD,'prazo_notificacao'],'Notificação pré-processual',2,Mail),
  doc('parecer_juridico','Parecer Jurídico','extrajudicial','parecer_juridico','Dr. Empresarial AI',['cliente_nome','advogado_nome','advogado_oab_uf','advogado_oab_numero','assunto_parecer','relato_fatos','fundamentos_juridicos','conclusao_parecer'],'Parecer técnico',2,BookOpen),
  doc('declaracao','Declaração','extrajudicial','declaracao','Dra. Civil AI',['cliente_nome','cliente_cpf','cliente_endereco','relato_fatos','comarca'],'Declaração genérica',1,FileText),
  doc('contrato','Contrato de Prestação de Serviços','contratos','contrato','Dr. Empresarial AI',CONTRATO,'Contrato de serviços',2,Briefcase),
  doc('contrato_honorarios','Contrato de Honorários','contratos','contrato_honorarios','Dra. Civil AI',CONTRATO,'Honorários advocatícios',2,FileSignature),
  doc('acordo_extrajudicial','Termo de Acordo','contratos','acordo_extrajudicial','Dra. Civil AI',[...CONTRATO,'valor_contrato'],'Acordo extrajudicial',2,Handshake),
  doc('confissao_divida','Confissão de Dívida','contratos','confissao_divida','Dra. Civil AI',[...CONTRATO,'valor_contrato','calculo_execucao'],'Confissão e parcelamento',2,FileSignature),
  doc('distrato','Distrato Contratual','contratos','distrato','Dr. Empresarial AI',CONTRATO,'Resilição contratual',2,FileMinus),
  doc('requerimento_administrativo','Requerimento Administrativo','administrativo','requerimento_administrativo','Dra. Civil AI',ADMIN,'Pedido administrativo',1,Landmark),
  doc('recurso_administrativo','Recurso Administrativo','administrativo','recurso_administrativo','Dra. Civil AI',ADMIN,'Recurso administrativo',2,Landmark),
];

export function getDocumentById(id: string) {
  return DOCUMENT_CATALOG.find((d) => d.id === id);
}

export function getEmptyFormForDocument(docId: string): Record<string, string> {
  const entry = getDocumentById(docId);
  if (!entry) return {};
  return Object.fromEntries(entry.fields.map((f) => [f, '']));
}

export const DOCUMENT_TYPES = DOCUMENT_CATALOG;
