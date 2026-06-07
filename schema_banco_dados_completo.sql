-- =============================================================
-- JURIS PULSE FLOW - SCHEMA COMPLETO DO BANCO DE DADOS POSTGRESQL
-- SaaS Jurídico com IA, WhatsApp, Gestão de Leads e Processos
-- Banco de Dados: advocatus
-- Versão: 2.0 - Completo e Escalável
-- =============================================================

-- 1. CRIAÇÃO DO BANCO DE DADOS
-- Execute este comando primeiro se o banco não existir:
-- CREATE DATABASE advocatus;
-- \c advocatus;

-- =============================================================
-- 2. EXTENSÕES ÚTEIS
-- =============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca textual avançada

-- =============================================================
-- 3. TABELA DE USUÁRIOS (Advogados e Administradores)
-- =============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'admin', 'user', 'integrator'
    company VARCHAR(255),
    telefone VARCHAR(50),
    cpf_cnpj VARCHAR(20),
    oab VARCHAR(50), -- Registro OAB do advogado
    
    -- Sistema de Créditos/Tokens
    tokens_available INTEGER DEFAULT 0,
    tokens_consumed INTEGER DEFAULT 0,
    tokens_total INTEGER DEFAULT 0, -- Total já adquirido historicamente
    
    -- Controles
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'inactive'
    vacation_mode BOOLEAN DEFAULT FALSE, -- Modo férias (para de receber leads)
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Configurações personalizadas
    settings JSONB DEFAULT '{}', -- Configurações flexíveis (webhooks, preferências, etc.)
    
    -- Metadados
    ultimo_acesso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 4. TABELA DE PLANOS E ASSINATURAS
-- =============================================================
CREATE TABLE IF NOT EXISTS planos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL, -- 'Starter', 'Professional', 'Enterprise'
    descricao TEXT,
    preco_mensal DECIMAL(10,2) NOT NULL,
    tokens_inclusos INTEGER DEFAULT 100, -- Tokens gratuitos por mês
    max_instancias_whatsapp INTEGER DEFAULT 1,
    max_usuarios INTEGER DEFAULT 1, -- Para contas multi-usuário
    features JSONB DEFAULT '[]', -- Lista de features: ["ai_analysis", "scraper", "api_access"]
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assinaturas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    plano_id INTEGER REFERENCES planos(id),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'trial'
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_fim TIMESTAMP,
    auto_renovar BOOLEAN DEFAULT TRUE,
    gateway_pagamento VARCHAR(50), -- 'stripe', 'mercadopago', 'pix'
    gateway_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 5. TABELA DE TRANSAÇÕES (Compra de Tokens)
-- =============================================================
CREATE TABLE IF NOT EXISTS transacoes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'purchase', 'refund', 'bonus', 'subscription'
    quantidade_tokens INTEGER DEFAULT 0,
    valor DECIMAL(10,2),
    moeda VARCHAR(10) DEFAULT 'BRL',
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    metodo_pagamento VARCHAR(50), -- 'credit_card', 'pix', 'boleto'
    gateway VARCHAR(50), -- 'stripe', 'mercadopago'
    gateway_transaction_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 6. TABELA DE INSTÂNCIAS WHATSAPP (Evolution API)
