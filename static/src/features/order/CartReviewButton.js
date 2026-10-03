import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { cartPricing } from './cartPricing';

export default function CartReviewButton({ addedDishes, onClick }) {
  const { itemCount, total, specialPrice } = cartPricing(addedDishes);
  if (!itemCount) return null;
  return <Box sx={{ p: 2, pb: 'max(16px, env(safe-area-inset-bottom))', bgcolor: 'white', borderTop: '1px solid #e5e5ef' }}>
    <Button variant="contained" fullWidth onClick={onClick} startIcon={<ShoppingCartIcon />} sx={{ maxWidth: 720, display: 'flex', mx: 'auto', minHeight: 56, gap: 1, textTransform: 'none' }}>
      <Box sx={{ flex: 1, textAlign: 'left' }}><Typography component="span" fontWeight={700}>{itemCount} {itemCount === 1 ? 'item' : 'items'} · Est. ${total.toFixed(2)}</Typography><Typography component="span" sx={{ display: 'block', fontSize: 11 }}>Includes tax & delivery</Typography></Box>
      <Typography component="span" fontWeight={700}>Review order</Typography>
    </Button>
    {specialPrice && <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>Special-price items priced separately by restaurant.</Typography>}
  </Box>;
}
