const ZONE = 'America/New_York';
function localParts(date) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date).map(part => [part.type, part.value]));
}
function arrivalSchedule(date, time, leadMinutes, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !/^\d{2}:\d{2}$/.test(time || '')) throw new Error('Choose a valid date and arrival time.');
  const lead = Number(leadMinutes);
  if (!Number.isInteger(lead) || lead < 0 || lead > 120) throw new Error('Reminder must be 0–120 whole minutes before arrival.');
  const target = Date.parse(`${date}T${time}:00Z`);
  if (!Number.isFinite(target)) throw new Error('Invalid arrival time.');
  let candidate = target;
  for (let i = 0; i < 3; i++) {
    const p = localParts(new Date(candidate));
    candidate += target - Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00Z`);
  }
  const matches = ms => {
    const p = localParts(new Date(ms));
    return `${p.year}-${p.month}-${p.day}` === date && `${p.hour}:${p.minute}` === time;
  };
  if (!matches(candidate) || matches(candidate - 3600000) || matches(candidate + 3600000)) throw new Error('This time is unavailable or ambiguous due to daylight saving. Choose another time.');
  if (candidate <= now.getTime()) throw new Error('Arrival time must be in the future.');
  return { arrivalAt: new Date(candidate).toISOString(), sendAt: new Date(Math.max(now.getTime(), candidate - lead * 60000)).toISOString(), leadMinutes: lead };
}
module.exports = { arrivalSchedule };
