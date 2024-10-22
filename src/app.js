require('dotenv').config(); // Chargement des variables d'environnement
const socketIo = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http')

// Importation des routes
const tuteurRoutes = require('./routes/tuteurRoutes');
const enfantRoutes = require('./routes/enfantRoutes');
const uploadRoutes = require('./routes/uploadRoutes');


const app = express();

// Configuration des middlewares
app.set('trust proxy', true);

app.use(express.json());

app.use(cors());

app.use(helmet()); 
app.use(bodyParser.json());

// Configuration de la limitation de requête
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limite chaque IP à 100 requêtes par windowMs
});
app.use(limiter);

const mongoURI = process.env.MONGO_URI;

// Connexion à MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connexion à MongoDB réussie.'))
  .catch((err) => console.error('Connexion à MongoDB échouée.', err));

// Utilisation des routes
app.use('/api/tuteurs', tuteurRoutes);
app.use('/api/enfants', enfantRoutes);
app.use('/api/upload', uploadRoutes);

// Middleware d'erreur global (pour les erreurs non gérées)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose s\'est mal passé !');
});
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Autoriser toutes les origines, à ajuster selon vos besoins
    methods: ["GET", "POST"] // Méthodes autorisées
  }
});
// Gestion des connexions WebSocket
io.on('connection', (socket) => {
  console.log('Un client est connecté');

  socket.on('disconnect', () => {
    console.log('Un client est déconnecté');
  });

  // Vous pouvez ajouter plus de gestionnaires d'événements ici
  socket.on('requestData', async () => {
    try {
      const data = await fetchData(); // Assurez-vous de créer cette fonction
      socket.emit('dataResponse', data);
    } catch (error) {
      socket.emit('error', 'Erreur lors de la récupération des données');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});



// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const Tuteur = require('./models/Tuteur');
// const Enfant = require('./models/Enfant');

// const jwt = require('jsonwebtoken');
// const SECRET_KEY = 'votre_clé_secrète';

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// // Remplacez 'votreURI' par votre URI de connexion MongoDB
// // mongoose.connect('mongodb+srv://ahmid:EvIVWEcFH0Ktn6Jf@cluster0.cp6rqjp.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connexion à MongoDB réussie.'))
//   .catch((err) => console.error('Connexion à MongoDB échouée.', err));

// // Routes

// // Inscription
// // app.post('/signup', async (req, res) => {
// //     try {
// //       const tuteur = new Tuteur(req.body);
// //       await tuteur.save();
// //       const token = jwt.sign({ id: tuteur._id }, SECRET_KEY, { expiresIn: '1d' });
// //       res.status(201).send({ tuteur, token });
// //     } catch (error) {
// //       res.status(400).send(error);
// //     }
// //   });
// app.post('/signup', async (req, res) => {
//   const { nom, prenom, email, telephone, password, isAdmin, enfants } = req.body;

//   try {
//     // Créez le tuteur sans les enfants pour obtenir son ID
//     const nouveauTuteur = new Tuteur({ nom, prenom, email, telephone, password, isAdmin });
//     const tuteurSauvegardé = await nouveauTuteur.save();

//     // Créez ensuite chaque enfant avec l'ID du tuteur sauvegardé
//     const enfantsPromises = enfants.map(enfant => {
//       return new Enfant({ ...enfant, tuteur: tuteurSauvegardé._id }).save();
//     });
//     await Promise.all(enfantsPromises);

//     res.status(201).send({ message: 'Tuteur et enfants créés avec succès' });
//   } catch (error) {
//     res.status(500).send({ message: 'Erreur lors de la création du tuteur et/ou des enfants', error });
//   }
// });

//   // Connexion
//   app.post('/login', async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const tuteur = await Tuteur.findOne({ email });
//       if (!tuteur || !(await tuteur.comparePassword(password))) {
//         return res.status(401).send({ error: 'Email ou mot de passe incorrect' });
//       }
//       const token = jwt.sign({ id: tuteur._id }, SECRET_KEY, { expiresIn: '1d' });
//       res.send({ tuteur, token });
//     } catch (error) {
//       res.status(400).send(error);
//     }
//   });

// app.post('/tuteurs', async (req, res) => {
//   try {
//     const tuteur = new Tuteur(req.body);
//     await tuteur.save();
//     res.status(201).send(tuteur);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// app.post('/enfants', async (req, res) => {
//   try {
//     const enfant = new Enfant(req.body);
//     await enfant.save();
//     await Tuteur.findByIdAndUpdate(enfant.tuteur, { $push: { enfants: enfant._id } });
//     res.status(201).send(enfant);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// app.get('/admin/enfants', async (req, res) => {
//   try {
//     const enfants = await Enfant.find().populate('tuteur').sort({ nom: 1 }); // Tri alphabétique
//     res.status(200).send(enfants);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.get('/admin/tuteurs', async (req, res) => {
//     try {
//       // Cherche tous les tuteurs et peuple le champ 'enfants' pour chaque tuteur
//       const tuteurs = await Tuteur.find().populate('enfants').exec();
//       res.status(200).send(tuteurs);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });

//   const authMiddleware = async (req, res, next) => {
//     try {
//       const token = req.headers.authorization.split(' ')[1]; // Authorization: Bearer token
//       const decoded = jwt.verify(token, SECRET_KEY);
//       const tuteur = await Tuteur.findById(decoded.id);
//       if (!tuteur) throw new Error();
//       req.tuteur = tuteur;
//       next();
//     } catch (error) {
//       res.status(401).send({ error: 'Veuillez vous authentifier.' });
//     }
//   };

//   app.get('/mes-enfants', authMiddleware, async (req, res) => {
//     try {
//       // Mise à jour pour utiliser `populate` directement sans `execPopulate`
//       await req.tuteur.populate('enfants');
//       res.json(req.tuteur.enfants); // Utilisation de res.json pour une meilleure clarté
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });
  
//   const authAdminMiddleware = async (req, res, next) => {
//     try {
//       const token = req.headers.authorization.split(' ')[1]; // Suppose Authorization: Bearer TOKEN
//       const decoded = jwt.verify(token, SECRET_KEY);
//       const tuteur = await Tuteur.findById(decoded.id);
      
//       if (!tuteur || !tuteur.isAdmin) {
//         throw new Error('Accès refusé');
//       }
      
//       req.tuteur = tuteur;
//       next();
//     } catch (error) {
//       res.status(403).send({ error: 'Accès refusé' });
//     }
//   };
  
//   app.get('/admin/tuteurs-avec-enfants',  async (req, res) => {
//     try {
//       const tuteurs = await Tuteur.find().populate('enfants');
//       res.json(tuteurs);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });
  
  
  

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur le port ${PORT}`);
// });
