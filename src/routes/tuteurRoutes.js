// src/routes/tuteurRoutes.js
const express = require('express');
const { protect } = require('../config/auth');
const tuteurController = require('../controllers/tuteurController');

const router = express.Router();

// Inscription d'un nouveau tuteur
router.post('/signup', tuteurController.signup);

// Connexion d'un tuteur
router.post('/login', tuteurController.login);

// Récupérer les informations du tuteur connecté
router.get('/me', protect, tuteurController.getMe);

// Route pour ajouter un enfant au tuteur connecté
router.post('/enfants', protect, tuteurController.addEnfant);

// Mise à jour des informations d'un enfant
router.put('/enfants/:id', protect, tuteurController.updateEnfant);

// Suppression d'un enfant
router.delete('/enfants/:id', protect, tuteurController.deleteEnfant);

router.post('/request-reset-password', tuteurController.requestPasswordReset);
// Route pour réinitialiser le mot de passe
router.post('/reset-password/:token', tuteurController.resetPassword);

router.delete('/:id', protect, tuteurController.deleteTuteurAndEnfants);

// Route pour mettre à jour le profil du tuteur connecté
router.put('/update-profile', protect, tuteurController.updateProfile);

module.exports = router;
