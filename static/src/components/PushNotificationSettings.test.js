import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PushNotificationSettings from './PushNotificationSettings';
import { apiFetch } from '../utils/apiClient';
jest.mock('../utils/apiClient');
jest.mock('../utils/pushNotifications', () => ({ pushSupported: () => false, syncPushSubscription: jest.fn(), stopPushNotifications: jest.fn() }));
beforeEach(() => {
  apiFetch.mockReset();
  apiFetch.mockImplementation(async url => ({ ok: true, json: async () => url.includes('config') ? { enabled: false } : { pickup: true, events: true } }));
});
test('notification setup explains iPhone installation and saves separate preferences', async () => {
  render(<PushNotificationSettings />);
  fireEvent.click(screen.getByRole('button', { name: /Phone notifications ·/ }));
  expect(await screen.findByText(/iPhone: open in Safari/)).toBeInTheDocument();
  const save = screen.getByRole('button', { name: 'Save preferences' });
  await waitFor(() => expect(save).toBeEnabled());
  fireEvent.click(screen.getByRole('checkbox', { name: /New delivery events/ }));
  fireEvent.click(save);
  await waitFor(() => expect(apiFetch).toHaveBeenCalledWith('/api/push/preferences', { method: 'PUT', auth: 'user', body: { pickup: true, events: false } }));
  expect(screen.getByRole('button', { name: 'Enable phone notifications' })).toBeDisabled();
});
test('setup failure is visible and preferences cannot silently be saved', async () => {
  apiFetch.mockResolvedValue({ ok: false, json: async () => ({ error: 'Notifications are not set up yet.' }) });
  render(<PushNotificationSettings />);
  fireEvent.click(screen.getByRole('button', { name: /Phone notifications ·/ }));
  expect(await screen.findByText('Notifications are not set up yet.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save preferences' })).toBeDisabled();
});
