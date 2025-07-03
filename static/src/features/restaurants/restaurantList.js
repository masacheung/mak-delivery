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
  Badge,
  Container,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  Avatar
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FilterListIcon from '@mui/icons-material/FilterList';
import { v4 as uuidv4 } from 'uuid';
import DishForm from "../dishes/dishForm";
import OrderSummary from "../order/orderSummary";
import MoreMenu from "../headerSection/menu/more";
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

const RestaurantList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

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
  const [showMenu, setShowMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    resetEventsState();
    setIsLoading(true);
    try {
      setError(null);
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
      setIsLoading(false);
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
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to submit order");

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
      console.error("Error submitting order:", error);
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
      '牛大 NewDa Noodles': newDaNoodlesImg
    };
    return imageMap[restaurantName] || chefImg;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
            onClick={() => navigate(-1)}
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
            {!isMobile && (
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  color: "primary.main",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                <FilterListIcon />
              </IconButton>
            )}
            <IconButton
              onClick={handleOpen}
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
          padding: isMobile ? "80px 16px 24px" : "80px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Filters Section */}
        <Slide direction="down" in={true} timeout={500}>
          <Paper
            elevation={0}
            className="form-container"
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
              Select Date & Location
            </Typography>
            
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                alignItems: isMobile ? "stretch" : "center",
              }}
            >
              <TextField
                label="Date"
                type="date"
                value={orderState.date}
                onChange={(e) => updateOrderState("date", e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth={isMobile}
                sx={{
                  minWidth: isMobile ? "100%" : "200px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              
              <TextField
                select
                label="Pickup Location"
                value={orderState.pickupLocation}
                onChange={(e) => updateOrderState("pickupLocation", e.target.value)}
                disabled={!enableLocationsDropdown}
                fullWidth={isMobile}
                sx={{
                  minWidth: isMobile ? "100%" : "250px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                {pickupLocations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {error && (
              <Box className="error-message" sx={{ marginTop: 2 }}>
                <Typography>{error}</Typography>
              </Box>
            )}
          </Paper>
        </Slide>

        {/* Restaurant Grid */}
        {availableRestaurants.length > 0 && (
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
                Available Restaurants
              </Typography>
              
              <Grid
                container
                spacing={isMobile ? 2 : 3}
                sx={{ marginBottom: 4 }}
              >
                {availableRestaurants.map((restaurant) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={restaurant.id}
                  >
                    <Card
                      className="restaurant-card"
                      sx={{
                        cursor: "pointer",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
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
                        height="200"
                        image={getRestaurantImage(restaurant.name)}
                        alt={restaurant.name}
                        sx={{
                          objectFit: "cover",
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
                            {restaurant.description || "Delicious food awaits!"}
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
                  </Grid>
                ))}
              </Grid>
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
        {!isLoading && availableRestaurants.length === 0 && orderState.date && (
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
            quantities={orderState.quantities[orderState.selectedRestaurant.id] || {}}
            onQuantityChange={handleQuantityChange}
            onAddDish={handleAddDish}
            onClose={handleCloseDishForm}
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
            maxHeight: "90vh",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "visible",
          },
        }}
      >
        <OrderSummary
          orderState={orderState}
          updateOrderState={updateOrderState}
          onClose={handleClose}
          onSubmit={handleSubmit}
          updateTotal={updateTotal}
        />
      </Drawer>
    </Box>
  );
};

export default RestaurantList;
