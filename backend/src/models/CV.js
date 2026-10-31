const mongoose = require('mongoose');
module.exports = mongoose.model('CV', new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  storagePath: { type: String, required: true },
  parsedData: mongoose.Schema.Types.Mixed,
}, { timestamps: true }));