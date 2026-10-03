import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { apiFetch } from '../../utils/apiClient';
import { pickupLocationDetails } from '../../utils/pickupLocation';

const localTime = value => new Intl.DateTimeFormat('en-GB', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(value));
const today = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};

export default function AdminArrivalTimes() {
  const [date, setDate] = useState(today);
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState('');
  const [arrivalTime, setArrivalTime] = useState('17:15');
  const [leadMinutes, setLeadMinutes] = useState(15);
  const [message, setMessage] = useState('');
  const [data, setData] = useState({ schedules: [] });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => { setSelected(''); setLocations([]); setData({ schedules: [] }); }, [date]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (!date) { setLoading(false); return; }
    Promise.all([apiFetch(`/api/adminConfig/openEvents?date=${date}`).then(async response => response.ok ? response.json() : []),
      apiFetch(`/api/arrival-schedules?date=${date}`, { auth: 'admin' }).then(async response => { const result = await response.json(); return response.ok ? result : { schedules: [], setupError: result.error }; })])
      .then(([events, result]) => { if (!cancelled) { setLocations([...new Set(events.flatMap(event => event.pick_up_locations))]); setData(result); if (result.setupError) setStatus({ severity: 'error', text: result.setupError }); } })
      .catch(error => { if (!cancelled) setStatus({ severity: 'error', text: error.message || 'Unable to load arrival settings.' }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [date, version]);

  async function save() {
    setBusy(true); setStatus(null);
    try {
      const response = await apiFetch('/api/arrival-schedules', { method: 'POST', auth: 'admin', body: { date, location: selected, arrivalTime, leadMinutes: Number(leadMinutes), message } });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus({ severity: 'success', text: 'Arrival reminder saved. It will notify customers with an order at this pickup.' });
      setVersion(value => value + 1);
    } catch (error) { setStatus({ severity: 'error', text: error.message || 'Unable to save reminder.' }); }
    finally { setBusy(false); }
  }
  async function cancel(id) {
    setBusy(true);
    try {
      const response = await apiFetch(`/api/arrival-schedules/${id}`, { method: 'DELETE', auth: 'admin' });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setStatus({ severity: 'success', text: 'Reminder cancelled.' }); setVersion(value => value + 1);
    } catch (error) { setStatus({ severity: 'error', text: error.message || 'Unable to cancel reminder.' }); }
    finally { setBusy(false); }
  }
  return <Stack gap={2}>
    <Box><Typography variant="h6" fontWeight={800}>Arrival times · 預計到達時間</Typography><Typography variant="body2" color="text.secondary">Choose a delivery date and one of its pickup locations. All times are New Jersey time.</Typography></Box>
    {status && <Alert severity={status.severity}>{status.text}</Alert>}
    {!loading && data.workerActive === false && <Alert severity="warning">Automatic reminders are temporarily unavailable. Your saved arrival times are kept.</Alert>}
    {!loading && data.pushConfigured === false && <Alert severity="info">Phone notifications are not available yet.</Alert>}
    <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
      <TextField fullWidth type="date" label="Delivery date" value={date} onChange={event => { setDate(event.target.value); setStatus(null); }} InputLabelProps={{ shrink: true }} />
      <TextField fullWidth select label="Pickup location for this date" value={selected} disabled={loading || !locations.length} onChange={event => setSelected(event.target.value)} helperText={loading ? 'Loading locations…' : !locations.length ? 'No pickup locations are open on this date.' : 'Only locations in this day’s delivery events.'}>
        {locations.map(location => <MenuItem key={location} value={location} sx={{ whiteSpace: 'normal' }}>{pickupLocationDetails(location).name}</MenuItem>)}
      </TextField>
    </Stack>
    {selected && <Typography variant="body2" color="text.secondary">{selected}</Typography>}
    <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}><TextField fullWidth type="time" label="Estimated arrival time" value={arrivalTime} onChange={event => setArrivalTime(event.target.value)} InputLabelProps={{ shrink: true }} /><TextField fullWidth select label="Notify before arrival" value={leadMinutes} onChange={event => setLeadMinutes(event.target.value)}>{[0,5,10,15,20,30,45,60].map(minutes => <MenuItem key={minutes} value={minutes}>{minutes ? `${minutes} minutes before` : 'At arrival time'}</MenuItem>)}</TextField></Stack>
    <TextField multiline minRows={2} label="Extra message (optional)" value={message} onChange={event => setMessage(event.target.value)} inputProps={{ maxLength: 500 }} />
    <Button variant="contained" disabled={busy || loading || !selected || !arrivalTime || Boolean(data.setupError)} onClick={save} sx={{ minHeight: 48, alignSelf: { sm: 'flex-start' } }}>{busy ? 'Saving…' : 'Save arrival reminder'}</Button>
    <Typography fontWeight={700}>Reminders for this date</Typography>
    {!loading && !data.schedules.length && <Typography variant="body2" color="text.secondary">No arrival reminders yet.</Typography>}
    {data.schedules.map(job => <Box key={job.id} sx={{ p: 2, border: '1px solid #e5e5ef', borderRadius: 2 }}><Stack direction="row" gap={1} justifyContent="space-between"><Typography fontWeight={700}>{pickupLocationDetails(job.pick_up_location).name}</Typography><Chip size="small" label={job.status === 'sent' ? 'Notification queued' : job.status} /></Stack><Typography variant="body2" sx={{ mt: 1 }}>Arrival {localTime(job.arrival_at)} · Reminder {localTime(job.send_at)} · {job.lead_minutes} min before</Typography>{job.status === 'pending' && <Stack direction="row" gap={1} sx={{ mt: 1 }}><Button disabled={busy} onClick={() => { setSelected(job.pick_up_location); setArrivalTime(localTime(job.arrival_at)); setLeadMinutes(job.lead_minutes); setMessage(job.message || ''); }}>Edit ETA</Button><Button disabled={busy} onClick={() => cancel(job.id)}>Cancel reminder</Button></Stack>}</Box>)}
  </Stack>;
}
