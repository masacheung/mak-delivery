const { test } = require('node:test');
const assert = require('node:assert/strict');

// Never load a real connection or send a text during these tests.
const connection = require.resolve('../db/connection');
require.cache[connection] = { id: connection, filename: connection, loaded: true, exports: {} };
const { createSmsSendBudget, reserveSmsSend: configuredReserve } = require('./smsSendBudget');
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function isolatedDatabase() {
  const state = { now: Date.parse('2026-10-09T12:00:00Z'), rows: [], trace: [], updates: [], fail: null };
  let sequence = 0;
  let mutex = Promise.resolve();
  const pool = {
    query: async (sql, values) => {
      state.updates.push({ sql, values });
      return { rows: [] };
    },
    connect: async () => {
      let unlock;
      let pending;
      let locked = false;
      const releaseLock = () => { if (unlock) { unlock(); unlock = null; locked = false; } };
      return {
        query: async (sql, values = []) => {
          state.trace.push({ sql, values });
          if (sql === 'BEGIN') return { rows: [] };
          if (sql.includes('pg_advisory_xact_lock')) {
            const previous = mutex;
            mutex = new Promise(resolve => { unlock = resolve; });
            await previous;
            locked = true;
            return { rows: [] };
          }
          if (sql === 'COMMIT') {
            if (pending) state.rows.push(pending);
            pending = null;
            releaseLock();
            return { rows: [] };
          }
          if (sql === 'ROLLBACK') {
            pending = null;
            releaseLock();
            return { rows: [] };
          }
          assert.equal(locked, true, 'database clock, cleanup and budget reads/writes require the shared lock');
          if (state.fail && sql.includes(state.fail)) {
            const error = new Error('isolated database failure');
            error.code = '42P01';
            throw error;
          }
          if (sql.includes('clock_timestamp() AS now')) return { rows: [{ now: new Date(state.now) }] };
          if (sql.startsWith('DELETE')) {
            state.rows = state.rows.filter(row => +row.created_at >= +values[0] - 7 * DAY);
            return { rows: [] };
          }
          if (sql.startsWith('SELECT created_at')) return { rows: state.rows.filter(row => +row.created_at > +values[0] - DAY) };
          if (sql.startsWith('INSERT')) {
            pending = { id: ++sequence, created_at: values[0], phone_hash: values[1], account_hash: values[2], ip_hash: values[3] };
            return { rows: [{ id: pending.id }] };
          }
          throw new Error(`Unexpected isolated query: ${sql}`);
        },
        release: () => { pending = null; releaseLock(); },
      };
    },
  };
  const service = (limit = 200) => createSmsSendBudget({ dbPool: pool, getSecret: () => 'persistent-test-secret', getDailyLimit: () => limit });
  return { state, pool, service };
}

function identity(index, overrides = {}) {
  return { phoneNumber: `+1201555${String(index).padStart(4, '0')}`, username: `test-account-${index}`, ip: `192.0.2.${index % 250 + 1}`, ...overrides };
}

test('resend cooldown is shared by phone and account, uses DB time, and expires at 60 seconds', async () => {
  const { state, service } = isolatedDatabase();
  const first = service();
  const afterRestart = service();
  const initial = await first.reserveSmsSend(identity(1));
  assert.deepEqual(initial, { allowed: true, attemptId: 1, resendAvailableAt: state.now + MINUTE, retryAfterSeconds: 60 });
  state.now += 25 * 1000;
  assert.equal((await afterRestart.reserveSmsSend(identity(2, { phoneNumber: identity(1).phoneNumber }))).retryAfterSeconds, 35);
  assert.equal((await afterRestart.reserveSmsSend(identity(3, { username: ' TEST-ACCOUNT-1 ' }))).allowed, false);
  state.now += 35 * 1000;
  assert.equal((await afterRestart.reserveSmsSend(identity(1))).allowed, true);
  const stored = JSON.stringify(state.rows);
  assert.equal(stored.includes(identity(1).phoneNumber), false);
  assert.equal(stored.includes(identity(1).username), false);
  assert.equal(stored.includes(identity(1).ip), false);
  assert.match(state.rows[0].phone_hash, /^[a-f0-9]{64}$/);
});

