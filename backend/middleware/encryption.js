const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// =============================================================
// 🔐 CRIPTOGRAFIA DE DADOS SENSÍVEIS
// =============================================================

// Chave mestra para criptografia (em produção, usar AWS KMS ou similar)
const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Para AES, sempre 16 bytes
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;

// Gerar chave derivada usando PBKDF2
const deriveKey = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
};

// Criptografar dados sensíveis
const encryptSensitiveData = (data) => {
  try {
    if (!data) return null;
    
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = deriveKey(MASTER_KEY, salt);
    
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(Buffer.from('advocatus-ia-data'));
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combinar salt, iv, tag e dados criptografados
    const combined = Buffer.concat([
      salt,
      iv,
      tag,
      Buffer.from(encrypted, 'hex')
    ]).toString('base64');
    
    return combined;
  } catch (error) {
    console.error('❌ Erro ao criptografar dados:', error);
    throw new Error('Falha na criptografia de dados');
  }
};

// Descriptografar dados sensíveis
const decryptSensitiveData = (encryptedData) => {
  try {
    if (!encryptedData) return null;
    
    const combined = Buffer.from(encryptedData, 'base64');
    
    // Extrair componentes
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = combined.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    
    const key = deriveKey(MASTER_KEY, salt);
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAuthTag(tag);
    decipher.setAAD(Buffer.from('advocatus-ia-data'));
    
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('❌ Erro ao descriptografar dados:', error);
    throw new Error('Falha na descriptografia de dados');
  }
};

// =============================================================
// 🔑 HASH DE SENHAS E TOKENS
// =============================================================

// Gerar hash seguro da senha
const hashPassword = async (password) => {
  try {
    // Usar bcrypt com salt rounds 12 (mais seguro que o padrão 10)
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('❌ Erro ao gerar hash da senha:', error);
    throw new Error('Falha ao processar senha');
  }
};

// Verificar senha com hash
const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('❌ Erro ao verificar senha:', error);
    return false;
  }
};

// Gerar token seguro aleatório
const generateSecureRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// =============================================================
// 🛡️ CRIPTOGRAFIA DE DADOS DE LEADS E PROCESSOS
// =============================================================

// Criptografar dados de leads (informações sensíveis dos clientes)
const encryptLeadData = (leadData) => {
  try {
    const sensitiveFields = {
      nome: leadData.nome,
      telefone: leadData.telefone,
      email: leadData.email,
      cpf: leadData.cpf,
      endereco: leadData.endereco,
      detalhes_caso: leadData.detalhes_caso
    };
    
    const encrypted = encryptSensitiveData(sensitiveFields);
    
    return {
      ...leadData,
      dados_criptografados: encrypted,
      // Manter apenas dados não-sensíveis em texto claro
      nome: null,
      telefone: leadData.telefone ? leadData.telefone.substring(0, 5) + '****' : null,
      email: leadData.email ? leadData.email.replace(/(.{2}).*@/, '$1***@') : null,
      cpf: null,
      endereco: null,
      detalhes_caso: null
    };
  } catch (error) {
    console.error('❌ Erro ao criptografar dados do lead:', error);
    return leadData; // Retorna original em caso de erro
  }
};

// Descriptografar dados de leads
const decryptLeadData = (encryptedLeadData) => {
  try {
    if (!encryptedLeadData.dados_criptografados) {
      return encryptedLeadData;
    }
    
    const decryptedFields = decryptSensitiveData(encryptedLeadData.dados_criptografados);
    
    return {
      ...encryptedLeadData,
      ...decryptedFields,
      dados_criptografados: null // Remove dados criptografados da resposta
    };
  } catch (error) {
    console.error('❌ Erro ao descriptografar dados do lead:', error);
    return encryptedLeadData; // Retorna original em caso de erro
  }
};

// =============================================================
// 🔐 MASCARAMENTO DE DADOS SENSÍVEIS PARA LOGS
// =============================================================

