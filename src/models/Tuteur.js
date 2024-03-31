const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma enfant réutilisé pour l'embarquement
const enfantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  // Pas besoin de référence au tuteur ici puisque l'enfant sera embarqué
});

const tuteurSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, unique: true, required: true },
  telephone: String,
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  enfants: [enfantSchema] // Embarquer directement les schémas des enfants
});

// Hook pour hasher le mot de passe avant de sauvegarder le tuteur
tuteurSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

tuteurSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Tuteur', tuteurSchema);
