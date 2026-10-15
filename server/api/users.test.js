const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
const { normalizeUsPhoneE164 } = require('../utils/phoneNormalize');

const pendingUser = {
  id: 42,
  username: 'returning-user',
  phone_number: '(201) 555-0123',
  password_hash: 'existing-password-hash',
  is_verified: false,
  role: 'user',
};
let storedUser, phoneOwner, calls, budgetMode, sendResult, sendError, checkResult, changeResult;

function mockModule(file, exports) {
  const filename = require.resolve(file);
  require.cache[filename] = { id: filename, filename, loaded: true, exports };
}

// The router never imports a database connection or makes a real SMS request.
mockModule('../db/queries.js', {
  getUserByUsername: async username => {
    calls.push(['getUserByUsername', username]);
    return storedUser;
  },
  getUserByPhoneNumber: async phoneNumber => {
    calls.push(['getUserByPhoneNumber', phoneNumber]);
    return phoneOwner || (storedUser && normalizeUsPhoneE164(storedUser.phone_number) === phoneNumber ? storedUser : null);
  },
  createUser: async (...args) => {
    calls.push(['createUser', ...args]);
    storedUser = { id: 43, username: args[0], phone_number: args[2], password_hash: args[1], is_verified: false };
    return storedUser;
  },
  getUserByUsernameAndPhone: async (...args) => { calls.push(['getUserByUsernameAndPhone', ...args]); return storedUser; },
  verifyUser: async () => { throw new Error('Unexpected verification request'); },
  verifyUserByPhone: async (...args) => {
    calls.push(['verifyUserByPhone', ...args]);
    storedUser = { ...storedUser, is_verified: true };
    return storedUser;
  },
  changeUnverifiedUserPhone: async (...args) => {
    calls.push(['changeUnverifiedUserPhone', ...args]);
    if (changeResult === 'race') return null;
    if (changeResult === 'conflict') throw Object.assign(new Error('isolated duplicate'), { code: '23505' });
    storedUser = { ...storedUser, phone_number: args[2] };
    return storedUser;
  },
  updateVerificationCode: async () => { throw new Error('Unexpected code update'); },
  updatePassword: async (...args) => { calls.push(['updatePassword', ...args]); return storedUser; },
});
mockModule('bcrypt', {
  compare: async (password, hash) => {
    calls.push(['compare', password, hash]);
    return password === 'correct-password' && hash === pendingUser.password_hash;
  },
  hash: async (...args) => { calls.push(['hash', ...args]); return 'new-password-hash'; },
});
mockModule('../services/loginSessions', {
  createSession: async (...args) => { calls.push(['createSession', args[0].id]); },
  revokeSession: async () => { calls.push(['revokeSession']); },
  sessionUser: async () => { throw new Error('Unexpected refresh request'); },
  accessToken: () => { throw new Error('Unexpected refresh token'); },
  sameOrigin: () => true,
});
mockModule('../services/smsSendBudget', {
  reserveSmsSend: async details => {
    calls.push(['reserveSmsSend', details]);
    if (budgetMode === 'database-error') throw Object.assign(new Error('isolated budget database failure'), { code: '42P01' });
    if (budgetMode === 'denied') return { allowed: false, retryAfterSeconds: 3600, message: 'Text message request limit reached. Please try again later.' };
    return { allowed: true, attemptId: 123, retryAfterSeconds: 60, resendAvailableAt: Date.now() + 60000 };
  },
  recordSmsResult: async (...args) => { calls.push(['recordSmsResult', ...args]); },
});
mockModule('twilio', () => ({ verify: { v2: { services: () => ({
  verifications: { create: async request => {
    calls.push(['sendSMS', request]);
    if (sendError) throw sendError;
    return sendResult;
  } },
  verificationChecks: { create: async request => {
    calls.push(['checkSMS', request]);
    return checkResult;
  } },
}) } } }));

