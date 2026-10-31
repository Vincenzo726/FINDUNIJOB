const DEFAULT_TIMEOUT_MS = 30000;

function providerError(message, statusCode = 502) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getConfig() {
  const apiKey = process.env.GEMMA_API_KEY;
  const apiUrl = (process.env.GEMMA_API_URL || '').replace(/\/+$/, '');
  const model = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';
  if (!apiKey || !apiUrl) throw providerError('AI provider is not configured', 503);
  return { apiKey, apiUrl, model };
}

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts.filter((part) => typeof part?.text === 'string').map((part) => part.text.trim()).filter(Boolean).join('\n');
}

async function generate(prompt, options = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) throw providerError('AI prompt is required', 400);
  const { apiKey, apiUrl, model } = getConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || DEFAULT_TIMEOUT_MS);
  let response;
  try {
    response = await (options.fetch || fetch)(`${apiUrl}/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt.trim() }] }] }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw providerError('AI provider request timed out', 504);
    throw providerError('AI provider is unavailable', 502);
  } finally {
    clearTimeout(timeout);
  }
  if (response.status === 401 || response.status === 403) throw providerError('AI provider authentication failed', 502);
  if (response.status === 404) throw providerError('Configured AI model was not found', 502);
  if (response.status === 429) throw providerError('AI provider rate limit reached', 429);
  if (!response.ok) throw providerError('AI provider returned an error', 502);
  let data;
  try { data = await response.json(); } catch { throw providerError('AI provider returned malformed data', 502); }
  const text = extractText(data);
  if (!text) throw providerError('AI provider returned an empty response', 502);
  return text;
}

const prompts = {
  careerGuidance: (prompt) => `You are a careful career advisor for university students and early-career applicants. Give practical, evidence-based guidance. Do not invent vacancies or claim a candidate meets requirements without evidence.\n\nStudent question:\n${prompt}`,
  cvAnalysis: (cvText) => `Review the following CV text for a university student or early-career applicant. Identify evidence-based strengths, missing information, clarity issues, and concrete next steps. Do not invent experience.\n\nCV text:\n${cvText}`,
  cvImprovement: (cvText) => `Suggest specific improvements to this university student's CV. Preserve factual accuracy, do not add unverified achievements, and provide example wording only when clearly marked as an example.\n\nCV text:\n${cvText}`,
  jobRecommendations: (profile) => `Help a university student search for suitable job categories using only the supplied profile. Explain the match criteria and identify missing information. Do not invent job vacancies or claim eligibility without evidence.\n\nProfile:\n${profile}`,
};

module.exports = {
  generate,
  extractText,
  careerGuidance: (prompt) => generate(prompts.careerGuidance(prompt)),
  analyzeCv: (cvText) => generate(prompts.cvAnalysis(cvText)),
  improveCv: (cvText) => generate(prompts.cvImprovement(cvText)),
  recommendJobs: (profile) => generate(prompts.jobRecommendations(profile)),
};
