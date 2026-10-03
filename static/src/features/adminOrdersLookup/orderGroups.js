import { RESTAURANT_NAME } from '../../constant/constant';

export function groupOrdersByRestaurant(orders, restaurantId = '') {
  const groups = {};
  orders.forEach(order => {
    Object.entries(order.order_details || {}).forEach(([id, dishes]) => {
      if ((restaurantId && String(restaurantId) !== id) || !Array.isArray(dishes) || !dishes.length) return;
      if (!groups[id]) groups[id] = { id, name: RESTAURANT_NAME[id] || dishes[0]?.restaurantName || `Restaurant ${id}`, orders: [] };
      groups[id].orders.push({ ...order, dishes });
    });
  });
  return Object.values(groups);
}

export function dishDescription(dish) {
  const options = Object.values(dish.selectedOptions || {}).flat().filter(Boolean).join(', ');
  return `${dish.quantity} × ${dish.name}${options ? ` (${options})` : ''}`;
}

export function restaurantOrderText(group, date) {
  return [group.name, `Pickup date: ${date || '—'}`, '', ...group.orders.flatMap(order => [
    `#${order.id} · ${order.username || 'Unknown user'}`,
    `Pickup: ${order.pick_up_location || 'Not specified'}`,
    ...order.dishes.map(dishDescription),
    ...(order.notes ? [`Notes: ${order.notes}`] : []), '',
  ])].join('\n');
}

export function groupOrdersByUser(orders) {
  const groups = new Map();
  orders.forEach(order => {
    const name = order.username || 'Unknown user';
    if (!groups.has(name)) groups.set(name, { name, orders: [] });
    groups.get(name).orders.push(order);
  });
  return Array.from(groups.values());
}

export function userOrderText(group, date) {
  return [group.name, `Pickup date: ${date || '—'}`, '', ...group.orders.flatMap(order => [
    `Order #${order.id}`,
    `Pickup: ${order.pick_up_location || 'Not specified'}`,
    `Whole-order total: $${Number(order.total || 0).toFixed(2)}`,
    ...Object.entries(order.order_details || {}).flatMap(([id, dishes]) => Array.isArray(dishes) && dishes.length
      ? [RESTAURANT_NAME[id] || dishes[0]?.restaurantName || `Restaurant ${id}`, ...dishes.map(dishDescription)] : []),
    ...(order.notes ? [`Notes: ${order.notes}`] : []), '',
  ])].join('\n');
}
