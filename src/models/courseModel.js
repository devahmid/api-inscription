const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  completed: { type: Boolean, default: false },
  resources: [
    {
      type: { type: String }, // pdf, link, etc.
      title: { type: String },
      url: { type: String }
    }
  ]
});

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  level: { type: String },
  lessons: [LessonSchema]
});

module.exports = mongoose.model('Course', CourseSchema);
