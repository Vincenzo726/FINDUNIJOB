const mongoose = require('mongoose');
module.exports = mongoose.model('Company', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  companyName: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, maxlength: 3000 },
  website: { type: String, maxlength: 300 },
  industry: { type: String, maxlength: 120 },
  location: { type: String, maxlength: 160 },
  companyLogo: String,
  verified: { type: Boolean, default: false },
}, { timestamps: true }));