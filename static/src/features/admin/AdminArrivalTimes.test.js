import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminArrivalTimes from './AdminArrivalTimes';
import { apiFetch } from '../../utils/apiClient';
jest.mock('../../utils/apiClient');
const location = 'Fort Lee 540 Main St';
beforeEach(() => {
  apiFetch.mockReset();
  apiFetch.mockImplementation(async (url, options = {}) => ({ ok: true, json: async () => options.method === 'POST' ? { success: true } : url.includes('openEvents') ? [{ pick_up_locations: [location] }] : { locations: [location], schedules: [], workerActive: true, pushConfigured: true } }));
});
test('admin saves date-specific location and 5:15 ETA with 15 minute reminder', async () => {
  render(<AdminArrivalTimes />);
  fireEvent.change(screen.getByLabelText('Delivery date'), { target: { value: '2026-10-09' } });
  const selector = screen.getByRole('combobox', { name: 'Pickup location for this date' });
  await waitFor(() => expect(selector).not.toHaveAttribute('aria-disabled','true'));
  fireEvent.mouseDown(selector);
  fireEvent.click(await screen.findByRole('option', { name: 'Fort Lee · 540 Main St' }));
  fireEvent.click(screen.getByRole('button', { name: 'Save arrival reminder' }));
  await waitFor(() => expect(apiFetch).toHaveBeenCalledWith('/api/arrival-schedules', { method: 'POST', auth: 'admin', body: { date: '2026-10-09', location, arrivalTime: '17:15', leadMinutes: 15, message: '' } }));
  expect(await screen.findByText(/Arrival reminder saved/)).toBeInTheDocument();
});
test('worker outage and no event are visible and prevent invalid location selection', async () => {
  apiFetch.mockImplementation(async url => ({ ok: true, json: async () => url.includes('openEvents') ? [] : { schedules: [], workerActive: false, pushConfigured: false } }));
  render(<AdminArrivalTimes />);
  expect(await screen.findByText(/Automatic reminders are temporarily unavailable/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save arrival reminder' })).toBeDisabled();
  expect(screen.getByText(/No pickup locations are open/)).toBeInTheDocument();
});
