import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../utils/apiClient";
import {
  Box,
  Typography,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Badge,
  Container,
  Paper,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Drawer,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { v4 as uuidv4 } from 'uuid';
import DishForm from "../dishes/dishForm";
import OrderSummary from "../order/orderSummary";
import PickupNotificationBell from "../../components/PickupNotificationBell";
import AvailablePickupDates from './AvailablePickupDates';
import CartReviewButton from '../order/CartReviewButton';
import { pickupLocationDetails } from '../../utils/pickupLocation';
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
import ALL_BLUE_CHINESE_CUISINE from "../../constant/restaurants/allBlueChineseCuisine";
import CHOPSTICKS_CHARM from "../../constant/restaurants/chopsticksCharm";

// Import restaurant images
import tastyMomentImg from "../../image/tastyMoment.webp";
import chefImg from "../../image/chef.webp";
import spiceTwentyFourImg from "../../image/spiceTwentyFour.webp";
import wontonGuyImg from "../../image/wontonGuy.webp";
import jiBeiChuanImg from "../../image/jiBeiChuan.webp";
import missFlowerHotpotImg from "../../image/missFlowerHotpot.webp";
import syMiniHotpotImg from "../../image/syMiniHotpot.webp";
import youGardenImg from "../../image/youGarden.webp";
import nineEightkImg from "../../image/nineEightk.webp";
import hkAlleyImg from "../../image/hk_alley.webp";
import meeTuImg from "../../image/meeTu.webp";
import yoDessertImg from "../../image/yoDessert.webp";
import noodlesTimeImg from "../../image/noodlesTime.webp";
import newDaNoodlesImg from "../../image/newDaNoodles.webp";
import allBlueChineseCuisineImg from "../../image/allBlueChineseCuisine.jpg";
import chopsticksCharmImage from "../../image/chopsticksCharm.jpg";

const RestaurantList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

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
    NEW_DA_NOODLES,
    ALL_BLUE_CHINESE_CUISINE,
    CHOPSTICKS_CHARM
  ];

  const [orderState, setOrderState] = useState({
    selectedRestaurant: null,
    quantities: {},
    isDishFormVisible: false,
    addedDishes: {},
    username: "",
    pickupLocation: "",
    date: "",
    notes: "",
    errors: {},
    total: 0,
  });
  const [openEvents, setOpenEvents] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [enableLocationsDropdown, setEnableLocationsDropdown] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const eventRequestId = useRef(0);
  const [submitError, setSubmitError] = useState('');
  const [restaurantSearch, setRestaurantSearch] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Set username from logged-in user
  useEffect(() => {
    if (user?.username) {
      setOrderState((prev) => ({ ...prev, username: user.username }));
    }
  }, [user]);

  const resetEventsState = () => {
    setOpenEvents([]);
    setPickupLocations([]);
    setEnableLocationsDropdown(false);
    setOrderState((prevState) => ({
      ...prevState,
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
    const currentRequest = ++eventRequestId.current;
    resetEventsState();
    if (!date) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      setError(null);
      const response = await apiFetch(`/api/adminConfig/openEvents?date=${date}`, {
        auth: "none",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }
      const data = await response.json();
      if (eventRequestId.current !== currentRequest) return;
      setOpenEvents(data);
      setPickupLocations(getUniqueOptions(data, "pick_up_locations"));
      setEnableLocationsDropdown(true);
    } catch (err) {
      if (eventRequestId.current !== currentRequest) return;
      setError(err.message);
      resetEventsState();
    } finally {
      if (eventRequestId.current === currentRequest) setIsLoading(false);
    }
  };

  const updateOrderState = async (field, value) => {
    if (field === 'date' && value === orderState.date) return;
    if (field === 'date' && value !== orderState.date && Object.values(orderState.addedDishes).some(dishes => dishes.length)) {
      if (!window.confirm('Changing the pickup date clears your cart. Continue?')) return;
    }
    if (field === 'pickupLocation' && value !== orderState.pickupLocation) {
      const allowed = getAvailableRestaurants(openEvents.filter(event => event.pick_up_locations.includes(value)));
      const invalidCart = Object.entries(orderState.addedDishes).some(([id, dishes]) => dishes.length && !allowed.some(r => String(r.id) === id));
      if (invalidCart && !window.confirm('Some dishes are unavailable at this location. Changing location clears your cart. Continue?')) return;
      if (invalidCart) setOrderState(prev => ({ ...prev, addedDishes: {}, quantities: {}, total: 0 }));
    }
    setOrderState((prev) => ({ ...prev, [field]: value }));
    if (field === 'date') {
      await handleSearch(value);
    }
  };

  const updateTotal = useCallback((total) => {
    setOrderState((prevState) => ({
      ...prevState,
      total,
    }));
  }, []);

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

      const updatedDishes = { ...prev.addedDishes };
      if (updatedQuantities[dishId] === 0) {
        updatedDishes[restaurantId] = updatedDishes[restaurantId]?.filter(dish => dish.id !== dishId) || [];
      }

      return {
        ...prev,
        quantities: {
          ...prev.quantities,
          [restaurantId]: updatedQuantities,
        },
        addedDishes: updatedDishes,
      };
    });
  };

  const handleAddDish = (restaurantId, selectedDishes) => {
    setOrderState((prev) => {
      const updatedDishes = { ...prev.addedDishes };
      updatedDishes[restaurantId] = [...(updatedDishes[restaurantId] || [])];

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
    if (submittingRef.current) return;
    setSubmitError('');
    let newErrors = {
      username: !orderState.username,
      pickupLocation: !orderState.pickupLocation,
      date: !orderState.date,
    };

    const hasOrders = Object.values(orderState.addedDishes).some((dishes) => dishes.length > 0);
    if (!hasOrders) {
      newErrors.noOrders = true;
    }

    updateOrderState("errors", newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      handleClose();
      return;
    }
    const orderData = {
        username: orderState.username,
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

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const response = await apiFetch("/api/orders", {
        method: "POST",
        auth: "user",
        body: orderData,
      });

      if (!response.ok) throw new Error("Failed to submit order");

      const result = await response.json();

      navigate("/ordered", { state: { order: result.order } });

      setOrderState({
        selectedRestaurant: null,
        quantities: {},
        isDishFormVisible: false,
        addedDishes: {},
        username: "",
        pickupLocation: "",
        date: "",
        errors: {},
        total: 0,
      });
    } catch (error) {
      setSubmitError('Unable to submit your order. Please try again.');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const getCartItemCount = () => {
    return Object.values(orderState.addedDishes).reduce((total, restaurantDishes) => {
      return total + restaurantDishes.reduce((subtotal, dish) => subtotal + dish.quantity, 0);
    }, 0);
  };

  const getRestaurantImage = (restaurantName) => {
    const imageMap = {
      'Tasty Moment': tastyMomentImg,
      '葛师傅': chefImg,
      'Spice 24': spiceTwentyFourImg,
      '雲吞佳': wontonGuyImg,
      '季北川': jiBeiChuanImg,
      '花小娇金汤花胶鸡': missFlowerHotpotImg,
      'S&Y Mini HotPot 蜀世冒菜': syMiniHotpotImg,
      '豫園': youGardenImg,
      '98K': nineEightkImg,
      '港茶巷 HK ALLEY': hkAlleyImg,
      'Meetu': meeTuImg,
      'Yo Dessert us': yoDessertImg,
      '面缘': noodlesTimeImg,
      '牛大 NewDa Noodles': newDaNoodlesImg,
      '四海 All Blue Chinese Cuisine': allBlueChineseCuisineImg,
      'Chopsticks Charm': chopsticksCharmImage
    };
    return imageMap[restaurantName] || chefImg;
  };

  const locationRestaurants = orderState.pickupLocation
    ? getAvailableRestaurants(openEvents.filter(event => event.pick_up_locations.includes(orderState.pickupLocation)))
    : [];
  const visibleRestaurants = locationRestaurants.filter(restaurant => restaurant.name.toLowerCase().includes(restaurantSearch.toLowerCase()));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f7f7fb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "0 16px" : "0 24px",
          }}
        >
          <IconButton
            aria-label="Back to home"
            onClick={() => navigate("/")}
            sx={{
              color: "primary.main",
              transition: "all 0.3s ease",
              "&:hover": { transform: "scale(1.1)" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant={isMobile ? "h6" : "h5"}
            className="app-title"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            Restaurants
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PickupNotificationBell enabled={Boolean(user)} isMobile={isMobile} />
            <IconButton
              onClick={handleOpen}
              aria-label="View cart"
              sx={{
                color: "primary.main",
                transition: "all 0.3s ease",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <Badge
                badgeContent={getCartItemCount()}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#FF6B6B",
                    color: "white",
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          padding: isMobile ? "80px 16px 110px" : "88px 24px 110px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Filters Section */}
        <Slide direction="down" in={true} timeout={500}>
          <Paper
            elevation={0}
            sx={{
              padding: isMobile ? "16px" : "24px",
              marginBottom: 2,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: 2,
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              1. Choose your pickup
            </Typography>
            
            <AvailablePickupDates value={orderState.date} onChange={date => updateOrderState('date', date)} />
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                alignItems: isMobile ? "stretch" : "center",
              }}
            >
              <TextField
                select
                label="Pickup Location"
                value={orderState.pickupLocation}
                onChange={(e) => updateOrderState("pickupLocation", e.target.value)}
                disabled={!enableLocationsDropdown}
                error={Boolean(orderState.errors.pickupLocation)}
                helperText={!orderState.date ? 'Choose a date first' : 'Select where you will collect your order'}
                SelectProps={{ renderValue: location => pickupLocationDetails(location).name, MenuProps: { PaperProps: { sx: { maxWidth: 'calc(100vw - 32px)' } } } }}
                fullWidth={isMobile}
                sx={{
                  minWidth: isMobile ? "100%" : "250px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                {pickupLocations.map((location) => (
                  <MenuItem key={location} value={location} sx={{ whiteSpace: 'normal', py: 1.5 }}>
                    <Box><Typography fontWeight={700}>{pickupLocationDetails(location).name}</Typography><Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{location}</Typography></Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            {orderState.pickupLocation && <Typography variant="body2" color="text.secondary" sx={{ mt: 1, overflowWrap: 'anywhere' }}>{orderState.pickupLocation}</Typography>}

            {error && (
              <Box className="error-message" sx={{ marginTop: 2 }}>
                <Typography>{error}</Typography>
              </Box>
            )}
          </Paper>
        </Slide>

        {/* Restaurant Grid */}
        {locationRestaurants.length > 0 && !isLoading && (
          <Fade in={true} timeout={800}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  marginBottom: 3,
                  fontWeight: 600,
                  color: "primary.main",
                  textAlign: "center",
                }}
              >
                2. Choose a restaurant
              </Typography>
              <TextField fullWidth label="Search restaurants" value={restaurantSearch} onChange={e => setRestaurantSearch(e.target.value)} sx={{ mb: 2 }} />
              {!visibleRestaurants.length && <Typography sx={{ mb: 2 }}>No restaurants match your search.</Typography>}
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
                {visibleRestaurants.map((restaurant) => (
                  <Box key={restaurant.id}>
                    <Card
                      component="button"
                      type="button"
                      className="restaurant-card"
                      sx={{
                        cursor: "pointer",
                        width: '100%',
                        textAlign: 'left',
                        font: 'inherit',
                        p: 0,
                        border: '1px solid #e5e5ef',
                        height: "100%",
                        display: "flex",
                        flexDirection: isMobile ? "row" : "column",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                      onClick={() => handleSelectRestaurant(restaurant)}
                    >
                      <CardMedia
                        component="img"
                        height={isMobile ? '116' : '180'}
                        loading="lazy"
                        image={getRestaurantImage(restaurant.name)}
                        alt={restaurant.name}
                        sx={{
                          objectFit: "cover",
                          width: isMobile ? 104 : '100%',
                          flexShrink: 0,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                      <CardContent
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: isMobile ? "16px" : "20px",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: isMobile ? '1rem' : '1.2rem',
                              marginBottom: 1,
                              color: "primary.main",
                            }}
                          >
                            {restaurant.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ marginBottom: 2 }}
                          >
                          {restaurant.description || "View menu & choose your dishes"}
                          </Typography>
                        </Box>
                        
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            icon={<RestaurantIcon />}
                            label={`${restaurant.dishes.length} dishes`}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(102, 126, 234, 0.1)",
                              color: "primary.main",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "success.main",
                            }}
                          >
                            Available
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <div className="loading-spinner" />
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && !orderState.pickupLocation && (
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography fontWeight={700}>{orderState.date ? 'Choose your pickup location to see restaurants' : 'Good food starts here'}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Select a date and pickup location above to browse available menus.</Typography>
          </Paper>
        )}
        {!isLoading && locationRestaurants.length === 0 && orderState.pickupLocation && orderState.date && (
          <Paper
            elevation={0}
            sx={{
              padding: isMobile ? "32px 16px" : "48px 32px",
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: 2,
                color: "text.secondary",
              }}
            >
              No restaurants available for this date and location
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try selecting a different date or location
            </Typography>
          </Paper>
        )}
      </Container>
      {getCartItemCount() > 0 && <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }}>
        <CartReviewButton addedDishes={orderState.addedDishes} onClick={handleOpen} />
      </Box>}

      {/* Dish Form Modal */}
      <Drawer
        anchor="right"
        open={orderState.isDishFormVisible}
        onClose={handleCloseDishForm}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : "500px",
            maxWidth: "100%",
          },
        }}
      >
        {orderState.selectedRestaurant && (
          <DishForm
            restaurant={orderState.selectedRestaurant}
            key={orderState.selectedRestaurant.id}
            quantities={orderState.quantities[orderState.selectedRestaurant.id] || {}}
            onQuantityChange={handleQuantityChange}
            onAddDish={handleAddDish}
            onClose={handleCloseDishForm}
            cartReview={<CartReviewButton addedDishes={orderState.addedDishes} onClick={() => { handleCloseDishForm(); handleOpen(); }} />}
          />
        )}
      </Drawer>

      {/* Order Summary Modal */}
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: "90dvh",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
          },
        }}
      >
        <OrderSummary
          orderState={orderState}
          updateOrderState={updateOrderState}
          onClose={handleClose}
          onSubmit={handleSubmit}
          updateTotal={updateTotal}
          submitting={submitting}
          submitError={submitError}
        />
      </Drawer>
    </Box>
  );
};

export default RestaurantList;
