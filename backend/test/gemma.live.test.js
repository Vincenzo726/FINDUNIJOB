require('dotenv').config();
const test = require('node:test');
const assert = require('node:assert/strict');
const gemma = require('../src/services/gemma.service');

test('live Google Gemma provider responds when configured', { timeout: 40000 }, async (t) => {
  if (!process.env.GEMMA_API_KEY || !process.env.GEMMA_API_URL || !process.env.GEMMA_MODEL) {
    t.skip('GEMMA_API_KEY, GEMMA_API_URL, and GEMMA_MODEL are not configured');
    return;
  }
  const result = await gemma.generate('In one sentence, give evidence-based career advice to a university student.');
  assert.equal(typeof result, 'string');
  assert.ok(result.trim().length > 0);
});
