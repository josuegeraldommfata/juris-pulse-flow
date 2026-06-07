require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');
const { scrapeProcess } = require('./scraper');
const { authenticateUser } = require('./middleware/auth');
const { checkTokens, deductTokens } = require('./middleware/checkTokens');
const { identificarAreaJuridica, obterAgente, listarAgentes } = require('./utils/aiAgents');
const { gerarDocumento, listarTemplates } = require('./utils/documentTemplates');
const caktoService = require('./services/caktoService');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Inicialização Simples
pool.connect().then(() => console.log('✅ Conectado ao PostgreSQL')).catch(err => console.error('❌ Erro DB:', err.message));

// --- DASHBOARD STATS ---
app.get('/api/stats/integrator', async (req, res) => {
  try {
    const { userId } = req.query;
    const leadsByStage = await pool.query('SELECT kanban_stage as stage, count(*) FROM leads WHERE user_id = $1 GROUP BY kanban_stage', [userId]);
    const totalLeads = await pool.query('SELECT count(*) FROM leads WHERE user_id = $1', [userId]);
    res.json({ leadsByStage: leadsByStage.rows, totalLeads: parseInt(totalLeads.rows[0].count) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/stats/admin', async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT count(*) FROM usuarios');
    const totalLeads = await pool.query('SELECT count(*) FROM leads');
    res.json({ totalClients: parseInt(totalUsers.rows[0].count), systemLeads: parseInt(totalLeads.rows[0].count), apiHealth: 'Healthy' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- LEADS ---
app.get('/api/leads', async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await pool.query(`
      SELECT id, nome as name, telefone as phone, resumo as subject, 
      COALESCE(kanban_stage, 'triagem') as kanban_stage, COALESCE(score_confianca, 0) as score_val, data_criacao as created_at
      FROM leads WHERE user_id = $1 OR user_id IS NULL ORDER BY data_criacao DESC
    `, [userId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { kanban_stage } = req.body;
    await pool.query('UPDATE leads SET kanban_stage = $1 WHERE id = $2', [kanban_stage, id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- NOTIFICAÇÕES ---
app.get('/api/notifications', async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10', [userId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- WHATSAPP PROXIES ---
app.get('/api/evolution/instances', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.EVOLUTION_API_URL}/instance/fetchInstances`, {
      headers: { 'apikey': process.env.EVOLUTION_API_KEY }
    });
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/evolution/create', async (req, res) => {
  try {
    const { instanceName, userId } = req.body;
    console.log(`🚀 Criando Robô para Usuário ID ${userId}: ${instanceName}`);
    
    const response = await axios.post(`${process.env.EVOLUTION_API_URL}/instance/create`, {
      instanceName, 
      integration: "WHATSAPP-BAILEYS", 
      qrcode: true
    }, { headers: { 'apikey': process.env.EVOLUTION_API_KEY } });

    // Configura o Webhook injetando o userId na URL para o n8n saber quem é o dono do lead
    if (process.env.EVOLUTION_WEBHOOK_URL) {
      const webhookUrlWithId = `${process.env.EVOLUTION_WEBHOOK_URL}?userId=${userId}`;
      await axios.post(`${process.env.EVOLUTION_API_URL}/webhook/set/${instanceName}`, {
        url: webhookUrlWithId, 
        enabled: true, 
        events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"]
      }, { headers: { 'apikey': process.env.EVOLUTION_API_KEY } }).catch(e => console.error('Erro Webhook:', e.message));
    }
    
    res.json(response.data);
  } catch (error) { 
    res.status(500).json({ error: error.response?.data || error.message }); 
  }
});

app.post('/api/evolution/qrcode', async (req, res) => {
  try {
    const { instanceName } = req.body;
    const response = await axios.get(`${process.env.EVOLUTION_API_URL}/instance/connect/${instanceName}`, {
      headers: { 'apikey': process.env.EVOLUTION_API_KEY }
    });
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/evolution/disconnect', async (req, res) => {
  try {
    const { instanceName } = req.body;
    await axios.delete(`${process.env.EVOLUTION_API_URL}/instance/logout/${instanceName}`, {
      headers: { 'apikey': process.env.EVOLUTION_API_KEY }
    });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/evolution/restart', async (req, res) => {
  try {
    const { instanceName } = req.body;
    await axios.post(`${process.env.EVOLUTION_API_URL}/instance/restart/${instanceName}`, {}, {
      headers: { 'apikey': process.env.EVOLUTION_API_KEY }
    });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, password]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ 
        id: user.id, 
        name: user.nome, 
        email: user.email, 
        role: user.role, 
        company: user.company,
        tokensAvailable: user.tokens_available || 0,
        tokensConsumed: user.tokens_consumed || 0,
        tokensTotal: user.tokens_total || 0
      });
    } else { res.status(401).json({ error: 'Credenciais inválidas' }); }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// =============================================================
// 💰 SISTEMA DE TOKENS E WALLET
// =============================================================

// Buscar saldo de tokens do usuário
app.get('/api/wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT tokens_available, tokens_consumed, tokens_total FROM usuarios WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Histórico de consumo de tokens
app.get('/api/wallet/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT 
        id,
        tipo_operacao as action,
        tokens_usados as cost,
        created_at as date,
        metadata
      FROM ai_logs 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 50
    `, [userId]);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comprar tokens (mock - integrar com gateway de pagamento)
app.post('/api/wallet/purchase', async (req, res) => {
  try {
    const { userId, planId, quantidade, valor } = req.body;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Atualiza tokens do usuário
      await client.query(
        `UPDATE usuarios 
         SET tokens_available = tokens_available + $1,
             tokens_total = tokens_total + $1
         WHERE id = $2`,
        [quantidade, userId]
      );
      
      // Registra a transação
      await client.query(
        `INSERT INTO transacoes (user_id, tipo, quantidade_tokens, valor, status, metodo_pagamento)
         VALUES ($1, 'purchase', $2, $3, 'completed', 'mock')`,
        [userId, quantidade, valor]
      );
      
      await client.query('COMMIT');
      
      console.log(`✅ ${quantidade} tokens comprados pelo usuário ${userId}`);
      
      res.json({ success: true, message: `${quantidade} tokens adicionados com sucesso!` });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Injetar tokens
app.post('/api/admin/inject-tokens', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    await pool.query(
      `UPDATE usuarios 
       SET tokens_available = tokens_available + $1,
           tokens_total = tokens_total + $1
       WHERE id = $2`,
      [amount, userId]
    );
    
    // Registra como bônus
    await pool.query(
      `INSERT INTO transacoes (user_id, tipo, quantidade_tokens, status)
       VALUES ($1, 'bonus', $2, 'completed')`,
      [userId, amount]
    );
    
    console.log(`✅ Admin injetou ${amount} tokens no usuário ${userId}`);
    
    res.json({ success: true, message: `${amount} tokens injetados com sucesso!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================
// 🤖 AGENTES DE IA E ANÁLISE
// =============================================================

// Listar todos os agentes de IA disponíveis
app.get('/api/ai/agents', (req, res) => {
  const agentes = listarAgentes();
  res.json(agentes);
});

// Analisar lead com IA (classificar área jurídica)
app.post('/api/ai/analyze-lead', authenticateUser, async (req, res) => {
  try {
    const { leadId, texto } = req.body;
    const userId = req.userId;
    
    // Identifica a área jurídica
    const area = identificarAreaJuridica(texto);
    const agente = obterAgente(area);
    
    // Atualiza o lead com a área identificada
    await pool.query(
      'UPDATE leads SET area = $1 WHERE id = $2',
      [area, leadId]
    );
    
    // Registra o uso da IA
    await pool.query(
      `INSERT INTO ai_logs (user_id, lead_id, tipo_operacao, modelo_ia, prompt, resposta, tokens_usados, sucesso)
       VALUES ($1, $2, 'classification', 'rule-based', $3, $4, 0, true)`,
      [userId, leadId, texto.substring(0, 500), area]
    );
    
    res.json({
      success: true,
      area,
      agente: agente.nome,
      especialidade: agente.especialidade,
      confianca: 85
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gerar documento jurídico com IA (COBRA 2 TOKENS)
app.post('/api/ai/generate-document', authenticateUser, checkTokens(2), async (req, res) => {
  try {
    const { tipo, dados } = req.body;
    const userId = req.userId;
    
    // Gera o documento
    const documento = gerarDocumento(tipo, dados);
    
    // Desconta os tokens
    await deductTokens(userId, 2, `Geração de documento: ${documento.nome}`);
    
    res.json({
      success: true,
      documento: documento.conteudo,
      nome: documento.nome,
      tokensUsados: 2
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar templates de documentos disponíveis
app.get('/api/ai/templates', (req, res) => {
  const templates = listarTemplates();
  res.json(templates);
});

// =============================================================
// 📄 SCRAPING DE PROCESSOS (COBRA 2 TOKENS)
// =============================================================

app.post('/api/scraper/process', authenticateUser, checkTokens(2), async (req, res) => {
  try {
    const { numeroProcesso, leadId } = req.body;
    const userId = req.userId;
    
    console.log(`🔍 Iniciando scraping do processo ${numeroProcesso} para usuário ${userId}`);
    
    // Executa o scraping
    const resultado = await scrapeProcess(numeroProcesso);
    
    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error });
    }
    
    // Salva o processo no banco
    const processoInserido = await pool.query(
      `INSERT INTO processos 
       (user_id, lead_id, numero_processo, tribunal, classe, assunto, foro, vara, juiz, partes, status, dados_completos)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        userId,
        leadId || null,
        resultado.data.numero,
        resultado.data.tribunal,
        resultado.data.classe || null,
        resultado.data.assunto || null,
        resultado.data.foro || null,
        resultado.data.vara || null,
        resultado.data.juiz || null,
        resultado.data.partes || [],
        resultado.data.status || 'ativo',
        JSON.stringify(resultado.data)
      ]
    );
    
    // Salva movimentações
    if (resultado.data.movimentacoes && resultado.data.movimentacoes.length > 0) {
      for (const mov of resultado.data.movimentacoes) {
        await pool.query(
          `INSERT INTO movimentacoes_processuais (processo_id, data_movimentacao, descricao, conteudo_completo)
           VALUES ($1, NOW(), $2, $3)`,
          [processoInserido.rows[0].id, mov.descricao, mov.descricao]
        );
      }
    }
    
    // Desconta os tokens
    await deductTokens(userId, 2, `Scraping do processo ${numeroProcesso}`);
    
    console.log(`✅ Processo ${numeroProcesso} coletado com sucesso`);
    
    res.json({
      success: true,
      processo: resultado.data,
      processoId: processoInserido.rows[0].id,
      tokensUsados: 2
    });
  } catch (err) {
    console.error('Erro no scraping:', err);
    res.status(500).json({ error: err.message });
  }
});

// Listar processos do usuário
app.get('/api/processos', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT * FROM processos WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================
// 📊 EXPORTAÇÃO DE DOSSIÊ (COBRA 1 TOKEN)
// =============================================================

app.post('/api/leads/:id/export', authenticateUser, checkTokens(1), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    // Busca dados completos do lead
    const lead = await pool.query(
      'SELECT * FROM leads WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (lead.rows.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }
    
    // Busca conversas
    const conversas = await pool.query(
      'SELECT * FROM conversas WHERE lead_id = $1 ORDER BY created_at ASC',
      [id]
    );
    
    // Busca processos relacionados
    const processos = await pool.query(
      'SELECT * FROM processos WHERE lead_id = $1',
      [id]
    );
    
    // Monta o dossiê
    const dossie = {
      lead: lead.rows[0],
      totalConversas: conversas.rows.length,
      conversas: conversas.rows,
      processos: processos.rows,
      dataExportacao: new Date().toISOString()
    };
    
    // Desconta o token
    await deductTokens(userId, 1, `Exportação de dossiê do lead ${lead.rows[0].nome}`);
    
    res.json({
      success: true,
      dossie,
      tokensUsados: 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================
// 📱 WEBHOOK WHATSAPP (Recebe mensagens da Evolution API)
// =============================================================

app.post('/api/webhook/whatsapp', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    console.log('📱 Webhook recebido:', event);
    
    // Se for mensagem recebida
    if (event === 'messages.upsert') {
      const message = data.messages[0];
      const userId = req.query.userId; // Vem da URL configurada no webhook
      
      if (!message.key.fromMe) { // Ignora mensagens enviadas por nós
        const telefone = message.key.remoteJid.replace('@s.whatsapp.net', '');
        const texto = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        
        // Verifica se já existe lead com este telefone
        let lead = await pool.query(
          'SELECT id FROM leads WHERE telefone = $1 AND user_id = $2',
          [telefone, userId]
        );
        
        let leadId;
        
        if (lead.rows.length === 0) {
          // Cria novo lead
          const novoLead = await pool.query(
            `INSERT INTO leads (user_id, telefone, resumo, status, origem)
             VALUES ($1, $2, $3, 'novo', 'whatsapp')
             RETURNING id`,
            [userId, telefone, texto.substring(0, 200)]
          );
          leadId = novoLead.rows[0].id;
          
          console.log(`✅ Novo lead criado: ${leadId}`);
          
          // Cria notificação para o usuário
          await pool.query(
            `INSERT INTO notifications (user_id, tipo, titulo, mensagem, prioridade)
             VALUES ($1, 'lead_hot', 'Novo Lead!', $2, 'alta')`,
            [userId, `Novo contato de ${telefone}`]
          );
        } else {
          leadId = lead.rows[0].id;
        }
        
        // Registra a conversa
        await pool.query(
          `INSERT INTO conversas (lead_id, telefone, tipo, conteudo, sentido)
           VALUES ($1, $2, 'text', $3, 'incoming')`,
          [leadId, telefone, texto]
        );
        
        console.log(`📥 Mensagem salva do lead ${leadId}`);
      }
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Erro no webhook:', err);
    res.status(500).json({ error: err.message });
  }
});

// =============================================================
// 👤 DETALHES DE LEAD
// =============================================================

app.get('/api/leads/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const lead = await pool.query(
      'SELECT * FROM leads WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (lead.rows.length === 0) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }
    
    res.json(lead.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Histórico de conversas de um lead
app.get('/api/leads/:id/conversation', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversas = await pool.query(
      'SELECT * FROM conversas WHERE lead_id = $1 ORDER BY created_at ASC',
      [id]
    );
    
    res.json(conversas.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================
// 👨‍💼 ADMIN - GESTÃO DE USUÁRIOS
// =============================================================

app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.nome as name,
        u.email,
        u.company,
        u.role,
        u.tokens_available,
        u.tokens_consumed,
        u.status,
        u.created_at,
        COUNT(DISTINCT l.id) as total_leads,
        COUNT(DISTINCT wi.id) as total_instances
      FROM usuarios u
      LEFT JOIN leads l ON l.user_id = u.id
      LEFT JOIN whatsapp_instances wi ON wi.user_id = u.id
      WHERE u.role != 'admin'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Métricas globais do sistema (Admin)
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM usuarios WHERE role != \'admin\'');
    const totalLeads = await pool.query('SELECT COUNT(*) as count FROM leads');
    const totalTokensConsumed = await pool.query('SELECT SUM(tokens_consumed) as total FROM usuarios');
    const totalInstances = await pool.query('SELECT COUNT(*) as count FROM whatsapp_instances');
    const leadsConvertidos = await pool.query('SELECT COUNT(*) as count FROM leads WHERE status = \'convertido\'');
    
    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalLeads: parseInt(totalLeads.rows[0].count),
      totalTokensConsumed: parseInt(totalTokensConsumed.rows[0].total || 0),
      totalInstances: parseInt(totalInstances.rows[0].count),
      leadsConvertidos: parseInt(leadsConvertidos.rows[0].count),
      taxaConversao: totalLeads.rows[0].count > 0 
        ? ((leadsConvertidos.rows[0].count / totalLeads.rows[0].count) * 100).toFixed(2)
        : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================================
// 💳 CAKTO PAYMENT GATEWAY - CHECKOUT TRANSPARENTE
// =============================================================

// Criar checkout (Pix, Boleto, Link)
app.post('/api/payment/checkout', authenticateUser, async (req, res) => {
  try {
    const {
      valor,
      quantidade_tokens,
      plano_id,
      metodo_pagamento,
      cliente
    } = req.body;
    
    const userId = req.userId;

    // Busca dados do usuário
    const user = await pool.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData = user.rows[0];

    const resultado = await caktoService.criarCheckout({
      valor,
      descricao: `Recarga de ${quantidade_tokens} tokens - Advocatus IA`,
      clienteNome: cliente?.nome || userData.nome,
      clienteEmail: cliente?.email || userData.email,
      clienteCPF: cliente?.cpf || userData.cpf_cnpj,
      clienteTelefone: cliente?.telefone || userData.telefone,
      metodoPagamento: metodo_pagamento || 'pix',
      planoId: plano_id,
      userId
    });

    if (resultado.success) {
      // Registra transação pendente
      await pool.query(
        `INSERT INTO transacoes (user_id, tipo, quantidade_tokens, valor, status, metodo_pagamento, gateway, gateway_transaction_id, metadata)
         VALUES ($1, 'purchase', $2, $3, 'pending', $4, 'cakto', $5, $6)`,
        [
          userId,
          quantidade_tokens,
          valor,
          metodo_pagamento,
          resultado.checkout_id,
          JSON.stringify(resultado)
        ]
      );

      res.json({
        success: true,
        checkout: resultado
      });
    } else {
      res.status(400).json(resultado);
    }

  } catch (err) {
    console.error('Erro ao criar checkout:', err);
    res.status(500).json({ error: err.message });
  }
});

// Processar pagamento com cartão (checkout transparente)
app.post('/api/payment/process-card', authenticateUser, async (req, res) => {
  try {
    const {
      valor,
      quantidade_tokens,
      parcelas,
      card_number,
      card_holder,
      card_expiry,
      card_cvv,
      cliente
    } = req.body;

    const userId = req.userId;

    // Busca dados do usuário
    const user = await pool.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
    const userData = user.rows[0];

    const resultado = await caktoService.processarCartao({
      valor,
      parcelas: parcelas || 1,
      cardNumber: card_number,
      cardHolder: card_holder,
      cardExpiry: card_expiry,
      cardCVV: card_cvv,
      clienteNome: cliente?.nome || userData.nome,
      clienteEmail: cliente?.email || userData.email,
      clienteCPF: cliente?.cpf || userData.cpf_cnpj,
      clienteTelefone: cliente?.telefone || userData.telefone,
      userId,
      planoId: null
    });

    if (resultado.success && resultado.approved) {
      // Adiciona tokens ao usuário
      await pool.query(
        `UPDATE usuarios 
         SET tokens_available = tokens_available + $1, tokens_total = tokens_total + $1
         WHERE id = $2`,
        [quantidade_tokens, userId]
      );

      // Registra transação aprovada
      await pool.query(
        `INSERT INTO transacoes (user_id, tipo, quantidade_tokens, valor, status, metodo_pagamento, gateway, gateway_transaction_id)
         VALUES ($1, 'purchase', $2, $3, 'completed', 'credit_card', 'cakto', $4)`,
        [userId, quantidade_tokens, valor, resultado.transaction_id]
      );

      console.log(`✅ Pagamento aprovado! ${quantidade_tokens} tokens adicionados ao usuário ${userId}`);

      res.json({
        success: true,
        approved: true,
        tokens_adicionados: quantidade_tokens,
        novo_saldo: (user.rows[0].tokens_available || 0) + quantidade_tokens,
        transaction_id: resultado.transaction_id
      });

    } else {
      res.status(400).json({
        success: false,
        error: resultado.error || 'Pagamento recusado',
        message: resultado.message
      });
    }

  } catch (err) {
    console.error('Erro ao processar cartão:', err);
    res.status(500).json({ error: err.message });
  }
});

// Criar assinatura recorrente
app.post('/api/payment/create-subscription', authenticateUser, async (req, res) => {
  try {
    const {
      plano_id,
      card_token,
      cliente
    } = req.body;

    const userId = req.userId;

    // Busca dados do plano
    const plano = await pool.query('SELECT * FROM planos WHERE id = $1', [plano_id]);
    
    if (plano.rows.length === 0) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    const planoData = plano.rows[0];

    // Busca dados do usuário
    const user = await pool.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
    const userData = user.rows[0];

    const resultado = await caktoService.criarAssinatura({
      planoId: plano_id,
      planoNome: planoData.nome,
      planoPeriodicidade: 'monthly',
      planoValor: planoData.preco_mensal,
      clienteNome: cliente?.nome || userData.nome,
      clienteEmail: cliente?.email || userData.email,
      clienteCPF: cliente?.cpf || userData.cpf_cnpj,
      clienteTelefone: cliente?.telefone || userData.telefone,
      cardToken: card_token,
      userId
    });

    if (resultado.success) {
      // Registra assinatura
      await pool.query(
        `INSERT INTO assinaturas (user_id, plano_id, status, gateway_subscription_id, gateway_pagamento)
         VALUES ($1, $2, 'active', $3, 'cakto')`,
        [userId, plano_id, resultado.subscription_id]
      );

      res.json({
        success: true,
        subscription: resultado
      });
    } else {
      res.status(400).json(resultado);
    }

  } catch (err) {
    console.error('Erro ao criar assinatura:', err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook Cakto (notificações de pagamento)
app.post('/api/webhook/cakto', async (req, res) => {
  try {
    const signature = req.headers['x-cakto-signature'];
    const payload = req.body;

    const resultado = caktoService.processarWebhook(payload, signature);

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error });
    }

    const { event, data } = resultado;

    console.log('📨 Webhook Cakto:', event, data.transaction_id);

    // Atualiza transação no banco
    if (event === 'payment.approved' || event === 'payment.paid') {
      const transacao = await pool.query(
        'SELECT * FROM transacoes WHERE gateway_transaction_id = $1',
        [data.transaction_id]
      );

      if (transacao.rows.length > 0) {
        const trans = transacao.rows[0];

        // Adiciona tokens ao usuário
        await pool.query(
          `UPDATE usuarios 
           SET tokens_available = tokens_available + $1, tokens_total = tokens_total + $1
           WHERE id = $2`,
          [trans.quantidade_tokens, trans.user_id]
        );

        // Atualiza status da transação
        await pool.query(
          'UPDATE transacoes SET status = $1 WHERE id = $2',
          ['completed', trans.id]
        );

        // Cria notificação
        await pool.query(
          `INSERT INTO notifications (user_id, tipo, titulo, mensagem, prioridade)
           VALUES ($1, 'token_purchase', 'Pagamento Aprovado!', $2, 'alta')`,
          [trans.user_id, `Seus ${trans.quantidade_tokens} tokens foram creditados!`]
        );

        console.log(`✅ Pagamento confirmado! ${trans.quantidade_tokens} tokens adicionados`);
      }
    }

    res.json({ success: true });

  } catch (err) {
    console.error('Erro ao processar webhook Cakto:', err);
    res.status(500).json({ error: err.message });
  }
});

// Listar planos disponíveis
app.get('/api/payment/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM planos WHERE ativo = true ORDER BY preco_mensal ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manipulador de erros global para o server não cair
app.use((err, req, res, next) => {
  console.error('💥 Erro Crítico:', err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Backend rodando na porta ${PORT}`));
