import { orderGroups, pickupDay, pickupLabel, splitOrders, todayInNewJersey } from './orderPresentation';
import { cartFromOrder } from './editCart';

test('pickup grouping uses New Jersey day around UTC midnight without claiming a past order was collected', () => {
  const today = todayInNewJersey(new Date('2026-10-04T01:00:00Z'));
  expect(today).toBe('2026-10-03');
  const orders = [{ id: 1, pick_up_date: '2026-10-02T00:00:00Z' }, { id: 2, pick_up_date: '2026-10-09' }, { id: 3, pick_up_date: '2026-10-03' }];
  expect(splitOrders(orders, today)).toEqual({ upcoming: [orders[2], orders[1]], past: [orders[0]] });
  expect(pickupLabel(orders[0], today)).toBe('Past pickup date');
  expect(pickupDay(orders[0].pick_up_date)).toBe('2026-10-02');
});

test('legacy saved cart retains prices, options and notes when matching dishes to the current menu', () => {
  const order = { order_details: JSON.stringify({ 1: [{ id: 'legacy1', name: 'Noodles', price: 12, quantity: 2 }, { id: 'legacy2', name: 'Noodles', price: 12, quantity: 1 }, { id: 'legacy3', name: 'Soup', price: 18, quantity: 1, selectedOptions: { spice: ['Mild'] } }] }) };
  const restaurants = [{ id: 1, dishes: [{ id: 10, name: 'Noodles', price: 15 }, { id: 11, name: 'Soup', options: { spice: { limit: 1 } } }] }];
  const result = cartFromOrder(order, restaurants);
  expect(result[1]).toHaveLength(2);
  expect(result[1][0]).toEqual({ id: 'legacy1', name: 'Noodles', price: 12, quantity: 3, sourceDishId: 10 });
  expect(result[1][1].selectedOptions).toEqual({ spice: ['Mild'] });
  expect(orderGroups({ order_details: 'invalid' })).toEqual([]);
});
