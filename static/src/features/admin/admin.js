import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Typography, Card, CardContent, IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import EventIcon from "@mui/icons-material/Event";
import AdminDeliveryEvent from "../adminConfig/adminDeliveryEvent";
import AdminOrdersLookup from "../adminOrdersLookup/adminOrdersLookup";
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";

const Admin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false); // Controls visibility

  const handleLogin = (e) => {
    e.preventDefault();
    const adminUser = "admin";
    const adminPass = "aDm1n";

    if (username === adminUser && password === adminPass) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

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

  if (!isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" overflowX="hidden">
        <Card sx={{ width: 350, padding: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Admin Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Typography color="error" variant="body2" align="center">
                  {error}
                </Typography>
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="95%" maxWidth="800" margin="auto" overflowX="hidden">
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
        <Box sx={{ display: "flex", alignItems: "center"}}>
          <img src="/delivery-truck.png" alt="Logo" style={{ width: 40, height: 40 }} />
        </Box>

        {/* Center - Mak Delivery */}
        <Typography variant="h6" 
          sx={{ flexGrow: 1, textAlign: "center", fontWeight: 'bold', fontFamily: 'Poppins, sans-serif',
            cursor: "pointer",
            transition: "color 0.3s ease, transform 0.2s ease",
            "&:hover": {
              color: "primary.main",
              transform: "scale(1.05)",
            }
          }}
          onClick={() => navigate("/")}>
          Mak Delivery Admin Panel
        </Typography>

        {/* Right - Shopping Cart */}
        <IconButton onClick={() => setShowEvents(true)}>
          <Badge badgeContent={events.length > 0 ? events.length : null} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 12, minWidth: 20, height: 20 } }}> 
            <EventIcon sx={{ fontSize: 30, color: "black" }}/>
          </Badge>
        </IconButton>
      </Box>

      <AdminDeliveryEvent/>
      <AdminOrdersLookup/>
      {showEvents && <UpcomingEvent events={events} onClose={() => setShowEvents(false)} />}
    </Box>
  );
};

export default Admin;
