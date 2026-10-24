const test = require('node:test');
const assert = require('node:assert/strict');
const PCNSNFC = require('../frontend/public/pcns-nfc.js');

test('preserves a decoded URL record string', () => {
  const url = 'https://example.org/pcns/?anchor=lm_123';
  assert.equal(PCNSNFC.decodeUri(url), url);
});

test('decodes NFC URI prefix compression', () => {
  const bytes = Uint8Array.from([0x04, ...new TextEncoder().encode('example.org/pcns/?anchor=lm_123')]);
  assert.equal(PCNSNFC.decodeUri(bytes), 'https://example.org/pcns/?anchor=lm_123');
});

test('strips NFC text record language metadata', () => {
  const text = JSON.stringify({ anchor: 'lm_123' });
  const body = new TextEncoder().encode(text);
  const bytes = Uint8Array.from([2, 0x65, 0x6e, ...body]); // status byte + "en" language
  assert.equal(PCNSNFC.decodeText(bytes), text);
});

test('does not misinterpret a raw JSON MIME payload as text metadata', () => {
  const text = JSON.stringify({ message: 'this is a long enough JSON payload to exceed sixty bytes without issue', anchor: 'lm_123' });
  assert.equal(PCNSNFC.decodeText(new TextEncoder().encode(text)), text);
});
