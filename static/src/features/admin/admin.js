import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel, IconButton,
  FormControlLabel, Checkbox, FormGroup
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
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
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [deliveryEvent, setDeliveryEvent] = useState([]);
  const [isFieldsVisible, setIsFieldsVisible] = useState(false);

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

  const handleTitleClick = () => {
    setIsFieldsVisible(!isFieldsVisible); // Toggle the visibility of the form fields
  };

  const handleChange = (event) => {
    const { value, checked } = event.target;

    setSelectedLocations((prev) => {
      if (checked) {
        return [...prev, value];  // Add to array if checked
      } else {
        return prev.filter((item) => item !== value);  // Remove from array if unchecked
      }
    });
  };

  const handleChangeRestaurant = (event) => {
    const { value, checked } = event.target;

    setSelectedRestaurants((prev) => {
      if (checked) {
        return [...prev, value];  // Add to array if checked
      } else {
        return prev.filter((item) => item !== value);  // Remove from array if unchecked
      }
    });
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

  const handleSubmit = async () => {
    const eventDate = {
      date: deliveryEvent,
      restaurants: selectedRestaurants,
      locations: selectedLocations
    }
    try {
      const response = await fetch("/api/adminConfig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDate),
      });

      if (!response.ok) {
        throw new Error("Failed to submit delivery event");
      }

      const data = await response.json();
      console.log("Delivery event submitted:", data);
    } catch (error) {
      console.error("Error submit delivery event:", error);
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

      <Box
        sx={{
          width: "100%",
          paddingTop: (theme) => `calc(${theme.mixins.toolbar.minHeight}px + 16px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflowX: "hidden",
          gap: 3, // Space between sections
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginBottom: 3,
            fontFamily: 'Poppins, sans-serif',
            textAlign: 'center',
            color: 'text.primary', // Adjust color as needed
            cursor: "pointer", // Show pointer cursor to indicate it's clickable
            transition: "color 0.3s ease, transform 0.2s ease", // Smooth transition effect
            "&:hover": {
              color: "primary.main", // Change color on hover (use theme primary color)
              transform: "scale(1.05)", // Slightly increase size on hover
            }
          }}
          onClick={handleTitleClick}
        >
          Create Delivery Event
        </Typography>

        {isFieldsVisible && (
        <>
          <TextField
            type="date"
            label="Delivery Date"
            InputLabelProps={{ shrink: true }}
            sx={{
              width: "80%", // Adjust width to be more consistent
              maxWidth: 400, // Max width to avoid it stretching too much
              marginBottom: 3, // Space below the date picker
              backgroundColor: "#f5f5f5", // Light background color for better contrast
              borderRadius: "4px", // Slightly rounded corners
            }}
            value={deliveryEvent}
            onChange={(e) => setDeliveryEvent(e.target.value)}
          />

          {/* Pickup Location */}
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <FormControl sx={{ width: "100%", mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontFamily: 'Poppins, sans-serif',
                  color: 'text.primary',
                }}
              >
                Select Pickup Location
              </Typography>

              <Card
                sx={{
                  width: "100%",
                  boxShadow: 2,
                  borderRadius: 2,
                  padding: 2,
                  backgroundColor: "#fff",
                }}
              >
                <CardContent>
                  <FormGroup sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 2 }}>
                    {PICK_UP_LOCATION.map((location, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={selectedLocations.includes(location)}
                            onChange={handleChange}
                            value={location}
                            color="primary"
                          />
                        }
                        label={location}
                        sx={{
                          fontSize: '0.875rem',
                          color: 'text.primary',
                          '& .MuiFormControlLabel-label': {
                            fontWeight: 'normal', // Lighter label font weight
                          },
                        }}
                      />
                    ))}
                  </FormGroup>
                </CardContent>
              </Card>
            </FormControl>
          </Box>

          {/* Restaurant Selection */}
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <FormControl sx={{ width: "100%", mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontFamily: 'Poppins, sans-serif',
                  color: 'text.primary',
                }}
              >
                Select Restaurants
              </Typography>

              <Card
                sx={{
                  width: "100%",
                  boxShadow: 2,
                  borderRadius: 2,
                  padding: 2,
                  backgroundColor: "#fff",
                }}
              >
                <CardContent>
                  <FormGroup sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 2 }}>
                    {Object.entries(RESTAURANT_NAME).map(([key, name]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            checked={selectedRestaurants.includes(name)}
                            onChange={handleChangeRestaurant}
                            value={name}
                            color="primary"
                          />
                        }
                        label={name}
                        sx={{
                          fontSize: '0.875rem',
                          color: 'text.primary',
                          '& .MuiFormControlLabel-label': {
                            fontWeight: 'normal', // Lighter label font weight
                          },
                        }}
                      />
                    ))}
                  </FormGroup>
                </CardContent>
              </Card>
            </FormControl>
          </Box>

          <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Delievery Event
          </Button>
        </>)}
      </Box>

      <Box sx={{ width: "100%", paddingTop: (theme) => `calc(${theme.mixins.toolbar.minHeight}px + 16px)`, display: "flex",
          justifyContent: "space-between",
          alignItems: "center", overflowX: "hidden",
          flexDirection: "column" }}>
        <Typography variant="h6" gutterBottom gap="5">Collect Orders</Typography>
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
    </Box>
  );
};

export default Admin;
