const gemma = require('../services/gemma.service');
async function chat(req, res) { const prompt = String(req.body.prompt || '').trim(); if (!prompt || prompt.length > 4000) return res.status(400).json({ success: false, message: 'prompt is required and must be at most 4000 characters' }); res.json({ success: true, data: { response: await gemma.generate(prompt) } }); }
module.exports = { chat };