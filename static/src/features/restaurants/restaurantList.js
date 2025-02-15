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

  const [orderState, setOrderState] = useState({
    selectedRestaurant: null,
    quantities: {},
    isDishFormVisible: false,
    addedDishes: {},
    wechatId: "",
    pickupLocation: "",
    date: "",
    errors: {},
  });

  const updateOrderState = (field, value) => {
    setOrderState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectRestaurant = (restaurant) => {
    if (orderState.selectedRestaurant?.id === restaurant.id) {
      updateOrderState("isDishFormVisible", false);
      setTimeout(() => {
        updateOrderState("selectedRestaurant", restaurant);
        updateOrderState("isDishFormVisible", true);
      }, 0);
    } else {
      updateOrderState("selectedRestaurant", restaurant);
      updateOrderState("isDishFormVisible", true);
    }

    if (!orderState.quantities[restaurant.id]) {
      const initialQuantities = restaurant.dishes.reduce(
        (acc, dish) => ({ ...acc, [dish.id]: 0 }),
        {}
      );
      updateOrderState("quantities", {
        ...orderState.quantities,
        [restaurant.id]: initialQuantities,
      });
    }
  };

  const handleCloseDishForm = () => {
    updateOrderState("isDishFormVisible", false);
    updateOrderState("selectedRestaurant", null);
  };

  const handleQuantityChange = (dishId, action) => {
    setOrderState((prev) => {
      const updatedQuantities = { ...prev.quantities[prev.selectedRestaurant.id] };

      if (action === "increase" && updatedQuantities[dishId] < 10) {
        updatedQuantities[dishId] += 1;
      } else if (action === "decrease" && updatedQuantities[dishId] > 0) {
        updatedQuantities[dishId] -= 1;
      } else if (action === "reset") {
        updatedQuantities[dishId] = 0;
      }

      const updatedDishes = { ...prev.addedDishes };
      if (updatedQuantities[dishId] === 0) {
        updatedDishes[prev.selectedRestaurant.id] = updatedDishes[prev.selectedRestaurant.id]?.filter(dish => dish.id !== dishId) || [];
      }

      return {
        ...prev,
        quantities: { ...prev.quantities, [prev.selectedRestaurant.id]: updatedQuantities },
        addedDishes: updatedDishes,
      };
    });
  };

  const handleAddDish = (restaurantId, selectedDishes) => {
    setOrderState((prev) => {
      const updatedDishes = { ...prev.addedDishes };
      if (!updatedDishes[restaurantId]) updatedDishes[restaurantId] = [];

      selectedDishes.forEach((newDish) => {
        // Find the existing dish and update quantity instead of adding
        const existingDishIndex = updatedDishes[restaurantId].findIndex((d) => d.id === newDish.id);

        if (existingDishIndex !== -1) {
          // ✅ Update quantity to the latest selection
          updatedDishes[restaurantId][existingDishIndex].quantity = newDish.quantity;
        } else {
          updatedDishes[restaurantId].push({
            id: newDish.id,
            name: newDish.name || "Unknown",
            price: newDish.price ?? 0,
            quantity: newDish.quantity ?? 0,
          });
        }
      });

      return { ...prev, addedDishes: updatedDishes };
    });
  };

  const handleSubmit = async () => {
    let newErrors = {
      wechatId: !orderState.wechatId,
      pickupLocation: !orderState.pickupLocation,
      date: !orderState.date,
    };

    updateOrderState("errors", newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    const orderData = {
      wechatId: orderState.wechatId,
      pickupLocation: orderState.pickupLocation,
      date: orderState.date,
      dishes: orderState.addedDishes,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to submit order");

      console.log("Order submitted successfully");

      setOrderState({
        selectedRestaurant: null,
        quantities: {},
        isDishFormVisible: false,
        addedDishes: {},
        wechatId: "",
        pickupLocation: "",
        date: "",
        errors: {},
      });
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 800, margin: "auto", padding: 2 }}>
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
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <ListItemText primary={restaurant.name} />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    orderState.isDishFormVisible && orderState.selectedRestaurant?.id === restaurant.id
                      ? handleCloseDishForm()
                      : handleSelectRestaurant(restaurant)
                  }
                >
                  {orderState.isDishFormVisible && orderState.selectedRestaurant?.id === restaurant.id ? "-" : "+"}
                </Button>
              </Box>

              {orderState.addedDishes[restaurant.id]?.length > 0 && (
                <Box sx={{ marginTop: 1, width: "100%" }}>
                  <Typography variant="body2" color="textSecondary">
                    Added Dishes:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                    {orderState.addedDishes[restaurant.id].map((dish) => (
                      <Chip key={dish.id} label={`${dish.name} x${dish.quantity}`} sx={{ margin: "2px" }} />
                    ))}
                  </Box>
                </Box>
              )}

              {orderState.isDishFormVisible && orderState.selectedRestaurant?.id === restaurant.id && (
                <Box sx={{ width: "100%", padding: 2, borderTop: "1px solid #ccc", marginTop: 2 }}>
                  <DishForm
                    restaurant={orderState.selectedRestaurant}
                    quantities={orderState.quantities[orderState.selectedRestaurant.id]}
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

      <OrderSummary addedDishes={orderState.addedDishes} />

      <Box sx={{ padding: 2 }}>
        <TextField fullWidth label="WeChat ID" value={orderState.wechatId} onChange={(e) => updateOrderState("wechatId", e.target.value)} margin="normal" required />
        <TextField select fullWidth label="Pick-up Location" value={orderState.pickupLocation} onChange={(e) => updateOrderState("pickupLocation", e.target.value)} margin="normal" required>
          {pickupLocations.map((location, index) => (
            <MenuItem key={index} value={location}>
              {location}
            </MenuItem>
          ))}
        </TextField>
        <TextField fullWidth label="Date" type="date" value={orderState.date} onChange={(e) => updateOrderState("date", e.target.value)} margin="normal" required InputLabelProps={{ shrink: true }} />
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
          Submit Order
        </Button>
      </Box>
    </Box>
  );
};

export default RestaurantList;
