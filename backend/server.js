require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');

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
    const { instanceName } = req.body;
    console.log(`🚀 Criando instância: ${instanceName}`);
    
    // Payload completo e compatível com Evolution v2.3.7
    const response = await axios.post(`${process.env.EVOLUTION_API_URL}/instance/create`, {
      instanceName: instanceName,
      integration: "WHATSAPP-BAILEYS",
      qrcode: true
    }, { headers: { 'apikey': process.env.EVOLUTION_API_KEY } });

    if (process.env.EVOLUTION_WEBHOOK_URL) {
      await axios.post(`${process.env.EVOLUTION_API_URL}/webhook/set/${instanceName}`, {
        url: process.env.EVOLUTION_WEBHOOK_URL, enabled: true, events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"]
      }, { headers: { 'apikey': process.env.EVOLUTION_API_KEY } }).catch(e => console.error('Erro Webhook:', e.message));
    }
    res.json(response.data);
  } catch (error) { 
    console.error('❌ Erro Evolution:', error.response?.data || error.message);
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
      res.json({ id: user.id, name: user.nome, email: user.email, role: user.role, company: user.company });
    } else { res.status(401).json({ error: 'Credenciais inválidas' }); }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Manipulador de erros global para o server não cair
app.use((err, req, res, next) => {
  console.error('💥 Erro Crítico:', err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Backend rodando na porta ${PORT}`));
