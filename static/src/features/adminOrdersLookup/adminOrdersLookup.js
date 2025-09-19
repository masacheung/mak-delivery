import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Card,
  Select, MenuItem, FormControl, InputLabel,
} from "@mui/material";
import {PICK_UP_LOCATION, RESTAURANT_NAME} from "../../constant/constant";

const AdminOrdersLookup = () => {
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [pickUpDate, setPickUpDate] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [orders, setOrders] = useState([]);
  const [sumTotal, setSumTotal] = useState(0);
  const [isFieldsVisible, setIsFieldsVisible] = useState(false);

  const handleTitleClick = () => {
    setIsFieldsVisible(!isFieldsVisible); // Toggle the visibility of the form fields
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

  return (
    <>

      <Box sx={{ width: "100%", paddingTop: (theme) => `calc(${theme.mixins.toolbar.minHeight}px + 16px)`, display: "flex",
          justifyContent: "space-between",
          alignItems: "center", overflowX: "hidden",
          flexDirection: "column" }}>
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
          Collect Orders
        </Typography>
        {isFieldsVisible && (
        <>
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
                <Typography><strong>Username:</strong> {order.username}</Typography>
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
                            ) : !isNaN(Number(dish.price)) ? (
                              `$${Number(dish.price).toFixed(2)}`
                            ) : (
                              <Typography color="error" variant="caption">
                                N/A
                              </Typography>
                            )}
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
        </>)}
      </Box>
    </>
  );
};

export default AdminOrdersLookup;
