import { pickupLocationDetails } from './pickupLocation';

test('distinguishes two Millburn pickup spots and preserves exact order addresses', () => {
  const library = 'Millburn Free Public Library, 200 Glen Ave, Millburn, NJ 07041';
  const main = '160 Main St, Millburn, NJ 07041';
  expect(pickupLocationDetails(library)).toEqual({ name: 'Millburn · Free Public Library', address: library });
  expect(pickupLocationDetails(main)).toEqual({ name: 'Millburn · 160 Main St', address: main });
});

test('supports street addresses and unfamiliar new locations without fabricating names', () => {
  expect(pickupLocationDetails('598 Central Ave, New Providence, NJ 07974').name).toBe('New Providence · 598 Central Ave');
  expect(pickupLocationDetails('New pickup, Another town').name).toBe('New pickup');
});
