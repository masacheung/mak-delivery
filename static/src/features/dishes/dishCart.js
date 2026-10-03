export function configuredDishPrice(dish, selectedOptions) {
  let price = dish.price === 'SP' ? 0 : Number(dish.price) || 0;
  for (const [key, selected] of Object.entries(selectedOptions)) {
    const option = dish.options?.[key];
    if (!option) continue;
    price += option.adjustable
      ? selected.reduce((sum, choice) => sum + Number(choice.match(/\$(\d+(?:\.\d+)?)/)?.[1] || 0), 0)
      : (Number(option.price) || 0) * selected.length;
  }
  return dish.price === 'SP' ? 'SP' : price;
}

export function changeSimpleDishQuantity(addedDishes, restaurantId, dish, delta, createId) {
  const items = addedDishes[restaurantId] || [];
  const existing = items.find(item => String(item.sourceDishId) === String(dish.id));
  const requested = Number(existing?.quantity || 0) + delta;
  const quantity = Math.max(0, delta > 0 ? Math.min(10, requested) : requested);
  let next = items.filter(item => item !== existing);
  if (quantity) next = [...next, existing ? { ...existing, quantity } : {
    id: createId(), sourceDishId: dish.id, name: dish.name, price: dish.price,
    quantity, selectedOptions: {},
  }];
  const result = { ...addedDishes, [restaurantId]: next };
  if (!next.length) delete result[restaurantId];
  return result;
}
