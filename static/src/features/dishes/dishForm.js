import React, { useState } from 'react';
import { Alert, Box, Button, Checkbox, Drawer, FormControlLabel, IconButton, Radio, RadioGroup, Snackbar, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { configuredDishPrice } from './dishCart';

function QuantityControl({ name, quantity, onChange, minimum = 0 }) {
  return <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
    <IconButton aria-label={`Decrease quantity for ${name}`} disabled={quantity <= minimum} onClick={() => onChange(-1)} sx={{ width: 44, height: 44 }}><RemoveIcon fontSize="small" /></IconButton>
    <Typography component="span" aria-label={`Quantity for ${name}`} sx={{ width: 22, textAlign: 'center', fontWeight: 700 }}>{quantity}</Typography>
    <IconButton aria-label={`Increase quantity for ${name}`} disabled={quantity >= 10} onClick={() => onChange(1)} sx={{ width: 44, height: 44, color: 'primary.main' }}><AddIcon fontSize="small" /></IconButton>
  </Stack>;
}

const priceLabel = price => price === 'SP' ? 'Price confirmed by restaurant' : `$${Number(price).toFixed(2)}`;

export default function DishForm({ restaurant, cartDishes = [], onSimpleQuantityChange, onAddDish, onClose, cartReview }) {
  const [search, setSearch] = useState('');
  const [activeDish, setActiveDish] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState('');
  const dishes = restaurant.dishes.filter(dish => dish && dish.name.toLowerCase().includes(search.toLowerCase()));
  const requiredMissing = activeDish && Object.entries(activeDish.options || {}).some(([key, option]) => option.limit === 1 && selectedOptions[key]?.length !== 1);
  const configuredPrice = activeDish ? configuredDishPrice(activeDish, selectedOptions) : 0;

  function chooseDish(dish) {
    setSelectedOptions({}); setQuantity(1); setActiveDish(dish);
  }

  function toggleOption(key, choice, limit) {
    setSelectedOptions(previous => {
      const choices = previous[key] || [];
      const next = limit === 1 ? [choice] : choices.includes(choice) ? choices.filter(value => value !== choice) : choices.length < (limit || Infinity) ? [...choices, choice] : choices;
      return { ...previous, [key]: next };
    });
  }

  function addConfiguredDish() {
    if (!activeDish || requiredMissing) return;
    onAddDish(restaurant.id, [{ ...activeDish, quantity, price: configuredPrice, selectedOptions }]);
    setAddedMessage(`${quantity} × ${activeDish.name} added to your cart`);
    setActiveDish(null);
  }

  return <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: '#f7f7fb', overflow: 'hidden' }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 0.75, bgcolor: 'white', borderBottom: '1px solid #e5e5ef', flexShrink: 0 }}>
      <Typography component="h2" fontWeight={800} color="primary.main" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>{restaurant.name}</Typography>
      <IconButton aria-label="Back to restaurants" onClick={onClose} sx={{ width: 44, height: 44 }}><CloseIcon /></IconButton>
    </Stack>
    <Box sx={{ p: 1.5, flexShrink: 0 }}><TextField fullWidth size="small" label="Search dishes" value={search} onChange={event => setSearch(event.target.value)} /><Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>Tap + to add · Choose dishes with options</Typography></Box>
    <Box component="ul" aria-label="Menu dishes" sx={{ m: 0, px: 1.5, pb: 2, listStyle: 'none', flex: 1, minHeight: 0, overflowY: 'auto' }}>
      {dishes.map(dish => {
        const hasOptions = Object.keys(dish.options || {}).length > 0;
        const count = cartDishes.filter(item => String(item.sourceDishId) === String(dish.id)).reduce((sum, item) => sum + item.quantity, 0);
        return <Box component="li" key={dish.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 80, px: 1.5, py: 1, bgcolor: 'white', borderBottom: '1px solid #e5e5ef' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}><Typography component="h3" fontSize={14} fontWeight={700} sx={{ lineHeight: 1.4, overflowWrap: 'anywhere' }}>{dish.name}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{priceLabel(dish.price)}{hasOptions && dish.price !== 'SP' ? ' +' : ''}</Typography>{hasOptions && count > 0 && <Typography variant="caption" color="primary.main">{count} in cart</Typography>}</Box>
          {hasOptions ? <Button variant="outlined" size="small" aria-label={`Choose options for ${dish.name}`} onClick={() => chooseDish(dish)} sx={{ minHeight: 44, minWidth: 80, flexShrink: 0, textTransform: 'none' }}>Choose</Button> : <QuantityControl name={dish.name} quantity={count} onChange={delta => { onSimpleQuantityChange(restaurant.id, dish, delta); if (delta > 0) setAddedMessage(`1 × ${dish.name} added to your cart`); }} />}
        </Box>;
      })}
      {!dishes.length && <Typography sx={{ p: 2 }} color="text.secondary">{restaurant.dishes.length ? 'No dishes match your search.' : 'No dishes available.'}</Typography>}
    </Box>
    <Box sx={{ flexShrink: 0 }}>{cartReview}</Box>
    <Drawer anchor="bottom" open={Boolean(activeDish)} onClose={() => setActiveDish(null)} PaperProps={{ sx: { maxHeight: '90dvh', borderRadius: '20px 20px 0 0', maxWidth: 600, width: '100%', mx: 'auto' } }}>
      {activeDish && <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '90dvh', overflow: 'hidden' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, borderBottom: '1px solid #e5e5ef', flexShrink: 0 }}><Box sx={{ minWidth: 0 }}><Typography component="h2" fontWeight={800} sx={{ overflowWrap: 'anywhere' }}>{activeDish.name}</Typography><Typography color="text.secondary">{priceLabel(configuredPrice)}</Typography></Box><IconButton aria-label="Close dish options" onClick={() => setActiveDish(null)} sx={{ width: 44, height: 44 }}><CloseIcon /></IconButton></Stack>
        <Box sx={{ p: 2, overflowY: 'auto', minHeight: 0 }}>
          {Object.entries(activeDish.options).map(([key, option]) => <Box key={key} sx={{ mb: 2 }}>
            <Typography id={`option-${key}`} fontWeight={700}>{option.name || key} <Typography component="span" variant="caption" color="text.secondary">{option.limit === 1 ? '(Required)' : `Choose up to ${option.limit || option.choices.length}`}</Typography></Typography>
            {option.limit === 1 ? <RadioGroup aria-labelledby={`option-${key}`} value={selectedOptions[key]?.[0] || ''} onChange={event => toggleOption(key, event.target.value, 1)}>{option.choices.map(choice => <FormControlLabel key={choice} value={choice} control={<Radio />} label={choice} sx={{ minHeight: 48, m: 0 }} />)}</RadioGroup> : <Stack>{option.choices.map(choice => {
              const checked = selectedOptions[key]?.includes(choice) || false;
              return <FormControlLabel key={choice} control={<Checkbox checked={checked} disabled={!checked && selectedOptions[key]?.length >= option.limit} onChange={() => toggleOption(key, choice, option.limit)} />} label={choice} sx={{ minHeight: 48, m: 0 }} />;
            })}</Stack>}
          </Box>)}
        </Box>
        <Box sx={{ p: 2, pb: 'max(16px, env(safe-area-inset-bottom))', borderTop: '1px solid #e5e5ef', flexShrink: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between"><Typography fontWeight={700}>Quantity</Typography><QuantityControl name={activeDish.name} quantity={quantity} minimum={1} onChange={delta => setQuantity(value => Math.max(1, Math.min(10, value + delta)))} /></Stack>
          {requiredMissing && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Select each required option to continue.</Typography>}
          <Button variant="contained" fullWidth disabled={Boolean(requiredMissing)} onClick={addConfiguredDish} sx={{ minHeight: 48, textTransform: 'none' }}>Add {quantity} to cart{configuredPrice !== 'SP' ? ` · $${(configuredPrice * quantity).toFixed(2)}` : ''}</Button>
        </Box>
      </Box>}
    </Drawer>
    <Snackbar key={addedMessage} open={Boolean(addedMessage)} autoHideDuration={3000} onClose={(_event, reason) => { if (reason !== 'clickaway') setAddedMessage(''); }} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ top: '64px !important' }}><Alert severity="success" role="status" onClose={() => setAddedMessage('')} sx={{ bgcolor: '#ededfc', color: 'text.primary' }}>{addedMessage}</Alert></Snackbar>
  </Box>;
}
