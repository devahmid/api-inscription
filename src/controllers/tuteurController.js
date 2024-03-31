// src/controllers/tuteurController.js
const Tuteur = require('../models/Tuteur');
const { generateToken } = require('../config/auth');
// Importez le modèle Enfant
const Enfant = require('../models/Enfant');

// Inscription d'un tuteur
exports.signup = async (req, res) => {
  try {
    const { email } = req.body;
    let tuteur = await Tuteur.findOne({ email });

    if (tuteur) {
      return res.status(400).json({ message: 'Un tuteur avec cet email existe déjà.' });
    }

    tuteur = new Tuteur(req.body);
    await tuteur.save();

    const token = generateToken(tuteur._id, tuteur.isAdmin);
    res.status(201).json({ tuteur, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Connexion d'un tuteur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tuteur = await Tuteur.findOne({ email });

    if (!tuteur || !(await tuteur.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const token = generateToken(tuteur._id, tuteur.isAdmin);
    res.json({ tuteur, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Obtenir les informations du tuteur connecté
exports.getMe = async (req, res) => {
  res.json(req.user);
};




// Ajout d'un enfant à un tuteur
exports.addEnfant = async (req, res) => {
    try {
      const tuteurId = req.user._id;
      const { nom, prenom, dateNaissance } = req.body;
  
      // Création de l'enfant en tant que document indépendant
      const nouvelEnfant = new Enfant({
        nom,
        prenom,
        dateNaissance,
        tuteur: tuteurId
      });
  
      const enfantSauvegarde = await nouvelEnfant.save();
  
      // Ajout de l'enfant au tableau 'enfants' du tuteur (approche hybride)
      const updatedTuteur = await Tuteur.findByIdAndUpdate(
        tuteurId,
        { $push: { enfants: enfantSauvegarde } }, // Vous pourriez vouloir stocker seulement certaines infos de l'enfant ici
        { new: true }
      );
  
      if (!updatedTuteur) {
        return res.status(404).send({ message: "Tuteur non trouvé" });
      }
  
      res.status(201).json({ message: "Enfant ajouté avec succès", enfant: enfantSauvegarde, tuteur: updatedTuteur });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Erreur lors de l\'ajout de l\'enfant.', error });
    }
  };
