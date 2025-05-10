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
  IconButton,
  Badge
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { v4 as uuidv4 } from 'uuid';
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
import NOODLES_TIME from "../../constant/restaurants/noodlesTimes";
import NEW_DA_NOODLES from "../../constant/restaurants/newDaNoodles";
import YO_DESSERT_US from "../../constant/restaurants/yoDessertUS";

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
    MEE_TU,
    YO_DESSERT_US,
    NOODLES_TIME,
    NEW_DA_NOODLES
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
  const [openEvents, setOpenEvents] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [availableRestaurants, setAvailableRestaurants] = useState([]);
  const [enableLocationsDropdown, setEnableLocationsDropdown] = useState(false);
  const [error, setError] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    console.log("Updated orderState:", orderState);
  }, [orderState]);

  useEffect(() => {
    console.log("Updated openEvents:", openEvents);
  }, [openEvents]);

  useEffect(() => {
    console.log("Updated availableRestaurants:", availableRestaurants);
  }, [availableRestaurants]);

  const resetEventsState = () => {
    setOpenEvents([]);
    setPickupLocations([]);
    setAvailableRestaurants([]);
    setEnableLocationsDropdown(false);
    setOrderState((prevState) => ({
      ...prevState,  // Spread the previous state to keep other properties unchanged
      selectedRestaurant: null,
      quantities: {},
      isDishFormVisible: false,
      addedDishes: {},
      notes: "",
      total: 0,
      pickupLocation: "",
    }));
  }

  const getUniqueOptions = (events, key) => {
    return [...new Set(events.flatMap(event => event[key]))];
  };

  const getAvailableRestaurants = (events) => {
    return restaurants.filter(restaurant =>
      events.some(event => event.restaurants.includes(restaurant.name)));
  };
  
  const handleSearch = async (date) => {
    resetEventsState();
    try {
      setError(null); // Clear previous errors
      const response = await fetch(`/api/adminConfig/openEvents?date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }
      const data = await response.json();
      setOpenEvents(data); // Store events in state
      setPickupLocations(getUniqueOptions(data, "pick_up_locations"));
      setAvailableRestaurants(getAvailableRestaurants(data));
      setEnableLocationsDropdown(true);
    } catch (err) {
      setError(err.message);
      resetEventsState();
    }
  };

  const updateOrderState = async (field, value) => {
    setOrderState((prev) => ({ ...prev, [field]: value }));
    if (field === 'date') {
      await handleSearch(value);
    }
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

  const handleQuantityChange = (dishId, action, restaurantId) => {
    setOrderState((prev) => {
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
        updatedDishes[restaurantId].push({
          id: `${newDish.id}-${uuidv4()}`,
          name: newDish.name || "Unknown",
          price: newDish.price === "SP" ? "SP" : newDish.price ?? 0, // 🔹 Ensure "SP" is preserved
          quantity: newDish.quantity ?? 0,
          selectedOptions: newDish.selectedOptions || [],
        });
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

    if (Object.values(newErrors).some((error) => error)) {
      handleClose();
      return;
    }
    const orderData = {
        wechatId: orderState.wechatId,
        pickupLocation: orderState.pickupLocation,
        date: orderState.date,
        orderDetails: JSON.stringify(
          Object.entries(orderState.addedDishes).reduce((acc, [restaurantId, dishes]) => {
            if (dishes.length > 0) {
              const restaurant = restaurants.find((r) => r.id === Number(restaurantId)); // Get restaurant name
              acc[restaurantId] = dishes.map((dish) => ({
                ...dish,
                restaurantName: restaurant ? restaurant.name : `Restaurant ${restaurantId}`, 
              }));
            }
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
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "95%", maxWidth: 800, margin: "auto", overflowX: "hidden"}}>
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

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h6"
            sx={{
              display: "inline-block", // Shrinks the clickable area
              padding: "4px 8px", // Reduce padding to limit clickable area
              fontWeight: "bold",
              fontFamily: "Poppins, sans-serif",
              cursor: "pointer",
              transition: "color 0.3s ease, transform 0.2s ease",
              "&:hover": {
                color: "primary.main",
                transform: "scale(1.05)",
              },
            }}
            onClick={() => navigate("/")}
          >
            Mak Delivery
          </Typography>
        </Box>

        {/* Right - Shopping Cart */}
        <IconButton>
          <Badge badgeContent={Object.keys(orderState.addedDishes).length > 0 ? Object.keys(orderState.addedDishes).length : null} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 12, minWidth: 20, height: 20 } }}> 
            <ShoppingCartIcon onClick={handleOpen} sx={{ fontSize: 30, color: "black" }}/>
          </Badge>
        </IconButton>
      </Box>
      {isOpen && (
        <Box
          sx={{
            position: "fixed",  // Make sure it stays fixed at the top
            width: "100%",      // Take the full width of the screen
            height: "100vh",    // Take the full height of the screen
            backgroundColor: "white",  // White background
            zIndex: 1300,       // Ensure it's above all content including the header
            display: "flex",     // Use flexbox to position the content
            flexDirection: "column",  // Stack content vertically
            alignItems: "center",     // Horizontally center content
            overflowX: "hidden"
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 10,
              left: 20,
              backgroundColor: "gray",
              color: "white",
              zIndex: 1100, // Ensure the button stays above all content
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <OrderSummary addedDishes={orderState.addedDishes} updateTotal={updateTotal} handleSubmit={handleSubmit}/>
      </Box>)}
      <Box sx={{ width: "100%", paddingTop: (theme) => `calc(${theme.mixins.toolbar.minHeight}px + 16px)` }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}> 
          Order
        </Typography>
        <Typography variant="h6" gutterBottom>
          Order Information
        </Typography>
        <TextField fullWidth label="WeChat ID" value={orderState.wechatId} onChange={(e) => updateOrderState("wechatId", e.target.value)} margin="normal" required error={orderState.errors?.wechatId} helperText={orderState.errors?.wechatId ? "WeChat ID is required" : ""}/>
        <TextField fullWidth label="Pick-up Date" type="date" value={orderState.date} onChange={(e) => updateOrderState("date", e.target.value)} margin="normal" required InputLabelProps={{ shrink: true }} error={orderState.errors?.date} helperText={orderState.errors?.date ? "Date is required" : ""}/>
        <TextField select fullWidth label="Pick-up Location" value={orderState.pickupLocation} onChange={(e) => updateOrderState("pickupLocation", e.target.value)} margin="normal" required error={orderState.errors?.pickupLocation} helperText={orderState.errors?.pickupLocation ? "Pick-up Location is required" : ""} disabled={!enableLocationsDropdown}>
          {pickupLocations.map((location, index) => (
            <MenuItem key={index} value={location}>
              {location}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Restaurant List
        </Typography>
        <List>
          {availableRestaurants.map((restaurant) => (
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
                      <div key={dish.id}>
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
                      <IconButton size="small" onClick={() => handleQuantityChange(dish.id, "reset", restaurant.id)}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                      </div>
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
    </Box>
  );
};

export default RestaurantList;
