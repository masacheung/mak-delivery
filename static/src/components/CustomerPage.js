import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Box, Container, IconButton, Toolbar, Typography, Button } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ReceiptLong from '@mui/icons-material/ReceiptLong';

export default function CustomerPage({ title, children, showOrders = true, maxWidth = 'md' }) {
  return <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7fb' }}>
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid #e5e5ef' }}>
      <Toolbar sx={{ gap: 1, maxWidth: 1200, width: '100%', mx: 'auto' }}>
        <IconButton component={RouterLink} to="/" aria-label="Back to home"><ArrowBack /></IconButton>
        <Typography fontWeight={800} sx={{ flex: 1 }}>{title}</Typography>
        {showOrders && <Button component={RouterLink} to="/lookup-order" startIcon={<ReceiptLong />}>My orders</Button>}
      </Toolbar>
    </AppBar>
    <Container maxWidth={maxWidth} sx={{ py: { xs: 2.5, sm: 4 }, pb: 'max(32px, env(safe-area-inset-bottom))' }}>{children}</Container>
  </Box>;
}
