const multer = require('multer');
const path = require('path');

// Configuration de multer pour enregistrer les fichiers dans le dossier 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/'); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    // Nommez les fichiers de manière unique en utilisant la date actuelle
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtrer les fichiers par type (optionnel)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté'), false);
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de 5MB par fichier
  fileFilter: fileFilter,
});

module.exports = upload;
