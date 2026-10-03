import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Typography } from '@mui/material';
import { apiFetch } from '../utils/apiClient';
import { pushSupported, syncPushSubscription, stopPushNotifications } from '../utils/pushNotifications';

export default function PushNotificationSettings() {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({ pickup: true, events: true });
  const [config, setConfig] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus(null); setConfig(null);
    Promise.all([apiFetch('/api/push/config').then(response => response.json()), apiFetch('/api/push/preferences', { auth: 'user' }).then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error); return result; })])
      .then(async ([settings, prefs]) => {
        if (cancelled) return;
        setConfig(settings); setPreferences(prefs);
        if (settings.enabled && pushSupported() && Notification.permission === 'granted') setEnabled(await syncPushSubscription(settings.publicKey));
      }).catch(error => { if (!cancelled) setStatus({ severity: 'error', text: error.message || 'Unable to load notification settings.' }); });
    return () => { cancelled = true; };
  }, [open]);
  async function enable() {
    setBusy(true); setStatus(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') throw new Error('Notifications are not allowed. You can change this in your device notification settings.');
      setEnabled(await syncPushSubscription(config.publicKey, true));
      setStatus({ severity: 'success', text: 'Phone notifications enabled on this device.' });
    } catch (error) { setStatus({ severity: 'error', text: error.message }); }
    finally { setBusy(false); }
  }
  async function save() {
    setBusy(true); setStatus(null);
    try {
      const response = await apiFetch('/api/push/preferences', { method: 'PUT', auth: 'user', body: preferences });
      if (!response.ok) { const result = await response.json(); throw new Error(result.error); }
      setStatus({ severity: 'success', text: 'Notification preferences saved.' });
    } catch (error) { setStatus({ severity: 'error', text: error.message || 'Unable to save preferences.' }); }
    finally { setBusy(false); }
  }
  return <><Button size="small" onClick={() => setOpen(true)} sx={{ textTransform: 'none' }}>Phone notifications · 手機通知</Button>
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs"><DialogTitle>Phone notifications</DialogTitle><DialogContent>
      <Stack gap={1.5} sx={{ pt: 1 }}>
        {status && <Alert severity={status.severity}>{status.text}</Alert>}
        <Box><Typography fontWeight={700}>Add Mak Delivery to your home screen</Typography><Typography variant="body2" color="text.secondary">iPhone: open in Safari → Share → Add to Home Screen. Open the home-screen app, sign in and enable notifications here. Android: browser menu → Install app / Add to Home Screen.</Typography></Box>
        {!pushSupported() && <Alert severity="info">Push is unavailable in this browser. On iPhone, open the installed home-screen app. You can still read notices using the bell.</Alert>}
        {config && !config.enabled && <Alert severity="info">Phone notifications are not available yet. You can save your preferences and read notices in the app.</Alert>}
        {enabled ? <Button disabled={busy} onClick={async () => { setBusy(true); try { await stopPushNotifications(); setEnabled(false); } catch { setStatus({ severity: 'error', text: 'Unable to disable notifications. Please retry.' }); } finally { setBusy(false); } }}>Disable on this device</Button> : <Button variant="contained" disabled={busy || !pushSupported() || !config?.enabled} onClick={enable}>Enable phone notifications</Button>}
        <FormControlLabel control={<Checkbox checked={preferences.pickup} onChange={event => setPreferences(previous => ({ ...previous, pickup: event.target.checked }))} />} label="Pickup reminders · 取餐提醒" />
        <FormControlLabel control={<Checkbox checked={preferences.events} onChange={event => setPreferences(previous => ({ ...previous, events: event.target.checked }))} />} label="New delivery events · 新開單消息" />
        <Typography variant="caption" color="text.secondary">Preferences apply to your account. Phone delivery also depends on notification permission and your device settings.</Typography>
      </Stack>
    </DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Close</Button><Button disabled={busy || !config} onClick={save}>Save preferences</Button></DialogActions></Dialog>
  </>;
}
