// Middleware de autenticação simples
function authenticateUser(req, res, next) {
  const userId = req.headers['x-user-id'] || req.query.userId || req.body.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  
  req.userId = parseInt(userId);
  next();
}

module.exports = { authenticateUser };
