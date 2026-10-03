import { groupOrdersByRestaurant, restaurantOrderText } from './features/adminOrdersLookup/orderGroups';

const orders = [
  { id: 10, username: 'alice', pick_up_location: 'Fort Lee', total: '42', notes: 'No peanuts', order_details: {
    1: [{ id: 'a', name: 'Noodles', quantity: 2, selectedOptions: { spice: ['Mild'], extras: ['Egg'] } }],
    2: [{ id: 'b', name: 'Tea', quantity: 1 }],
  } },
  { id: 11, username: 'bob', pick_up_location: 'Hoboken', order_details: { 1: [{ id: 'c', name: 'Rice', quantity: 3 }], 2: [] } },
];

test('splits multi-restaurant orders into restaurant groups with their users and pickup locations', () => {
  const groups = groupOrdersByRestaurant(orders);
  expect(groups).toHaveLength(2);
  expect(groups.find(group => group.id === '1').orders.map(order => order.username)).toEqual(['alice', 'bob']);
  expect(groups.find(group => group.id === '1').orders[1].pick_up_location).toBe('Hoboken');
});

test('selected restaurant and copied text contain only that restaurant dishes', () => {
  const groups = groupOrdersByRestaurant(orders, '1');
  expect(groups).toHaveLength(1);
  const text = restaurantOrderText(groups[0], '2026-10-02');
  expect(text).toContain('2 × Noodles (Mild, Egg)');
  expect(text).toContain('#10 · alice');
  expect(text).toContain('Pickup: Fort Lee');
  expect(text).toContain('Notes: No peanuts');
  expect(text).toContain('3 × Rice');
  expect(text).not.toContain('Tea');
  expect(text).not.toContain('Whole-order total');
});

test('handles empty and missing restaurant details without creating empty groups', () => {
  expect(groupOrdersByRestaurant([{ id: 1 }, { id: 2, order_details: { 1: [], 2: null } }])).toEqual([]);
  expect(groupOrdersByRestaurant(orders, '99')).toEqual([]);
});