const originalEnv = {};
for (const [name, value] of Object.entries({
  JWT_SECRET: 'users-api-isolated-test-secret',
  TWILIO_ACCOUNT_SID: 'isolated-test-account',
  TWILIO_AUTH_TOKEN: 'isolated-test-auth',
  TWILIO_VERIFY_SERVICE_SID: 'isolated-test-service',
  SMS_ENABLED: 'true',
})) {
  originalEnv[name] = process.env[name];
  process.env[name] = value;
}
const app = express();
app.use(express.json());
app.use('/users', require('./users'));
const { issueVerificationToken } = require('../services/verificationSession');
let server, base;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/users`;
});
beforeEach(() => {
  storedUser = { ...pendingUser };
  phoneOwner = null;
  calls = [];
  budgetMode = 'allowed';
  sendResult = { sid: 'VE' + 'a'.repeat(32), status: 'pending' };
  sendError = null;
  checkResult = { status: 'pending' };
  changeResult = 'updated';
  process.env.TWILIO_VERIFY_SERVICE_SID = 'isolated-test-service';
  process.env.SMS_ENABLED = 'true';
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
  for (const [name, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

async function post(route, body, headers = {}) {
  const response = await fetch(`${base}/${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return { response, body: await response.json() };
}
function assertNoSessionOrAccountChanges(result) {
  assert.equal(result.response.headers.get('set-cookie'), null);
  assert.equal(result.body.token, undefined);
  assert.equal(result.body.user, undefined);
  assert.equal(result.body.password, undefined);
  assert.equal(result.body.password_hash, undefined);
  for (const name of ['sendSMS', 'createUser', 'hash', 'createSession', 'revokeSession']) {
    assert.equal(calls.some(call => call[0] === name), false, `${name} must not run`);
  }
  assert.deepEqual(storedUser, pendingUser);
}
function assertResumeResult(result, status) {
  assert.equal(result.response.status, status);
  assert.deepEqual({ ...result.body, verification: { ...result.body.verification, verificationToken: undefined } }, {
    success: false,
    requiresVerification: true,
    verification: { username: pendingUser.username, phoneNumber: '+12015550123', verificationToken: undefined },
    message: 'Your account is not verified yet. Continue phone verification to finish signing up.',
  });
  assert.equal(typeof result.body.verification.verificationToken, 'string');
  assert.deepEqual(calls.find(call => call[0] === 'compare'), ['compare', 'correct-password', pendingUser.password_hash]);
  assertNoSessionOrAccountChanges(result);
}

test('correct password on an unverified login resumes the same account without SMS or login credentials', async () => {
  const result = await post('login', { username: pendingUser.username, password: 'correct-password', rememberMe: true });
  assertResumeResult(result, 403);
  assert.deepEqual(calls.map(call => call[0]), ['getUserByUsername', 'compare']);
});

test('wrong passwords do not disclose an unverified account or its phone', async () => {
  const result = await post('login', { username: pendingUser.username, password: 'wrong-password', rememberMe: true });
  assert.equal(result.response.status, 401);
  assert.deepEqual(result.body, { success: false, message: 'Invalid credentials' });
  assertNoSessionOrAccountChanges(result);
});

test('unknown login remains a generic credential failure', async () => {
  storedUser = null;
  const result = await post('login', { username: 'missing', password: 'correct-password' });
  assert.equal(result.response.status, 401);
  assert.deepEqual(result.body, { success: false, message: 'Invalid credentials' });
  assert.deepEqual(calls.map(call => call[0]), ['getUserByUsername']);
  assert.equal(result.response.headers.get('set-cookie'), null);
});

test('retrying signup with the same normalized phone and correct password resumes without recreating the account', async () => {
  const result = await post('register', { username: pendingUser.username, password: 'correct-password', phoneNumber: '+1 201 555 0123' });
  assertResumeResult(result, 409);
  assert.deepEqual(calls.map(call => call[0]), ['getUserByUsername', 'compare']);
});

test('signup conflicts do not disclose verification details when the password is wrong', async () => {
  const result = await post('register', { username: pendingUser.username, password: 'wrong-password', phoneNumber: '2015550123' });
  assert.equal(result.response.status, 409);
  assert.deepEqual(result.body, { success: false, message: 'Username already exists' });
  assertNoSessionOrAccountChanges(result);
});

test('signup with another phone cannot resume or expose the existing account', async () => {
  const result = await post('register', { username: pendingUser.username, password: 'correct-password', phoneNumber: '2015559999' });
  assert.equal(result.response.status, 409);
  assert.deepEqual(result.body, { success: false, message: 'Username already exists' });
  assert.equal(calls.some(call => call[0] === 'compare'), false);
  assertNoSessionOrAccountChanges(result);
});

