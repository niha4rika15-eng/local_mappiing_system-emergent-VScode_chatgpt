const test = require('node:test');
const assert = require('node:assert/strict');
const PCNSML = require('../frontend/public/pcns-ml.js');

test('fits stride length from supervised measured walks', () => {
  const model = PCNSML.fitStrideModel([
    { steps: 10, distanceM: 7 },
    { steps: 20, distanceM: 14 },
    { steps: 30, distanceM: 21 },
  ]);
  assert.ok(Math.abs(model.strideLengthM - 0.7) < 1e-12);
  assert.equal(model.sampleCount, 3);
  assert.ok(model.rmseM < 1e-12);
  assert.ok(Math.abs(PCNSML.predictDistance(model, 15) - 10.5) < 1e-12);
});

test('rejects too few calibration samples', () => {
  assert.throws(() => PCNSML.fitStrideModel([{ steps: 10, distanceM: 7 }]), /At least two/);
});

test('rejects invalid or implausible measurements', () => {
  assert.throws(() => PCNSML.fitStrideModel([
    { steps: 0, distanceM: 7 }, { steps: 20, distanceM: 14 },
  ]), /invalid/);
  assert.throws(() => PCNSML.fitStrideModel([
    { steps: 10, distanceM: 30 }, { steps: 20, distanceM: 60 },
  ]), /outside the safe range/);
});
