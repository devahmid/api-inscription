// src/routes/enfantRoutes.js
const express = require('express');
const { protect } = require('../config/auth');
const enfantController = require('../controllers/enfantController');

const router = express.Router();

// Ajouter un enfant pour le tuteur connecté
router.post('/', protect, enfantController.addEnfant);

// Lister tous les enfants du tuteur connecté
router.get('/', protect, enfantController.getEnfants);

module.exports = router;