test('verified username and phone conflicts remain ordinary conflicts', async () => {
  storedUser.is_verified = true;
  const result = await post('register', { username: pendingUser.username, password: 'correct-password', phoneNumber: '2015550123' });
  assert.equal(result.response.status, 409);
  assert.deepEqual(result.body, { success: false, message: 'Username already exists' });
  assert.deepEqual(calls.map(call => call[0]), ['getUserByUsername']);
});

test('phone-only conflicts never expose the other username or verification state', async () => {
  storedUser = null;
  phoneOwner = { ...pendingUser };
  const result = await post('register', { username: 'another-user', password: 'correct-password', phoneNumber: '2015550123' });
  assert.equal(result.response.status, 409);
  assert.deepEqual(result.body, { success: false, message: 'Phone number already registered' });
  assert.deepEqual(calls.map(call => call[0]), ['getUserByUsername', 'getUserByPhoneNumber']);
});

test('a new registration still sends its initial code and creates a new unverified user', async () => {
  storedUser = null;
  const result = await post('register', { username: 'new-user', password: 'new-password', phoneNumber: '2015550123' });
  assert.equal(result.response.status, 201);
  assert.equal(result.body.success, true);
  assert.deepEqual(result.body.user, { id: 43, username: 'new-user', phoneNumber: '+12015550123', isVerified: false, role: 'user' });
  assert.deepEqual(calls.find(call => call[0] === 'sendSMS')[1], { to: '+12015550123', channel: 'sms' });
  assert.deepEqual(calls.find(call => call[0] === 'createUser'), ['createUser', 'new-user', 'new-password-hash', '+12015550123', null, null]);
  assert.equal(result.body.token, undefined);
  assert.equal(typeof result.body.verification.verificationToken, 'string');
  assert.equal(result.body.verification.phoneNumber, '+12015550123');
  assert.equal(result.body.retryAfterSeconds, 60);
  assert.ok(calls.findIndex(call => call[0] === 'createUser') < calls.findIndex(call => call[0] === 'sendSMS'));
  assert.equal(result.response.headers.get('set-cookie'), null);
});

test('a verified remembered login preserves its existing access token and session behavior', async () => {
  storedUser.is_verified = true;
  const result = await post('login', { username: pendingUser.username, password: 'correct-password', rememberMe: true });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.success, true);
  assert.equal(result.body.remembered, true);
  assert.equal(result.body.user.isVerified, true);
  assert.equal(result.body.requiresVerification, undefined);
  const claims = jwt.verify(result.body.token, process.env.JWT_SECRET);
  assert.equal(claims.userId, pendingUser.id);
  assert.equal(claims.username, pendingUser.username);
  assert.equal(claims.role, 'user');
  assert.equal(claims.exp - claims.iat, 24 * 60 * 60);
  assert.deepEqual(calls.map(call => call[0]), ['getUserByUsername', 'compare', 'createSession']);
});

test('ordinary verified login still revokes a remembered session and returns an access token', async () => {
  storedUser.is_verified = true;
  storedUser.role = 'admin';
  const result = await post('login', { username: pendingUser.username, password: 'correct-password' });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.remembered, false);
  assert.equal(result.body.user.role, 'admin');
  assert.equal(jwt.verify(result.body.token, process.env.JWT_SECRET).role, 'admin');
  assert.deepEqual(calls.map(call => call[0]), ['getUserByUsername', 'compare', 'revokeSession']);
});

const newRegistration = { username: 'new-user', password: 'new-password', phoneNumber: '2015550123' };
const correction = { username: pendingUser.username, password: 'correct-password', currentPhoneNumber: '+12015550123', phoneNumber: '+12015550124' };
const noSms = () => assert.equal(calls.some(call => call[0] === 'sendSMS'), false, 'Paid SMS must not run');
const noAccountCreate = () => assert.equal(calls.some(call => call[0] === 'createUser'), false, 'No account should be created');
const noPhoneChange = () => assert.equal(calls.some(call => call[0] === 'changeUnverifiedUserPhone'), false, 'The phone must remain unchanged');
const resendBody = () => ({ phoneNumber: normalizeUsPhoneE164(storedUser.phone_number), verificationToken: issueVerificationToken(storedUser) });

