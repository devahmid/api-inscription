const mongoose = require('mongoose');

const enfantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  tuteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Tuteur', required: true }
});

module.exports = mongoose.model('Enfant', enfantSchema);
