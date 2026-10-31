const Student = require('../models/Student');
async function get(req, res) { res.json({ success: true, data: await Student.findOne({ user: req.user._id }).populate('cv') }); }
async function update(req, res) { const allowed = ['university', 'course', 'level', 'skills', 'bio', 'location', 'profilePicture']; const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key))); res.json({ success: true, data: await Student.findOneAndUpdate({ user: req.user._id }, data, { new: true, runValidators: true }) }); }
module.exports = { get, update };