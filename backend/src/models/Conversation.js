const mongoose = require('mongoose');
module.exports = mongoose.model('Conversation', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  messages: [{ role: { type: String, enum: ['user', 'assistant'] }, content: String, createdAt: { type: Date, default: Date.now } }],
  model: String,
}, { timestamps: true }));