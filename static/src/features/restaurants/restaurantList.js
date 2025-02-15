import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  MenuItem,
} from "@mui/material";
import DishForm from "../dishes/dishForm";
import OrderSummary from "../order/orderSummary";

const RestaurantList = () => {
  const restaurants = [
    {
      id: 1,
      name: "Restaurant A",
      dishes: [
        { id: 1, name: "Pizza", price: 10 },
        { id: 22, name: "Pizza B", price: 20 },
      ],
    },
    {
      id: 2,
      name: "Restaurant B",
      dishes: [{ id: 7, name: "Burger", price: 5 }],
    },
    {
      id: 3,
      name: "Restaurant C",
      dishes: [{ id: 5, name: "Pasta", price: 8 }],
    },
  ];

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [isDishFormVisible, setIsDishFormVisible] = useState(false);
  const [addedDishes, setAddedDishes] = useState({});
  const [wechatId, setWechatId] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({});

  const handleSelectRestaurant = (restaurant) => {
    if (selectedRestaurant?.id === restaurant.id) {
      setIsDishFormVisible(false);
      setTimeout(() => {
        setIsDishFormVisible(true);
        setSelectedRestaurant(restaurant);
      }, 0);
    } else {
      setSelectedRestaurant(restaurant);
      setIsDishFormVisible(true);
    }

    if (!quantities[restaurant.id]) {
      const initialQuantities = restaurant.dishes.reduce(
        (acc, dish) => ({ ...acc, [dish.id]: 0 }),
        {}
      );
      setQuantities((prev) => ({ ...prev, [restaurant.id]: initialQuantities }));
    }
  };

  const handleCloseDishForm = () => {
    setIsDishFormVisible(false);
  };

  const handleQuantityChange = (dishId, action) => {
    setQuantities((prev) => {
      const updated = { ...prev[selectedRestaurant.id] };
      if (action === "increase" && updated[dishId] < 10) updated[dishId] += 1;
      else if (action === "decrease" && updated[dishId] > 0) updated[dishId] -= 1;
      return { ...prev, [selectedRestaurant.id]: updated };
    });
  };

  const handleAddDish = (restaurantId, selectedDishes) => {
    setAddedDishes((prev) => {
      const updatedDishes = { ...prev };

      if (!updatedDishes[restaurantId]) {
        updatedDishes[restaurantId] = [];
      }

      selectedDishes.forEach((dish) => {
        const existingDishIndex = updatedDishes[restaurantId].findIndex((d) => d.id === dish.id);

        if (existingDishIndex !== -1) {
          updatedDishes[restaurantId][existingDishIndex].quantity += dish.quantity;
        } else {
          updatedDishes[restaurantId].push({
            id: dish.id,
            name: dish.name || "Unknown",
            price: dish.price ?? 0, // Ensure price is never undefined
            quantity: dish.quantity ?? 0, // Ensure quantity is never undefined
          });
        }
      });

      return updatedDishes;
    });
  };

  const handleSubmit = async () => {
    let newErrors = {
      wechatId: !wechatId,
      pickupLocation: !pickupLocation,
      date: !date,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const orderData = {
      wechatId,
      pickupLocation,
      date,
      dishes: addedDishes,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to submit order");

      console.log("Order submitted successfully");
      setAddedDishes({});
      setWechatId("");
      setPickupLocation("");
      setDate("");
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ width: "100%", padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Restaurant List
        </Typography>

        <List>
          {restaurants.map((restaurant) => (
            <ListItem
              key={restaurant.id}
              sx={{
                marginBottom: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 2,
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <ListItemText primary={restaurant.name} />
                <Button variant="contained" color="primary" onClick={() => handleSelectRestaurant(restaurant)}>
                  +
                </Button>
              </Box>

              {addedDishes[restaurant.id]?.length > 0 && (
                <Box sx={{ marginTop: 1, width: "100%" }}>
                  <Typography variant="body2" color="textSecondary">
                    Added Dishes:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                    {addedDishes[restaurant.id].map((dish) => (
                      <Chip key={dish.id} label={`${dish.name} x${dish.quantity}`} sx={{ margin: "2px" }} />
                    ))}
                  </Box>
                </Box>
              )}

              {isDishFormVisible && selectedRestaurant?.id === restaurant.id && (
                <Box sx={{ width: "100%", padding: 2, borderTop: "1px solid #ccc", marginTop: 2 }}>
                  <DishForm
                    restaurant={selectedRestaurant}
                    quantities={quantities[selectedRestaurant.id]}
                    onQuantityChange={handleQuantityChange}
                    onClose={handleCloseDishForm}
                    onAddDish={handleAddDish}
                  />
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      <OrderSummary addedDishes={addedDishes} />

      <Box sx={{ padding: 2 }}>
        <TextField
          fullWidth
          label="WeChat ID"
          value={wechatId}
          onChange={(e) => setWechatId(e.target.value)}
          margin="normal"
          required
          error={errors.wechatId}
          helperText={errors.wechatId ? "WeChat ID is required" : ""}
        />
        <TextField
          select
          fullWidth
          label="Pick-up Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          margin="normal"
          required
          error={errors.pickupLocation}
          helperText={errors.pickupLocation ? "Pick-up Location is required" : ""}
        >
          <MenuItem value="Location A">Location A</MenuItem>
          <MenuItem value="Location B">Location B</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={errors.date}
          helperText={errors.date ? "Date is required" : ""}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
          Submit Order
        </Button>
      </Box>
    </Box>
  );
};

export default RestaurantList;
