const jwt = require('jsonwebtoken');
const Tuteur = require('../models/Tuteur'); // Importez le modèle Tuteur

// Génère un token pour un utilisateur
const generateToken = (userId, isAdmin) => {
  return jwt.sign(
    {
      id: userId,
      isAdmin: isAdmin // Ajoutez isAdmin dans le payload
    },
    'laCleSecrete',
    { expiresIn: '24h' }
  );
};
// Middleware pour protéger les routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, 'laCleSecrete');
      
      req.user = await Tuteur.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error('Erreur d\'authentification', error);
      res.status(401).send({ message: 'Non autorisé' });
    }
  } else {
    res.status(401).send({ message: 'Non autorisé, pas de token' });
  }
};

module.exports = { generateToken, protect };
