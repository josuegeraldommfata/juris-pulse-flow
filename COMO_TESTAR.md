# 🧪 COMO TESTAR O ADVOCATUS IA

## 🎯 Guia Rápido de Testes

### **1️⃣ PREPARAR O AMBIENTE**

#### A. Criar o Banco de Dados:
```bash
# Abra o pgAdmin ou terminal PostgreSQL
psql -U postgres

# No PostgreSQL:
CREATE DATABASE advocatus;
\c advocatus
\i C:\Users\tecro\OneDrive\Imagens\juris-pulse-flow\schema_banco_dados_completo.sql

# Aguarde a execução (cria 15 tabelas + índices + seed data)
# Ao final você terá:
# - Usuário admin: admin@advocatus.com / 32080910
# - Usuário teste: joao@teste.com / teste123
# - 3 planos cadastrados
```

#### B. Instalar Dependências do Backend:
```bash
cd backend
npm install
```

#### C. Verificar .env:
```env
PORT=3001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=advocatus
DB_PASSWORD=32080910
DB_PORT=5432
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=BQYHJGJHJ
EVOLUTION_WEBHOOK_URL=http://localhost:3001/api/webhook/whatsapp
```

#### D. Iniciar o Backend:
```bash
npm start

# Você deve ver:
# ✅ Conectado ao PostgreSQL
# ✅ Backend rodando na porta 3001
```

#### E. Instalar Frontend (se necessário):
```bash
cd ..
npm install
npm run dev

# Acesse: http://localhost:5173
```

---

### **2️⃣ TESTAR AUTENTICAÇÃO**

#### Teste 1: Login com Admin
```bash
# Via POSTMAN ou curl:
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@advocatus.com",
    "password": "32080910"
  }'

# Resposta esperada:
{
  "id": 1,
  "name": "Administrador",
  "email": "admin@advocatus.com",
  "role": "admin",
  "company": "Juris Pulse Flow",
  "tokensAvailable": 10000,
  "tokensConsumed": 0,
  "tokensTotal": 10000
}
```

#### Teste 2: Login no Frontend
1. Abra http://localhost:5173
2. Digite: admin@advocatus.com / 32080910
3. Deve entrar no dashboard

---

### **3️⃣ TESTAR SISTEMA DE TOKENS**

#### Teste 3: Ver Saldo
```bash
curl http://localhost:3001/api/wallet/1

# Resposta:
{
  "tokens_available": 10000,
  "tokens_consumed": 0,
  "tokens_total": 10000
}
```

#### Teste 4: Comprar Tokens
```bash
curl -X POST http://localhost:3001/api/wallet/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "quantidade": 100,
    "valor": 50.00
  }'

# Resposta:
{
  "success": true,
  "message": "100 tokens adicionados com sucesso!"
}
```

#### Teste 5: Injetar Tokens (Admin)
```bash
curl -X POST http://localhost:3001/api/admin/inject-tokens \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "amount": 500
  }'
```

---

### **4️⃣ TESTAR AGENTES DE IA**

#### Teste 6: Listar Agentes
```bash
curl http://localhost:3001/api/ai/agents

# Resposta: Lista com 12 agentes
```

#### Teste 7: Classificar Lead (Trabalhista)
```bash
curl -X POST http://localhost:3001/api/ai/analyze-lead \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "leadId": 1,
    "texto": "Fui demitido sem justa causa e não recebi minhas verbas rescisórias. Trabalhei por 5 anos na empresa XYZ e tenho todas as provas."
  }'

# Resposta esperada:
{
  "success": true,
  "area": "trabalhista",
  "agente": "Dr. Trabalhista AI",
  "especialidade": "Direito do Trabalho e Previdenciário",
  "confianca": 85
}
```

#### Teste 8: Classificar Lead (Civil)
```bash
curl -X POST http://localhost:3001/api/ai/analyze-lead \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "leadId": 2,
    "texto": "Sofri um acidente e preciso entrar com ação de indenização por danos morais e materiais contra a empresa."
  }'

# Resposta esperada:
{
  "success": true,
  "area": "civil",
  "agente": "Dra. Civil AI",
  "especialidade": "Direito Civil e Obrigações",
  "confianca": 85
}
```

---

### **5️⃣ TESTAR GERAÇÃO DE DOCUMENTOS (COBRA 2 TOKENS)**

#### Teste 9: Listar Templates
```bash
curl http://localhost:3001/api/ai/templates

# Resposta:
[
  { "id": "peticao_inicial", "nome": "Petição Inicial", "custoTokens": 2 },
  { "id": "contestacao", "nome": "Contestação", "custoTokens": 2 },
  { "id": "recurso", "nome": "Recurso", "custoTokens": 2 },
  { "id": "contrato", "nome": "Contrato", "custoTokens": 2 },
  { "id": "procuracao", "nome": "Procuração", "custoTokens": 1 },
  { "id": "declaracao", "nome": "Declaração", "custoTokens": 1 }
]
```

