import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AvailablePickupDates, { availablePickupDates, pickupDateLabel } from './AvailablePickupDates';
import { apiFetch } from '../../utils/apiClient';

jest.mock('../../utils/apiClient', () => ({ apiFetch: jest.fn() }));

beforeEach(() => apiFetch.mockReset());

test('offers unique open dates in calendar order and selects the actual event date', async () => {
  apiFetch.mockResolvedValue({ ok: true, json: async () => [
    { pick_up_date: '2026-10-04T00:00:00.000Z' }, { pick_up_date: '2026-10-02' }, { pick_up_date: '2026-10-02' },
  ] });
  const onChange = jest.fn();
  render(<AvailablePickupDates value="2026-10-02" onChange={onChange} />);
  const secondDate = await screen.findByRole('button', { name: 'Sun, Oct 4, 2026' });
  expect(screen.getByRole('button', { name: 'Fri, Oct 2, 2026' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getAllByRole('button')).toHaveLength(2);
  expect(screen.queryByRole('button', { name: /Oct 3/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Fri, Oct 2, 2026' }));
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(secondDate);
  expect(onChange).toHaveBeenCalledWith('2026-10-04');
  expect(availablePickupDates([{ pick_up_date: '2026-10-04' }, {}, { pick_up_date: '2026-10-02' }])).toEqual(['2026-10-02', '2026-10-04']);
  expect(pickupDateLabel('2026-10-02')).toBe('Fri, Oct 2, 2026');
});

test('a 404 means no open dates rather than a failed loading message', async () => {
  apiFetch.mockResolvedValue({ ok: false, status: 404 });
  render(<AvailablePickupDates value="" onChange={jest.fn()} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No pickup dates are open yet');
  expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
});

test('failed loading can be retried without offering unavailable dates', async () => {
  apiFetch.mockResolvedValueOnce({ ok: false, status: 500 })
    .mockResolvedValueOnce({ ok: true, json: async () => [{ pick_up_date: '2026-10-02' }] });
  render(<AvailablePickupDates value="" onChange={jest.fn()} />);
  fireEvent.click(await screen.findByRole('button', { name: 'Retry' }));
  expect(await screen.findByRole('button', { name: 'Fri, Oct 2, 2026' })).toBeInTheDocument();
  expect(apiFetch).toHaveBeenCalledTimes(2);
});
