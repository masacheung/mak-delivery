import React, { useState } from "react";
import { Box, TextField, Button, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const pickupLocations = [
  "Fort Lee 540 Main St",
  "Hackensack 99 Ranch",
  "Tenafly (165 Grove St, Tenafly, NJ 07670)",
  "Weehawken (150 Henley Place)",
  "Weehawken (9 Ave at Port Imperial)",
  "Möge Tea (2029 Lemoine Ave #102, Fort Lee, NJ 07024)",
  "Jersey City (Canopy 159 Morgan St)",
  "Jersey City (1 Shorn Ln)",
  "Jersey City (155 Bay St)",
  "JSQ (Overlook Flat)",
];

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const [pickUpLocation, setPickUpLocation] = useState("");
  const [pickUpDate, setPickUpDate] = useState("");
  const [orders, setOrders] = useState([]); // Store fetched orders

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
      const response = await fetch(`/api/orders/search?pick_up_location=${pickUpLocation}&pick_up_date=${pickUpDate}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data); // Set the fetched orders
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  if (isAuthenticated) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>

        {/* Input Fields for Query */}
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Pickup Location"
            variant="outlined"
            value={pickUpLocation}
            onChange={(e) => setPickUpLocation(e.target.value)}
          />
          <TextField
            label="Pickup Date"
            type="date"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={pickUpDate}
            onChange={(e) => setPickUpDate(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Box>

        {/* Display Orders */}
        {orders.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxWidth: 800, mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>WeChat ID</strong></TableCell>
                  <TableCell><strong>Order Details</strong></TableCell>
                  <TableCell><strong>Total ($)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.wechat_id}</TableCell>
                    <TableCell>
                      {typeof order.order_details === "string"
                        ? JSON.parse(order.order_details).map(dish => `${dish.name} x${dish.quantity}`).join(", ")
                        : "N/A"}
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" mt={2} color="textSecondary">
            No orders found for the given criteria.
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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
};

export default Admin;
