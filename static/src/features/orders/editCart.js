import { orderGroups } from './orderPresentation';

// Older orders predate sourceDishId; match menu names without repricing saved dishes.
export function cartFromOrder(order, restaurants) {
  return Object.fromEntries(orderGroups(order).map(([id, dishes]) => {
    const menu = restaurants.find(restaurant => String(restaurant.id) === id);
    const items = [];
    dishes.forEach(dish => {
      const source = menu?.dishes.find(item => item && (String(item.id) === String(dish.sourceDishId) || item.name === dish.name));
      const next = { ...dish, sourceDishId: dish.sourceDishId ?? source?.id };
      const plain = source && !Object.keys(source.options || {}).length && !Object.values(dish.selectedOptions || {}).flat().filter(Boolean).length;
      const existing = plain && items.find(item => String(item.sourceDishId) === String(next.sourceDishId) && item.price === next.price && !Object.values(item.selectedOptions || {}).flat().filter(Boolean).length);
      if (existing) existing.quantity = Number(existing.quantity || 0) + Number(next.quantity || 0);
      else items.push(next);
    });
    return [id, items];
  }));
}
