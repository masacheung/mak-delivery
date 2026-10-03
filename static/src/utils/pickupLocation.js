const AREAS = ['New Providence', 'Jersey City', 'Fort Lee', 'Hackensack', 'Tenafly', 'Weehawken', 'Hoboken', 'Ridgewood', 'Secaucus', 'Harrison', 'Millburn', 'Livingston'];

// Display labels only; keep the original address as the order/API value.
export function pickupLocationDetails(address = '') {
  const area = AREAS.find(name => address.toLowerCase().includes(name.toLowerCase()));
  const firstPart = address.split(',')[0].trim();
  const place = area && firstPart.toLowerCase().startsWith(area.toLowerCase())
    ? firstPart.slice(area.length).replace(/^\s*[-–·]?\s*/, '') : firstPart;
  return { name: area ? `${area}${place ? ` · ${place}` : ''}` : firstPart, address };
}
