const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE usuarios 
        ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS plan_id VARCHAR(50) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS telefone VARCHAR(30) DEFAULT NULL
    `);
    console.log('OK: Colunas trial_expires_at, plan_id, telefone adicionadas (ou ja existiam)!');
  } catch (e) {
    console.error('ERRO:', e.message);
  } finally {
    await pool.end();
  }
}

migrate();
