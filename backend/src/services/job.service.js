const Job = require('../models/Job');

function buildJobFilter(query) {
  const filter = { status: query.status || 'PUBLISHED' };
  if (query.location) filter.location = new RegExp(String(query.location).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (query.employmentType) filter.employmentType = query.employmentType;
  if (query.skill) filter.skills = String(query.skill);
  return filter;
}

async function findPublishedJobs(query = {}) {
  return Job.find(buildJobFilter(query)).sort({ createdAt: -1 });
}

module.exports = { buildJobFilter, findPublishedJobs };