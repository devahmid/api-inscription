const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.HOST_MAIL,
  port: 465,
  secure: true, 
  auth: {
    user: process.env.MAIL,
    pass:  process.env.PWD_MAIL // Considérez utiliser des variables d'environnement pour la sécurité
  }
});
// console.log(process.env.HOST_MAIL)

module.exports = transporter;