// Mascarar dados sensíveis para logs
const maskSensitiveData = (data) => {
  const sensitiveFields = [
    'password', 'senha', 'cpf', 'cnpj', 'card_number', 
    'card_cvv', 'telefone', 'phone', 'email'
  ];
  
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const masked = { ...data };
  
  Object.keys(masked).forEach(key => {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      if (typeof masked[key] === 'string') {
        if (lowerKey.includes('email')) {
          masked[key] = masked[key].replace(/(.{2}).*@/, '$1***@');
        } else if (lowerKey.includes('cpf')) {
          masked[key] = masked[key].replace(/(\d{3}).*(\d{2})/, '$1.***.***-$2');
        } else if (lowerKey.includes('phone') || lowerKey.includes('telefone')) {
          masked[key] = masked[key].replace(/(\d{2}).*(\d{4})/, '($1) ****-$2');
        } else if (lowerKey.includes('card_number')) {
          masked[key] = '**** **** **** ' + masked[key].slice(-4);
        } else {
          masked[key] = '*'.repeat(masked[key].length);
        }
      }
    }
    
    // Recursão para objetos aninhados
    if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key]);
    }
  });
  
  return masked;
};

// =============================================================
// 🔒 VALIDAÇÃO DE INTEGRIDADE DE DADOS
// =============================================================

// Gerar hash de integridade para dados críticos
const generateDataIntegrityHash = (data) => {
  const dataString = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash('sha256').update(dataString + MASTER_KEY).digest('hex');
};

// Verificar integridade dos dados
const verifyDataIntegrity = (data, expectedHash) => {
  const actualHash = generateDataIntegrityHash(data);
  return actualHash === expectedHash;
};

// =============================================================
// 🛡️ MIDDLEWARE DE CRIPTOGRAFIA AUTOMÁTICA
// =============================================================

// Middleware para criptografar automaticamente respostas com dados sensíveis
const encryptResponseData = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    try {
      // Se a resposta contém dados de leads, criptografar automaticamente
      if (data && Array.isArray(data)) {
        data = data.map(item => {
          if (item.telefone || item.cpf || item.email) {
            return encryptLeadData(item);
          }
          return item;
        });
      } else if (data && (data.telefone || data.cpf || data.email)) {
        data = encryptLeadData(data);
      }
      
      originalJson.call(this, data);
    } catch (error) {
      console.error('❌ Erro ao criptografar resposta:', error);
      originalJson.call(this, data); // Retorna sem criptografia em caso de erro
    }
  };
  
  next();
};

// Middleware para descriptografar automaticamente dados de entrada
const decryptRequestData = (req, res, next) => {
  try {
    if (req.body && req.body.dados_criptografados) {
      const decryptedData = decryptSensitiveData(req.body.dados_criptografados);
      req.body = { ...req.body, ...decryptedData };
      delete req.body.dados_criptografados;
    }
  } catch (error) {
    console.error('❌ Erro ao descriptografar dados da requisição:', error);
    return res.status(400).json({ error: 'Dados criptografados inválidos' });
  }
  
  next();
};

// =============================================================
// 🔐 UTILITÁRIOS DE SEGURANÇA
// =============================================================

// Gerar chave API segura para integrações
const generateApiKey = (userId, permissions = []) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  const payload = {
    userId,
    permissions,
    timestamp,
    random
  };
  
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', MASTER_KEY).update(encoded).digest('hex');
  
  return `ak_${encoded}_${signature}`;
};

// Validar chave API
const validateApiKey = (apiKey) => {
  try {
    if (!apiKey || !apiKey.startsWith('ak_')) {
      return null;
    }
    
    const parts = apiKey.substring(3).split('_');
    if (parts.length !== 2) {
      return null;
    }
    
    const [encoded, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', MASTER_KEY).update(encoded).digest('hex');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString());
    
    // Verificar se a chave não expirou (válida por 1 ano)
    if (Date.now() - payload.timestamp > 365 * 24 * 60 * 60 * 1000) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
};

module.exports = {
  // Criptografia Geral
  encryptSensitiveData,
  decryptSensitiveData,
  
  // Hash de Senhas
  hashPassword,
  verifyPassword,
  
  // Tokens Seguros
  generateSecureRandomToken,
  
  // Criptografia de Leads
  encryptLeadData,
  decryptLeadData,
  
  // Mascaramento
  maskSensitiveData,
  
  // Integridade
  generateDataIntegrityHash,
  verifyDataIntegrity,
  
  // Middlewares
  encryptResponseData,
  decryptRequestData,
  
  // API Keys
  generateApiKey,
  validateApiKey
};