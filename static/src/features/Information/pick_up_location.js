import React, { useState, useEffect  } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, IconButton, Badge } from "@mui/material";
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import EventIcon from "@mui/icons-material/Event";
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
  },
  {
    name: "Hackensack 99 Ranch",
    lat: 40.8892,
    lng: -74.0424,
  },
  {
    name: "Tenafly - 165 Grove St",
    lat: 40.9252,
    lng: -73.9615,
  },
  {
    name: "Weehawken - 150 Henley Place",
    lat: 40.7743,
    lng: -74.0150,
  },
  {
    name: "Weehawken - 9 Ave at Port Imperial",
    lat: 40.7736,
    lng: -74.0119,
  },
  {
    name: "900 Madison St, Hoboken, NJ 07030",
    lat: 40.7471,
    lng: -74.0324,
  },
  {
    name: "Möge Tea - 2029 Lemoine Ave #102, Fort Lee, NJ 07024",
    lat: 40.8500,
    lng: -73.9700,
  },
  {
    name: "Jersey City - Canopy 159 Morgan St",
    lat: 40.7196,
    lng: -74.0457,
  },
  {
    name: "Jersey City - 1 Shore Ln",
    lat: 40.7275,
    lng: -74.0342,
  },
  {
    name: "Jersey City - 155 Bay St",
    lat: 40.7190,
    lng: -74.0421,
  },
  {
    name: "JSQ - Overlook Flat",
    lat: 40.7326,
    lng: -74.0635,
  },
  {
    name: "Ridgewood",
    lat: 40.9793,
    lng: -74.1165,
  },
  {
    name: "4000 Riverside Station Blvd, Secaucus, NJ 07094",
    lat: 40.7870,
    lng: -74.0672,
  },
  {
    name: "200 Angelo Cifelli Dr, Harrison, NJ 07029",
    lat: 40.7380,
    lng: -74.1550,
  },
  {
    name: "Millburn Free Public Library, 200 Glen Ave, Millburn, NJ 07041",
    lat: 40.7266,
    lng: -74.3062,
  },
  {
    name: "160 Main St, Millburn, NJ 07041",
    lat: 40.7229,
    lng: -74.3031,
  },
  {
    name: "1100-8100 Town Center Way, Livingston, NJ 07039",
    lat: 40.7876,
    lng: -74.3228,
  },
  {
    name: "598 Central Ave, New Providence, NJ 07974",
    lat: 40.6984,
    lng: -74.4011,
  },
];

const PickUpLocations = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false); // Controls visibility
  const [showMenu, setShowMenu] = useState(false); // Controls visibility

  const handleSearch = async () => {
    try {
      setError(null); // Clear previous errors
      const response = await fetch("/api/adminConfig");
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }
      const data = await response.json();
      setEvents(data); // Store events in state
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

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        padding: 0, // Ensure no extra padding on the body
      }}
    >
      <Box
        sx={{
          position: "fixed", // Keep header fixed at top
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          paddingTop: 2,
          paddingBottom: 2,
          boxShadow: 2,
          zIndex: 1100, // Ensure header is above the content but below the overlay
        }}
      >
        {/* Left - Logo */}
        <IconButton onClick={() =>setShowMenu(true)}>
          <DensityMediumIcon sx={{ fontSize: 30, color: "black" }}/>
        </IconButton>

        {/* Center - Mak Delivery */}
        <Typography variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontWeight: 'bold',
            fontFamily: 'Poppins, sans-serif',
            cursor: "pointer",
            transition: "color 0.3s ease, transform 0.2s ease",
            "&:hover": {
              color: "primary.main",
              transform: "scale(1.05)",
            }
          }}
          onClick={() => navigate("/")}
        >
          Mak Delivery
        </Typography>

        {/* Right - Shopping Cart */}
        <IconButton onClick={() =>setShowEvents(true)}>
          <Badge badgeContent={events.length > 0 ? events.length : null} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 12, minWidth: 20, height: 20 } }}> 
            <EventIcon sx={{ fontSize: 30, color: "black" }} />
          </Badge>
        </IconButton>
      </Box>

      {/* Menu */}
      {showMenu && (
        <Box
          sx={{
            width: "100%", // Ensure full width
            padding: 0, // Remove padding that might be causing the shift
            display: "flex",
            justifyContent: "center", // Center align the UpcomingEvent
          }}
        >
          <MoreMenu onClose={() => setShowMenu(false)} />
        </Box>
      )}

      {/* Upcoming Event */}
      {showEvents && (
        <Box
          sx={{
            width: "100%", // Ensure full width
            padding: 0, // Remove padding that might be causing the shift
            display: "flex",
            justifyContent: "center", // Center align the UpcomingEvent
          }}
        >
          <UpcomingEvent events={events} onClose={() => setShowEvents(false)} />
        </Box>
      )}

      {/* Top Section - 60% */}
      <Box
        sx={{
          flex: 6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          // Optional: width 100% so 110% map width doesn't overflow horizontally
          width: '100%',
        }}
      >
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📍 Pick-up Locations Map
          </h2>

          <MapContainer
            center={[40.85, -73.97]}
            zoom={11}
            style={{ height: '80vh', width: '100%', borderRadius: '1rem' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {pickupLocations.map((location, index) => (
              <Marker key={index} position={[location.lat, location.lng]} icon={customIcon}>
                <Popup>{location.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </Box>
    </Box>
  );
};

export default PickUpLocations;
