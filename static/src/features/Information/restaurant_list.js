import React, { useState, useEffect  } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, IconButton, Badge } from "@mui/material";
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import EventIcon from "@mui/icons-material/Event";
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";
import MoreMenu from "../headerSection/menu/more";
import RestaurantList from "./restaurant_support_list";

const RestaurantSupportList = () => {
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
          gap: 1,
          width: '100%',
          mx: "auto",
          textAlign: "center", // centers h2 text
        }}
      >
        <div style={{ marginTop: '50px' }}>
          <RestaurantList/>
        </div>
      </Box>
    </Box>
  );
};

export default RestaurantSupportList;
