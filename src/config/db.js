// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://45.93.139.215:27017/maBDD', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Connexion à MongoDB réussie.');
  } catch (error) {
    console.error('Connexion à MongoDB échouée.', error);
    process.exit(1); // Arrête l'application en cas d'échec de la connexion
  }
};

module.exports = connectDB;
