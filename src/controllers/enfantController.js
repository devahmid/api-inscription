// src/controllers/enfantController.js
const Enfant = require('../models/Enfant');

// Ajouter un enfant
exports.addEnfant = async (req, res) => {
  try {
    const { nom, prenom, dateNaissance } = req.body;
    const enfant = new Enfant({
      nom,
      prenom,
      dateNaissance,
      tuteur: req.user._id, // req.user est défini par le middleware d'authentification
    });

    await enfant.save();
    res.status(201).json(enfant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Lister les enfants du tuteur connecté
exports.getEnfants = async (req, res) => {
  try {
    const enfants = await Enfant.find({ tuteur: req.user._id });
    res.json(enfants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
