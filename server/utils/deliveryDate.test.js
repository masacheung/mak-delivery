const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getDeliveryDate } = require('./deliveryDate');

test('late evening events remain available after UTC midnight', () => {
  assert.equal(getDeliveryDate(new Date('2026-10-03T03:30:00Z')), '2026-10-02');
  assert.equal(getDeliveryDate(new Date('2026-10-03T04:30:00Z')), '2026-10-03');
});

test('uses New York daylight saving and winter offsets', () => {
  assert.equal(getDeliveryDate(new Date('2026-01-03T04:30:00Z')), '2026-01-02');
  assert.equal(getDeliveryDate(new Date('2026-01-03T05:30:00Z')), '2026-01-03');
});
