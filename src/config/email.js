const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'centre', // Exemple avec Gmail, remplacez par votre service d'email
  host: process.env.HOST_MAIL,
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL,
    pass:  process.env.PWD_MAIL // Considérez utiliser des variables d'environnement pour la sécurité
  }
});

module.exports = transporter;
