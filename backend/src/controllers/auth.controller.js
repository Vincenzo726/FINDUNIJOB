const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');

function publicUser(user) { const result = user.toObject(); delete result.password; return result; }
function profileFields(profile, role) {
  const allowed = role === 'STUDENT'
    ? ['university', 'course', 'level', 'skills', 'bio', 'location', 'profilePicture']
    : ['companyName', 'description', 'website', 'industry', 'location', 'companyLogo'];
  return Object.fromEntries(Object.entries(profile || {}).filter(([key]) => allowed.includes(key)));
}
async function register(req, res) {
  const { fullName, email, password, role, profile = {} } = req.body;
  if (!fullName || !email || !password || !['STUDENT', 'COMPANY'].includes(role)) return res.status(400).json({ success: false, message: 'fullName, email, password and a valid role are required' });
  const user = await User.create({ fullName, email, password, role });
  const safeProfile = profileFields(profile, role);
  if (role === 'STUDENT') await Student.create({ user: user._id, ...safeProfile });
  else await Company.create({ user: user._id, companyName: safeProfile.companyName || fullName, ...safeProfile });
  res.status(201).json({ success: true, data: { user: publicUser(user), token: generateToken(user) } });
}
async function login(req, res) {
  const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password || ''))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
  res.json({ success: true, data: { user: publicUser(user), token: generateToken(user) } });
}
async function me(req, res) {
  const Profile = req.user.role === 'STUDENT' ? Student : Company;
  const profile = await Profile.findOne({ user: req.user._id });
  res.json({ success: true, data: { user: publicUser(req.user), profile } });
}
module.exports = { register, login, me };