import React, { useEffect } from 'react';
import { Alert, Box, Button, Card, Chip, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { RESTAURANT_NAME } from '../../constant/constant';
import { dishDescription } from '../adminOrdersLookup/orderGroups';
import { cartPricing, TAX_RATE } from './cartPricing';
import { pickupLocationDetails } from '../../utils/pickupLocation';
import { pickupDateLabel } from '../restaurants/AvailablePickupDates';

// Preserve the existing pricing rules.

export default function OrderSummary({ orderState, updateOrderState, onClose, onSubmit, updateTotal, submitting = false, submitError = '', editMode = false }) {
  const addedDishes = orderState?.addedDishes || {};
  const { entries, deliveryFee, subtotal, tax, total, specialPrice } = cartPricing(addedDishes);
  const pickup = pickupLocationDetails(orderState.pickupLocation);

  useEffect(() => {
    if (orderState.total !== total) updateTotal(total);
  }, [total, orderState.total, updateTotal]);

  function removeDish(restaurantId, dishId) {
    const next = { ...addedDishes, [restaurantId]: addedDishes[restaurantId].filter(dish => dish.id !== dishId) };
    if (!next[restaurantId].length) delete next[restaurantId];
    updateOrderState('addedDishes', next);
  }

  function changeQuantity(restaurantId, dishId, delta) {
    const next = addedDishes[restaurantId].map(dish => dish.id === dishId ? { ...dish, quantity: Math.max(1, Number(dish.quantity) + delta) } : dish);
    updateOrderState('addedDishes', { ...addedDishes, [restaurantId]: next });
  }

  return <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '90dvh', bgcolor: '#f7f7fb' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 2, bgcolor: 'white', borderBottom: '1px solid #e5e5ef', flexShrink: 0 }}>
      <Box><Typography variant="overline" color="text.secondary">STEP 3 · {editMode ? 'SAVE CHANGES' : 'CHECKOUT'}</Typography><Typography variant="h6" fontWeight={800}>{editMode ? 'Review your changes' : 'Review your order'}</Typography></Box>
      <IconButton aria-label="Close order summary" onClick={onClose} disabled={submitting}><CloseIcon /></IconButton>
    </Stack>
    <Box sx={{ overflowY: 'auto', minHeight: 0, p: { xs: 2, sm: 3 } }}>
      {!entries.length ? <Stack alignItems="center" gap={2} sx={{ py: 5 }}>
        <Typography variant="h6">Your cart is empty</Typography><Typography color="text.secondary">Choose a restaurant and add your favourite dishes.</Typography>
        <Button variant="contained" onClick={onClose}>Browse restaurants</Button>
      </Stack> : <Stack gap={2} sx={{ maxWidth: 760, mx: 'auto' }}>
        <Card variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#ededfc', borderColor: 'primary.light' }}>
          <Typography fontWeight={700}>Pickup details</Typography>
          <Typography fontWeight={800} color="primary.dark" sx={{ mt: 1 }}>{orderState.date ? pickupDateLabel(orderState.date) : 'Select a pickup date'}</Typography>
          <Typography fontWeight={700} sx={{ mt: 1 }}>{pickup.name || 'Select a pickup location'}</Typography>
          {pickup.address !== pickup.name && <Typography variant="body2" sx={{ mt: 0.5, overflowWrap: 'anywhere' }}>{pickup.address}</Typography>}
          <Button size="small" onClick={onClose} disabled={submitting} sx={{ mt: 1 }}>Change pickup</Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Ordering as {orderState.username}</Typography>
        </Card>
        {entries.map(([id, dishes]) => <Card key={id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Typography fontWeight={700} sx={{ mb: 1 }}>{RESTAURANT_NAME[id] || `Restaurant ${id}`}</Typography>
          {dishes.map(dish => <Stack key={dish.id} gap={0.5} sx={{ py: 1, borderTop: '1px solid #eeeef5' }}>
            <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ flex: 1, minWidth: 0 }}><Typography sx={{ overflowWrap: 'anywhere' }}>{dishDescription(dish)}</Typography>
              {dish.price === 'SP' ? <Chip size="small" label="Price confirmed by restaurant" /> : <Typography color="text.secondary" variant="body2">${(Number(dish.price) * dish.quantity).toFixed(2)}</Typography>}</Box>
            <IconButton aria-label={`Remove ${dish.name}`} disabled={submitting} onClick={() => removeDish(id, dish.id)} sx={{ width: 44, height: 44 }}><DeleteOutlineIcon /></IconButton>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between"><Typography variant="caption" color="text.secondary">Quantity</Typography><Stack direction="row" alignItems="center"><IconButton aria-label={`Decrease ${dish.name} in cart`} disabled={submitting || dish.quantity <= 1} onClick={() => changeQuantity(id, dish.id, -1)}><Remove fontSize="small" /></IconButton><Typography fontSize={14} fontWeight={700} sx={{ minWidth: 24, textAlign: 'center' }}>{dish.quantity}</Typography><IconButton aria-label={`Increase ${dish.name} in cart`} disabled={submitting || dish.quantity >= 10} onClick={() => changeQuantity(id, dish.id, 1)}><Add fontSize="small" /></IconButton></Stack></Stack>
          </Stack>)}
        </Card>)}
        <TextField label="Order notes (optional)" multiline minRows={2} value={orderState.notes || ''} disabled={submitting} onChange={e => updateOrderState('notes', e.target.value)} placeholder="Special requests for your order" />
        <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Stack gap={1}>{[['Subtotal', subtotal], [`Tax (${TAX_RATE * 100}%)`, tax], ['Delivery fee', deliveryFee]].map(([label, amount]) => <Stack key={label} direction="row" justifyContent="space-between"><Typography color="text.secondary">{label}</Typography><Typography>${amount.toFixed(2)}</Typography></Stack>)}
            <Divider /><Stack direction="row" justifyContent="space-between"><Typography fontWeight={800}>Estimated total</Typography><Typography fontWeight={800}>${total.toFixed(2)}</Typography></Stack>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>Final amount may vary at delivery.{specialPrice ? ' Special-price items are excluded until the restaurant confirms their price.' : ''}</Typography>
        </Card>
        {submitError && <Alert severity="error">{submitError}</Alert>}
      </Stack>}
    </Box>
    {entries.length > 0 && <Box sx={{ p: 2, pb: 'max(16px, env(safe-area-inset-bottom))', bgcolor: 'white', borderTop: '1px solid #e5e5ef', flexShrink: 0 }}>
      <Button fullWidth size="large" variant="contained" disabled={submitting || !orderState.date || !orderState.pickupLocation} onClick={onSubmit} sx={{ minHeight: 52 }}>{submitting ? (editMode ? 'Saving changes…' : 'Submitting order…') : `${editMode ? 'Save changes' : 'Submit order'} · $${total.toFixed(2)}`}</Button>
      {(!orderState.date || !orderState.pickupLocation) && <Typography variant="caption">Close this summary and choose a pickup date and location first.</Typography>}
    </Box>}
  </Box>;
}
