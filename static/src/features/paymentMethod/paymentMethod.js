import React, { useState } from 'react';
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import Close from '@mui/icons-material/Close';
import ContentCopy from '@mui/icons-material/ContentCopy';
import OpenInNew from '@mui/icons-material/OpenInNew';

export default function PaymentMethod({ order, onClose }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  return <Dialog open onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>Payment instructions<IconButton aria-label="Close payment instructions" onClick={onClose}><Close /></IconButton></DialogTitle>
    <DialogContent><Stack gap={2}>
      <Typography variant="body2" color="text.secondary">Use Venmo and include your order ID in the payment note.</Typography>
      <Box sx={{ p: 2, bgcolor: '#eeedff', borderRadius: 2 }}><Typography variant="caption" color="text.secondary">PAYMENT NOTE</Typography><Typography fontWeight={800}>Order #{order.id} · {order.username}</Typography><Button size="small" startIcon={<ContentCopy />} onClick={async () => { try { await navigator.clipboard.writeText(`Order #${order.id} · ${order.username}`); setCopied(true); setCopyError(false); } catch { setCopyError(true); } }}>{copied ? 'Copied' : 'Copy payment note'}</Button>{copyError && <Typography variant="caption">Copy the order ID shown above into your payment note.</Typography>}</Box>
      <Button variant="contained" href="https://venmo.com/u/Crystal-Mak-1" target="_blank" rel="noopener noreferrer" endIcon={<OpenInNew />}>Open Venmo · Crystal-Mak-1</Button>
      <Typography variant="body2" color="text.secondary" textAlign="center">Or scan the QR code from another device</Typography>
      <Box component="img" src="/venmo.jpg" alt="Venmo QR code for Crystal-Mak-1" sx={{ width: '100%', maxWidth: 240, height: 'auto', mx: 'auto' }} />
      <Alert severity="info">Payment status updates after the admin records your payment.</Alert>
      <Button variant="outlined" onClick={onClose}>Back to order</Button>
    </Stack></DialogContent>
  </Dialog>;
}
