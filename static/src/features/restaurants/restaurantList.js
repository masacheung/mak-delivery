import React, { useState, useEffect } from "react";
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
import { PICK_UP_LOCATION } from "../../constant/constant";
import DishForm from "../dishes/dishForm";
import OrderSummary from "../order/orderSummary";
import TASTY_MOMENT from "../../constant/restaurants/tastyMoment";
import HK_ALLEY from "../../constant/restaurants/hkAlley";
import WONTON_GUY from "../../constant/restaurants/wontonGuy";
import S_Y_MINI_HOTPOT from "../../constant/restaurants/syMiniHotPot";
import NINETY_EIGHT_K from "../../constant/restaurants/ninetyEightK";
import CHEF_GE from "../../constant/restaurants/chefGe";
import SPICE_TWENTY_FOUR from "../../constant/restaurants/spiceTwentyFour";
import MEE_TU from "../../constant/restaurants/meeTu";
import YOU_GARDEN from "../../constant/restaurants/youGarden";
import JI_BEI_CHUAN from "../../constant/restaurants/jiBeiChuan";
import MISS_FLOWER_HOTPOT from "../../constant/restaurants/missFlowerHotpot";

const RestaurantList = () => {
  const navigate = useNavigate();

  const restaurants = [
    TASTY_MOMENT,
    CHEF_GE,
    SPICE_TWENTY_FOUR,
    WONTON_GUY,
    JI_BEI_CHUAN,
    MISS_FLOWER_HOTPOT,
    S_Y_MINI_HOTPOT,
    YOU_GARDEN,
    NINETY_EIGHT_K,
    HK_ALLEY,
    MEE_TU
  ];

  const [orderState, setOrderState] = useState({
    selectedRestaurant: null,
    quantities: {},
    isDishFormVisible: false,
    addedDishes: {},
    wechatId: "",
    pickupLocation: "",
    date: "",
    notes: "",
    errors: {},
    total: 0,
  });

  const updateOrderState = (field, value) => {
    setOrderState((prev) => ({ ...prev, [field]: value }));
  };

  const updateTotal = (total) => {
      setOrderState((prevState) => ({
        ...prevState,
        total,
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
        const existingDishIndex = updatedDishes[restaurantId].findIndex((d) => d.id === newDish.id);

        if (existingDishIndex !== -1) {
          updatedDishes[restaurantId][existingDishIndex].quantity = newDish.quantity;
        } else {
          updatedDishes[restaurantId].push({
            id: newDish.id,
            name: newDish.name || "Unknown",
            price: newDish.price === "SP" ? "SP" : newDish.price ?? 0, // 🔹 Ensure "SP" is preserved
            quantity: newDish.quantity ?? 0,
            selectedOptions: newDish.selectedOptions || [],
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

    const hasOrders = Object.values(orderState.addedDishes).some((dishes) => dishes.length > 0);
    if (!hasOrders) {
      newErrors.noOrders = true; // ✅ Add an error flag for no orders
    }

    updateOrderState("errors", newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    console.log(orderState.total);

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
        notes: orderState.notes
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
        <Typography color="error" variant="caption" display="block">
          (Please refer to the WeChat notification for available restaurant(s) and pickup location on your selected date.)
        </Typography>
        <Typography color="error" variant="caption" display="block">
          (For drink(s), the total price includes only the drink and excludes add-ons.)
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
                      <Chip
                        key={dish.id}
                        label={`${dish.name} ${
                          dish.selectedOptions && Object.keys(dish.selectedOptions).length > 0
                            ? ` (${Object.entries(dish.selectedOptions)
                                .map(([optionKey, selected]) => selected.join(", "))
                                .join("; ")})` // ✅ Display selected options for all option groups
                            : ""
                        } x${dish.quantity}`}
                        sx={{ margin: "2px" }}
                      />
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
        <TextField
          label="Additional Notes"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          value={orderState.notes}
          onChange={(e) => setOrderState({ ...orderState, notes: e.target.value })}
          sx={{ marginTop: 2 }}
        />
      </Box>

      <OrderSummary addedDishes={orderState.addedDishes} updateTotal={updateTotal}/>

      <Box sx={{ padding: 2 }}>
        <TextField fullWidth label="WeChat ID" value={orderState.wechatId} onChange={(e) => updateOrderState("wechatId", e.target.value)} margin="normal" required error={orderState.errors?.wechatId} helperText={orderState.errors?.wechatId ? "WeChat ID is required" : ""}/>
        <TextField select fullWidth label="Pick-up Location" value={orderState.pickupLocation} onChange={(e) => updateOrderState("pickupLocation", e.target.value)} margin="normal" required error={orderState.errors?.pickupLocation} helperText={orderState.errors?.pickupLocation ? "Pick-up Location is required" : ""}>
          {PICK_UP_LOCATION.map((location, index) => (
            <MenuItem key={index} value={location}>
              {location}
            </MenuItem>
          ))}
        </TextField>
        <TextField fullWidth label="Pick-up Date" type="date" value={orderState.date} onChange={(e) => updateOrderState("date", e.target.value)} margin="normal" required InputLabelProps={{ shrink: true }} error={orderState.errors?.date} helperText={orderState.errors?.date ? "Date is required" : ""}/>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2,  marginTop: 2 }} onClick={handleSubmit}>
          Submit Order
        </Button>

        {orderState.errors?.noOrders && (
          <Typography color="error" sx={{ mt: 2 }}>
            Please add at least one dish before submitting your order.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RestaurantList;
