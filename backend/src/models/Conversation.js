const mongoose = require('mongoose');
const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  messages: [{ role: { type: String, enum: ['user', 'assistant'] }, content: String, createdAt: { type: Date, default: Date.now } }],
  model: String,
}, { timestamps: true });
conversationSchema.index({ user: 1, updatedAt: -1 });
module.exports = mongoose.model('Conversation', conversationSchema);