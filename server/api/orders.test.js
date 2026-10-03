const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
process.env.JWT_SECRET = 'orders-api-isolated-test-secret';

let queryArgs;
const connectionPath = require.resolve('../db/connection.js');
require.cache[connectionPath] = { id: connectionPath, filename: connectionPath, loaded: true, exports: {
  query: async (...args) => {
    queryArgs = args;
    return { rows: [{ id: 7, username: 'test-user', pick_up_location: 'Test pickup', pick_up_date: '2026-10-02', order_details: JSON.stringify({ 1: [{ name: 'Noodles', quantity: 2 }] }), total: '20.00', notes: '', payment_status: null }] };
  },
} };
const app = express();
app.use('/api/orders', require('./orders'));
let server, base;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));

function headers(role) { return { Authorization: `Bearer ${jwt.sign({ username: 'tester', role }, process.env.JWT_SECRET)}` }; }

test('admin search includes each order pickup location and date and parses dishes', async () => {
  const response = await fetch(`${base}/api/orders/search?pick_up_date=2026-10-02&pick_up_location=Test%20pickup`, { headers: headers('admin') });
  assert.equal(response.status, 200);
  const [order] = await response.json();
  assert.equal(order.pick_up_location, 'Test pickup');
  assert.equal(order.pick_up_date, '2026-10-02');
  assert.equal(order.order_details['1'][0].name, 'Noodles');
  assert.equal(order.payment_status, 'Unpaid');
  assert.deepEqual(queryArgs[1], ['2026-10-02', 'Test pickup']);
});

test('admin search still rejects customers and anonymous callers', async () => {
  assert.equal((await fetch(`${base}/api/orders/search?pick_up_date=2026-10-02`)).status, 401);
  assert.equal((await fetch(`${base}/api/orders/search?pick_up_date=2026-10-02`, { headers: headers('user') })).status, 403);
});

test('admin search requires a pickup date', async () => {
  assert.equal((await fetch(`${base}/api/orders/search`, { headers: headers('admin') })).status, 400);
});
