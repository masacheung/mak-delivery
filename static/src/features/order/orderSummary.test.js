import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OrderSummary from './orderSummary';

const orderState = { username: 'alice', date: '2026-10-02', pickupLocation: 'Test pickup', total: 0, addedDishes: {
  1: [{ id: 'a', name: 'Noodles', price: 10, quantity: 2, selectedOptions: { spice: ['Mild'] } }],
  2: [{ id: 'b', name: 'Special meal', price: 'SP', quantity: 1 }],
} };

function renderSummary(extra = {}) {
  const props = { orderState, updateOrderState: jest.fn(), updateTotal: jest.fn(), onClose: jest.fn(), onSubmit: jest.fn(), ...extra };
  render(<OrderSummary {...props} />);
  return props;
}

test('checkout shows pickup, choices, preserved fee and tax rules, and special-price notice', () => {
  const props = renderSummary();
  expect(screen.getByText('Test pickup')).toBeInTheDocument();
  expect(screen.getByText('2 × Noodles (Mild)')).toBeInTheDocument();
  expect(screen.getByText('Tax (6.25%)')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Submit order · $29.25' })).toBeEnabled();
  expect(props.updateTotal).toHaveBeenCalledWith(29.25);
  expect(screen.getByText(/Special-price items are excluded/)).toBeInTheDocument();
});

test('removing an item preserves dishes from other restaurants', () => {
  const props = renderSummary();
  fireEvent.click(screen.getByRole('button', { name: 'Remove Noodles' }));
  expect(props.updateOrderState).toHaveBeenCalledWith('addedDishes', { 2: orderState.addedDishes[2] });
});

test('submission is disabled while submitting and displays a failed request', () => {
  renderSummary({ submitting: true, submitError: 'Unable to submit your order. Please try again.' });
  expect(screen.getByRole('button', { name: 'Submitting order…' })).toBeDisabled();
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to submit');
});

test('checkout prevents orders without a pickup location', () => {
  renderSummary({ orderState: { ...orderState, pickupLocation: '' } });
  expect(screen.getByRole('button', { name: /Submit order/ })).toBeDisabled();
});

test('checkout emphasises readable date, area, full address and allows changing pickup', () => {
  const props = renderSummary({ orderState: { ...orderState, pickupLocation: '598 Central Ave, New Providence, NJ 07974' } });
  expect(screen.getByText('Fri, Oct 2, 2026')).toBeInTheDocument();
  expect(screen.getByText('New Providence · 598 Central Ave')).toBeInTheDocument();
  expect(screen.getByText('598 Central Ave, New Providence, NJ 07974')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Change pickup' }));
  expect(props.onClose).toHaveBeenCalledTimes(1);
});
