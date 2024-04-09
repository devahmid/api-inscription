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
// Mise à jour d'un enfant
exports.updateEnfant2 = async (req, res) => {
  try {
      const { id } = req.params;
      const { nom, prenom, dateNaissance } = req.body;
      const enfant = await Enfant.findByIdAndUpdate(id, { nom, prenom, dateNaissance }, { new: true });
      if (!enfant) {
          return res.status(404).json({ message: "Enfant non trouvé." });
      }
      res.json({ message: "Enfant mis à jour avec succès.", enfant });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'enfant." });
  }
};
// Mettre à jour les informations d'un enfant
exports.updateEnfant = async (req, res) => {
  const { id } = req.params; // L'ID de l'enfant
  const { nom, prenom, dateNaissance } = req.body; // Les nouvelles informations de l'enfant
  try {
      // D'abord, mettre à jour l'enfant dans la collection d'enfants
      const updatedEnfant = await Enfant.findByIdAndUpdate(id, { nom, prenom, dateNaissance }, { new: true });

      if (!updatedEnfant) {
          return res.status(404).json({ message: "Enfant non trouvé." });
      }

      // Ensuite, mettre à jour les informations de l'enfant dans le document du tuteur
      // Remarque : Cela suppose que vous avez un tableau d'objets `enfants` dans votre document `Tuteur`
      const tuteurId = req.user._id; // Assumant que vous avez l'ID du tuteur à partir de l'authentification
      await Tuteur.updateOne(
          { _id: tuteurId, "enfants._id": id },
          { $set: { "enfants.$": updatedEnfant } } // Mise à jour de l'enfant spécifique dans le tableau
      );

      res.json({ message: "Enfant mis à jour avec succès", enfant: updatedEnfant });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'enfant." });
  }
};

// Suppression d'un enfant
exports.deleteEnfant = async (req, res) => {
  try {
      const { id } = req.params;
      console.log(id)
      // Supprimer l'enfant de la collection d'enfants
      const result = await Enfant.findByIdAndDelete(id);
      if (!result) {
          return res.status(404).json({ message: "Enfant non trouvé." });
      }

      // Supprimer l'enfant du tableau des enfants dans le document du tuteur
      // Assumant que vous avez l'ID du tuteur à partir de l'authentification
      const tuteurId = req.user._id;
      Tuteur.findByIdAndUpdate(
        tuteurId,
        { $pull: { enfants: { _id: id } } }, // Commande pour retirer l'enfant
        { new: true } // Option pour retourner le document mis à jour
      )
      .then(result => console.log(result))
      .catch(err => console.error(err));

      res.json({ message: "Enfant supprimé avec succès." });
  } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      res.status(500).json({ message: "Erreur serveur lors de la suppression de l'enfant." });
  }
};



const transporter = require('../config/email');

// Fonction pour demander un renouvellement de mot de passe
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const tuteur = await Tuteur.findOne({ email });
    if (!tuteur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    
    const token = generateToken(tuteur._id, false); // Générer un token temporaire
    const resetLink = `http://localhost:4200/reset-password/${token}`; // Lien de réinitialisation
    
    // Envoyer l'email
    await transporter.sendMail({
      from: 'contact@centre-culturel-olivier.fr',
      to: tuteur.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `<p>Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe: <a href="${resetLink}">${resetLink}</a></p>`
    });
    
    res.json({ message: 'Email de réinitialisation envoyé.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Vérifier le token (assurez-vous que votre fonction generateToken inclut une date d'expiration)
    let decoded;
    try {
      decoded = jwt.verify(token, 'laCleSecrete');
    } catch (error) {
      return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }

    const tuteur = await Tuteur.findById(decoded.id);
    if (!tuteur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifiez ici si le token n'a pas déjà été utilisé ou est expiré (si vous stockez cette info)

    // Mettre à jour le mot de passe
    // Assurez-vous d'hasher le nouveau mot de passe avant de le stocker
    tuteur.password = newPassword; // Assurez-vous d'utiliser une méthode de votre modèle Tuteur pour hasher le mot de passe
    await tuteur.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Fonction pour réinitialiser le mot de passe
// Vous devrez implémenter cette fonction pour gérer la réinitialisation du mot de passe
// après que l'utilisateur a cliqué sur le lien envoyé par email.