#### Teste 10: Gerar Petição Inicial
```bash
curl -X POST http://localhost:3001/api/ai/generate-document \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "tipo": "peticao_inicial",
    "dados": {
      "nomeAutor": "João da Silva",
      "qualificacaoAutor": "brasileiro, solteiro, mecânico, RG 12.345.678-9, CPF 123.456.789-00",
      "nomeReu": "Empresa XYZ Ltda",
      "qualificacaoReu": "pessoa jurídica de direito privado, CNPJ 12.345.678/0001-90",
      "tipoAcao": "TRABALHISTA - Rescisão Indireta",
      "comarca": "São Paulo",
      "vara": "1ª Vara do Trabalho",
      "valorCausa": "50000.00",
      "fatos": "O autor trabalhou na empresa ré por 5 anos, tendo sido demitido sem justa causa em 01/01/2026, sem o pagamento das verbas rescisórias devidas.",
      "fundamentacao": "Conforme o art. 477 da CLT, o empregador deve efetuar o pagamento das verbas rescisórias no prazo de 10 dias.",
      "pedidos": "Condenação ao pagamento de: aviso prévio, 13º salário proporcional, férias vencidas e proporcionais com 1/3, saldo de salário, FGTS com multa de 40%",
      "advogado": "Dr. Pedro Santos",
      "numeroOab": "123456",
      "ufOab": "SP",
      "cidade": "São Paulo"
    }
  }'

# Resposta:
{
  "success": true,
  "documento": "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA 1ª VARA DO TRABALHO...",
  "nome": "Petição Inicial",
  "tokensUsados": 2
}

# ✅ 2 TOKENS FORAM DESCONTADOS AUTOMATICAMENTE
```

#### Teste 11: Gerar Procuração (1 token)
```bash
curl -X POST http://localhost:3001/api/ai/generate-document \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "tipo": "procuracao",
    "dados": {
      "outorgante": "Maria Souza",
      "qualificacao": "brasileira, casada, professora, RG 98.765.432-1, CPF 987.654.321-00",
      "outorgado": "Dra. Ana Silva",
      "numeroOab": "654321",
      "ufOab": "SP",
      "poderesEspeciais": "confessar, transigir, desistir, receber e dar quitação",
      "cidade": "São Paulo"
    }
  }'

# ✅ 1 TOKEN FOI DESCONTADO
```

#### Teste 12: Tentar Gerar sem Tokens
```bash
# Primeiro, zerar os tokens do usuário 2:
# UPDATE usuarios SET tokens_available = 0 WHERE id = 2;

curl -X POST http://localhost:3001/api/ai/generate-document \
  -H "Content-Type: application/json" \
  -H "x-user-id: 2" \
  -d '{
    "tipo": "peticao_inicial",
    "dados": {...}
  }'

# Resposta esperada (ERRO 402):
{
  "error": "Tokens insuficientes",
  "required": 2,
  "available": 0,
  "message": "Você precisa de 2 tokens mas tem apenas 0. Recarregue sua carteira!"
}

# ✅ SISTEMA BLOQUEOU A AÇÃO!
```

---

### **6️⃣ TESTAR SCRAPING (COBRA 2 TOKENS)**

#### Teste 13: Consultar Processo TJSP
```bash
curl -X POST http://localhost:3001/api/scraper/process \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "numeroProcesso": "1001234-56.2024.8.26.0100",
    "leadId": 5
  }'

# Resposta esperada (se processo existir):
{
  "success": true,
  "processo": {
    "tribunal": "TJSP",
    "numero": "1001234-56.2024.8.26.0100",
    "classe": "Procedimento Comum Cível",
    "assunto": "...",
    "partes": [...],
    "movimentacoes": [...]
  },
  "processoId": 1,
  "tokensUsados": 2
}

# ✅ 2 TOKENS FORAM DESCONTADOS
# ✅ PROCESSO SALVO NO BANCO
```

#### Teste 14: Listar Processos do Usuário
```bash
curl -H "x-user-id: 1" http://localhost:3001/api/processos

# Resposta:
[
  {
    "id": 1,
    "numero_processo": "1001234-56.2024.8.26.0100",
    "tribunal": "TJSP",
    "status": "ativo",
    "created_at": "2026-06-04T10:00:00Z"
  }
]
```

---

### **7️⃣ TESTAR LEADS**

#### Teste 15: Criar Lead Manualmente (no banco)
```sql
INSERT INTO leads (user_id, nome, telefone, resumo, area, kanban_stage, score_confianca, temperatura, origem)
VALUES (1, 'Carlos Mendes', '11987654321', 'Preciso de ajuda com inventário da minha mãe', 'familia', 'triagem', 80, 'hot', 'whatsapp');
```

#### Teste 16: Listar Leads
```bash
curl http://localhost:3001/api/leads?userId=1

# Resposta:
[
  {
    "id": 1,
    "name": "Carlos Mendes",
    "phone": "11987654321",
    "subject": "Preciso de ajuda com inventário...",
    "kanban_stage": "triagem",
    "score_val": 80,
    "created_at": "2026-06-04"
  }
]
```

