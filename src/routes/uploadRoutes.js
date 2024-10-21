const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');

// Route pour gérer l'upload de fichiers
router.post('/', upload.single('file'), (req, res) => {
  try {
    res.send({ message: 'Fichier uploadé avec succès', file: req.file });
  } catch (error) {
    res.status(400).send({ error: 'Erreur lors de l\'upload' });
  }
});

module.exports = router;