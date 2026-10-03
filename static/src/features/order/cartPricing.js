export const TAX_RATE = 0.0625;

export function cartPricing(addedDishes = {}) {
  const entries = Object.entries(addedDishes).filter(([, dishes]) => dishes.length);
  const dishes = entries.flatMap(([, items]) => items);
  const itemCount = dishes.reduce((sum, dish) => sum + Number(dish.quantity || 0), 0);
  const subtotal = dishes.reduce((sum, dish) => sum + (Number(dish.price) || 0) * Number(dish.quantity || 0), 0);
  const deliveryFee = entries.length === 1 ? 6 : entries.length === 2 ? 8 : entries.length >= 3 ? 10 : 0;
  const tax = subtotal * TAX_RATE;
  return { entries, itemCount, subtotal, deliveryFee, tax, total: subtotal + tax + deliveryFee, specialPrice: dishes.some(dish => dish.price === 'SP') };
}
