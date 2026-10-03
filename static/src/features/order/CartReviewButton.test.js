import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartReviewButton from './CartReviewButton';

test('live cart estimate updates after adding or removing dishes and opens checkout', () => {
  const onClick = jest.fn();
  const { rerender } = render(<CartReviewButton addedDishes={{ 1: [{ price: 10, quantity: 2 }] }} onClick={onClick} />);
  fireEvent.click(screen.getByRole('button', { name: /2 items · Est. \$27.25/ }));
  expect(onClick).toHaveBeenCalledTimes(1);
  rerender(<CartReviewButton addedDishes={{ 1: [{ price: 10, quantity: 3 }] }} onClick={onClick} />);
  expect(screen.getByRole('button', { name: /3 items · Est. \$37.88/ })).toBeInTheDocument();
  rerender(<CartReviewButton addedDishes={{}} onClick={onClick} />);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('special-price estimate makes the exclusion visible', () => {
  render(<CartReviewButton addedDishes={{ 1: [{ price: 'SP', quantity: 1 }] }} onClick={() => {}} />);
  expect(screen.getByText(/Special-price items priced separately/)).toBeInTheDocument();
});
