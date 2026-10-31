const gemma = require('../services/gemma.service');
function input(req, field) {
  const value = String(req.body[field] || '').trim();
  if (!value || value.length > 8000) { const error = new Error(`${field} is required and must be at most 8000 characters`); error.statusCode = 400; throw error; }
  return value;
}
async function chat(req, res) { res.json({ success: true, data: { response: await gemma.generate(input(req, 'prompt')) } }); }
async function careerGuidance(req, res) { res.json({ success: true, data: { response: await gemma.careerGuidance(input(req, 'prompt')) } }); }
async function analyzeCv(req, res) { res.json({ success: true, data: { response: await gemma.analyzeCv(input(req, 'cvText')) } }); }
async function improveCv(req, res) { res.json({ success: true, data: { response: await gemma.improveCv(input(req, 'cvText')) } }); }
async function recommendJobs(req, res) { res.json({ success: true, data: { response: await gemma.recommendJobs(input(req, 'profile')) } }); }
module.exports = { chat, careerGuidance, analyzeCv, improveCv, recommendJobs };