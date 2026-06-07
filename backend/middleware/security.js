const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss');
const validator = require('validator');
const crypto = require('crypto');

// =============================================================
// 🛡️ RATE LIMITING - PROTEÇÃO CONTRA ATAQUES DDoS E FORÇA BRUTA
// =============================================================

// Rate limit para login (mais restritivo)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 tentativas por IP
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'RATE_LIMIT_LOGIN'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip + ':' + (req.body.email || 'no-email');
  }
});

// Rate limit geral para APIs
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 1000 requests por IP
  message: {
    error: 'Muitas requisições. Tente novamente em alguns minutos.',
    code: 'RATE_LIMIT_GENERAL'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limit para APIs de IA (mais restritivo)
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 50, // Máximo 50 chamadas de IA por usuário
  message: {
    error: 'Limite de uso da IA atingido. Aguarde alguns minutos.',
    code: 'RATE_LIMIT_AI'
  },
  keyGenerator: (req) => {
    return req.userId ? `user:${req.userId}` : req.ip;
  }
});

// Rate limit para scraping (muito restritivo)
const scrapingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10, // Máximo 10 consultas por usuário
  message: {
    error: 'Limite de consultas aos tribunais atingido. Aguarde 10 minutos.',
    code: 'RATE_LIMIT_SCRAPING'
  },
  keyGenerator: (req) => {
    return req.userId ? `scrape:${req.userId}` : req.ip;
  }
});

// =============================================================
// 🔒 SANITIZAÇÃO E VALIDAÇÃO DE INPUTS
// =============================================================

// Sanitizar strings para prevenir XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return xss(input, {
    whiteList: {}, // Remove todas as tags HTML
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  });
};

// Validar e sanitizar dados de entrada
const validateAndSanitize = (req, res, next) => {
  try {
    // IA: prompt pode ser muito grande; sanitização pesada pode quebrar o payload.
    // Mantemos a validação no controller (aiController) e evitamos sanitização aqui.
    if (req.path && req.path.startsWith('/api/ai/')) {
      return next();
    }

    // Sanitizar todos os campos de texto
    const sanitizeObject = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;

      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          sanitized[key] = sanitizeInput(value.trim());
        } else if (typeof value === 'object') {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };

    // Sanitizar body, query e params
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    if (req.params) req.params = sanitizeObject(req.params);

    // Validações específicas
    if (req.body.email && !validator.isEmail(req.body.email)) {
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    if (req.body.telefone && !validator.isMobilePhone(req.body.telefone, 'pt-BR')) {
      return res.status(400).json({ error: 'Telefone inválido' });
    }

    if (req.body.cpf && !validator.isLength(req.body.cpf, { min: 11, max: 14 })) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    next();
  } catch (error) {
    console.error('❌ Erro na sanitização:', error);
    res.status(400).json({ error: 'Dados inválidos fornecidos' });
  }
};

// =============================================================
// 🔐 VALIDAÇÃO DE JWT E SESSÃO
// =============================================================

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

// Gerar token JWT seguro
const generateSecureToken = (userId, email) => {
  const payload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    issuer: 'advocatus-ia',
    audience: 'advocatus-users'
  });
};

// Verificar token JWT e validar sessão
const verifySecureToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token de acesso obrigatório',
        code: 'MISSING_TOKEN'
      });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'advocatus-ia',
      audience: 'advocatus-users'
    });

    // Verificar se o token não expirou
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    console.error('❌ Token inválido:', error.message);
    return res.status(401).json({ 
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
};

// =============================================================
// 🔍 DETECÇÃO DE ATAQUES E COMPORTAMENTO SUSPEITO
// =============================================================

// Cache para detectar padrões suspeitos
const suspiciousActivityCache = new Map();

// Detectar comportamento suspeito
const detectSuspiciousActivity = (req, res, next) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';
    const userId = req.userId;
    
    const key = userId || clientIP;
    const now = Date.now();
    
    // Obter histórico de atividade
    let activity = suspiciousActivityCache.get(key) || {
      requests: [],
      failedLogins: 0,
      lastActivity: now,
      blocked: false
    };

    // Limpar requisições antigas (últimos 5 minutos)
    activity.requests = activity.requests.filter(time => now - time < 5 * 60 * 1000);
    
    // Adicionar nova requisição
    activity.requests.push(now);
    activity.lastActivity = now;

    // Detecção de padrões suspeitos
    const suspiciousPatterns = [
      // Muitas requisições em pouco tempo
      activity.requests.length > 100,
      
      // User-Agent suspeito (bots, scrapers)
      /bot|crawl|spider|scraper|curl|wget|python|postman/i.test(userAgent),
      
      // Múltiplas tentativas de login falhadas
      activity.failedLogins > 10,
      
      // Requisições muito frequentes (mais de 50 por minuto)
      activity.requests.length > 50
    ];

    if (suspiciousPatterns.some(pattern => pattern)) {
      activity.blocked = true;
      suspiciousActivityCache.set(key, activity);
      
      console.warn(`🚨 Atividade suspeita detectada: ${key} - IP: ${clientIP} - UA: ${userAgent}`);
      
      return res.status(429).json({
        error: 'Atividade suspeita detectada. Conta temporariamente bloqueada.',
        code: 'SUSPICIOUS_ACTIVITY'
      });
    }

    // Se estava bloqueado mas já passou tempo suficiente (1 hora), desbloquear
    if (activity.blocked && now - activity.lastActivity > 60 * 60 * 1000) {
      activity.blocked = false;
      activity.failedLogins = 0;
      activity.requests = [];
    }

    // Se ainda está bloqueado, rejeitar
    if (activity.blocked) {
      return res.status(429).json({
        error: 'Conta temporariamente bloqueada por atividade suspeita.',
        code: 'ACCOUNT_BLOCKED'
      });
    }

    // Atualizar cache
    suspiciousActivityCache.set(key, activity);
    next();
  } catch (error) {
    console.error('❌ Erro na detecção de atividade suspeita:', error);
    next(); // Continua em caso de erro para não quebrar o sistema
  }
};

