import { cartPricing } from './cartPricing';

test('counts quantities and preserves fees for one, two and three restaurants', () => {
  const meal = { price: 10, quantity: 2 };
  expect(cartPricing({})).toMatchObject({ itemCount: 0, total: 0, deliveryFee: 0 });
  expect(cartPricing({ 1: [meal], 2: [] })).toMatchObject({ itemCount: 2, subtotal: 20, tax: 1.25, deliveryFee: 6, total: 27.25 });
  expect(cartPricing({ 1: [meal], 2: [meal] }).deliveryFee).toBe(8);
  expect(cartPricing({ 1: [meal], 2: [meal], 3: [meal] }).deliveryFee).toBe(10);
});

test('special-price dishes count as items but do not invent a price', () => {
  expect(cartPricing({ 1: [{ price: 'SP', quantity: 3 }, { price: 12, quantity: 1 }] })).toMatchObject({ itemCount: 4, subtotal: 12, specialPrice: true, total: 18.75 });
});