-- =============================================================
CREATE TABLE IF NOT EXISTS whatsapp_instances (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    instance_name VARCHAR(255) UNIQUE NOT NULL,
    instance_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'connecting'
    phone_number VARCHAR(50),
    qr_code TEXT,
    webhook_url TEXT,
    
    -- Estatísticas
    mensagens_enviadas INTEGER DEFAULT 0,
    mensagens_recebidas INTEGER DEFAULT 0,
    leads_capturados INTEGER DEFAULT 0,
    
    -- Configurações
    auto_resposta BOOLEAN DEFAULT TRUE,
    horario_funcionamento JSONB DEFAULT '{"inicio": "08:00", "fim": "18:00"}',
    
    ultimo_ping TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 7. TABELA DE LEADS (Clientes Capturados)
-- =============================================================
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    whatsapp_instance_id INTEGER REFERENCES whatsapp_instances(id) ON DELETE SET NULL,
    
    -- Informações do Lead
    nome VARCHAR(255),
    telefone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    cpf VARCHAR(14),
    
    -- Dados do Caso Jurídico
    resumo TEXT, -- Resumo gerado pela IA
    area VARCHAR(100), -- 'Trabalhista', 'Cível', 'Criminal', 'Família', etc.
    assunto TEXT, -- Descrição detalhada do caso
    urgencia VARCHAR(20) DEFAULT 'normal', -- 'baixa', 'normal', 'alta', 'urgente'
    
    -- Classificação e Score
    kanban_stage VARCHAR(50) DEFAULT 'triagem', -- 'triagem', 'documentacao', 'aguardando', 'contrato', 'fechado', 'descartado'
    score_confianca INTEGER DEFAULT 0, -- 0 a 100 (quão confiável é o lead)
    temperatura VARCHAR(20) DEFAULT 'cold', -- 'hot', 'warm', 'cold'
    origem VARCHAR(50) DEFAULT 'whatsapp', -- 'whatsapp', 'site', 'indicacao', 'manual'
    
    -- Status e Controle
    status VARCHAR(50) DEFAULT 'novo', -- 'novo', 'contatado', 'em_negociacao', 'convertido', 'perdido'
    has_lawyer BOOLEAN DEFAULT FALSE, -- Já tem advogado?
    valor_causa DECIMAL(15,2),
    valor_honorarios DECIMAL(15,2),
    
    -- Processo Judicial (se aplicável)
    numero_processo VARCHAR(50),
    tribunal VARCHAR(100),
    
    -- Atribuição e Follow-up
    atribuido_a INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    proximo_contato TIMESTAMP,
    ultimo_contato TIMESTAMP,
    
    -- Tokens e Custo
    token_cost INTEGER DEFAULT 1, -- Quanto custou processar este lead
    
    -- Metadados
    tags VARCHAR(255)[], -- Array de tags: ['urgente', 'alto_valor', 'recorrente']
    notas TEXT,
    metadata JSONB DEFAULT '{}', -- Dados extras flexíveis
    
    descartado BOOLEAN DEFAULT FALSE,
    motivo_descarte VARCHAR(255),
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 8. TABELA DE CONVERSAS (Histórico WhatsApp)
-- =============================================================
CREATE TABLE IF NOT EXISTS conversas (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    whatsapp_instance_id INTEGER REFERENCES whatsapp_instances(id) ON DELETE SET NULL,
    telefone VARCHAR(50) NOT NULL,
    
    -- Dados da Conversa
    tipo VARCHAR(20) NOT NULL, -- 'text', 'audio', 'image', 'document', 'video'
    conteudo TEXT,
    midia_url TEXT,
    sentido VARCHAR(20) NOT NULL, -- 'incoming' (recebido), 'outgoing' (enviado)
    
    -- IA e Análise
    analisado_ia BOOLEAN DEFAULT FALSE,
    sentimento VARCHAR(20), -- 'positivo', 'neutro', 'negativo'
    intencao VARCHAR(50), -- 'contratacao', 'duvida', 'urgente', 'spam'
    
    -- Status
    lida BOOLEAN DEFAULT FALSE,
    respondida BOOLEAN DEFAULT FALSE,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 9. TABELA DE PROCESSOS JURÍDICOS (Scraping)
-- =============================================================
CREATE TABLE IF NOT EXISTS processos (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Identificação do Processo
    numero_processo VARCHAR(50) UNIQUE NOT NULL,
    tribunal VARCHAR(100) NOT NULL, -- 'TJSP', 'TRT-2', 'STF', etc.
    
    -- Dados do Processo
    classe VARCHAR(255),
    assunto TEXT,
    foro VARCHAR(255),
    vara VARCHAR(255),
    juiz VARCHAR(255),
    
    -- Partes
    partes TEXT[], -- Array com as partes: ['Autor: João', 'Réu: Empresa X']
    
    -- Status
    status VARCHAR(50) DEFAULT 'ativo', -- 'ativo', 'arquivado', 'suspenso', 'sentenciado'
    fase VARCHAR(100), -- 'Instrução', 'Sentença', 'Recurso', etc.
    
    -- Movimentações (última atualização)
    ultima_movimentacao JSONB,
    data_ultima_movimentacao TIMESTAMP,
    
    -- Controle de Scraping
    ultima_consulta TIMESTAMP,
    proxima_consulta TIMESTAMP,
    frequencia_consulta INTEGER DEFAULT 24, -- em horas
    scraping_ativo BOOLEAN DEFAULT TRUE,
    
    -- Metadados completos
    dados_completos JSONB DEFAULT '{}', -- JSON com TODOS os dados do scraping
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 10. TABELA DE MOVIMENTAÇÕES PROCESSUAIS
-- =============================================================
CREATE TABLE IF NOT EXISTS movimentacoes_processuais (
    id SERIAL PRIMARY KEY,
    processo_id INTEGER REFERENCES processos(id) ON DELETE CASCADE,
    data_movimentacao TIMESTAMP NOT NULL,
    descricao TEXT NOT NULL,
    tipo VARCHAR(100), -- 'Despacho', 'Sentença', 'Audiência', etc.
    conteudo_completo TEXT,
    notificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 11. TABELA DE NOTIFICAÇÕES
-- =============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'lead_hot', 'processo_update', 'token_low', 'sistema'
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    link VARCHAR(500), -- Link para a página relacionada
    icone VARCHAR(50), -- Nome do ícone/emoji
    prioridade VARCHAR(20) DEFAULT 'normal', -- 'baixa', 'normal', 'alta', 'critica'
    lida BOOLEAN DEFAULT FALSE,
    acao_requerida BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 12. TABELA DE AGENDAMENTOS/COMPROMISSOS
-- =============================================================
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    processo_id INTEGER REFERENCES processos(id) ON DELETE SET NULL,
    
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50), -- 'audiencia', 'consulta', 'prazo', 'reuniao'
    data_hora TIMESTAMP NOT NULL,
    duracao INTEGER, -- em minutos
    local VARCHAR(255),
    
    status VARCHAR(50) DEFAULT 'agendado', -- 'agendado', 'confirmado', 'concluido', 'cancelado'
    lembrete_enviado BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 13. TABELA DE SCRIPTS DE ATENDIMENTO (IA)
-- =============================================================
CREATE TABLE IF NOT EXISTS scripts_atendimento (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    area_juridica VARCHAR(100), -- 'Trabalhista', 'Cível', etc.
    
    -- Conteúdo do Script
    prompt_inicial TEXT NOT NULL,
    perguntas_chave TEXT[], -- Array de perguntas para a IA fazer
    criterios_qualificacao JSONB DEFAULT '{}', -- Critérios para classificar o lead
    
    ativo BOOLEAN DEFAULT TRUE,
    prioridade INTEGER DEFAULT 0, -- Ordem de execução
    
    -- Estatísticas
    vezes_usado INTEGER DEFAULT 0,
    taxa_conversao DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 14. TABELA DE LOGS DE IA (Para análise de performance)
-- =============================================================
CREATE TABLE IF NOT EXISTS ai_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    conversa_id INTEGER REFERENCES conversas(id) ON DELETE SET NULL,
    
    tipo_operacao VARCHAR(50) NOT NULL, -- 'classification', 'analysis', 'response', 'scraping'
    modelo_ia VARCHAR(100), -- 'gpt-4', 'claude', 'llama', etc.
    
    -- Dados da Requisição
    prompt TEXT,
    resposta TEXT,
    tokens_usados INTEGER,
    tempo_resposta INTEGER, -- em milissegundos
    
    -- Resultado
    sucesso BOOLEAN DEFAULT TRUE,
    erro TEXT,
    confianca DECIMAL(5,2), -- Nível de confiança da IA (0-100)
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 15. TABELA DE CONFIGURAÇÕES DO SISTEMA
-- =============================================================
CREATE TABLE IF NOT EXISTS configuracoes_sistema (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    descricao TEXT,
    editavel BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 16. TABELA DE WEBHOOKS E INTEGRAÇÕES
-- =============================================================
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    evento VARCHAR(50) NOT NULL, -- 'lead_created', 'lead_converted', 'processo_updated', etc.
    metodo VARCHAR(10) DEFAULT 'POST', -- 'POST', 'GET', 'PUT'
    headers JSONB DEFAULT '{}',
    ativo BOOLEAN DEFAULT TRUE,
    
    -- Estatísticas
    ultimo_disparo TIMESTAMP,
    total_disparos INTEGER DEFAULT 0,
    total_erros INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- 17. ÍNDICES PARA OTIMIZAÇÃO
-- =============================================================

-- Usuários
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_telefone ON leads(telefone);
CREATE INDEX IF NOT EXISTS idx_leads_kanban_stage ON leads(kanban_stage);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_temperatura ON leads(temperatura);
CREATE INDEX IF NOT EXISTS idx_leads_data_criacao ON leads(data_criacao DESC);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score_confianca DESC);

-- Conversas
CREATE INDEX IF NOT EXISTS idx_conversas_lead_id ON conversas(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversas_telefone ON conversas(telefone);
CREATE INDEX IF NOT EXISTS idx_conversas_created_at ON conversas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversas_lida ON conversas(lida) WHERE lida = FALSE;

-- Processos
CREATE INDEX IF NOT EXISTS idx_processos_numero ON processos(numero_processo);
CREATE INDEX IF NOT EXISTS idx_processos_user_id ON processos(user_id);
CREATE INDEX IF NOT EXISTS idx_processos_lead_id ON processos(lead_id);
CREATE INDEX IF NOT EXISTS idx_processos_tribunal ON processos(tribunal);
CREATE INDEX IF NOT EXISTS idx_processos_status ON processos(status);

-- Movimentações
CREATE INDEX IF NOT EXISTS idx_movimentacoes_processo_id ON movimentacoes_processuais(processo_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON movimentacoes_processuais(data_movimentacao DESC);

-- Notificações
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_lida ON notifications(lida) WHERE lida = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- WhatsApp Instances
CREATE INDEX IF NOT EXISTS idx_whatsapp_user_id ON whatsapp_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_status ON whatsapp_instances(status);

-- Transações
CREATE INDEX IF NOT EXISTS idx_transacoes_user_id ON transacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_status ON transacoes(status);
CREATE INDEX IF NOT EXISTS idx_transacoes_created_at ON transacoes(created_at DESC);

-- Agendamentos
CREATE INDEX IF NOT EXISTS idx_agendamentos_user_id ON agendamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_hora ON agendamentos(data_hora);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);

-- AI Logs
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON ai_logs(created_at DESC);

-- =============================================================
-- 18. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =============================================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processos_updated_at BEFORE UPDATE ON processos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_instances_updated_at BEFORE UPDATE ON whatsapp_instances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- 19. FUNÇÕES ÚTEIS
-- =============================================================

-- Função para calcular ROI do usuário
CREATE OR REPLACE FUNCTION calcular_roi_usuario(p_user_id INTEGER)
RETURNS TABLE(
    investimento DECIMAL(10,2),
    retorno DECIMAL(10,2),
    roi_percentual DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(t.valor), 0) as investimento,
        COALESCE(SUM(l.valor_honorarios), 0) as retorno,
        CASE 
            WHEN COALESCE(SUM(t.valor), 0) > 0 THEN
                ((COALESCE(SUM(l.valor_honorarios), 0) - COALESCE(SUM(t.valor), 0)) / COALESCE(SUM(t.valor), 1)) * 100
            ELSE 0
        END as roi_percentual
    FROM transacoes t
    LEFT JOIN leads l ON l.user_id = t.user_id AND l.status = 'convertido'
    WHERE t.user_id = p_user_id AND t.status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- 20. VIEWS ÚTEIS
-- =============================================================

-- View: Dashboard de Leads por Estágio
CREATE OR REPLACE VIEW v_leads_por_estagio AS
SELECT 
    user_id,
    kanban_stage,
    COUNT(*) as total,
    AVG(score_confianca) as score_medio,
    SUM(CASE WHEN temperatura = 'hot' THEN 1 ELSE 0 END) as hot_leads,
    SUM(valor_honorarios) as valor_total_potencial
FROM leads
WHERE descartado = FALSE
GROUP BY user_id, kanban_stage;

-- View: Performance de Conversão
CREATE OR REPLACE VIEW v_performance_conversao AS
SELECT 
    user_id,
    COUNT(*) as total_leads,
    SUM(CASE WHEN status = 'convertido' THEN 1 ELSE 0 END) as convertidos,
    ROUND(
        (SUM(CASE WHEN status = 'convertido' THEN 1 ELSE 0 END)::DECIMAL / 
        NULLIF(COUNT(*), 0)) * 100, 
        2
    ) as taxa_conversao,
    SUM(valor_honorarios) FILTER (WHERE status = 'convertido') as receita_total
FROM leads
GROUP BY user_id;

-- View: Ranking de Clientes (Para Administradores)
CREATE OR REPLACE VIEW v_ranking_clientes AS
SELECT 
    u.id,
    u.nome,
    u.company,
    u.email,
    COUNT(DISTINCT l.id) as total_leads,
    SUM(CASE WHEN l.status = 'convertido' THEN 1 ELSE 0 END) as leads_convertidos,
    u.tokens_consumed,
    SUM(l.valor_honorarios) FILTER (WHERE l.status = 'convertido') as receita_gerada,
    COUNT(DISTINCT wi.id) as instancias_whatsapp
FROM usuarios u
LEFT JOIN leads l ON l.user_id = u.id
LEFT JOIN whatsapp_instances wi ON wi.user_id = u.id
WHERE u.role = 'user'
GROUP BY u.id, u.nome, u.company, u.email, u.tokens_consumed
ORDER BY leads_convertidos DESC, receita_gerada DESC;

-- =============================================================
-- 21. DADOS INICIAIS (SEED DATA)
-- =============================================================

-- Inserir Planos Padrão
INSERT INTO planos (nome, descricao, preco_mensal, tokens_inclusos, max_instancias_whatsapp, max_usuarios, features) VALUES
('Starter', 'Ideal para advogados autônomos', 97.00, 100, 1, 1, '["ai_analysis", "lead_management", "whatsapp_integration"]'),
('Professional', 'Para escritórios médios', 297.00, 500, 3, 5, '["ai_analysis", "lead_management", "whatsapp_integration", "process_scraping", "advanced_analytics"]'),
('Enterprise', 'Solução completa para grandes escritórios', 997.00, 2000, 10, 20, '["ai_analysis", "lead_management", "whatsapp_integration", "process_scraping", "advanced_analytics", "api_access", "white_label", "priority_support"]')
ON CONFLICT DO NOTHING;

-- Inserir Usuário Administrador
INSERT INTO usuarios (nome, email, senha, role, company, tokens_available, tokens_total, status) 
VALUES ('Administrador', 'admin@advocatus.com', '32080910', 'admin', 'Juris Pulse Flow', 10000, 10000, 'active')
ON CONFLICT (email) DO NOTHING;

-- Inserir Usuário de Teste
INSERT INTO usuarios (nome, email, senha, role, company, oab, tokens_available, tokens_total, status) 
VALUES ('Dr. João Silva', 'joao@teste.com', 'teste123', 'user', 'Silva Advocacia', 'SP123456', 500, 500, 'active')
ON CONFLICT (email) DO NOTHING;

-- Inserir Configurações do Sistema
INSERT INTO configuracoes_sistema (chave, valor, tipo, descricao) VALUES
('sistema_nome', 'Juris Pulse Flow', 'string', 'Nome do sistema'),
('versao', '2.0.0', 'string', 'Versão atual do sistema'),
('manutencao', 'false', 'boolean', 'Modo manutenção ativo'),
('max_leads_por_usuario', '1000', 'number', 'Limite máximo de leads por usuário'),
('tokens_por_lead', '1', 'number', 'Custo em tokens por lead processado'),
('tokens_por_scraping', '2', 'number', 'Custo em tokens por consulta de processo'),
('ia_provider', 'openai', 'string', 'Provedor de IA padrão'),
('ia_model', 'gpt-4', 'string', 'Modelo de IA padrão')
ON CONFLICT (chave) DO NOTHING;

-- =============================================================
-- 22. COMENTÁRIOS E DOCUMENTAÇÃO
-- =============================================================

COMMENT ON TABLE usuarios IS 'Tabela principal de usuários do sistema (advogados, integradores e administradores)';
COMMENT ON TABLE leads IS 'Leads capturados via WhatsApp ou outras fontes, com classificação de IA';
COMMENT ON TABLE processos IS 'Processos jurídicos monitorados via scraping dos tribunais';
COMMENT ON TABLE conversas IS 'Histórico completo de conversas do WhatsApp com os leads';
COMMENT ON TABLE ai_logs IS 'Logs de todas as operações de IA para análise de performance e custos';
COMMENT ON TABLE transacoes IS 'Histórico financeiro de compras de tokens e assinaturas';

-- =============================================================
-- FIM DO SCHEMA
-- =============================================================

-- Para verificar se tudo foi criado corretamente:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Para verificar total de registros:
-- SELECT 
--     schemaname,
--     tablename,
--     (SELECT COUNT(*) FROM usuarios) as total_usuarios,
--     (SELECT COUNT(*) FROM leads) as total_leads,
--     (SELECT COUNT(*) FROM processos) as total_processos
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- LIMIT 1;