test('missing Twilio configuration fails signup honestly before reserving cost or creating an account', async () => {
  storedUser = null;
  delete process.env.TWILIO_VERIFY_SERVICE_SID;
  const result = await post('register', newRegistration);
  assert.equal(result.response.status, 503);
  assert.equal(result.body.success, false);
  assert.equal(result.body.code, 'SMS_UNAVAILABLE');
  assert.equal(result.body.verification, undefined);
  assert.equal(calls.some(call => call[0] === 'reserveSmsSend'), false);
  noAccountCreate(); noSms();
});

test('SMS kill switch stops signup before any paid send or account creation', async () => {
  storedUser = null;
  process.env.SMS_ENABLED = 'false';
  const result = await post('register', newRegistration);
  assert.equal(result.response.status, 503);
  assert.equal(result.body.success, false);
  assert.equal(calls.some(call => call[0] === 'reserveSmsSend'), false);
  noAccountCreate(); noSms();
});

for (const route of ['register', 'resend-verification', 'change-verification-phone']) {
  for (const mode of ['denied', 'database-error']) {
    test(`${route} fails closed with no SMS or account update when budget is ${mode}`, async () => {
      budgetMode = mode;
      const body = route === 'register' ? newRegistration : route === 'resend-verification' ? resendBody() : correction;
      if (route === 'register') storedUser = null;
      const result = await post(route, body);
      assert.equal(result.response.status, mode === 'denied' ? 429 : 503);
      assert.equal(result.body.success, false);
      assert.equal(result.body.code, mode === 'denied' ? 'SMS_RATE_LIMITED' : 'SMS_UNAVAILABLE');
      if (mode === 'denied') {
        assert.equal(result.body.retryAfterSeconds, 3600);
        assert.equal(result.response.headers.get('retry-after'), '3600');
        assert.ok(result.body.resendAvailableAt > Date.now());
      }
      noAccountCreate(); noPhoneChange(); noSms();
    });
  }
}

for (const invalid of ['missing', 'forged', 'wrong-phone', 'expired', 'changed-password', 'verified-account']) {
  test(`resend rejects a ${invalid} verification capability before spending any SMS budget`, async () => {
    let body = resendBody();
    if (invalid === 'missing') delete body.verificationToken;
    if (invalid === 'forged') body.verificationToken = jwt.sign({ sub: String(storedUser.id), phone: body.phoneNumber, username: storedUser.username }, process.env.JWT_SECRET, { audience: 'phone-verification' });
    if (invalid === 'wrong-phone') {
      storedUser.phone_number = '+12015550124';
      body.phoneNumber = storedUser.phone_number;
    }
    if (invalid === 'expired') {
      const originalNow = Date.now;
      try {
        Date.now = () => originalNow() - 8 * 86400000;
        body.verificationToken = issueVerificationToken(storedUser);
      } finally { Date.now = originalNow; }
    }
    if (invalid === 'changed-password') storedUser.password_hash = 'changed-password-hash';
    if (invalid === 'verified-account') storedUser.is_verified = true;
    const result = await post('resend-verification', body);
    assert.equal(result.response.status, 401);
    assert.equal(result.body.code, 'VERIFICATION_SESSION_EXPIRED');
    assert.equal(calls.some(call => call[0] === 'reserveSmsSend'), false);
    noSms();
  });
}

test('a capability issued after password verification permits one explicit resend with socket IP instead of forged X-Forwarded-For', async () => {
  const login = await post('login', { username: pendingUser.username, password: 'correct-password' });
  const verification = login.body.verification;
  assert.equal(login.response.status, 403);
  assert.equal(calls.some(call => call[0] === 'sendSMS'), false);
  const result = await post('resend-verification', { phoneNumber: verification.phoneNumber, verificationToken: verification.verificationToken }, { 'X-Forwarded-For': '203.0.113.99, 198.51.100.7' });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.success, true);
  assert.equal(result.body.retryAfterSeconds, 60);
  assert.deepEqual(calls.find(call => call[0] === 'reserveSmsSend')[1], { phoneNumber: '+12015550123', username: pendingUser.username, ip: '127.0.0.1' });
  assert.deepEqual(calls.filter(call => call[0] === 'sendSMS'), [['sendSMS', { to: '+12015550123', channel: 'sms' }]]);
  assert.equal(result.body.token, undefined);
  assert.equal(result.response.headers.get('set-cookie'), null);
});

