import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import {PICK_UP_LOCATION, RESTAURANT_NAME} from "../../constant/constant";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [pickUpDate, setPickUpDate] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [orders, setOrders] = useState([]);
  const [sumTotal, setSumTotal] = useState(0);

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
    const encodePickUpLocation = encodeURIComponent(pickUpLocation);

    try {
      const response = await fetch(`/api/orders/search?pick_up_location=${encodePickUpLocation}&pick_up_date=${pickUpDate}&restaurantId=${restaurant}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      const sum = data.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);;

      setOrders(data);
      setSumTotal(parseFloat(sum.toFixed(2)));
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  if (!isAuthenticated) {
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
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Typography variant="h4" gutterBottom>Admin Panel</Typography>

      {/* Pickup Location Dropdown */}
      <FormControl sx={{ minWidth: 300, mb: 2 }}>
        <InputLabel shrink htmlFor="location-select">Pickup Location</InputLabel>
        <Select
          value={pickUpLocation}
          onChange={(e) => setPickUpLocation(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">
            <em>Clear Selection</em>
          </MenuItem>
          {PICK_UP_LOCATION.map((location, index) => (
            <MenuItem key={index} value={location}>{location}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 300, mb: 2 }}>
        <InputLabel shrink htmlFor="restaurant-select">
          Select Restaurant
        </InputLabel>
        <Select
          id="restaurant-select"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">
            <em>Clear Selection</em>
          </MenuItem>
          {Object.entries(RESTAURANT_NAME).map(([id, name]) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Pickup Date Input */}
      <TextField
        type="date"
        label="Pickup Date"
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 300, mb: 2 }}
        value={pickUpDate}
        onChange={(e) => setPickUpDate(e.target.value)}
      />

      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search Orders
      </Button>

      {/* Display Search Results */}
      {orders.length > 0 && (
        <Box mt={4} width="80%">
          <Typography variant="h6">Search Results:</Typography>
          <Typography><strong>Total Orders:</strong> {orders.length}</Typography>
          <Typography><strong>Total :</strong> $ {sumTotal}</Typography>
          <Typography><strong>Location:</strong> {pickUpLocation}</Typography>
          {orders.map((order) => (
            <Card key={order.id} sx={{ mt: 2, p: 2 }}>
              <Typography><strong>Order ID:</strong> {order.id}</Typography>
              <Typography><strong>WeChat ID:</strong> {order.wechat_id}</Typography>
              <Typography><strong>Total:</strong> ${isNaN(Number(order.total)) ? "N/A" : Number(order.total).toFixed(2)}</Typography>

              <Typography variant="h6" mt={2}><strong>Order Details:</strong></Typography>
              {order.order_details && Object.keys(order.order_details).length > 0 ? (
                Object.entries(order.order_details).map(([restaurantId, dishes]) => (
                  <Box key={restaurantId} sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary">
                      {RESTAURANT_NAME[restaurantId]}
                    </Typography>
                    <Typography><strong>Order:</strong></Typography>
                    <ul style={{ paddingLeft: "20px" }}>
                      {dishes.map((dish) => (
                        <li key={dish.id}>
                          {`${dish.name} ${
                            dish.selectedOptions && Object.keys(dish.selectedOptions).length > 0
                              ? ` (${Object.entries(dish.selectedOptions)
                                  .map(([optionKey, selected]) => selected.join(", "))
                                  .join("; ")})` // ✅ Display all selected options correctly
                              : ""
                          } x${dish.quantity}`} -
                          {dish.price === "SP" ? (
                            <Typography color="error" variant="caption">
                              SP (Check with restaurant)
                            </Typography>
                          ) : `$${dish.price.toFixed(2)}`}
                        </li>
                      ))}
                    </ul>
                  </Box>
                ))
              ) : (
                <Typography color="error">No order details available.</Typography>
              )}
              <Typography><strong>Notes:</strong>{order.notes}</Typography>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Admin;
