const express = require('express');
const Course = require('../models/courseModel'); // Assuming the model is in the models folder
const router = express.Router();
const upload = require('../middleware/multerConfig'); // Import du middleware multer

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).send({ message: 'Erreur serveur lors de la récupération des cours.' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send({ message: 'Cours non trouvé.' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).send({ message: 'Erreur serveur lors de la récupération du cours.' });
  }
});

// Create a new course (avec upload de fichier)
router.post('/', upload.single('file'), async (req, res) => {
    try {
      const { name, description, level, category, videoUrl, lessons } = req.body;
  
      // Vérification des champs obligatoires
      if (!name || !description || !level || !category) {
        return res.status(400).send({ message: 'Tous les champs sont obligatoires.' });
      }
  
      // Construction des données de cours
      const courseData = { name, description, level, category, videoUrl };
  
      // Ajout de l'URL du fichier si un fichier est uploadé
      if (req.file) {
        const fileUrl = `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`;
        courseData.fileUrl = fileUrl;
      }
  
      // Parsing des leçons (car elles sont envoyées en tant que chaîne JSON dans FormData)
      if (lessons) {
        courseData.lessons = JSON.parse(lessons).map(lesson => ({
          title: lesson.title,
          videoUrl: lesson.videoUrl,
          resources: lesson.resources.map(resource => ({
            type: resource.type,
            title: resource.title,
            url: resource.url
          }))
        }));
      }
  
      // Création d'une nouvelle instance de cours
      const course = new Course(courseData);
      await course.save();
  
      // Réponse avec le cours créé
      res.status(201).json(course);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: 'Erreur lors de la création du cours.' });
    }
  });

// Update course by ID (avec possibilité d'uploader un nouveau fichier)
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const { name, description, level, category, videoUrl } = req.body;

    const updatedData = { name, description, level, category, videoUrl };

    // Si un nouveau fichier est uploadé, met à jour l'URL du fichier
    if (req.file) {
      const fileUrl = `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`;
      updatedData.fileUrl = fileUrl;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedCourse) {
      return res.status(404).send({ message: 'Cours non trouvé.' });
    }
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).send({ message: 'Erreur lors de la mise à jour du cours.' });
  }
});

// Delete course by ID
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).send({ message: 'Cours non trouvé.' });
    }
    res.json({ message: 'Cours supprimé avec succès.' });
  } catch (error) {
    res.status(500).send({ message: 'Erreur lors de la suppression du cours.' });
  }
});

module.exports = router;