test('verification capability cannot act as a login access token on /me', async () => {
  const capability = issueVerificationToken(storedUser);
  assert.throws(() => jwt.verify(capability, process.env.JWT_SECRET));
  const response = await fetch(`${base}/me`, { headers: { Authorization: `Bearer ${capability}` } });
  assert.equal(response.status, 401);
  assert.equal((await response.json()).user, undefined);
  assert.equal(calls.length, 0);
});

test('provider failure after signup preserves the created pending account and usable verification metadata', async () => {
  storedUser = null;
  sendError = Object.assign(new Error('isolated provider failure'), { code: 20429 });
  const result = await post('register', newRegistration);
  assert.equal(result.response.status, 503);
  assert.equal(result.body.success, false);
  assert.equal(result.body.requiresVerification, true);
  assert.equal(result.body.code, 'SMS_SEND_FAILED');
  assert.equal(result.body.verification.username, newRegistration.username);
  assert.equal(result.body.verification.phoneNumber, '+12015550123');
  assert.equal(typeof result.body.verification.verificationToken, 'string');
  assert.equal(result.body.user, undefined);
  assert.equal(storedUser.is_verified, false);
  assert.equal(storedUser.username, newRegistration.username);
  assert.ok(calls.findIndex(call => call[0] === 'createUser') < calls.findIndex(call => call[0] === 'sendSMS'));
  assert.deepEqual(calls.find(call => call[0] === 'recordSmsResult'), ['recordSmsResult', 123, { status: 'failed', errorCode: 20429 }]);
  assert.equal(result.body.retryAfterSeconds, 60);
});

for (const status of ['failed', 'canceled', 'approved']) {
  test(`provider send status ${status} is not reported as successful delivery or accepted SMS`, async () => {
    sendResult.status = status;
    const result = await post('resend-verification', resendBody());
    assert.equal(result.response.status, 503);
    assert.equal(result.body.success, false);
    assert.equal(result.body.code, 'SMS_SEND_FAILED');
    assert.equal(calls.filter(call => call[0] === 'sendSMS').length, 1);
  });
}

for (const failure of ['wrong-password', 'verified', 'conflict', 'stale-phone']) {
  test(`phone correction ${failure} is rejected without paid SMS or an account update`, async () => {
    const body = { ...correction };
    if (failure === 'wrong-password') body.password = 'incorrect-password';
    if (failure === 'verified') storedUser.is_verified = true;
    if (failure === 'conflict') phoneOwner = { id: 99, username: 'another-user', phone_number: body.phoneNumber };
    if (failure === 'stale-phone') storedUser.phone_number = '+12015550125';
    const result = await post('change-verification-phone', body);
    assert.equal(result.response.status, failure === 'wrong-password' ? 401 : failure === 'verified' ? 403 : 409);
    assert.equal(result.body.success, false);
    assert.equal(calls.some(call => call[0] === 'reserveSmsSend'), false);
    noPhoneChange(); noSms();
    if (failure === 'stale-phone') assert.equal(result.body.verification.phoneNumber, storedUser.phone_number);
  });
}

for (const race of ['race', 'conflict']) {
  test(`phone correction compare-and-set ${race} cancels its reservation without sending SMS`, async () => {
    changeResult = race;
    const result = await post('change-verification-phone', correction);
    assert.equal(result.response.status, 409);
    assert.equal(result.body.success, false);
    assert.equal(storedUser.phone_number, pendingUser.phone_number);
    assert.deepEqual(calls.find(call => call[0] === 'recordSmsResult'), ['recordSmsResult', 123, { status: 'canceled' }]);
    noSms();
  });
}

