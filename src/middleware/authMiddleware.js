// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Tuteur = require('../models/Tuteur'); // Assurez-vous que le chemin d'accès est correct

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token du header
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Récupérer l'utilisateur à partir du token et l'ajouter à l'objet req
      req.tuteur = await Tuteur.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Erreur d\'authentification ', error);
      res.status(401).json({ message: 'Non autorisé, token invalide ou expiré' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Non autorisé, pas de token' });
  }
};

module.exports = { protect };
