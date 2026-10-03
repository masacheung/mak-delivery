import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import CustomerPage from '../../components/CustomerPage';
import OrderDetails from '../orders/OrderDetails';

export default function OrderedPage() {
  const location = useLocation();
  const order = location.state?.order;
  return <CustomerPage title={location.state?.updated ? 'Order updated' : 'Order confirmation'} maxWidth="sm">
    {!order ? <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}><ReceiptLong color="primary" sx={{ fontSize: 44 }} /><Typography variant="h6" fontWeight={800} sx={{ my: 1 }}>Find your order in My orders</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>Your saved orders are available there whenever you need them.</Typography><Button component={RouterLink} to="/lookup-order" variant="contained">View my orders</Button></Paper> : <Stack gap={2.5}>
      <Box sx={{ textAlign: 'center', py: 1 }}><CheckCircleOutline color="primary" sx={{ fontSize: 48 }} /><Typography component="h1" variant="h4" fontWeight={800} sx={{ mt: 1, fontSize: 28 }}>{location.state?.updated ? 'Changes saved.' : 'Your order is saved.'}</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Keep order #{order.id} handy for payment and pickup.</Typography></Box>
      <Button component={RouterLink} to="/lookup-order" state={{ orderId: order.id }} variant="contained" fullWidth startIcon={<ReceiptLong />}>View this order in My orders</Button>
      <OrderDetails order={order} canEdit />
      <Button component={RouterLink} to="/install-guide">Set up pickup notifications</Button>
    </Stack>}
  </CustomerPage>;
}
