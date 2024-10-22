const multer = require('multer');
const path = require('path');

// Configuration de multer pour enregistrer les fichiers dans le dossier 'assets'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const absolutePath = path.resolve(__dirname, '../../assets/');  // Utilisation de path.resolve
      console.log('Chemin absolu du dossier d\'upload:', absolutePath);
      cb(null, absolutePath);
    },
    filename: (req, file, cb) => {
      console.log('Nom du fichier reçu :', file.originalname);  // Affiche le nom du fichier uploadé
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  

// Filtrer les fichiers par type (optionnel)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accepte le fichier
  } else {
    cb(new Error('Type de fichier non supporté'), false); // Rejette le fichier
  }
};


// Configuration de multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de 5MB par fichier
  fileFilter: fileFilter,
});

module.exports = upload;
