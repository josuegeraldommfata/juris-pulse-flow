-- =============================================================
-- JURIS PULSE FLOW - SCHEMA DO BANCO DE DADOS POSTGRESQL
-- Banco de Dados: advocatus
-- Usuário: postgres (ou o de sua preferência)
-- Senha do Usuário Sugerida: 32080910
-- =============================================================

-- 1. Criação do Banco de Dados (Execute este comando primeiro se necessário)
-- CREATE DATABASE advocatus;

-- 2. Tabela de Usuários (Advogados e Administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'admin' ou 'user'
    company VARCHAR(255),
    tokens_available INTEGER DEFAULT 0,
    tokens_consumed INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Leads (Clientes capturados via WhatsApp/Scraper)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255),
    telefone VARCHAR(50),
    resumo TEXT, -- Resumo da IA sobre o caso
    kanban_stage VARCHAR(50) DEFAULT 'triagem', -- 'triagem', 'documentacao', 'aguardando', 'contrato'
    score_confianca INTEGER DEFAULT 0, -- 0 a 100
    status VARCHAR(50) DEFAULT 'pendente',
    area VARCHAR(100), -- Trabalhista, Cível, etc.
    has_lawyer BOOLEAN DEFAULT FALSE,
    token_cost INTEGER DEFAULT 1,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Notificações
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Índices para otimização de buscas
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_kanban_stage ON leads(kanban_stage);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- 6. Inserção de Usuário Administrador de Exemplo
-- Email: admin@advocatus.com | Senha: 32080910
INSERT INTO usuarios (nome, email, senha, role, company, tokens_available) 
VALUES ('Administrador', 'admin@advocatus.com', '32080910', 'admin', 'Juris Pulse Flow', 1000)
ON CONFLICT (email) DO NOTHING;

