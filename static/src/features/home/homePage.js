import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, IconButton, Badge } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import EventIcon from "@mui/icons-material/Event";
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";

const pickupLocations = [
  "Fort Lee 540 Main St",
  "Hackensack 99 Ranch",
  "Tenafly - 165 Grove St, Tenafly, NJ 07670",
  "Weehawken - 150 Henley Place",
  "Weehawken - 9 Ave at Port Imperial",
  "900 Madison St, Hoboken, NJ 07030",
  "Möge Tea - 2029 Lemoine Ave #102, Fort Lee, NJ 07024",
  "Jersey City - Canopy 159 Morgan St",
  "Jersey City - 1 Shorn Ln",
  "Jersey City - 155 Bay St",
  "JSQ - Overlook Flat",
  "Ridgewood",
  "4000 Riverside Station Blvd, Secaucus, NJ 07094",
  "200 Angelo Cifelli Dr, Harrison, NJ 07029",
  "Millburn Free Public Library, 200 Glen Ave, Millburn, NJ 07041",
  "160 Main St, Millburn, NJ 07041",
  "1100-8100 Town Center Way, Livingston, NJ 07039"
];

const HomePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false); // Controls visibility

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/delivery-truck.png" alt="Logo" style={{ width: 40, height: 40 }} />
        </Box>

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
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          麥麥送
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: "80%", height: "60px", fontSize: "1.2rem" }}
          onClick={() => navigate("/restaurants")}
        >
          Order
        </Button>

        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "80%", height: "60px", fontSize: "1.2rem" }}
          onClick={() => navigate("/lookup-order")}
        >
          Look Up Order
        </Button>
      </Box>

      {/* Bottom Section - 40% */}
      <Box
        sx={{
          flex: 4,
          textAlign: "center",
          overflowY: "auto",
        }}
      >
        <Typography variant="body1">Pick-up Locations</Typography>
        <Typography variant="body2" color="textSecondary">
          {pickupLocations.map((location, index) => (
            <span key={index} style={{ display: "block" }}>{location}</span>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
