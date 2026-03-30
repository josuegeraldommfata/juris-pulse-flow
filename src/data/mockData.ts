export const mockLeads = [
  { id: '1', name: 'João Mendes', phone: '(11) 99999-1234', subject: 'Acidente de Trabalho', score: 'hot' as const, status: 'triado', date: '2026-03-29T14:30:00', tokenCost: 1 },
  { id: '2', name: 'Maria Oliveira', phone: '(21) 98888-5678', subject: 'Revisão Trabalhista', score: 'warm' as const, status: 'triado', date: '2026-03-29T11:15:00', tokenCost: 1 },
  { id: '3', name: 'Carlos Souza', phone: '(31) 97777-9012', subject: 'Demissão sem Justa Causa', score: 'hot' as const, status: 'pendente', date: '2026-03-28T09:45:00', tokenCost: 1 },
  { id: '4', name: 'Ana Costa', phone: '(41) 96666-3456', subject: 'Horas Extras', score: 'cold' as const, status: 'triado', date: '2026-03-28T16:20:00', tokenCost: 1 },
  { id: '5', name: 'Pedro Lima', phone: '(51) 95555-7890', subject: 'Insalubridade', score: 'warm' as const, status: 'pendente', date: '2026-03-27T10:00:00', tokenCost: 1 },
  { id: '6', name: 'Lucia Ferreira', phone: '(61) 94444-2345', subject: 'Assédio Moral', score: 'hot' as const, status: 'triado', date: '2026-03-27T13:30:00', tokenCost: 1 },
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
