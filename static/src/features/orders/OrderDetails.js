import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import EditOutlined from '@mui/icons-material/EditOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import OpenInNew from '@mui/icons-material/OpenInNew';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import { RESTAURANT_NAME } from '../../constant/constant';
import { pickupLocationDetails } from '../../utils/pickupLocation';
import { pickupDateLabel } from '../restaurants/AvailablePickupDates';
import { orderGroups, pickupDay, pickupLabel, todayInNewJersey } from './orderPresentation';
import PaymentMethod from '../paymentMethod/paymentMethod';

export default function OrderDetails({ order, canEdit = false }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const pickup = pickupLocationDetails(order.pick_up_location);
  const day = pickupDay(order.pick_up_date);
  const groups = orderGroups(order);
  const paymentRecorded = Boolean(order.payment_status && order.payment_status !== 'Unpaid');
  const editAvailable = canEdit && Boolean(day) && day >= todayInNewJersey();
  return <Stack gap={2}>
    <Paper variant="outlined" sx={{ p: 2.5, borderColor: '#deddf5', bgcolor: '#f0efff', borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ mb: 2 }}><Typography component="h2" variant="h6" fontWeight={800}>Order #{order.id}</Typography><Chip size="small" label={pickupLabel(order)} sx={{ bgcolor: 'white' }} /></Stack>
      <Stack direction="row" gap={1.5} sx={{ mb: 2 }}><CalendarMonth color="primary" /><Box><Typography variant="caption" color="text.secondary">Pickup date</Typography><Typography fontWeight={700}>{day ? pickupDateLabel(day) : 'Not specified'}</Typography></Box></Stack>
      <Stack direction="row" gap={1.5}><LocationOnOutlined color="primary" /><Box sx={{ minWidth: 0 }}><Typography variant="caption" color="text.secondary">Pickup location</Typography><Typography fontWeight={700}>{pickup.name || 'Not specified'}</Typography><Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere', mt: 0.5 }}>{pickup.address}</Typography></Box></Stack>
      {pickup.address && <Button href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup.address)}`} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNew />} sx={{ mt: 1 }}>Open pickup map</Button>}
    </Paper>
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1}><Box><Typography color="text.secondary" variant="body2">Estimated total</Typography><Typography variant="h5" fontWeight={800}>${Number(order.total || 0).toFixed(2)}</Typography></Box><Chip size="small" label={paymentRecorded ? `Payment recorded · ${order.payment_status}` : 'Payment not recorded'} sx={{ alignSelf: 'flex-start', bgcolor: paymentRecorded ? '#eeedff' : '#fff3dd' }} /></Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Final amount may vary at pickup. Payment status is updated by the admin.</Typography>
      {!paymentRecorded && <Button variant="outlined" startIcon={<PaymentsOutlined />} onClick={() => setPaymentOpen(true)} sx={{ mt: 2 }} fullWidth>View payment instructions</Button>}
    </Paper>
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
      <Typography fontWeight={800} sx={{ mb: 2 }}>Your dishes</Typography>
      {!groups.length && <Alert severity="info">No dish details available for this order.</Alert>}
      {groups.map(([id, dishes], index) => <Box key={id} sx={{ mt: index ? 2 : 0 }}>
        <Typography fontWeight={700} color="primary.main" sx={{ mb: 1 }}>{dishes[0]?.restaurantName || RESTAURANT_NAME[id] || `Restaurant ${id}`}</Typography>
        {dishes.map((dish, i) => <Stack key={`${dish.id}-${i}`} direction="row" gap={1.5} sx={{ py: 1, borderTop: '1px solid #eeeef5' }}>
          <Box sx={{ minWidth: 30, pt: 0.2 }}><Typography fontSize={13} fontWeight={800} color="primary.main">{dish.quantity}×</Typography></Box>
          <Box sx={{ minWidth: 0, flex: 1 }}><Typography fontSize={14} fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>{dish.name}</Typography>{Object.values(dish.selectedOptions || {}).flat().filter(Boolean).length > 0 && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{Object.values(dish.selectedOptions).flat().filter(Boolean).join(', ')}</Typography>}</Box>
          <Typography variant="body2" sx={{ flexShrink: 0 }}>{dish.price === 'SP' ? 'Special price' : `$${(Number(dish.price || 0) * Number(dish.quantity || 0)).toFixed(2)}`}</Typography>
        </Stack>)}
      </Box>)}
      {order.notes && <><Divider sx={{ my: 2 }} /><Typography variant="body2" fontWeight={700}>Order notes</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{order.notes}</Typography></>}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Ordered by {order.username}</Typography>
    </Paper>
    {editAvailable && <Button component={RouterLink} to="/edit-order" state={{ orderData: { ...order, order_details: Object.fromEntries(groups) } }} variant="outlined" startIcon={<EditOutlined />} fullWidth>Edit this order</Button>}
    {canEdit && !editAvailable && <Typography variant="body2" color="text.secondary" textAlign="center">Order editing is unavailable for this pickup date.</Typography>}
    {paymentOpen && <PaymentMethod order={order} onClose={() => setPaymentOpen(false)} />}
  </Stack>;
}
