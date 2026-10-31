const Conversation = require('../models/Conversation');
const Student = require('../models/Student');
const gemma = require('../services/gemma.service');
const { findPublishedJobs } = require('../services/job.service');

function input(req, field, max = 8000) {
  const value = String(req.body[field] || '').trim();
  if (!value || value.length > max) {
    const error = new Error(`${field} is required and must be at most ${max} characters`);
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function jobTerms(prompt, profile) {
  const values = [prompt, ...(profile?.skills || []), profile?.course, profile?.location].filter(Boolean);
  return values.join(' ').slice(0, 180);
}

function formatJobs(jobs) {
  return jobs.map((job) => `${job.title} | ${job.company?.companyName || 'Company'} | ${job.location} | ${job.employmentType} | job id ${job._id}`).join('\n');
}

async function getConversation(req, id) {
  if (!id) return Conversation.create({ user: req.user._id, model: process.env.GEMMA_MODEL });
  const conversation = await Conversation.findOne({ _id: id, user: req.user._id });
  if (!conversation) {
    const error = new Error('Conversation not found');
    error.statusCode = 404;
    throw error;
  }
  return conversation;
}

async function chat(req, res) {
  const prompt = input(req, 'prompt', 4000);
  const conversation = await getConversation(req, req.body.conversationId);
  const student = await Student.findOne({ user: req.user._id }).select('university course level skills bio location');
  const jobs = await findPublishedJobs({ q: jobTerms(prompt, student) }, 3);
  const context = conversation.messages.slice(-10).map((message) => `${message.role}: ${message.content}`).join('\n');
  const response = await gemma.chat(prompt, context, JSON.stringify(student || {}), formatJobs(jobs));
  conversation.messages.push({ role: 'user', content: prompt }, { role: 'assistant', content: response });
  conversation.model = process.env.GEMMA_MODEL;
  await conversation.save();
  res.json({ success: true, data: { conversationId: conversation._id, response, jobs } });
}

async function listConversations(req, res) {
  const conversations = await Conversation.find({ user: req.user._id }).select('model messages createdAt updatedAt').sort({ updatedAt: -1 }).limit(20);
  res.json({ success: true, data: conversations });
}

async function getConversationById(req, res) {
  const conversation = await Conversation.findOne({ _id: req.params.id, user: req.user._id });
  if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });
  res.json({ success: true, data: conversation });
}

async function deleteConversation(req, res) {
  const conversation = await Conversation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });
  res.json({ success: true, message: 'Conversation deleted' });
}

async function careerGuidance(req, res) { res.json({ success: true, data: { response: await gemma.careerGuidance(input(req, 'prompt')) } }); }
async function analyzeCv(req, res) { res.json({ success: true, data: { response: await gemma.analyzeCv(input(req, 'cvText')) } }); }
async function improveCv(req, res) { res.json({ success: true, data: { response: await gemma.improveCv(input(req, 'cvText')) } }); }
async function recommendJobs(req, res) { res.json({ success: true, data: { response: await gemma.recommendJobs(input(req, 'profile')) } }); }

module.exports = { chat, listConversations, getConversationById, deleteConversation, careerGuidance, analyzeCv, improveCv, recommendJobs };
