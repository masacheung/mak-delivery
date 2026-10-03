import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderLookup from './orderLookup';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../utils/apiClient';
jest.mock('../../hooks/useAuth');
jest.mock('../../utils/apiClient');
const future = { id: 22, username: 'alice', pick_up_date: '2099-10-09', pick_up_location: '540 Main St, Fort Lee, NJ', payment_status: 'Unpaid', total: 20, order_details: { 1: [{ id: 'dish', name: 'Noodles', price: 10, quantity: 1 }] } };
const past = { ...future, id: 11, pick_up_date: '2020-10-02', payment_status: 'Venmo' };
beforeEach(() => { useAuth.mockReturnValue({ user: { username: 'alice' }, isAuthenticated: true, loading: false }); apiFetch.mockReset(); apiFetch.mockResolvedValue({ ok: true, json: async () => [past, future] }); });
function mount() { render(<MemoryRouter><OrderLookup /></MemoryRouter>); }

test('signed-in orders open without a manual search, expose pickup/map/payment details and separate past dates', async () => {
  mount();
  fireEvent.click(await screen.findByRole('button', { name: 'View order 22' }));
  expect(await screen.findByRole('heading', { name: 'Order #22' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Open pickup map' })).toHaveAttribute('href', expect.stringContaining('540%20Main%20St'));
  expect(screen.getByRole('link', { name: 'Edit this order' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'View payment instructions' }));
  expect(await screen.findByText('Payment status updates after the admin records your payment.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Payment Complete' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Back to order' }));
  await waitFor(() => expect(screen.queryByText('Payment instructions')).not.toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: 'Close order details' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  fireEvent.click(screen.getByRole('tab', { name: 'Past dates (1)' }));
  fireEvent.click(await screen.findByRole('button', { name: 'View order 11' }));
  expect(screen.queryByRole('link', { name: 'Edit this order' })).not.toBeInTheDocument();
  expect(screen.getByText('Payment recorded · Venmo', { selector: '.MuiChip-label' })).toBeInTheDocument();
});

test('guest lookup still works with the keyboard and does not expose editing controls', async () => {
  useAuth.mockReturnValue({ user: null, isAuthenticated: false, loading: false });
  apiFetch.mockResolvedValue({ ok: true, json: async () => future });
  mount();
  fireEvent.change(screen.getByLabelText(/Username/), { target: { value: 'alice' } });
  fireEvent.change(screen.getByLabelText(/Order ID/), { target: { value: '22' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Find order' }).closest('form'));
  expect(await screen.findByRole('heading', { name: 'Order #22' })).toBeInTheDocument();
  expect(apiFetch).toHaveBeenCalledWith('/api/orders?username=alice&orderId=22', { auth: 'none' });
  expect(screen.queryByRole('link', { name: 'Edit this order' })).not.toBeInTheDocument();
});

test('failed lookup remains recoverable', async () => {
  useAuth.mockReturnValue({ user: null, isAuthenticated: false, loading: false });
  apiFetch.mockResolvedValue({ ok: false, status: 404, json: async () => ({}) });
  mount();
  fireEvent.change(screen.getByLabelText(/Username/), { target: { value: 'alice' } });
  fireEvent.change(screen.getByLabelText(/Order ID/), { target: { value: '99' } });
  fireEvent.click(screen.getByRole('button', { name: 'Find order' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Order not found');
  expect(screen.getByRole('button', { name: 'Find order' })).toBeEnabled();
});
