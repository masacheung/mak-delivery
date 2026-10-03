import React from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import foodImage from '../../image/tastyMoment.webp';

export default function HomeLandingContent({ isLoading, isAuthenticated, user, onStartOrdering, onTrackOrder, error }) {
  return <Container maxWidth="lg" sx={{ pt: { xs: 11, md: 15 }, pb: 6, flex: 1 }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: { xs: 3, md: 7 }, alignItems: 'center' }}>
      <Box>
        <Chip label="麥麥送 · COMMUNITY FOOD DELIVERY" sx={{ bgcolor: '#ededfc', color: 'primary.main', fontWeight: 700, mb: 2 }} />
        <Typography component="h1" sx={{ fontSize: { xs: '2.8rem', md: '4.3rem' }, fontWeight: 850, letterSpacing: '-.045em', lineHeight: 1.12 }}>Your favourites.<br /><Box component="span" sx={{ color: 'primary.main' }}>Closer to home.</Box></Typography>
        <Typography sx={{ mt: 2.5, maxWidth: 440, fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.7 }}>Order from the restaurants you love and collect your meal at a convenient pickup location.</Typography>
        {isAuthenticated && <Typography sx={{ mt: 2, fontWeight: 600 }}>Welcome back, {user?.username}.</Typography>}
        <Stack gap={1.5} sx={{ mt: 3, maxWidth: { xs: '100%', md: 380 } }}>
          <Button size="large" variant="contained" endIcon={<ArrowForwardIcon />} onClick={onStartOrdering} sx={{ minHeight: 56 }}>{isAuthenticated ? 'Start your order' : 'Log in to order'}</Button>
          <Button size="large" variant="outlined" startIcon={<SearchIcon />} onClick={onTrackOrder}>Track your order</Button>
        </Stack>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Box component="img" src={foodImage} alt="Tasty Moment, one of our supported restaurants" sx={{ width: '100%', height: { xs: 220, md: 420 }, objectFit: 'cover', borderRadius: 5, display: 'block' }} />
        <Paper elevation={0} sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,.96)' }}>
          <Typography fontWeight={800}>Many restaurants. One pickup.</Typography><Typography variant="body2" color="text.secondary">Mix your favourites in a single order.</Typography>
        </Paper>
      </Box>
    </Box>
    <Box sx={{ mt: { xs: 4, md: 7 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
      {[
        ['01', 'Choose your pickup', 'Select an available date and a location near you.'],
        ['02', 'Find your favourites', 'Browse restaurant menus and customise your dishes.'],
        ['03', 'Review & collect', 'Check your order, then collect at your chosen location.'],
      ].map(([number, title, description]) => <Paper variant="outlined" key={number} sx={{ p: 2.5, borderRadius: 3, display: 'flex', gap: 2 }}>
        <Typography sx={{ color: 'secondary.main', fontWeight: 800 }}>{number}</Typography><Box><Typography fontWeight={700}>{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{description}</Typography></Box>
      </Paper>)}
    </Box>
    {isLoading && <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 2 }}><CircularProgress size={18} /><Typography variant="body2">Loading delivery dates…</Typography></Stack>}
    {error && <Alert severity="warning" sx={{ mt: 2 }}>{error}</Alert>}
  </Container>;
}
