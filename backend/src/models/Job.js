const mongoose = require('mongoose');
module.exports = mongoose.model('Job', new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  description: { type: String, required: true, maxlength: 10000 },
  requirements: { type: String, maxlength: 5000 },
  responsibilities: { type: String, maxlength: 5000 },
  location: { type: String, required: true, maxlength: 160 },
  level: { type: String, enum: ['Entry-Level', 'Mid-Level', 'Senior & Executive'], default: 'Entry-Level' },
  category: { type: String, maxlength: 120 },
  remote: { type: Boolean, default: false },
  employmentType: { type: String, enum: ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'REMOTE'], required: true },
  salary: { min: Number, max: Number, currency: { type: String, maxlength: 8 } },
  skills: [{ type: String, trim: true, maxlength: 80 }],
  deadline: Date,
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'CLOSED'], default: 'PUBLISHED' },
}, { timestamps: true }));