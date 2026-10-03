import { apiFetch } from './apiClient';
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); global.fetch = jest.fn(); });
afterEach(() => { delete global.fetch; });
test('expired access token refreshes once and retries with new token', async () => {
  localStorage.setItem('authToken','expired');
  fetch.mockResolvedValueOnce({ status: 401 }).mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'new-token', user: { username: 'alice', role: 'user' } }) }).mockResolvedValueOnce({ status: 200 });
  const response = await apiFetch('/api/orders', { auth: 'user' });
  expect(response.status).toBe(200);
  expect(fetch.mock.calls[1][0]).toBe('/api/users/refresh');
  expect(fetch.mock.calls[2][1].headers.Authorization).toBe('Bearer new-token');
});
test('signed-out devices never restore remembered cookies automatically', async () => {
  localStorage.setItem('makSignedOut','1');
  fetch.mockResolvedValue({ status: 401 });
  await apiFetch('/api/orders', { auth: 'user' });
  expect(fetch).toHaveBeenCalledTimes(1);
});
