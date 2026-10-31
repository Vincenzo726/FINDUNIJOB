const Application = require('../models/Application');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
async function create(req, res) {
  const student = await Student.findOne({ user: req.user._id }); if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
  const job = await Job.findOne({ _id: req.body.job, status: 'PUBLISHED' }); if (!job) return res.status(404).json({ success: false, message: 'Published job not found' });
  if (req.body.cv && !(await require('../models/CV').exists({ _id: req.body.cv, student: student._id }))) return res.status(403).json({ success: false, message: 'CV does not belong to student' });
  const application = await Application.create({ student: student._id, job: job._id, cv: req.body.cv, coverLetter: req.body.coverLetter });
  res.status(201).json({ success: true, data: application });
}
async function mine(req, res) { const student = await Student.findOne({ user: req.user._id }); res.json({ success: true, data: await Application.find({ student: student?._id }).populate('job cv').sort({ appliedAt: -1 }) }); }
async function received(req, res) { const company = await Company.findOne({ user: req.user._id }); const jobs = await Job.find({ company: company?._id }).select('_id'); res.json({ success: true, data: await Application.find({ job: { $in: jobs } }).populate({ path: 'student', populate: { path: 'user', select: 'fullName email' } }).populate('job').populate({ path: 'cv', select: '-storagePath -parsedData' }).sort({ appliedAt: -1 }) }); }
async function updateStatus(req, res) { const company = await Company.findOne({ user: req.user._id }); const jobs = await Job.find({ company: company?._id }).select('_id'); const application = await Application.findOneAndUpdate({ _id: req.params.id, job: { $in: jobs } }, { status: req.body.status }, { new: true, runValidators: true }); if (!application) return res.status(404).json({ success: false, message: 'Application not found or not owned by company' }); res.json({ success: true, data: application }); }
module.exports = { create, mine, received, updateStatus };