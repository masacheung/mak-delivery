import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Alert, Button, CircularProgress, Stack } from '@mui/material';
import CustomerPage from '../../components/CustomerPage';
import { useAuth } from '../../hooks/useAuth';
import RestaurantList from '../restaurants/restaurantList';
import { pickupDay, todayInNewJersey } from '../orders/orderPresentation';

export default function EditExistingOrder() {
  const { state } = useLocation();
  const { user, loading } = useAuth();
  const order = state?.orderData;
  if (loading) return <CustomerPage title="Edit order"><CircularProgress size={24} aria-label="Loading order" /></CustomerPage>;
  if (!order || user?.username !== order.username || !pickupDay(order.pick_up_date) || pickupDay(order.pick_up_date) < todayInNewJersey()) return <CustomerPage title="Edit order"><Stack gap={2}><Alert severity="info">Choose one of your upcoming orders to make changes.</Alert><Button component={RouterLink} to="/lookup-order" variant="contained">View my orders</Button></Stack></CustomerPage>;
  return <RestaurantList key={order.id} editOrder={order} />;
}
