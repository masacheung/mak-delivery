import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Card, CardContent, IconButton
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import AdminDeliveryEvent from "../adminConfig/adminDeliveryEvent";
import AdminOrdersLookup from "../adminOrdersLookup/adminOrdersLookup";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

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
          sx={{ flexGrow: 1, textAlign: "center", fontWeight: 'bold', fontFamily: 'Poppins, sans-serif',}}>
          Mak Delivery Admin Panel
        </Typography>

        {/* Right - Shopping Cart */}
        <IconButton>
          <AccountCircle sx={{ fontSize: 30, color: "black" }}/>
        </IconButton>
      </Box>

      <AdminDeliveryEvent/>
      <AdminOrdersLookup/>
    </Box>
  );
};

export default Admin;
