const mongoose = require('mongoose');
module.exports = mongoose.model('Student', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  university: { type: String, trim: true, maxlength: 160 },
  course: { type: String, trim: true, maxlength: 160 },
  level: { type: String, trim: true, maxlength: 80 },
  skills: [{ type: String, trim: true, maxlength: 80 }],
  bio: { type: String, maxlength: 2000 },
  location: { type: String, maxlength: 160 },
  profilePicture: String,
  cv: { type: mongoose.Schema.Types.ObjectId, ref: 'CV' },
}, { timestamps: true }));