// Incrementar contador de falhas de login
const recordLoginFailure = (identifier) => {
  const activity = suspiciousActivityCache.get(identifier) || {
    requests: [],
    failedLogins: 0,
    lastActivity: Date.now(),
    blocked: false
  };
  
  activity.failedLogins++;
  suspiciousActivityCache.set(identifier, activity);
};

// =============================================================
// 🛡️ HEADERS DE SEGURANÇA
// =============================================================

// Configurar headers de segurança com helmet
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.cakto.com.br"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'none'"],
      childSrc: ["'none'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Para compatibilidade
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  }
});

// Headers adicionais customizados
const customSecurityHeaders = (req, res, next) => {
  // Remover headers que revelam tecnologia
  res.removeHeader('X-Powered-By');
  
  // Headers de segurança adicionais
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  
  // Header customizado para identificar nossa API
  res.setHeader('X-API-Version', '2.0');
  
  next();
};

// =============================================================
// 🔐 VALIDAÇÃO DE DADOS CRÍTICOS
// =============================================================

// Validar dados de pagamento
const validatePaymentData = (req, res, next) => {
  const { valor, card_number, card_expiry, card_cvv } = req.body;
  
  if (valor && (isNaN(valor) || valor < 0 || valor > 10000)) {
    return res.status(400).json({ error: 'Valor de pagamento inválido' });
  }
  
  if (card_number && !validator.isCreditCard(card_number.replace(/\s/g, ''))) {
    return res.status(400).json({ error: 'Número do cartão inválido' });
  }
  
  if (card_expiry && !/^(0[1-9]|1[0-2])\/([0-9]{2}|20[2-9][0-9])$/.test(card_expiry)) {
    return res.status(400).json({ error: 'Data de validade inválida' });
  }
  
  if (card_cvv && (!/^[0-9]{3,4}$/.test(card_cvv))) {
    return res.status(400).json({ error: 'CVV inválido' });
  }
  
  next();
};

// =============================================================
// 🚨 LOGGING DE SEGURANÇA
// =============================================================

const securityLogger = (event, details, req = null) => {
  const timestamp = new Date().toISOString();
  const ip = req ? (req.ip || req.connection.remoteAddress) : 'unknown';
  const userAgent = req ? req.headers['user-agent'] : 'unknown';
  const userId = req ? req.userId : null;
  
  const logEntry = {
    timestamp,
    event,
    details,
    ip,
    userAgent,
    userId
  };
  
  console.log(`🛡️ [SECURITY] ${timestamp} - ${event}:`, JSON.stringify(logEntry));
  
  // Em produção, enviar para sistema de monitoramento (ELK, Datadog, etc.)
  // sendToSecurityMonitoring(logEntry);
};

// Middleware para log de tentativas de acesso
const logSecurityEvent = (event) => {
  return (req, res, next) => {
    securityLogger(event, {
      path: req.path,
      method: req.method,
      body: req.method === 'POST' ? Object.keys(req.body || {}) : null
    }, req);
    next();
  };
};

// =============================================================
// 🛡️ EXPORTAÇÕES
// =============================================================

module.exports = {
  // Rate Limiters
  loginLimiter,
  generalLimiter,
  aiLimiter,
  scrapingLimiter,
  
  // Validação e Sanitização
  validateAndSanitize,
  validatePaymentData,
  
  // JWT e Autenticação
  generateSecureToken,
  verifySecureToken,
  
  // Detecção de Ataques
  detectSuspiciousActivity,
  recordLoginFailure,
  
  // Headers de Segurança
  securityHeaders,
  customSecurityHeaders,
  
  // Logging
  securityLogger,
  logSecurityEvent,
  
  // Utilitários
  sanitizeInput
};