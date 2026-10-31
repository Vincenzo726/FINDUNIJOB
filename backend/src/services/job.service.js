const Job = require('../models/Job');

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildJobFilter(query) {
  const filter = { status: 'PUBLISHED' };
  if (query.q) {
    const terms = String(query.q).split(/[\s,|/]+/).map((term) => term.trim()).filter((term) => term.length > 2).slice(0, 12);
    const expression = new RegExp(terms.map(escapeRegex).join('|').slice(0, 200), 'i');
    filter.$or = [{ title: expression }, { description: expression }, { skills: expression }, { category: expression }];
  }
  if (query.location) filter.location = new RegExp(escapeRegex(query.location), 'i');
  if (query.employmentType) filter.employmentType = query.employmentType;
  if (query.skill) filter.skills = new RegExp(escapeRegex(query.skill), 'i');
  if (query.category) filter.category = new RegExp(escapeRegex(query.category), 'i');
  if (query.level) filter.level = query.level;
  if (query.remote === 'true') filter.remote = true;
  return filter;
}

async function findPublishedJobs(query = {}, limit = 3) {
  return Job.find(buildJobFilter(query)).populate('company', 'companyName').sort({ createdAt: -1 }).limit(limit);
}

module.exports = { buildJobFilter, findPublishedJobs, escapeRegex };