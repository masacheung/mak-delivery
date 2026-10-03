import React from 'react';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAdminConfigEvents } from '../../hooks/useAdminConfigEvents';

export function availablePickupDates(events) {
  return [...new Set(events.map(event => String(event.pick_up_date || '').slice(0, 10))
    .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date)))].sort();
}

export function pickupDateLabel(date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${date}T12:00:00`));
}

export default function AvailablePickupDates({ value, onChange }) {
  const { events, isLoading, error, refetch } = useAdminConfigEvents();
  const dates = availablePickupDates(events);

  return <Box sx={{ mb: 2 }}>
    <Typography fontWeight={700} sx={{ mb: 1 }}>Available pickup dates</Typography>
    {isLoading && <Stack direction="row" gap={1} alignItems="center"><CircularProgress size={18} /><Typography variant="body2" color="text.secondary">Loading available dates…</Typography></Stack>}
    {!isLoading && error && <Alert severity="warning" action={<Button onClick={refetch}>Retry</Button>}>Unable to load pickup dates. Please try again.</Alert>}
    {!isLoading && !error && !dates.length && <Alert severity="info" action={<Button onClick={refetch}>Refresh</Button>}>No pickup dates are open yet. Please check back soon.</Alert>}
    {!error && dates.length > 0 && <Box role="group" aria-label="Available pickup dates" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {dates.map(date => <Button key={date} variant={value === date ? 'contained' : 'outlined'} aria-pressed={value === date} onClick={() => { if (value !== date) onChange(date); }} sx={{ minHeight: 48, flex: { xs: '1 1 140px', sm: '0 1 auto' } }}>{pickupDateLabel(date)}</Button>)}
    </Box>}
  </Box>;
}
