export const mockLeads = [
  { id: '1', name: 'João Mendes', phone: '(11) 99999-1234', subject: 'Acidente de Trabalho', score: 'hot' as const, status: 'triado', date: '2026-03-29T14:30:00', tokenCost: 1, area: 'Trabalhista', hasLawyer: false, kanbanStage: 'triagem' as const },
  { id: '2', name: 'Maria Oliveira', phone: '(21) 98888-5678', subject: 'Revisão Trabalhista', score: 'warm' as const, status: 'triado', date: '2026-03-29T11:15:00', tokenCost: 1, area: 'Trabalhista', hasLawyer: true, kanbanStage: 'documentacao' as const },
  { id: '3', name: 'Carlos Souza', phone: '(31) 97777-9012', subject: 'Demissão sem Justa Causa', score: 'hot' as const, status: 'pendente', date: '2026-03-28T09:45:00', tokenCost: 1, area: 'Trabalhista', hasLawyer: false, kanbanStage: 'aguardando' as const },
  { id: '4', name: 'Ana Costa', phone: '(41) 96666-3456', subject: 'Horas Extras', score: 'cold' as const, status: 'triado', date: '2026-03-28T16:20:00', tokenCost: 1, area: 'Trabalhista', hasLawyer: false, kanbanStage: 'triagem' as const },
  { id: '5', name: 'Pedro Lima', phone: '(51) 95555-7890', subject: 'Insalubridade', score: 'warm' as const, status: 'pendente', date: '2026-03-27T10:00:00', tokenCost: 1, area: 'Previdenciário', hasLawyer: true, kanbanStage: 'contrato' as const },
  { id: '6', name: 'Lucia Ferreira', phone: '(61) 94444-2345', subject: 'Assédio Moral', score: 'hot' as const, status: 'triado', date: '2026-03-27T13:30:00', tokenCost: 1, area: 'Trabalhista', hasLawyer: false, kanbanStage: 'documentacao' as const },
];

export const mockConsumptionHistory = [
  { id: '1', date: '2026-03-29T14:30:00', lead: 'João Mendes', action: 'Triagem IA', cost: 1, balance: 850 },
  { id: '2', date: '2026-03-29T11:15:00', lead: 'Maria Oliveira', action: 'Triagem IA', cost: 1, balance: 851 },
  { id: '3', date: '2026-03-28T09:45:00', lead: 'Carlos Souza', action: 'Triagem IA', cost: 1, balance: 852 },
  { id: '4', date: '2026-03-28T16:20:00', lead: 'Ana Costa', action: 'Triagem IA', cost: 1, balance: 853 },
  { id: '5', date: '2026-03-27T10:00:00', lead: 'Pedro Lima', action: 'Triagem IA', cost: 1, balance: 854 },
];

export const mockUsers = [
  { id: '1', name: 'Dra. Ana Silva', email: 'ana@silvaesilva.adv.br', office: 'Silva & Silva', tokensAvailable: 850, tokensConsumed: 150, status: 'active' as const },
  { id: '2', name: 'Dr. Bruno Rocha', email: 'bruno@rochajuridico.com', office: 'Rocha Jurídico', tokensAvailable: 320, tokensConsumed: 680, status: 'active' as const },
  { id: '3', name: 'Dra. Camila Dias', email: 'camila@diaslaw.com', office: 'Dias & Assoc.', tokensAvailable: 0, tokensConsumed: 500, status: 'inactive' as const },
  { id: '4', name: 'Dr. Diego Santos', email: 'diego@santosadv.com', office: 'Santos Advocacia', tokensAvailable: 1200, tokensConsumed: 300, status: 'active' as const },
];

export const mockInstances = [
  { name: 'whatsapp-real', displayName: 'WhatsApp Real', status: 'connected' as const, phone: '+55 11 99999-0001', lastActivity: '2026-03-29T14:30:00' },
  { name: 'whatsapp-assistente', displayName: 'WhatsApp Assistente IA', status: 'disconnected' as const, phone: '', lastActivity: '2026-03-28T10:00:00' },
];

