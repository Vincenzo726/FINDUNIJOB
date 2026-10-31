const Company = require('../models/Company');
async function get(req, res) { res.json({ success: true, data: await Company.findOne({ user: req.user._id }) }); }
async function update(req, res) { const allowed = ['companyName', 'description', 'website', 'industry', 'location', 'companyLogo']; const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key))); res.json({ success: true, data: await Company.findOneAndUpdate({ user: req.user._id }, data, { new: true, runValidators: true }) }); }
module.exports = { get, update };