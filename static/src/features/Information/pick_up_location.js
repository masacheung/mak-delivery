import React, { useState, useEffect } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Badge,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  DensityMedium as DensityMediumIcon,
  Event as EventIcon,
  Home as HomeIcon,
  LocationOn as LocationOnIcon,
  Map as MapIcon,
  Place as PlaceIcon,
} from "@mui/icons-material";
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";
import MoreMenu from "../headerSection/menu/more";

import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pickupLocations = [
  {
    name: "Fort Lee 540 Main St",
    lat: 40.851994,
    lng: -73.972452,
    area: "Fort Lee",
  },
  {
    name: "Hackensack 99 Ranch",
    lat: 40.8892,
    lng: -74.0424,
    area: "Hackensack",
  },
  {
    name: "Tenafly - 165 Grove St",
    lat: 40.9252,
    lng: -73.9615,
    area: "Tenafly",
  },
  {
    name: "Weehawken - 150 Henley Place",
    lat: 40.7743,
    lng: -74.0150,
    area: "Weehawken",
  },
  {
    name: "Weehawken - 9 Ave at Port Imperial",
    lat: 40.7736,
    lng: -74.0119,
    area: "Weehawken",
  },
  {
    name: "900 Madison St, Hoboken, NJ 07030",
    lat: 40.7471,
    lng: -74.0324,
    area: "Hoboken",
  },
  {
    name: "Möge Tea - 2029 Lemoine Ave #102, Fort Lee, NJ 07024",
    lat: 40.8500,
    lng: -73.9700,
    area: "Fort Lee",
  },
  {
    name: "Jersey City - Canopy 159 Morgan St",
    lat: 40.7196,
    lng: -74.0457,
    area: "Jersey City",
  },
  {
    name: "Jersey City - 1 Shore Ln",
    lat: 40.7275,
    lng: -74.0342,
    area: "Jersey City",
  },
  {
    name: "Jersey City - 155 Bay St",
    lat: 40.7190,
    lng: -74.0421,
    area: "Jersey City",
  },
  {
    name: "JSQ - Overlook Flat",
    lat: 40.7326,
    lng: -74.0635,
    area: "Jersey City",
  },
  {
    name: "Ridgewood",
    lat: 40.9793,
    lng: -74.1165,
    area: "Ridgewood",
  },
  {
    name: "4000 Riverside Station Blvd, Secaucus, NJ 07094",
    lat: 40.7870,
    lng: -74.0672,
    area: "Secaucus",
  },
  {
    name: "200 Angelo Cifelli Dr, Harrison, NJ 07029",
    lat: 40.7380,
    lng: -74.1550,
    area: "Harrison",
  },
  {
    name: "Millburn Free Public Library, 200 Glen Ave, Millburn, NJ 07041",
    lat: 40.7266,
    lng: -74.3062,
    area: "Millburn",
  },
  {
    name: "160 Main St, Millburn, NJ 07041",
    lat: 40.7229,
    lng: -74.3031,
    area: "Millburn",
  },
  {
    name: "10 Robert H Harp Dr, Livingston, NJ 07039",
    lat: 40.7876,
    lng: -74.3228,
    area: "Livingston",
  },
  {
    name: "598 Central Ave, New Providence, NJ 07974",
    lat: 40.6984,
    lng: -74.4011,
    area: "New Providence",
  },
];

const PickUpLocations = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSearch = async () => {
    try {
      setError("");
      const response = await fetch("/api/adminConfig");
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    handleSearch();
    const interval = setInterval(() => {
      handleSearch();
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const groupedLocations = pickupLocations.reduce((acc, location) => {
    if (!acc[location.area]) {
      acc[location.area] = [];
    }
    acc[location.area].push(location);
    return acc;
  }, {});

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          color: 'black',
        }}
      >
        <Toolbar>
          <IconButton 
            onClick={() => setShowMenu(true)}
            sx={{ 
              color: 'inherit',
              '&:hover': { 
                background: 'rgba(0,0,0,0.1)',
                transform: 'scale(1.1)',
              }
            }}
          >
            <DensityMediumIcon />
          </IconButton>
          
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              textAlign: 'center',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease',
              }
            }}
            onClick={() => navigate("/")}
          >
            Pick-up Locations
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={() => navigate("/")}
              sx={{ 
                color: 'inherit',
                '&:hover': { 
                  background: 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <HomeIcon />
            </IconButton>
            
            <IconButton 
              onClick={() => setShowEvents(true)}
              sx={{ 
                color: 'inherit',
                '&:hover': { 
                  background: 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Badge 
                badgeContent={events.length > 0 ? events.length : null} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '0.75rem',
                    minWidth: 20,
                    height: 20,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  }
                }}
              >
                <EventIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu */}
      {showMenu && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <MoreMenu onClose={() => setShowMenu(false)} />
        </Box>
      )}

      {/* Upcoming Event */}
      {showEvents && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <UpcomingEvent events={events} onClose={() => setShowEvents(false)} />
        </Box>
      )}

      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <Fade in={true} timeout={1000}>
          <Box>
            {/* Hero Section */}
            <Paper
              elevation={8}
              sx={{
                p: 4,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              <LocationOnIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: isMobile ? '1.8rem' : '2.5rem',
                }}
              >
                Pick-up Locations
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Find convenient locations to collect your order
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<MapIcon />}
                  label={`${pickupLocations.length} Locations`}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
                <Chip
                  icon={<PlaceIcon />}
                  label={`${Object.keys(groupedLocations).length} Areas`}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            </Paper>

            {/* Map Section */}
            <Paper
              elevation={8}
              sx={{
                p: 3,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MapIcon sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  Interactive Map
                </Typography>
              </Box>
              
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <MapContainer
                  center={[40.85, -73.97]}
                  zoom={11}
                  style={{
                    height: isMobile ? '400px' : '500px',
                    width: '100%',
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  {pickupLocations.map((location, index) => (
                    <Marker 
                      key={index} 
                      position={[location.lat, location.lng]} 
                      icon={customIcon}
                      eventHandlers={{
                        click: () => setSelectedLocation(location),
                      }}
                    >
                      <Popup>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {location.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {location.area}
                          </Typography>
                        </Box>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Box>
            </Paper>

            {/* Locations List */}
            <Paper
              elevation={8}
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PlaceIcon sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  All Locations
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {Object.entries(groupedLocations).map(([area, locations]) => (
                  <Grid item xs={12} md={6} key={area}>
                    <Card
                      sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={area}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              fontWeight: 'bold',
                              mb: 1,
                            }}
                          />
                        </Box>
                        
                        <List dense>
                          {locations.map((location, index) => (
                            <React.Fragment key={index}>
                              <ListItem
                                button
                                onClick={() => setSelectedLocation(location)}
                                sx={{
                                  borderRadius: 1,
                                  mb: 1,
                                  '&:hover': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <LocationOnIcon sx={{ color: '#667eea', fontSize: 20 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={location.name}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    fontWeight: 500,
                                  }}
                                />
                              </ListItem>
                              {index < locations.length - 1 && <Divider sx={{ my: 0.5 }} />}
                            </React.Fragment>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default PickUpLocations;
