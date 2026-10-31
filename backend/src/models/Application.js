const mongoose = require('mongoose');
module.exports = mongoose.model('Application', new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  cv: { type: mongoose.Schema.Types.ObjectId, ref: 'CV' },
  coverLetter: { type: String, maxlength: 5000 },
  status: { type: String, enum: ['PENDING', 'REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true }));
module.exports.schema.index({ student: 1, job: 1 }, { unique: true });