export const mockConversation = [
  { role: 'user', content: 'Olá, sofri um acidente de trabalho e preciso de orientação jurídica.' },
  { role: 'assistant', content: 'Olá! Sinto muito pelo ocorrido. Posso ajudá-lo com isso. Pode me informar quando ocorreu o acidente e se houve registro no local de trabalho?' },
  { role: 'user', content: 'Foi há 2 semanas. Sim, foi registrado e tenho o CAT.' },
  { role: 'assistant', content: 'Ótimo que você possui o CAT. Baseado nas informações, classifico como URGÊNCIA ALTA. Recomendo: 1) Consulta presencial para análise do caso. 2) Possível ação por danos materiais e morais. Vou encaminhar seu caso para análise detalhada.' },
];

export const tokenPlans = [
  { id: 'basic', name: 'Básico', tokens: 500, price: 149.90, popular: false },
  { id: 'pro', name: 'Profissional', tokens: 1000, price: 249.90, popular: true },
  { id: 'enterprise', name: 'Empresarial', tokens: 2500, price: 499.90, popular: false },
];

export const mockLeadDocuments = [
  { id: '1', name: 'RG - Frente.jpg', type: 'image', status: 'approved' as const, date: '2026-03-29' },
  { id: '2', name: 'RG - Verso.jpg', type: 'image', status: 'approved' as const, date: '2026-03-29' },
  { id: '3', name: 'CAT - Comunicação de Acidente.pdf', type: 'pdf', status: 'pending' as const, date: '2026-03-28' },
  { id: '4', name: 'Contrato de Trabalho.pdf', type: 'pdf', status: 'pending' as const, date: '2026-03-28' },
  { id: '5', name: 'Holerite - Último Mês.pdf', type: 'pdf', status: 'rejected' as const, date: '2026-03-27' },
];

export const mockAIAnalysis = {
  pontosFortes: [
    'CAT registrado em tempo hábil',
    'Testemunhas no local do acidente',
    'Histórico de exposição a riscos documentado',
    'Laudo médico com nexo causal confirmado',
  ],
  pontosFracos: [
    'Empregador pode alegar negligência do empregado',
    'Falta exame periódico recente',
  ],
  resumo: 'Caso com alta probabilidade de êxito. Documentação principal presente. Recomenda-se coleta de provas adicionais sobre condições do ambiente de trabalho.',
  areaJuridica: 'Trabalhista - Acidente de Trabalho',
  valorEstimado: 85000,
};

export const mockPerformanceData = [
  { month: 'Jan', leadsTotal: 42, leadsQualificados: 28 },
  { month: 'Fev', leadsTotal: 55, leadsQualificados: 38 },
  { month: 'Mar', leadsTotal: 68, leadsQualificados: 45 },
  { month: 'Abr', leadsTotal: 73, leadsQualificados: 52 },
  { month: 'Mai', leadsTotal: 90, leadsQualificados: 61 },
  { month: 'Jun', leadsTotal: 85, leadsQualificados: 58 },
];

export const mockSystemHealth = [
  { name: 'Evolution API', status: 'online' as const, latency: '45ms', uptime: '99.9%', lastCheck: '2026-03-29T14:30:00' },
  { name: 'PostgreSQL', status: 'online' as const, latency: '12ms', uptime: '99.99%', lastCheck: '2026-03-29T14:30:00' },
  { name: 'n8n Workflows', status: 'online' as const, latency: '120ms', uptime: '99.5%', lastCheck: '2026-03-29T14:30:00' },
  { name: 'Mercado Pago', status: 'warning' as const, latency: '340ms', uptime: '98.2%', lastCheck: '2026-03-29T14:25:00' },
  { name: 'OpenAI GPT', status: 'online' as const, latency: '890ms', uptime: '99.7%', lastCheck: '2026-03-29T14:30:00' },
];

export type KanbanStage = 'triagem' | 'documentacao' | 'aguardando' | 'contrato';

export const kanbanColumns: { id: KanbanStage; title: string }[] = [
  { id: 'triagem', title: 'Triagem IA' },
  { id: 'documentacao', title: 'Documentação Pendente' },
  { id: 'aguardando', title: 'Aguardando Advogado' },
  { id: 'contrato', title: 'Contrato Assinado' },
];