test('phone correction updates the same user before sending and issues a capability for the new phone', async () => {
  const oldCapability = issueVerificationToken(storedUser);
  const result = await post('change-verification-phone', correction, { 'X-Forwarded-For': '203.0.113.99' });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.success, true);
  assert.equal(storedUser.id, pendingUser.id);
  assert.equal(storedUser.username, pendingUser.username);
  assert.equal(storedUser.phone_number, correction.phoneNumber);
  assert.deepEqual(calls.find(call => call[0] === 'changeUnverifiedUserPhone'), ['changeUnverifiedUserPhone', pendingUser.id, pendingUser.phone_number, correction.phoneNumber]);
  assert.deepEqual(calls.find(call => call[0] === 'reserveSmsSend')[1], { phoneNumber: correction.phoneNumber, username: pendingUser.username, ip: '127.0.0.1' });
  assert.ok(calls.findIndex(call => call[0] === 'changeUnverifiedUserPhone') < calls.findIndex(call => call[0] === 'sendSMS'));
  assert.equal(result.body.verification.phoneNumber, correction.phoneNumber);
  assert.notEqual(result.body.verification.verificationToken, oldCapability);
  assert.equal(result.body.user, undefined);
  assert.equal(result.body.token, undefined);
  noAccountCreate();
});

test('phone correction SMS provider failure preserves new phone and returns recoverable metadata with truthful failure', async () => {
  sendError = Object.assign(new Error('isolated provider unavailable'), { code: 30003 });
  const result = await post('change-verification-phone', correction);
  assert.equal(result.response.status, 503);
  assert.equal(result.body.success, false);
  assert.equal(result.body.requiresVerification, true);
  assert.equal(result.body.code, 'SMS_SEND_FAILED');
  assert.equal(storedUser.phone_number, correction.phoneNumber);
  assert.equal(result.body.verification.phoneNumber, correction.phoneNumber);
  assert.equal(result.body.verification.username, pendingUser.username);
  assert.equal(typeof result.body.verification.verificationToken, 'string');
  assert.equal(result.body.retryAfterSeconds, 60);
  assert.equal(result.body.message.includes('could not confirm'), true);
  assert.equal(result.body.token, undefined);
  assert.equal(result.response.headers.get('set-cookie'), null);
});

test('old database verification sentinel cannot approve an SMS code without Twilio approval', async () => {
  storedUser.verification_code = '123456';
  storedUser.verification_expiry = new Date(Date.now() + 60000);
  const result = await post('verify', { phoneNumber: '+12015550123', verificationCode: '123456' });
  assert.equal(result.response.status, 400);
  assert.equal(result.body.success, false);
  assert.equal(storedUser.is_verified, false);
  assert.equal(calls.some(call => call[0] === 'verifyUserByPhone'), false);
  assert.deepEqual(calls.find(call => call[0] === 'checkSMS'), ['checkSMS', { to: '+12015550123', code: '123456' }]);
  noSms();
});

test('missing Twilio config never verifies the account using an old database code', async () => {
  delete process.env.TWILIO_VERIFY_SERVICE_SID;
  storedUser.verification_code = '123456';
  const result = await post('verify', { phoneNumber: '+12015550123', verificationCode: '123456' });
  assert.equal(result.response.status, 503);
  assert.equal(result.body.success, false);
  assert.equal(result.body.code, 'SMS_UNAVAILABLE');
  assert.equal(storedUser.is_verified, false);
  assert.equal(calls.some(call => ['checkSMS', 'verifyUserByPhone'].includes(call[0])), false);
  noSms();
});

test('only an approved provider check verifies the matching account ID', async () => {
  checkResult.status = 'approved';
  const result = await post('verify', { phoneNumber: '+12015550123', verificationCode: '123456' });
  assert.equal(result.response.status, 200);
  assert.equal(result.body.success, true);
  assert.equal(result.body.user.isVerified, true);
  assert.deepEqual(calls.find(call => call[0] === 'verifyUserByPhone'), ['verifyUserByPhone', '+12015550123', pendingUser.id]);
  noSms();
});

test('pending accounts cannot use password recovery to bypass verification and obtain new resend capabilities', async () => {
  const result = await post('reset-password-update', { username: pendingUser.username, phoneNumber: '+12015550123', newPassword: 'attacker-chosen-password' });
  assert.equal(result.response.status, 403);
  assert.equal(result.body.success, false);
  assert.equal(result.body.message, 'Please verify your phone number first');
  assert.equal(calls.some(call => ['hash', 'updatePassword'].includes(call[0])), false);
  assert.equal(storedUser.password_hash, pendingUser.password_hash);
  noSms();
});
