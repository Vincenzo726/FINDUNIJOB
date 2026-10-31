async function generate(prompt) {
  if (!process.env.GEMMA_API_KEY || !process.env.GEMMA_API_URL) {
    const error = new Error('AI provider is not configured'); error.statusCode = 503; throw error;
  }
  const response = await fetch(process.env.GEMMA_API_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GEMMA_API_KEY}` },
    body: JSON.stringify({ model: process.env.GEMMA_MODEL || 'gemma-3-27b-it', prompt }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) { const error = new Error(`AI provider returned HTTP ${response.status}`); error.statusCode = 502; throw error; }
  const data = await response.json();
  return data.response || data.text || data.choices?.[0]?.message?.content || data;
}
module.exports = { generate };