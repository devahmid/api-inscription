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


module.exports = router;
