import React, { useRef, useState } from 'react';
import { Alert, Box, Button, Card, Chip, CircularProgress, MenuItem, Stack, ToggleButton, ToggleButtonGroup, TextField, Typography } from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import FileDownload from '@mui/icons-material/FileDownload';
import { saveAs } from 'file-saver';
import { PICK_UP_LOCATION, RESTAURANT_NAME } from '../../constant/constant';
import { apiFetch } from '../../utils/apiClient';
import { dishDescription, groupOrdersByRestaurant, groupOrdersByUser, restaurantOrderText, userOrderText } from './orderGroups';

const paymentStatuses = ['Unpaid', 'Zelle', 'Venmo', 'Cash'];

export default function AdminOrdersLookup() {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [payment, setPayment] = useState('All');
  const [groupByRestaurant, setGroupByRestaurant] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchedDate, setSearchedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState({});
  const requestId = useRef(0);
  const filtered = orders.filter(order => payment === 'All' || (order.payment_status || 'Unpaid') === payment);
  const groups = groupOrdersByRestaurant(filtered, groupByRestaurant ? restaurant : '');
  const visibleOrders = groupByRestaurant ? filtered.filter(order => groups.some(group => group.orders.some(row => row.id === order.id))) : filtered;
  const userGroups = groupOrdersByUser(visibleOrders);
  const total = visibleOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  async function search(event) {
    event.preventDefault();
    if (!date) return;
    const currentRequest = ++requestId.current;
    setLoading(true);
    setMessage(null);
    try {
      const params = new URLSearchParams({ pick_up_date: date, pick_up_location: location });
      const response = await apiFetch(`/api/orders/search?${params}`, { auth: 'admin' });
      if (!response.ok) throw new Error('Unable to load orders. Please try again.');
      const data = await response.json();
      if (requestId.current !== currentRequest) return;
      setOrders(data);
      setSearchedDate(date);
      setSearched(true);
    } catch (error) {
      if (requestId.current !== currentRequest) return;
      setOrders([]);
      setSearched(false);
      setMessage({ severity: 'error', text: error.message });
    } finally {
      if (requestId.current === currentRequest) setLoading(false);
    }
  }

  async function updatePayment(id, status) {
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      const response = await apiFetch(`/api/orders/payment/${id}`, { method: 'PUT', auth: 'admin', body: { payment_status: status } });
      if (!response.ok) throw new Error('Payment update failed. Please try again.');
      setOrders(prev => prev.map(order => order.id === id ? { ...order, payment_status: status } : order));
    } catch (error) {
      setMessage({ severity: 'error', text: error.message });
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  }

  async function copyGroup(group, text = restaurantOrderText(group, searchedDate)) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage({ severity: 'success', text: `Copied ${group.name} orders.` });
    } catch {
      setMessage({ severity: 'error', text: 'Clipboard unavailable. Use Download text to save the restaurant orders.' });
    }
  }

  async function exportWord() {
    try {
      const { Document, Packer, Paragraph, HeadingLevel } = await import('docx');
      const title = groupByRestaurant ? 'Restaurant orders' : 'User orders';
      const children = [new Paragraph({ text: `${title} · ${searchedDate}`, heading: HeadingLevel.HEADING_1 })];
      const sections = groupByRestaurant ? groups.map(group => restaurantOrderText(group, searchedDate)) : userGroups.map(group => userOrderText(group, searchedDate));
      sections.forEach(section => section.split('\n').forEach((line, index) => {
        children.push(new Paragraph({ text: line, ...(index === 0 ? { heading: HeadingLevel.HEADING_2 } : {}) }));
      }));
      saveAs(await Packer.toBlob(new Document({ sections: [{ children }] })), `${groupByRestaurant ? 'Restaurant' : 'User'}_orders_${searchedDate}.docx`);
    } catch {
      setMessage({ severity: 'error', text: 'Export failed. Please try again.' });
    }
  }

  function renderOrder(order, restaurantEntries) {
    return <Box key={order.id} sx={{ p: 2, borderTop: '1px solid #e5e5ef' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="space-between">
        <Box><Typography fontWeight={700}>#{order.id} · {order.username}</Typography>
          <Typography sx={{ mt: .5 }}><strong>Pickup:</strong> {order.pick_up_location || 'Not specified'}</Typography>
          <Typography variant="body2" color="text.secondary">Whole-order total: ${Number(order.total || 0).toFixed(2)}</Typography></Box>
        <TextField select label="Payment status" size="small" value={order.payment_status || 'Unpaid'} disabled={Boolean(saving[order.id])} onChange={e => updatePayment(order.id, e.target.value)} sx={{ minWidth: 150 }}>
          {paymentStatuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
        </TextField>
      </Stack>
      {restaurantEntries.map(([id, dishes]) => Array.isArray(dishes) && dishes.length > 0 && <Box key={id}>
        {!groupByRestaurant && <Typography fontWeight={700} color="primary" sx={{ mt: 2 }}>{RESTAURANT_NAME[id] || dishes[0]?.restaurantName || `Restaurant ${id}`}</Typography>}
        <Box component="ul" sx={{ pl: 2.5, my: 1.5 }}>{dishes.map((dish, index) => <Typography component="li" key={`${dish.id}-${index}`} sx={{ mb: .5 }}>{dishDescription(dish)}</Typography>)}</Box>
      </Box>)}
      {order.notes && <Typography variant="body2"><strong>Order notes:</strong> {order.notes}</Typography>}
    </Box>;
  }

  return <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', py: 3, px: { xs: 1, sm: 3 } }}>
    <Typography variant="h5" fontWeight={800}>Collect orders</Typography>
    <Typography color="text.secondary" sx={{ mt: 1, mb: 1 }}>{groupByRestaurant ? 'Orders organised by restaurant, ready to copy and send.' : 'All orders grouped by user, with every restaurant in each order.'}</Typography>
    <ToggleButtonGroup exclusive color="primary" value={groupByRestaurant ? 'restaurant' : 'user'} onChange={(_event, mode) => { if (!mode) return; setGroupByRestaurant(mode === 'restaurant'); setMessage(null); }} aria-label="Order view" sx={{ mb: 2, width: { xs: '100%', sm: 'auto' }, '& .MuiToggleButton-root': { flex: { xs: 1, sm: 'initial' }, minWidth: 0, minHeight: 48, px: { xs: 1, sm: 3 } } }}>
      <ToggleButton value="restaurant">By restaurant · 按餐廳</ToggleButton>
      <ToggleButton value="user">By user · 按用戶</ToggleButton>
    </ToggleButtonGroup>
    <Box component="form" onSubmit={search} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
      <TextField required type="date" label="Pickup date" InputLabelProps={{ shrink: true }} value={date} onChange={e => setDate(e.target.value)} />
      <TextField select label="Pickup location" value={location} onChange={e => setLocation(e.target.value)}>
        <MenuItem value="">All locations</MenuItem>
        {PICK_UP_LOCATION.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
      </TextField>
      <TextField select label="Restaurant" value={groupByRestaurant ? restaurant : ''} disabled={!groupByRestaurant} SelectProps={{ displayEmpty: true }} InputLabelProps={{ shrink: true }} onChange={e => setRestaurant(e.target.value)} helperText={!groupByRestaurant ? 'User view includes all restaurants.' : ''}>
        <MenuItem value="">All restaurants</MenuItem>
        {Object.entries(RESTAURANT_NAME).map(([id, name]) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
      </TextField>
      <TextField select label="Payment status" value={payment} onChange={e => setPayment(e.target.value)}>
        {['All', ...paymentStatuses].map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
      </TextField>
      <Button type="submit" variant="contained" disabled={loading || !date} sx={{ minHeight: 48 }}>{loading ? <CircularProgress size={24} /> : 'Search orders'}</Button>
    </Box>
    {message && <Alert severity={message.severity} onClose={() => setMessage(null)} sx={{ mt: 2 }}>{message.text}</Alert>}
    {searched && !loading && <>
      <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ my: 3 }}>
        <Chip label={searchedDate} /><Chip label={`${visibleOrders.length} orders`} /><Chip label={groupByRestaurant ? `${groups.length} restaurants` : `${userGroups.length} users`} />
        <Chip label={`Whole-order totals: $${total.toFixed(2)}`} />
        <Button startIcon={<FileDownload />} disabled={!visibleOrders.length} onClick={exportWord}>Export to Word</Button>
      </Stack>
      {!visibleOrders.length && <Alert severity="info">No orders match these filters.</Alert>}
      <Stack gap={3}>{groupByRestaurant ? groups.map(group => <Card key={group.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f0f0ff', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flexGrow: 1 }}><Typography variant="h6" fontWeight={700}>{group.name}</Typography>
            <Typography variant="body2">{group.orders.length} orders · {group.orders.reduce((sum, order) => sum + order.dishes.reduce((qty, dish) => qty + Number(dish.quantity || 0), 0), 0)} items</Typography></Box>
          <Button startIcon={<ContentCopy />} variant="contained" onClick={() => copyGroup(group)}>Copy restaurant orders</Button>
          <Button onClick={() => saveAs(new Blob([restaurantOrderText(group, searchedDate)], { type: 'text/plain;charset=utf-8' }), `Restaurant_${group.id}_${searchedDate}.txt`)}>Download text</Button>
        </Box>
        {group.orders.map(order => renderOrder(order, [[group.id, order.dishes]]))}
      </Card>) : userGroups.map(group => <Card key={group.name} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f0f0ff', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flexGrow: 1 }}><Typography variant="h6" fontWeight={700}>{group.name}</Typography><Typography variant="body2">{group.orders.length} orders</Typography></Box>
          <Button startIcon={<ContentCopy />} onClick={() => copyGroup(group, userOrderText(group, searchedDate))}>Copy user orders</Button>
        </Box>
        {group.orders.map(order => renderOrder(order, Object.entries(order.order_details || {})))}
      </Card>)}</Stack>
    </>}
  </Box>;
}
