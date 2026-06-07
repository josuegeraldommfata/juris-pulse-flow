const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware para verificar se o usuário tem tokens suficientes
function checkTokens(tokensRequired) {
  return async (req, res, next) => {
    try {
      const userId = req.userId;
      
      const result = await pool.query(
        'SELECT tokens_available FROM usuarios WHERE id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      const { tokens_available } = result.rows[0];
      
      if (tokens_available < tokensRequired) {
        return res.status(402).json({ 
          error: 'Tokens insuficientes',
          required: tokensRequired,
          available: tokens_available,
          message: `Você precisa de ${tokensRequired} tokens mas tem apenas ${tokens_available}. Recarregue sua carteira!`
        });
      }
      
      req.tokensRequired = tokensRequired;
      next();
    } catch (error) {
      console.error('Erro ao verificar tokens:', error);
      res.status(500).json({ error: 'Erro ao verificar saldo de tokens' });
    }
  };
}

// Função para descontar tokens após operação bem-sucedida
async function deductTokens(userId, amount, description) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Atualiza o saldo do usuário
    await client.query(
      'UPDATE usuarios SET tokens_available = tokens_available - $1, tokens_consumed = tokens_consumed + $1 WHERE id = $2',
      [amount, userId]
    );
    
    // Registra no log de AI (para histórico)
    await client.query(
      `INSERT INTO ai_logs (user_id, tipo_operacao, tokens_usados, sucesso, metadata) 
       VALUES ($1, $2, $3, true, $4)`,
      [userId, description, amount, JSON.stringify({ timestamp: new Date() })]
    );
    
    await client.query('COMMIT');
    
    console.log(`✅ ${amount} tokens descontados do usuário ${userId} - ${description}`);
    
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao descontar tokens:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { checkTokens, deductTokens };
