import React, { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import DishForm from './dishForm';
import { changeSimpleDishQuantity, configuredDishPrice } from './dishCart';

const restaurant = { id: 1, name: 'Test menu', dishes: [
  { id: 1, name: 'Noodles', price: 10 },
  { id: 2, name: 'Custom meal', price: 10, options: {
    spice: { name: 'Spice', choices: ['Mild', 'Hot'], limit: 1 },
    sides: { name: 'Sides', choices: ['Rice', 'Noodles'], limit: 2, price: 3 },
    extras: { name: 'Extras', choices: ['Egg $2.00', 'Beef $5.00'], limit: 1, adjustable: true },
  } },
] };

function Harness({ onAddDish = jest.fn() }) {
  const [cart, setCart] = useState({});
  return <><DishForm restaurant={restaurant} cartDishes={cart[1] || []} onClose={() => {}} onAddDish={onAddDish} onSimpleQuantityChange={(id, dish, delta) => setCart(previous => changeSimpleDishQuantity(previous, id, dish, delta, () => 'unique-id'))} /><output data-testid="cart">{JSON.stringify(cart)}</output></>;
}

test('simple dishes add directly, merge quantities and remove at zero', () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'Increase quantity for Noodles' }));
  fireEvent.click(screen.getByRole('button', { name: 'Increase quantity for Noodles' }));
  expect(JSON.parse(screen.getByTestId('cart').textContent)[1]).toEqual([{ id: 'unique-id', sourceDishId: 1, name: 'Noodles', price: 10, quantity: 2, selectedOptions: {} }]);
  fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity for Noodles' }));
  fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity for Noodles' }));
  expect(JSON.parse(screen.getByTestId('cart').textContent)).toEqual({});
  expect(screen.getByRole('button', { name: 'Decrease quantity for Noodles' })).toBeDisabled();
});

test('options require selections and preserve add-on pricing for each quantity', () => {
  const onAddDish = jest.fn();
  render(<Harness onAddDish={onAddDish} />);
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Choose options for Custom meal' }));
  expect(screen.getByRole('button', { name: 'Add 1 to cart · $10.00' })).toBeDisabled();
  fireEvent.click(screen.getByRole('radio', { name: 'Mild' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'Rice' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Egg $2.00' }));
  // Background controls are aria-hidden while the options sheet is open.
  fireEvent.click(screen.getByRole('button', { name: 'Increase quantity for Custom meal' }));
  fireEvent.click(screen.getByRole('button', { name: 'Add 2 to cart · $30.00' }));
  expect(onAddDish).toHaveBeenCalledWith(1, [expect.objectContaining({ id: 2, price: 15, quantity: 2, selectedOptions: { spice: ['Mild'], sides: ['Rice'], extras: ['Egg $2.00'] } })]);
});

test('cancelling options discards drafts and never adds anything', () => {
  const onAddDish = jest.fn();
  render(<Harness onAddDish={onAddDish} />);
  fireEvent.click(screen.getByRole('button', { name: 'Choose options for Custom meal' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Hot' }));
  fireEvent.click(screen.getByRole('button', { name: 'Close dish options' }));
  expect(onAddDish).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Choose options for Custom meal' }));
  expect(screen.getByRole('radio', { name: 'Hot' })).not.toBeChecked();
});

test('search keeps matching menu rows', () => {
  render(<Harness />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Search dishes' }), { target: { value: 'custom' } });
  const menu = screen.getByRole('list', { name: 'Menu dishes' });
  expect(within(menu).getAllByRole('listitem')).toHaveLength(1);
  expect(within(menu).getByRole('heading', { name: 'Custom meal' })).toBeInTheDocument();
});

test('special-price items retain their restaurant-confirmed price and simple items cap at ten', () => {
  expect(configuredDishPrice({ price: 'SP', options: restaurant.dishes[1].options }, { extras: ['Egg $2.00'] })).toBe('SP');
  let cart = {};
  for (let i = 0; i < 12; i++) cart = changeSimpleDishQuantity(cart, 1, restaurant.dishes[0], 1, () => 'id');
  expect(cart[1][0].quantity).toBe(10);
  expect(changeSimpleDishQuantity(cart, 2, { id: 3, name: 'Other', price: 5 }, 1, () => 'other')[1]).toEqual(cart[1]);
});