test('phone and account each have 5/hour and 10/rolling 24-hour caps', async () => {
  for (const scope of ['phoneNumber', 'username']) {
    const hourly = isolatedDatabase();
    const hourStart = hourly.state.now;
    for (let index = 1; index <= 5; index++) {
      hourly.state.now = hourStart + (index - 1) * MINUTE;
      assert.equal((await hourly.service().reserveSmsSend(identity(index, { [scope]: identity(1)[scope] }))).allowed, true);
    }
    hourly.state.now += MINUTE;
    assert.deepEqual((await hourly.service().reserveSmsSend(identity(6, { [scope]: identity(1)[scope] }))).retryAfterSeconds, 55 * 60);
    hourly.state.now = hourStart + HOUR;
    assert.equal((await hourly.service().reserveSmsSend(identity(6, { [scope]: identity(1)[scope] }))).allowed, true);

    const daily = isolatedDatabase();
    const dayStart = daily.state.now;
    for (let index = 1; index <= 10; index++) {
      daily.state.now = dayStart + (index - 1) * HOUR;
      assert.equal((await daily.service().reserveSmsSend(identity(index, { [scope]: identity(1)[scope] }))).allowed, true);
    }
    daily.state.now = dayStart + 10 * HOUR;
    assert.equal((await daily.service().reserveSmsSend(identity(11, { [scope]: identity(1)[scope] }))).retryAfterSeconds, 14 * 60 * 60);
    daily.state.now = dayStart + DAY;
    assert.equal((await daily.service().reserveSmsSend(identity(11, { [scope]: identity(1)[scope] }))).allowed, true);
  }
});

test('IP has 20/hour and 60/day caps even when accounts and phones rotate', async () => {
  const { state, service } = isolatedDatabase();
  const start = state.now;
  for (let batch = 0; batch < 3; batch++) {
    state.now = start + batch * 2 * HOUR;
    for (let index = 1; index <= 20; index++) {
      assert.equal((await service().reserveSmsSend(identity(batch * 20 + index, { ip: '192.0.2.10' }))).allowed, true);
    }
    const denied = await service().reserveSmsSend(identity(100 + batch, { ip: '::ffff:192.0.2.10' }));
    assert.equal(denied.allowed, false);
    assert.equal(denied.retryAfterSeconds, batch === 2 ? 20 * 60 * 60 : 60 * 60);
  }
  state.now = start + DAY;
  assert.equal((await service().reserveSmsSend(identity(200, { ip: '192.0.2.10' }))).allowed, true);
});

test('unknown/forged IPs share a bucket, and do not avoid phone, account or global caps', async () => {
  const { service } = isolatedDatabase();
  for (let index = 0; index < 20; index++) {
    assert.equal((await service().reserveSmsSend(identity(index, { ip: `forged-${index}` }))).allowed, true);
  }
  assert.equal((await service().reserveSmsSend(identity(21, { ip: undefined }))).allowed, false);
  assert.equal((await service().reserveSmsSend(identity(0, { ip: '198.51.100.200' }))).allowed, false);
});

test('global 200/rolling day cap survives service restarts and different identities', async () => {
  const { state, service } = isolatedDatabase();
  for (let index = 0; index < 200; index++) assert.equal((await service().reserveSmsSend(identity(index))).allowed, true);
  const denied = await service().reserveSmsSend(identity(201));
  assert.equal(denied.allowed, false);
  assert.equal(denied.retryAfterSeconds, 86400);
  state.now += DAY;
  assert.equal((await service().reserveSmsSend(identity(201))).allowed, true);
});

test('lowering a daily cap waits until enough existing reservations expire', async () => {
  const { state, service } = isolatedDatabase();
  const start = state.now;
  await service().reserveSmsSend(identity(1));
  state.now += HOUR;
  await service().reserveSmsSend(identity(2));
  state.now += HOUR;
  await service().reserveSmsSend(identity(3));
  assert.equal((await service(1).reserveSmsSend(identity(4))).retryAfterSeconds, 86400);
  state.now = start + DAY + 2 * HOUR;
  assert.equal((await service(1).reserveSmsSend(identity(4))).allowed, true);
});

