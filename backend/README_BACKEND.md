# 🚀 ADVOCATUS IA - BACKEND COMPLETO

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Endpoints da API](#endpoints-da-api)
- [Sistema de Tokens](#sistema-de-tokens)
- [Agentes de IA](#agentes-de-ia)
- [Webhook WhatsApp](#webhook-whatsapp)

---

## 🎯 Visão Geral

Backend Node.js completo para o SaaS jurídico com:
- ✅ **12 Agentes de IA** especializados por área jurídica
- ✅ **Sistema de Tokens** com cobrança automática
- ✅ **Scraping de Processos** (TJSP, TRT)
- ✅ **Geração de Documentos** jurídicos
- ✅ **Integração WhatsApp** (Evolution API)
- ✅ **Multi-tenant** (SaaS completo)

---

## 📦 Instalação

```bash
cd backend
npm install
```

### Dependências:
- express
- pg (PostgreSQL)
- playwright (scraping)
- cors
- dotenv
- axios

---

## ⚙️ Configuração

### 1. Arquivo `.env`:

```env
PORT=3001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=advocatus
DB_PASSWORD=sua_senha
DB_PORT=5432
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=sua_chave
EVOLUTION_WEBHOOK_URL=http://seu-servidor/api/webhook/whatsapp
```

### 2. Criar o Banco de Dados:

```bash
# Execute o schema SQL completo:
psql -U postgres -d advocatus -f ../schema_banco_dados_completo.sql
```

### 3. Iniciar o Servidor:

```bash
npm start
# ou para desenvolvimento:
npm run dev
```

Servidor rodando em: `http://localhost:3001`

---

## 🔌 Endpoints da API

### **🔐 AUTENTICAÇÃO**

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@advocatus.com",
  "password": "32080910"
}

Response:
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

---

### **💰 SISTEMA DE TOKENS**

#### Buscar Saldo
```http
GET /api/wallet/:userId

Response:
{
  "tokens_available": 500,
  "tokens_consumed": 100,
  "tokens_total": 600
}
```

#### Histórico de Consumo
```http
GET /api/wallet/history/:userId

Response:
[
  {
    "id": 1,
    "action": "Geração de documento: Petição Inicial",
    "cost": 2,
    "date": "2026-06-04T10:30:00Z"
  }
]
```

#### Comprar Tokens
```http
POST /api/wallet/purchase
Content-Type: application/json

{
  "userId": 1,
  "quantidade": 100,
  "valor": 50.00
}

Response:
{
  "success": true,
  "message": "100 tokens adicionados com sucesso!"
}
```

#### Injetar Tokens (Admin)
```http
POST /api/admin/inject-tokens
Content-Type: application/json

{
  "userId": 2,
  "amount": 500
}
```

---

### **🤖 AGENTES DE IA**

#### Listar Agentes Disponíveis
```http
GET /api/ai/agents

Response:
[
  {
    "id": "trabalhista",
    "nome": "Dr. Trabalhista AI",
    "especialidade": "Direito do Trabalho",
    "areas": ["CLT", "Rescisão", "FGTS"],
    "documentos": ["Reclamação Trabalhista", "Defesa"]
  },
  // ... 11 outros agentes
]
```

#### Analisar Lead (Classificar Área)
```http
POST /api/ai/analyze-lead
Headers: x-user-id: 1
Content-Type: application/json

{
  "leadId": 5,
  "texto": "Fui demitido sem justa causa e não recebi minhas verbas rescisórias"
}

Response:
{
  "success": true,
  "area": "trabalhista",
  "agente": "Dr. Trabalhista AI",
  "especialidade": "Direito do Trabalho",
  "confianca": 85
}
```

#### Gerar Documento (COBRA 2 TOKENS)
```http
POST /api/ai/generate-document
Headers: x-user-id: 1
Content-Type: application/json

{
  "tipo": "peticao_inicial",
  "dados": {
    "nomeAutor": "João da Silva",
    "nomeReu": "Empresa XYZ Ltda",
    "tipoAcao": "TRABALHISTA",
    "comarca": "São Paulo",
    "valorCausa": "50000.00",
    "fatos": "O autor trabalhou na empresa por 5 anos...",
    "pedidos": "Pagamento de verbas rescisórias..."
  }
}

Response:
{
  "success": true,
  "documento": "EXCELENTÍSSIMO SENHOR DOUTOR...",
  "nome": "Petição Inicial",
  "tokensUsados": 2
}
```

#### Listar Templates de Documentos
```http
GET /api/ai/templates

Response:
[
  { "id": "peticao_inicial", "nome": "Petição Inicial", "custoTokens": 2 },
  { "id": "contestacao", "nome": "Contestação", "custoTokens": 2 },
  { "id": "recurso", "nome": "Recurso", "custoTokens": 2 },
  { "id": "contrato", "nome": "Contrato", "custoTokens": 2 },
  { "id": "procuracao", "nome": "Procuração", "custoTokens": 1 },
  { "id": "declaracao", "nome": "Declaração", "custoTokens": 1 }
]
```

---

### **🔍 SCRAPING DE PROCESSOS (COBRA 2 TOKENS)**

#### Consultar Processo
```http
POST /api/scraper/process
Headers: x-user-id: 1
Content-Type: application/json

{
  "numeroProcesso": "1234567-89.2024.8.26.0100",
  "leadId": 10
}

Response:
{
  "success": true,
  "processo": {
    "tribunal": "TJSP",
    "numero": "1234567-89.2024.8.26.0100",
    "classe": "Procedimento Comum Cível",
    "assunto": "Indenização por Danos Morais",
    "foro": "Foro Central Cível",
    "vara": "7ª Vara Cível",
    "juiz": "Dr. Fernando Silva",
    "partes": ["Autor: João", "Réu: Empresa X"],
    "status": "Ativo",
    "movimentacoes": [...]
  },
  "processoId": 15,
  "tokensUsados": 2
}
```

#### Listar Processos do Usuário
```http
GET /api/processos
Headers: x-user-id: 1

Response:
[
  {
    "id": 15,
    "numero_processo": "1234567-89.2024.8.26.0100",
    "tribunal": "TJSP",
    "status": "ativo",
    "created_at": "2026-06-04T10:00:00Z"
  }
]
```

---

### **👥 GESTÃO DE LEADS**

#### Listar Leads
```http
GET /api/leads?userId=1

Response:
[
  {
    "id": 5,
    "name": "Maria Santos",
    "phone": "11999999999",
    "subject": "Preciso de ajuda com rescisão trabalhista",
    "kanban_stage": "triagem",
    "score_val": 75,
    "created_at": "2026-06-04"
  }
]
```

#### Detalhes de Lead
```http
GET /api/leads/:id
Headers: x-user-id: 1

Response:
{
  "id": 5,
  "nome": "Maria Santos",
  "telefone": "11999999999",
  "area": "trabalhista",
  "kanban_stage": "documentacao",
  "score_confianca": 75,
  "temperatura": "hot"
}
```

#### Histórico de Conversas
```http
GET /api/leads/:id/conversation
Headers: x-user-id: 1

Response:
[
  {
    "id": 1,
    "tipo": "text",
    "conteudo": "Olá, preciso de ajuda",
    "sentido": "incoming",
    "created_at": "2026-06-04T09:00:00Z"
  }
]
```

#### Atualizar Estágio (Kanban)
```http
PATCH /api/leads/:id
Content-Type: application/json

{
  "kanban_stage": "contrato"
}
```

#### Exportar Dossiê (COBRA 1 TOKEN)
```http
POST /api/leads/:id/export
Headers: x-user-id: 1

Response:
{
  "success": true,
  "dossie": {
    "lead": {...},
    "totalConversas": 15,
    "conversas": [...],
    "processos": [...]
  },
  "tokensUsados": 1
}
```

---

### **📱 WHATSAPP INTEGRATION**

#### Listar Instâncias
```http
GET /api/evolution/instances

Response:
{
  "instances": [
    {
      "instanceName": "dra_maria",
      "status": "open",
      "number": "5511999999999"
    }
  ]
}
```

#### Criar Instância
```http
POST /api/evolution/create
Content-Type: application/json

{
  "instanceName": "dra_maria_123",
  "userId": 2
}
```

#### Gerar QR Code
```http
POST /api/evolution/qrcode
Content-Type: application/json

{
  "instanceName": "dra_maria_123"
}

Response:
{
  "base64": "data:image/png;base64,..."
}
```

#### Desconectar
```http
POST /api/evolution/disconnect
Content-Type: application/json

{
  "instanceName": "dra_maria_123"
}
```

#### Webhook (Receber Mensagens)
```http
POST /api/webhook/whatsapp?userId=2
Content-Type: application/json

{
  "event": "messages.upsert",
  "data": {
    "messages": [{
      "key": {
        "remoteJid": "5511999999999@s.whatsapp.net",
        "fromMe": false
      },
      "message": {
        "conversation": "Olá, preciso de um advogado"
      }
    }]
  }
}

Response:
{
  "success": true
}
```

---

### **👨‍💼 PAINEL ADMINISTRATIVO**

#### Listar Usuários
```http
GET /api/admin/users

Response:
[
  {
    "id": 2,
    "name": "Dra. Ana Silva",
    "email": "ana@example.com",
    "tokens_available": 850,
    "total_leads": 45,
    "total_instances": 2
  }
]
```

#### Métricas Globais
```http
GET /api/admin/metrics

Response:
{
  "totalUsers": 150,
  "totalLeads": 3420,
  "totalTokensConsumed": 25680,
  "totalInstances": 280,
  "leadsConvertidos": 856,
  "taxaConversao": "25.03"
}
```

---

## 💰 Sistema de Tokens

### **COBRANÇA AUTOMÁTICA:**

| Ação | Custo | Endpoint |
|------|-------|----------|
| 📄 Gerar Petição Inicial | 2 tokens | POST /api/ai/generate-document |
| 📄 Gerar Contestação | 2 tokens | POST /api/ai/generate-document |
| 📄 Gerar Recurso | 2 tokens | POST /api/ai/generate-document |
| 📄 Gerar Contrato | 2 tokens | POST /api/ai/generate-document |
| 📄 Gerar Procuração | 1 token | POST /api/ai/generate-document |
| 📄 Gerar Declaração | 1 token | POST /api/ai/generate-document |
| 🔍 Consultar Processo | 2 tokens | POST /api/scraper/process |
| 📊 Exportar Dossiê | 1 token | POST /api/leads/:id/export |
| 🤖 Analisar Lead | 0 tokens | POST /api/ai/analyze-lead |

### **Middleware de Verificação:**

O sistema verifica automaticamente se o usuário tem tokens suficientes antes de executar a ação. Se não tiver, retorna erro `402 Payment Required`:

```json
{
  "error": "Tokens insuficientes",
  "required": 2,
  "available": 1,
  "message": "Você precisa de 2 tokens mas tem apenas 1. Recarregue sua carteira!"
}
```

---

## 🤖 Agentes de IA - 12 Áreas Jurídicas

1. **Trabalhista** - CLT, Rescisão, FGTS, Horas Extras
2. **Civil** - Contratos, Indenizações, Responsabilidade Civil
3. **Família** - Divórcio, Pensão, Guarda, Inventário
4. **Penal** - Defesa Criminal, Habeas Corpus
5. **Consumidor** - CDC, Defeitos, Negativação
6. **Previdenciário** - INSS, Aposentadoria, Auxílio-Doença
7. **Empresarial** - Societário, Recuperação Judicial
8. **Tributário** - Impostos, Execução Fiscal
9. **Imobiliário** - Locação, Despejo, Usucapião
10. **Administrativo** - Concursos, Licitações
11. **Eleitoral** - Propaganda, Candidaturas
12. **Ambiental** - Licenças, Crimes Ambientais

---

## 🔒 Segurança

### Headers de Autenticação:

Todos os endpoints protegidos exigem o header:
```
x-user-id: 1
```

### Tokens de Sessão:

(Implementar JWT para produção)

---

## 🐛 Debugging

### Logs do Sistema:

```bash
# O servidor exibe logs detalhados:
✅ Conectado ao PostgreSQL
🚀 Backend rodando na porta 3001
🔍 Iniciando scraping do processo 1234567...
✅ 2 tokens descontados do usuário 1
📱 Webhook recebido: messages.upsert
```

---

## 📞 Suporte

- **Documentação Completa:** Veja `PROGRESSO_ADVOCATUS_IA.md`
- **Schema do Banco:** `schema_banco_dados_completo.sql`
- **Versão:** 2.0.0
- **Status:** ✅ Funcional (92%)

---

**Desenvolvido com ❤️ para revolucionar o atendimento jurídico no Brasil!**
