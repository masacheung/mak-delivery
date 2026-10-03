export function pickupDay(value) {
  const day = String(value || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : '';
}

export function todayInNewJersey(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function orderGroups(order) {
  let details = order?.order_details || {};
  if (typeof details === 'string') { try { details = JSON.parse(details); } catch { details = {}; } }
  return Object.entries(details || {}).filter(([, dishes]) => Array.isArray(dishes) && dishes.length);
}

export function pickupLabel(order, today = todayInNewJersey()) {
  const day = pickupDay(order.pick_up_date);
  return !day ? 'Pickup date unavailable' : day === today ? 'Pickup today' : day > today ? 'Upcoming pickup' : 'Past pickup date';
}

export function splitOrders(orders, today = todayInNewJersey()) {
  return {
    upcoming: orders.filter(order => pickupDay(order.pick_up_date) >= today).sort((a, b) => pickupDay(a.pick_up_date).localeCompare(pickupDay(b.pick_up_date)) || Number(b.id) - Number(a.id)),
    past: orders.filter(order => pickupDay(order.pick_up_date) < today).sort((a, b) => pickupDay(b.pick_up_date).localeCompare(pickupDay(a.pick_up_date)) || Number(b.id) - Number(a.id)),
  };
}
