import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Paper, Skeleton, Stack, Tab, Tabs, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Close from '@mui/icons-material/Close';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import Refresh from '@mui/icons-material/Refresh';
import Search from '@mui/icons-material/Search';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import CustomerPage from '../../components/CustomerPage';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../utils/apiClient';
import { pickupLocationDetails } from '../../utils/pickupLocation';
import { pickupDateLabel } from '../restaurants/AvailablePickupDates';
import { orderGroups, pickupDay, pickupLabel, splitOrders } from './orderPresentation';
import OrderDetails from './OrderDetails';

export default function OrderLookup() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState(0);
  const [limit, setLimit] = useState(6);
  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState('');
  const [orderId, setOrderId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const initialOrderId = location.state?.orderId;
  useEffect(() => { if (user?.username) setUsername(user.username); }, [user?.username]);
  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!isAuthenticated) { setOrders([]); return; }
    setOrdersLoading(true); setOrdersError('');
    apiFetch('/api/orders/mine', { auth: 'user' }).then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to load your orders.');
      if (!cancelled) {
        const next = Array.isArray(result) ? result : [];
        setOrders(next);
        if (initialOrderId) setSelected(next.find(order => String(order.id) === String(initialOrderId)) || null);
      }
    }).catch(error => { if (!cancelled) setOrdersError(error.message || 'Unable to load your orders.'); })
      .finally(() => { if (!cancelled) setOrdersLoading(false); });
    return () => { cancelled = true; };
  }, [isAuthenticated, authLoading, version, initialOrderId]);

  async function lookup(event) {
    event.preventDefault();
    if (lookupLoading) return;
    setLookupError('');
    if (!username.trim() || !/^\d+$/.test(orderId.trim())) { setLookupError('Enter your username and a numeric order ID.'); return; }
    setLookupLoading(true);
    try {
      const response = await apiFetch(`/api/orders?username=${encodeURIComponent(username.trim())}&orderId=${encodeURIComponent(orderId.trim())}`, { auth: 'none' });
      const result = await response.json();
      if (!response.ok) throw new Error(response.status === 404 ? 'Order not found. Check your username and order ID.' : 'Unable to look up this order. Please try again.');
      setSelected(result);
    } catch (error) { setLookupError(error.message || 'Unable to look up this order.'); }
    finally { setLookupLoading(false); }
  }
  const groups = splitOrders(orders);
  const currentOrders = tab === 0 ? groups.upcoming : groups.past;
  const searchForm = <Box component="form" onSubmit={lookup}><Stack gap={2}>
    <Typography variant="body2" color="text.secondary">Use the order ID from your confirmation.</Typography>
    <TextField label="Username" value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" fullWidth required />
    <TextField label="Order ID" value={orderId} onChange={event => setOrderId(event.target.value)} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} fullWidth required />
    {lookupError && <Alert severity="error">{lookupError}</Alert>}
    <Button type="submit" variant="contained" disabled={lookupLoading} startIcon={<Search />}>{lookupLoading ? 'Finding your order…' : 'Find order'}</Button>
  </Stack></Box>;

  return <CustomerPage title="My orders" showOrders={false}>
    <Stack gap={3}>
      <Box><Typography component="h1" variant="h4" fontWeight={800} sx={{ fontSize: { xs: 28, sm: 34 } }}>Your next pickup,<br />all in one place.</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>View your dishes, pickup details and payment information.</Typography></Box>
      {authLoading && <Stack gap={2}><Skeleton variant="rounded" height={55} /><Skeleton variant="rounded" height={170} /></Stack>}
      {!authLoading && isAuthenticated && <>
        <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between"><Typography fontWeight={700}>Orders for {user?.username}</Typography><Button startIcon={<Refresh />} disabled={ordersLoading} onClick={() => setVersion(value => value + 1)}>Refresh</Button></Stack>
        <Tabs value={tab} onChange={(_, value) => { setTab(value); setLimit(6); }} variant="fullWidth" aria-label="Order history"><Tab label={`Upcoming (${groups.upcoming.length})`} /><Tab label={`Past dates (${groups.past.length})`} /></Tabs>
        {ordersLoading ? <Stack gap={2}><Skeleton variant="rounded" height={170} /><Skeleton variant="rounded" height={170} /></Stack> : ordersError ? <Alert severity="error" action={<Button onClick={() => setVersion(value => value + 1)}>Retry</Button>}>{ordersError}</Alert> : !currentOrders.length ? <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}><ReceiptLong sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} /><Typography fontWeight={700}>{tab === 0 ? 'No upcoming pickups yet' : 'No past orders yet'}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>{tab === 0 ? 'Choose a delivery date and find your next favourite meal.' : 'Orders appear here after their pickup date.'}</Typography><Button variant="contained" onClick={() => navigate('/restaurants')}>Browse restaurants</Button></Paper> : <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            {currentOrders.slice(0, limit).map(order => {
              const day = pickupDay(order.pick_up_date);
              const items = orderGroups(order).flatMap(([, dishes]) => dishes);
              const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
              const restaurantCount = orderGroups(order).length;
              return <Paper component="button" type="button" key={order.id} onClick={() => setSelected(order)} variant="outlined" aria-label={`View order ${order.id}`} sx={{ p: 2.5, textAlign: 'left', font: 'inherit', cursor: 'pointer', borderRadius: 3, bgcolor: 'white', '&:hover': { borderColor: 'primary.main' }, '&:focus-visible': { outline: '3px solid #5557d9', outlineOffset: 3 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}><Typography variant="caption" color="text.secondary">ORDER #{order.id}</Typography><Chip component="span" size="small" label={pickupLabel(order)} sx={{ bgcolor: '#eeedff' }} /></Stack>
                <Typography fontSize={20} fontWeight={800} sx={{ mt: 1.5 }}>{day ? pickupDateLabel(day) : 'Pickup date unavailable'}</Typography>
                <Stack direction="row" gap={0.75} alignItems="center" sx={{ mt: 1 }}><LocationOnOutlined fontSize="small" color="primary" /><Typography variant="body2" fontWeight={600}>{pickupLocationDetails(order.pick_up_location).name}</Typography></Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{itemCount} {itemCount === 1 ? 'item' : 'items'} · {restaurantCount} {restaurantCount === 1 ? 'restaurant' : 'restaurants'}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #eeeef5' }}><Box><Typography fontWeight={800}>${Number(order.total || 0).toFixed(2)}</Typography><Typography variant="caption" color="text.secondary">{order.payment_status && order.payment_status !== 'Unpaid' ? `Payment recorded · ${order.payment_status}` : 'Payment not recorded'}</Typography></Box><Stack direction="row" gap={0.5} alignItems="center" sx={{ color: 'primary.main' }}><Typography fontSize={13} fontWeight={700}>View details</Typography><ArrowForward fontSize="small" /></Stack></Stack>
              </Paper>;
            })}
          </Box>
          {currentOrders.length > limit && <Button variant="outlined" onClick={() => setLimit(value => value + 6)}>Show more orders</Button>}
        </>}
        <Accordion expanded={searchOpen} onChange={(_, expanded) => setSearchOpen(expanded)} elevation={0} sx={{ border: '1px solid #e5e5ef', borderRadius: '12px !important', '&:before': { display: 'none' } }}><AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight={600}>Find an order by ID</Typography></AccordionSummary><AccordionDetails>{searchForm}</AccordionDetails></Accordion>
      </>}
      {!authLoading && !isAuthenticated && <>
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#eeedff' }}><Typography fontWeight={800}>All your orders, without searching.</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2 }}>Sign in to view your upcoming pickups and order history.</Typography><Button variant="contained" onClick={() => navigate('/auth?redirect=/lookup-order')}>Log in to see my orders</Button></Paper>
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}><Typography fontWeight={800} sx={{ mb: 2 }}>Find a single order</Typography>{searchForm}</Paper>
      </>}
    </Stack>
    <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullScreen={mobile} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: '#f7f7fb' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'white', borderBottom: '1px solid #e5e5ef' }}><Typography component="span" fontWeight={800}>Order details</Typography><IconButton aria-label="Close order details" onClick={() => setSelected(null)}><Close /></IconButton></DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, pt: '24px !important' }}>{selected ? <OrderDetails key={selected.id} order={selected} canEdit={isAuthenticated && user?.username === selected.username} /> : <CircularProgress />}</DialogContent>
    </Dialog>
  </CustomerPage>;
}
