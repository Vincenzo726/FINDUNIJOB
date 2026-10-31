const test = require('node:test');
const assert = require('node:assert/strict');
const gemma = require('../src/services/gemma.service');

function response(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

test('builds a Google generateContent request and joins text parts', async () => {
  const original = { key: process.env.GEMMA_API_KEY, url: process.env.GEMMA_API_URL, model: process.env.GEMMA_MODEL };
  process.env.GEMMA_API_KEY = 'test-key';
  process.env.GEMMA_API_URL = 'https://example.test/v1beta/';
  process.env.GEMMA_MODEL = 'test-model';
  let request;
  const result = await gemma.generate('Give careful advice', {
    fetch: async (url, options) => {
      request = { url, options };
      return response(200, { candidates: [{ content: { parts: [{ text: 'First.' }, { text: 'Second.' }] } }] });
    },
  });
  assert.equal(result, 'First.\nSecond.');
  assert.equal(request.url, 'https://example.test/v1beta/models/test-model:generateContent');
  assert.equal(request.options.headers['x-goog-api-key'], 'test-key');
  assert.deepEqual(JSON.parse(request.options.body), { contents: [{ parts: [{ text: 'Give careful advice' }] }] });
  process.env.GEMMA_API_KEY = original.key; process.env.GEMMA_API_URL = original.url; process.env.GEMMA_MODEL = original.model;
});

test('maps provider failures without exposing credentials', async () => {
  process.env.GEMMA_API_KEY = 'secret-test-key';
  process.env.GEMMA_API_URL = 'https://example.test/v1beta';
  await assert.rejects(() => gemma.generate('Hello', { fetch: async () => response(401, {}) }), (error) => {
    assert.equal(error.statusCode, 502);
    assert.equal(error.message, 'AI provider authentication failed');
    assert.equal(error.message.includes('secret-test-key'), false);
    return true;
  });
});

test('rejects missing credentials', async () => {
  const original = process.env.GEMMA_API_KEY;
  delete process.env.GEMMA_API_KEY;
  await assert.rejects(() => gemma.generate('Hello'), (error) => error.statusCode === 503);
  process.env.GEMMA_API_KEY = original;
});