test('concurrent clients cannot double-reserve a single cooldown slot', async () => {
  const { state, service } = isolatedDatabase();
  const replicaA = service();
  const replicaB = service();
  const attempts = await Promise.all(Array.from({ length: 20 }, (_, index) =>
    (index % 2 ? replicaA : replicaB).reserveSmsSend(identity(1))));
  assert.equal(attempts.filter(value => value.allowed).length, 1);
  assert.equal(state.rows.length, 1);
  assert.equal(state.trace.filter(value => value.sql.includes('pg_advisory_xact_lock')).length, 20);
});

test('concurrent different identities cannot exceed the shared global cap', async () => {
  const { state, service } = isolatedDatabase();
  const replicas = [service(3), service(3)];
  const attempts = await Promise.all(Array.from({ length: 20 }, (_, index) =>
    replicas[index % 2].reserveSmsSend(identity(index))));
  assert.equal(attempts.filter(value => value.allowed).length, 3);
  assert.equal(state.rows.length, 3);
  assert.equal(attempts.filter(value => !value.allowed).every(value => value.retryAfterSeconds === 86400), true);
});

test('database/migration failures throw and roll back instead of granting permission', async () => {
  const { state, service } = isolatedDatabase();
  state.fail = 'SELECT created_at';
  await assert.rejects(service().reserveSmsSend(identity(1)), error => error.code === '42P01');
  assert.equal(state.rows.length, 0);
  assert.equal(state.trace.at(-1).sql, 'ROLLBACK');
  state.fail = 'INSERT';
  await assert.rejects(service().reserveSmsSend(identity(1)));
  assert.equal(state.rows.length, 0);
  state.fail = null;
  assert.equal((await service().reserveSmsSend(identity(1))).allowed, true);
  const disconnected = createSmsSendBudget({ dbPool: { connect: async () => { throw new Error('offline'); } }, getSecret: () => 'test', getDailyLimit: () => 200 });
  await assert.rejects(disconnected.reserveSmsSend(identity(2)), /offline/);
});

test('provider failures stay counted; audit fields discard raw errors and unrelated data', async () => {
  const { state, service } = isolatedDatabase();
  const budget = service();
  const reserved = await budget.reserveSmsSend(identity(1));
  await budget.recordSmsResult(reserved.attemptId, { status: 'failed', sid: `SM${'a'.repeat(32)}`, errorCode: 21614, password: 'never store', code: '123456' });
  assert.deepEqual(state.updates[0].values, [reserved.attemptId, 'failed', `SM${'a'.repeat(32)}`, '21614']);
  await budget.recordSmsResult(reserved.attemptId, { status: 'raw OTP 123456', sid: { secret: 'raw provider object' }, errorCode: 'private message' });
  assert.deepEqual(state.updates[1].values, [reserved.attemptId, 'unknown', null, null]);
  assert.equal((await budget.reserveSmsSend(identity(1))).allowed, false);
  assert.equal(state.rows.length, 1);
});

test('old reservation cleanup retains the active window and requires explicit secret/config', async () => {
  const { state, service } = isolatedDatabase();
  state.rows.push({ created_at: new Date(state.now - 8 * DAY), phone_hash: 'old', account_hash: 'old', ip_hash: 'old' });
  assert.equal((await service().reserveSmsSend(identity(1))).allowed, true);
  assert.equal(state.rows.length, 1);
  const originalSecret = process.env.JWT_SECRET;
  const originalLimit = process.env.SMS_DAILY_LIMIT;
  try {
    delete process.env.JWT_SECRET;
    await assert.rejects(configuredReserve(identity(1)), /persistent JWT_SECRET/);
    process.env.JWT_SECRET = 'test';
    for (const value of ['0', '-1', 'abc', '2.5', '']) {
      process.env.SMS_DAILY_LIMIT = value;
      await assert.rejects(configuredReserve(identity(1)), /positive integer/);
    }
  } finally {
    if (originalSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = originalSecret;
    if (originalLimit === undefined) delete process.env.SMS_DAILY_LIMIT; else process.env.SMS_DAILY_LIMIT = originalLimit;
  }
});