#### Teste 17: Ver Detalhes do Lead
```bash
curl -H "x-user-id: 1" http://localhost:3001/api/leads/1

# Resposta completa do lead
```

#### Teste 18: Mover Lead no Kanban
```bash
curl -X PATCH http://localhost:3001/api/leads/1 \
  -H "Content-Type: application/json" \
  -d '{
    "kanban_stage": "documentacao"
  }'
```

#### Teste 19: Exportar Dossiê (COBRA 1 TOKEN)
```bash
curl -X POST http://localhost:3001/api/leads/1/export \
  -H "x-user-id: 1"

# Resposta:
{
  "success": true,
  "dossie": {
    "lead": {...},
    "totalConversas": 0,
    "conversas": [],
    "processos": []
  },
  "tokensUsados": 1
}

# ✅ 1 TOKEN FOI DESCONTADO
```

---

### **8️⃣ TESTAR WEBHOOK WHATSAPP**

#### Teste 20: Simular Mensagem Recebida
```bash
curl -X POST "http://localhost:3001/api/webhook/whatsapp?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "messages.upsert",
    "data": {
      "messages": [{
        "key": {
          "remoteJid": "5511999887766@s.whatsapp.net",
          "fromMe": false
        },
        "message": {
          "conversation": "Olá, preciso de um advogado trabalhista urgente!"
        }
      }]
    }
  }'

# Resposta:
{
  "success": true
}

# ✅ LEAD CRIADO AUTOMATICAMENTE
# ✅ CONVERSA SALVA
# ✅ NOTIFICAÇÃO CRIADA
```

#### Teste 21: Verificar se Lead foi Criado
```bash
curl http://localhost:3001/api/leads?userId=1

# Deve aparecer novo lead com telefone 5511999887766
```

---

### **9️⃣ TESTAR PAINEL ADMIN**

#### Teste 22: Listar Usuários
```bash
curl http://localhost:3001/api/admin/users

# Resposta:
[
  {
    "id": 2,
    "name": "Dr. João Silva",
    "email": "joao@teste.com",
    "tokens_available": 500,
    "total_leads": 1,
    "total_instances": 0
  }
]
```

#### Teste 23: Métricas Globais
```bash
curl http://localhost:3001/api/admin/metrics

# Resposta:
{
  "totalUsers": 1,
  "totalLeads": 2,
  "totalTokensConsumed": 5,
  "totalInstances": 0,
  "leadsConvertidos": 0,
  "taxaConversao": "0.00"
}
```

---

### **🔟 TESTAR HISTÓRICO DE TOKENS**

#### Teste 24: Ver Histórico
```bash
curl http://localhost:3001/api/wallet/history/1

# Resposta:
[
  {
    "id": 1,
    "action": "Geração de documento: Petição Inicial",
    "cost": 2,
    "date": "2026-06-04T10:30:00Z"
  },
  {
    "id": 2,
    "action": "Scraping do processo 1001234-56.2024.8.26.0100",
    "cost": 2,
    "date": "2026-06-04T11:00:00Z"
  },
  {
    "id": 3,
    "action": "Exportação de dossiê do lead Carlos Mendes",
    "cost": 1,
    "date": "2026-06-04T11:15:00Z"
  }
]
```

---

## ✅ CHECKLIST DE TESTES

### **Backend:**
- [ ] Servidor inicia sem erros
- [ ] Conecta ao PostgreSQL
- [ ] Login funciona
- [ ] Tokens são verificados antes de ações
- [ ] Tokens são descontados corretamente
- [ ] Agentes de IA classificam áreas
- [ ] Documentos são gerados
- [ ] Scraping funciona (TJSP)
- [ ] Leads são listados
- [ ] Kanban atualiza
- [ ] Webhook recebe mensagens
- [ ] Admin vê métricas

### **Frontend:**
- [ ] Página de login abre
- [ ] Login redireciona para dashboard
- [ ] Dashboard mostra estatísticas
- [ ] Página de leads lista corretamente
- [ ] Kanban permite drag & drop
- [ ] Wallet mostra saldo
- [ ] WhatsApp manager lista instâncias

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot connect to database"
```bash
# Verifique se PostgreSQL está rodando:
# Windows: Services > PostgreSQL
# Verifique credenciais no .env
```

### Erro: "Module not found"
```bash
cd backend
npm install
```

### Erro: "Port 3001 already in use"
```bash
# Mude a porta no .env:
PORT=3002
```

### Erro ao gerar documento: "Tokens insuficientes"
```bash
# Injete mais tokens:
curl -X POST http://localhost:3001/api/admin/inject-tokens \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": 1000}'
```

---

## 🎉 CONCLUSÃO

Se todos os testes passarem, você tem um sistema **100% funcional** com:
- ✅ 12 agentes de IA
- ✅ Sistema de tokens funcionando
- ✅ Geração de documentos
- ✅ Scraping de processos
- ✅ Integração WhatsApp
- ✅ Multi-tenant (SaaS)

**🚀 PRONTO PARA PRODUÇÃO (após configurar gateway de pagamento real)!**
