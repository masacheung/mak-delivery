import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Drawer,
  Fade,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon,
  Restaurant as RestaurantIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
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
import YO_DESSERT_US from "../../constant/restaurants/yoDessert";

// Import restaurant images
import chefGeImage from "../../image/chef.webp";
import hkAlleyImage from "../../image/hk_alley.webp";
import jiBeiChuanImage from "../../image/jiBeiChuan.webp";
import meeTuImage from "../../image/meeTu.webp";
import missFlowerHotpotImage from "../../image/missFlowerHotpot.webp";
import newDaNoodlesImage from "../../image/newDaNoodles.webp";
import ninetyEightKImage from "../../image/nineEightk.webp";
import noodlesTimeImage from "../../image/noodlesTime.webp";
import spiceTwentyFourImage from "../../image/spiceTwentyFour.webp";
import syMiniHotpotImage from "../../image/syMiniHotpot.webp";
import tastyMomentImage from "../../image/tastyMoment.webp";
import wontonGuyImage from "../../image/wontonGuy.webp";
import yoDessertImage from "../../image/yoDessert.webp";
import youGardenImage from "../../image/youGarden.webp";

const EditExistingOrder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

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

  // Create image mapping using restaurant names from constants
  const imageMap = {
    '葛师傅': chefGeImage,
    '港茶巷 HK ALLEY': hkAlleyImage,
    '蜀香缘火锅': jiBeiChuanImage,
    '遇图': meeTuImage,
    '花小姐音乐火锅': missFlowerHotpotImage,
    '兰州拉面': newDaNoodlesImage,
    '九八堂': ninetyEightKImage,
    '面时代': noodlesTimeImage,
    '麻辣二十四': spiceTwentyFourImage,
    '思悦迷你火锅': syMiniHotpotImage,
    '香味时刻': tastyMomentImage,
    '馄饨先生': wontonGuyImage,
    '优の甜品': yoDessertImage,
    '又一村': youGardenImage,
  };

  const [orderState, setOrderState] = useState({
    orderId: null,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [isDishFormOpen, setIsDishFormOpen] = useState(false);

  useEffect(() => {
    if (orderData) {
      console.log('Order data:', orderData);
      const initialDate = new Date(orderData.pick_up_date).toISOString().split("T")[0];
      
      setOrderState({
        orderId: orderData.id,
        selectedRestaurant: null,
        quantities: {},
        isDishFormVisible: false,
        addedDishes: orderData.order_details,
        wechatId: orderData.wechat_id,
        pickupLocation: orderData.pick_up_location,
        date: initialDate,
        notes: orderData.notes || "",
        errors: {},
        total: orderData.total,
      });
      
      // Initialize search with the order date
      handleSearch(initialDate);
    }
  }, [orderData]);

  const resetEventsState = () => {
    setOpenEvents([]);
    setPickupLocations([]);
    setAvailableRestaurants([]);
    setEnableLocationsDropdown(false);
    setOrderState((prevState) => ({
      ...prevState,
      selectedRestaurant: null,
      quantities: {},
      isDishFormVisible: false,
      addedDishes: orderData?.order_details || {},
      notes: orderData?.notes || "",
      total: orderData?.total || 0,
      pickupLocation: orderData?.pick_up_location || "",
    }));
  };

  const getUniqueOptions = (events, key) => {
    return [...new Set(events.flatMap(event => event[key]))];
  };

  const getAvailableRestaurants = (events) => {
    return restaurants.filter(restaurant =>
      events.some(event => event.restaurants.includes(restaurant.name)));
  };
  
  const handleSearch = async (date) => {
    if (!date) return;
    
    setLoading(true);
    resetEventsState();
    
    try {
      setError("");
      const response = await fetch(`/api/adminConfig/openEvents?date=${date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }
      const data = await response.json();
      setOpenEvents(data);
      setPickupLocations(getUniqueOptions(data, "pick_up_locations"));
      setAvailableRestaurants(getAvailableRestaurants(data));
      setEnableLocationsDropdown(true);
    } catch (err) {
      setError(err.message);
      resetEventsState();
    } finally {
      setLoading(false);
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
      setOrderState((prev) => ({
        ...prev,
        isDishFormVisible: false,
        selectedRestaurant: null,
      }));
      setIsDishFormOpen(false);
    } else {
      setOrderState((prev) => ({
        ...prev,
        selectedRestaurant: restaurant,
        isDishFormVisible: true,
      }));
      setIsDishFormOpen(true);

      if (!orderState.quantities[restaurant.id]) {
        const initialQuantities = restaurant.dishes.reduce(
          (acc, dish) => ({ ...acc, [dish.id]: 0 }),
          {}
        );
        setOrderState((prev) => ({
          ...prev,
          quantities: { ...prev.quantities, [restaurant.id]: initialQuantities },
        }));
      }
    }
  };

  const handleCloseDishForm = () => {
    setOrderState((prev) => ({
      ...prev,
      isDishFormVisible: false,
      selectedRestaurant: null,
    }));
    setIsDishFormOpen(false);
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
          price: newDish.price === "SP" ? "SP" : newDish.price ?? 0,
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
      newErrors.noOrders = true;
    }

    updateOrderState("errors", newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setIsOrderSummaryOpen(false);
      return;
    }

    const orderData = {
      orderId: orderState.orderId,
      wechatId: orderState.wechatId,
      pickupLocation: orderState.pickupLocation,
      date: orderState.date,
      orderDetails: JSON.stringify(
        Object.entries(orderState.addedDishes).reduce((acc, [restaurantId, dishes]) => {
          if (dishes.length > 0) {
            const restaurant = restaurants.find((r) => r.id === Number(restaurantId));
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
      const response = await fetch(`/api/orders/update/${orderState.orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to update order");

      const result = await response.json();
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
      console.error("Error updating order:", error);
    }
  };

  const getTotalItemsCount = () => {
    return Object.values(orderState.addedDishes).reduce((total, dishes) => total + dishes.length, 0);
  };

  const handleRemoveDish = (restaurantId, dishId) => {
    setOrderState((prev) => {
      // Remove from addedDishes
      const updatedAddedDishes = { ...prev.addedDishes };
      if (updatedAddedDishes[restaurantId]) {
        updatedAddedDishes[restaurantId] = updatedAddedDishes[restaurantId].filter(dish => dish.id !== dishId);
        
        // Clean up empty restaurant arrays
        if (updatedAddedDishes[restaurantId].length === 0) {
          delete updatedAddedDishes[restaurantId];
        }
      }

      // For existing dishes, we might need to extract the base dish ID
      // Existing dishes may have IDs like "originalId-uuid"
      let baseDishId = dishId;
      if (dishId.includes('-')) {
        baseDishId = dishId.split('-')[0];
      }

      // Also reset quantities if this dish exists in quantities state
      const updatedQuantities = { ...prev.quantities };
      if (updatedQuantities[restaurantId]) {
        // Try both the full ID and base ID
        if (updatedQuantities[restaurantId][dishId] !== undefined) {
          updatedQuantities[restaurantId] = { 
            ...updatedQuantities[restaurantId], 
            [dishId]: 0 
          };
        } else if (updatedQuantities[restaurantId][baseDishId] !== undefined) {
          updatedQuantities[restaurantId] = { 
            ...updatedQuantities[restaurantId], 
            [baseDishId]: 0 
          };
        }
      }

      return {
        ...prev,
        addedDishes: updatedAddedDishes,
        quantities: updatedQuantities,
      };
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          color: 'black',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img 
              src="/delivery-truck.png" 
              alt="Logo" 
              style={{ width: isMobile ? 30 : 40, height: isMobile ? 30 : 40 }} 
            />
          </Box>
          
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              textAlign: 'center',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Poppins, sans-serif',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease',
              }
            }}
            onClick={() => navigate("/")}
          >
            {isMobile ? "Edit Order" : "Edit Order - Mak Delivery"}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={() => navigate("/")}
              sx={{ 
                color: 'inherit',
                '&:hover': { 
                  background: 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <HomeIcon />
            </IconButton>
            
            <IconButton
              onClick={() => setIsOrderSummaryOpen(true)}
              sx={{ 
                color: 'inherit',
                '&:hover': { 
                  background: 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Badge 
                badgeContent={getTotalItemsCount()} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '0.75rem',
                    minWidth: 20,
                    height: 20,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <Fade in={true} timeout={1000}>
          <Box>
            {/* Hero Section */}
            <Paper
              elevation={8}
              sx={{
                p: 4,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              <EditIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: isMobile ? '1.8rem' : '2.5rem',
                }}
              >
                Edit Your Order
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Modify your existing order details and dishes
              </Typography>
            </Paper>

            {/* Order Information Section */}
            <Paper
              elevation={8}
              sx={{
                p: 4,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  Order Information
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="WeChat ID"
                    value={orderState.wechatId}
                    onChange={(e) => updateOrderState("wechatId", e.target.value)}
                    required
                    error={orderState.errors?.wechatId}
                    helperText={orderState.errors?.wechatId ? "WeChat ID is required" : ""}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pick-up Date"
                    type="date"
                    value={orderState.date}
                    onChange={(e) => updateOrderState("date", e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    error={orderState.errors?.date}
                    helperText={orderState.errors?.date ? "Date is required" : ""}
                    InputProps={{
                      startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Pick-up Location"
                    value={orderState.pickupLocation}
                    onChange={(e) => updateOrderState("pickupLocation", e.target.value)}
                    required
                    error={orderState.errors?.pickupLocation}
                    helperText={orderState.errors?.pickupLocation ? "Pick-up Location is required" : ""}
                    disabled={!enableLocationsDropdown}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  >
                    {pickupLocations.map((location, index) => (
                      <MenuItem key={index} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    multiline
                    rows={3}
                    value={orderState.notes}
                    onChange={(e) => setOrderState(prev => ({ ...prev, notes: e.target.value }))}
                    InputProps={{
                      startAdornment: <NotesIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress sx={{ color: '#667eea' }} />
              </Box>
            )}

            {/* Error State */}
            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}

            {/* Restaurant List */}
            {availableRestaurants.length > 0 && (
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <RestaurantIcon sx={{ mr: 1, color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                    Available Restaurants
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {availableRestaurants.map((restaurant) => (
                    <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                          },
                        }}
                        onClick={() => handleSelectRestaurant(restaurant)}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={imageMap[restaurant.name] || "/delivery-truck.png"}
                          alt={restaurant.name}
                          sx={{
                            objectFit: 'cover',
                            borderRadius: '8px 8px 0 0',
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Typography 
                            variant="h6" 
                            component="h2" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: '#333',
                              mb: 2,
                              textAlign: 'center',
                            }}
                          >
                            {restaurant.name}
                          </Typography>
                          
                                                     {/* Show added dishes */}
                           {orderState.addedDishes[restaurant.id]?.length > 0 && (
                             <Box sx={{ mt: 2 }}>
                               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                 Added Dishes:
                               </Typography>
                               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                 {orderState.addedDishes[restaurant.id].map((dish) => (
                                   <Box 
                                     key={dish.id} 
                                     sx={{ 
                                       display: 'flex', 
                                       alignItems: 'center', 
                                       gap: 1,
                                       p: 1,
                                       borderRadius: 1,
                                       border: '1px solid #e0e0e0',
                                       background: 'rgba(255, 255, 255, 0.8)',
                                     }}
                                   >
                                     <Box sx={{ flex: 1, minWidth: 0 }}>
                                       <Typography 
                                         variant="caption" 
                                         sx={{
                                           fontSize: '0.75rem',
                                           fontWeight: 'bold',
                                           color: '#333',
                                           wordWrap: 'break-word',
                                           overflow: 'hidden',
                                           display: '-webkit-box',
                                           WebkitLineClamp: 2,
                                           WebkitBoxOrient: 'vertical',
                                           lineHeight: 1.2,
                                         }}
                                       >
                                         {dish.name}
                                       </Typography>
                                       <Typography 
                                         variant="caption" 
                                         sx={{
                                           fontSize: '0.65rem',
                                           color: '#666',
                                           fontWeight: 'bold',
                                         }}
                                       >
                                         Qty: {dish.quantity}
                                       </Typography>
                                     </Box>
                                     <IconButton
                                       size="small"
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         handleRemoveDish(restaurant.id, dish.id);
                                       }}
                                       sx={{ 
                                         width: 24, 
                                         height: 24,
                                         color: '#ff6b6b',
                                         backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                         border: '1px solid #ff6b6b',
                                         '&:hover': { 
                                           backgroundColor: 'rgba(255, 107, 107, 0.2)',
                                           transform: 'scale(1.1)',
                                         }
                                       }}
                                     >
                                       <ClearIcon sx={{ fontSize: 16 }} />
                                     </IconButton>
                                   </Box>
                                 ))}
                               </Box>
                             </Box>
                           )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {/* Empty State */}
            {!loading && availableRestaurants.length === 0 && orderState.date && (
              <Paper
                elevation={8}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                }}
              >
                <RestaurantIcon sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No restaurants available for this date
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please select a different date or check back later
                </Typography>
              </Paper>
            )}
          </Box>
        </Fade>
      </Container>

             {/* Order Summary Drawer */}
       <Drawer
         anchor="bottom"
         open={isOrderSummaryOpen}
         onClose={() => setIsOrderSummaryOpen(false)}
         PaperProps={{
           sx: {
             maxHeight: '90vh',
             borderRadius: '20px 20px 0 0',
             background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
             backdropFilter: 'blur(10px)',
           }
         }}
       >
         <OrderSummary 
           orderState={orderState}
           updateOrderState={updateOrderState}
           onClose={() => setIsOrderSummaryOpen(false)}
           onSubmit={handleSubmit}
           updateTotal={updateTotal}
         />
       </Drawer>

      {/* Dish Form Drawer */}
      <Drawer
        anchor="bottom"
        open={isDishFormOpen}
        onClose={handleCloseDishForm}
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            borderRadius: '20px 20px 0 0',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
              {orderState.selectedRestaurant?.name} - Menu
            </Typography>
            <IconButton onClick={handleCloseDishForm}>
              <CloseIcon />
            </IconButton>
          </Box>
          {orderState.selectedRestaurant && (
            <DishForm
              restaurant={orderState.selectedRestaurant}
              quantities={orderState.quantities[orderState.selectedRestaurant.id]}
              onQuantityChange={handleQuantityChange}
              onClose={handleCloseDishForm}
              onAddDish={handleAddDish}
            />
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default EditExistingOrder;
