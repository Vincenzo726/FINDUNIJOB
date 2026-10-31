const Job = require('../models/Job');
const Company = require('../models/Company');
const writableFields = ['title', 'description', 'requirements', 'responsibilities', 'location', 'level', 'category', 'remote', 'employmentType', 'salary', 'skills', 'deadline', 'status'];
function pickJobFields(body) {
  return Object.fromEntries(Object.entries(body || {}).filter(([key]) => writableFields.includes(key)));
}
function safeNumber(value, fallback) { const number = Number(value); return Number.isFinite(number) ? number : fallback; }
async function list(req, res) {
  const { q, location, employmentType, skill, company } = req.query;
  const filter = { status: 'PUBLISHED' };
  if (q) {
    const query = String(q).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ title: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }, { skills: new RegExp(query, 'i') }];
  }
  if (location) filter.location = new RegExp(String(location).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (employmentType) filter.employmentType = employmentType;
  if (skill) filter.skills = { $in: [String(skill)] };
  if (company) filter.company = company;
  if (req.query.level) filter.level = req.query.level;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.remote === 'true') filter.remote = true;
  if (req.query.createdAfter && !Number.isNaN(Date.parse(req.query.createdAfter))) filter.createdAt = { $gte: new Date(req.query.createdAfter) };
  const page = Math.max(1, safeNumber(req.query.page, 1)); const limit = Math.min(50, Math.max(1, safeNumber(req.query.limit, 10)));
  const [jobs, total] = await Promise.all([Job.find(filter).populate('company').sort(req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }).skip((page - 1) * limit).limit(limit), Job.countDocuments(filter)]);
  res.json({ success: true, data: { jobs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
}
async function getOne(req, res) { const job = await Job.findById(req.params.id).populate('company'); if (!job) return res.status(404).json({ success: false, message: 'Job not found' }); res.json({ success: true, data: job }); }
async function create(req, res) { const company = await Company.findOne({ user: req.user._id }); if (!company) return res.status(404).json({ success: false, message: 'Company profile not found' }); res.status(201).json({ success: true, data: await Job.create({ ...pickJobFields(req.body), company: company._id }) }); }
async function update(req, res) { const company = await Company.findOne({ user: req.user._id }); const job = await Job.findOneAndUpdate({ _id: req.params.id, company: company?._id }, pickJobFields(req.body), { new: true, runValidators: true }); if (!job) return res.status(404).json({ success: false, message: 'Job not found or not owned by company' }); res.json({ success: true, data: job }); }
async function remove(req, res) { const company = await Company.findOne({ user: req.user._id }); const job = await Job.findOneAndDelete({ _id: req.params.id, company: company?._id }); if (!job) return res.status(404).json({ success: false, message: 'Job not found or not owned by company' }); res.json({ success: true, message: 'Job deleted' }); }
async function owned(req, res) { const company = await Company.findOne({ user: req.user._id }); res.json({ success: true, data: await Job.find({ company: company?._id }).sort({ createdAt: -1 }) }); }
module.exports = { list, getOne, create, update, remove, owned };