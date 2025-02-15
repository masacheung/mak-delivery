import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import TASTY_MOMENT from "./tastyMoment";

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
  const navigate = useNavigate();

  const restaurants = [
    TASTY_MOMENT,
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
    total: 0,
  });

  const updateOrderState = (field, value) => {
    setOrderState((prev) => ({ ...prev, [field]: value }));
  };

  const updateTotal = (orderDetails) => {
    const newTotal = Object.values(orderDetails).flat().reduce((sum, dish) => {
      return sum + (dish.price === "SP" ? 0 : dish.price * dish.quantity);
    }, 0);

    setOrderState((prevState) => ({
      ...prevState,
      total: newTotal, // Only sum up valid prices
    }));
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
      // Ensure selectedRestaurant exists before proceeding
      if (!prev.selectedRestaurant?.id) return prev;

      const restaurantId = prev.selectedRestaurant.id;
      const updatedQuantities = { ...prev.quantities[restaurantId] } || {};

      if (action === "increase" && (updatedQuantities[dishId] || 0) < 10) {
        updatedQuantities[dishId] = (updatedQuantities[dishId] || 0) + 1;
      } else if (action === "decrease" && (updatedQuantities[dishId] || 0) > 0) {
        updatedQuantities[dishId] -= 1;
      } else if (action === "reset") {
        updatedQuantities[dishId] = 0;
      }

      // Ensure addedDishes is updated correctly
      const updatedDishes = { ...prev.addedDishes };
      if (updatedQuantities[dishId] === 0) {
        updatedDishes[restaurantId] = updatedDishes[restaurantId]?.filter(dish => dish.id !== dishId) || [];
      }

      return {
        ...prev,
        quantities: { ...prev.quantities, [restaurantId]: updatedQuantities },
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
        orderDetails: JSON.stringify(
          Object.entries(orderState.addedDishes).reduce((acc, [restaurantId, dishes]) => {
            const restaurant = restaurants.find((r) => r.id === Number(restaurantId)); // Get restaurant name
            acc[restaurantId] = dishes.map((dish) => ({
              ...dish,
              restaurantName: restaurant ? restaurant.name : `Restaurant ${restaurantId}`, // Assign restaurant name
            }));
            return acc;
          }, {})
        ),
        total: orderState.total,
      };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to submit order");

      const result = await response.json(); // FIXED: Define result before using it

      console.log("Order submitted successfully");

      console.log(result.order);

      // Redirect to the ordered page with order details
      navigate("/ordered", { state: { order: result.order } });

      setOrderState({
        selectedRestaurant: null,
        quantities: {},
        isDishFormVisible: false,
        addedDishes: {},
        wechatId: "",
        pickupLocation: "",
        date: "",
        errors: {},
        total: 0,
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
                <Box sx={{ width: "100%", maxHeight: "300px", overflowY: "auto", padding: 2, borderTop: "1px solid #ccc", marginTop: 2,
                 "&::-webkit-scrollbar": {
                       width: "8px",
                     },
                     "&::-webkit-scrollbar-track": {
                       background: "#f1f1f1",
                       borderRadius: "10px",
                     },
                     "&::-webkit-scrollbar-thumb": {
                       background: "#888",
                       borderRadius: "10px",
                     },
                     "&::-webkit-scrollbar-thumb:hover": {
                       background: "#555",
                     },
                  }}>
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

      <OrderSummary addedDishes={orderState.addedDishes} updateTotal={updateTotal}/>

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
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
          Submit Order
        </Button>
      </Box>
    </Box>
  );
};

export default RestaurantList;
