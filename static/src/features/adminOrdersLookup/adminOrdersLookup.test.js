import React from 'react';
import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import AdminOrdersLookup from './adminOrdersLookup';
import { apiFetch } from '../../utils/apiClient';
import { Document, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';

jest.mock('../../utils/apiClient', () => ({ apiFetch: jest.fn() }));
jest.mock('docx', () => ({ Document: jest.fn(), Packer: { toBlob: jest.fn().mockResolvedValue('test-blob') }, Paragraph: jest.fn(), HeadingLevel: {} }));
jest.mock('file-saver', () => ({ saveAs: jest.fn() }));
const orders = [
  { id: 1, username: 'alice', pick_up_location: 'Pickup A', total: 40, payment_status: 'Unpaid', order_details: { 1: [{ name: 'Noodles', quantity: 2 }], 2: [{ name: 'Tea', quantity: 1 }] } },
  { id: 2, username: 'bob', pick_up_location: 'Pickup B', total: 20, payment_status: 'Cash', order_details: { 1: [{ name: 'Rice', quantity: 1 }] } },
];
beforeEach(() => {
  apiFetch.mockReset();
  Document.mockClear();
  Packer.toBlob.mockResolvedValue('test-blob');
  saveAs.mockClear();
  apiFetch.mockResolvedValue({ ok: true, json: async () => orders });
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: jest.fn().mockResolvedValue() } });
});

async function searchOrders(count = 2) {
  render(<AdminOrdersLookup />);
  fireEvent.change(screen.getByLabelText(/Pickup date/), { target: { value: '2026-10-02' } });
  fireEvent.click(screen.getByRole('button', { name: 'Search orders' }));
  await screen.findByText(`${count} orders`);
}

test('groups multiple restaurants, shows every pickup, and copies only one restaurant', async () => {
  await searchOrders();
  expect(screen.getAllByText('Pickup A')).toHaveLength(2);
  expect(screen.getByText('Pickup B')).toBeInTheDocument();
  const heading = screen.getByRole('heading', { name: 'Tasty Moment' });
  const group = heading.closest('.MuiCard-root');
  expect(within(group).getByText('2 × Noodles')).toBeInTheDocument();
  expect(within(group).queryByText('1 × Tea')).not.toBeInTheDocument();
  fireEvent.click(within(group).getByRole('button', { name: 'Copy restaurant orders' }));
  await screen.findByText('Copied Tasty Moment orders.');
  const text = navigator.clipboard.writeText.mock.calls[0][0];
  expect(text).toContain('#1 · alice');
  expect(text).toContain('Pickup: Pickup B');
  expect(text).not.toContain('Tea');
});

test('restaurant selection hides the other restaurant and updates export scope', async () => {
  await searchOrders();
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Restaurant' }));
  fireEvent.click(screen.getByRole('option', { name: 'Tasty Moment' }));
  expect(screen.getByText('1 restaurants')).toBeInTheDocument();
  expect(screen.queryByText('1 × Tea')).not.toBeInTheDocument();
});

test('failed search displays an actionable error instead of stale results', async () => {
  apiFetch.mockResolvedValue({ ok: false });
  render(<AdminOrdersLookup />);
  fireEvent.change(screen.getByLabelText(/Pickup date/), { target: { value: '2026-10-02' } });
  fireEvent.click(screen.getByRole('button', { name: 'Search orders' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load orders');
});

test('Word export loads on demand and downloads the searched date report', async () => {
  await searchOrders();
  fireEvent.click(screen.getByRole('button', { name: 'Export to Word' }));
  await waitFor(() => expect(saveAs).toHaveBeenCalledWith('test-blob', 'Restaurant_orders_2026-10-02.docx'));
  expect(Document).toHaveBeenCalledTimes(1);
  expect(Packer.toBlob).toHaveBeenCalled();
});

test('turning restaurant grouping off shows all restaurants and multiple orders under each user', async () => {
  apiFetch.mockResolvedValue({ ok: true, json: async () => [...orders, {
    id: 3, username: 'alice', pick_up_location: 'Pickup C', total: 10, payment_status: 'Unpaid',
    order_details: { 2: [{ name: 'Coffee', quantity: 1 }] }, notes: 'No sugar',
  }] });
  await searchOrders(3);
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Restaurant' }));
  fireEvent.click(screen.getByRole('option', { name: 'Tasty Moment' }));
  expect(screen.queryByText('1 × Tea')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /By user/ }));
  expect(screen.getByText('2 users')).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: 'Restaurant' })).toHaveAttribute('aria-disabled', 'true');
  const alice = screen.getByRole('heading', { name: 'alice' }).closest('.MuiCard-root');
  expect(within(alice).getByText('2 orders')).toBeInTheDocument();
  expect(within(alice).getByText('2 × Noodles')).toBeInTheDocument();
  expect(within(alice).getByText('1 × Tea')).toBeInTheDocument();
  expect(within(alice).getByText('1 × Coffee')).toBeInTheDocument();
  expect(within(alice).getByText('Pickup C')).toBeInTheDocument();
  expect(screen.getAllByText('Pickup A')).toHaveLength(1);
  expect(screen.getByText('Whole-order totals: $70.00')).toBeInTheDocument();
  fireEvent.click(within(alice).getByRole('button', { name: 'Copy user orders' }));
  await screen.findByText('Copied alice orders.');
  const text = navigator.clipboard.writeText.mock.calls[0][0];
  expect(text).toContain('Tea');
  expect(text).toContain('Coffee');
  expect(text).toContain('Notes: No sugar');
  expect(text).not.toContain('Rice');
  fireEvent.click(screen.getByRole('button', { name: /By restaurant/ }));
  expect(screen.queryByText('1 × Tea')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Tasty Moment' })).toBeInTheDocument();
  expect(apiFetch).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: /By restaurant/ })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: /By restaurant/ }));
  expect(screen.getByRole('button', { name: /By restaurant/ })).toHaveAttribute('aria-pressed', 'true');
});

test('user view exports complete orders using the user report format', async () => {
  await searchOrders();
  fireEvent.click(screen.getByRole('button', { name: /By user/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Export to Word' }));
  await waitFor(() => expect(saveAs).toHaveBeenCalledWith('test-blob', 'User_orders_2026-10-02.docx'));
  const text = Paragraph.mock.calls.map(([options]) => options.text).join('\n');
  expect(text).toContain('User orders · 2026-10-02');
  expect(text).toContain('2 × Noodles');
  expect(text).toContain('1 × Tea');
  expect(text).toContain('1 × Rice');
});
