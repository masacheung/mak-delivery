const { test } = require('node:test');
const assert = require('node:assert/strict');
const { arrivalSchedule } = require('./arrivalTime');
const now = new Date('2026-10-01T12:00:00Z');
test('5:15 PM New Jersey arrives at 21:15 UTC and reminds at 21:00 UTC', () => {
  assert.deepEqual(arrivalSchedule('2026-10-03','17:15',15,now), { arrivalAt: '2026-10-03T21:15:00.000Z', sendAt: '2026-10-03T21:00:00.000Z', leadMinutes: 15 });
});
test('winter offset, already-due reminders and invalid inputs are handled', () => {
  assert.equal(arrivalSchedule('2026-12-03','17:15',15,now).arrivalAt,'2026-12-03T22:15:00.000Z');
  assert.equal(arrivalSchedule('2026-10-03','17:15',15,new Date('2026-10-03T21:10:00Z')).sendAt,'2026-10-03T21:10:00.000Z');
  for (const input of [['2026-02-30','17:15',15],['2026-03-08','02:30',15],['2026-11-01','01:30',15],['2026-10-03','25:15',15],['2026-10-03','17:15',1.5]]) assert.throws(()=>arrivalSchedule(...input,new Date('2026-01-01T00:00Z')));
  assert.throws(()=>arrivalSchedule('2026-10-01','01:00',15,now), /future/);
});
