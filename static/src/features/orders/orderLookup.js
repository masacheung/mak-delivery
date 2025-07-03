import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  useTheme, 
  useMediaQuery,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  Fade,
  Slide
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ReceiptIcon from '@mui/icons-material/Receipt';

const OrderLookup = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  const [username, setUsername] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];
  const [pickUpDate, setPickUpDate] = useState("");
  const [disableEdit, setDisableEdit] = useState(true);

  // Set username from logged-in user
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleLookup = async () => {
    if (!username || !orderId) {
      setError("Please enter both Username and Order ID.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/orders?username=${username}&orderId=${orderId}`);
      if (!response.ok) throw new Error("Order not found");

      const data = await response.json();
      console.log(data);
      setOrderData(data);
      setPickUpDate(new Date(data.pick_up_date).toISOString().split("T")[0]);
      setDisableEdit(data.pick_up_date >= currentDate);
      console.log(new Date(data.pick_up_date).toISOString().split("T")[0]);
      console.log(currentDate);
    } catch (err) {
      setOrderData(null);
      setError("Order not found. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "16px" : "24px",
      }}
    >
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              padding: isMobile ? "32px 24px" : "48px 40px",
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Header */}
            <Box sx={{ marginBottom: 4 }}>
              <SearchIcon 
                sx={{ 
                  fontSize: 48, 
                  color: "primary.main", 
                  marginBottom: 2 
                }} 
              />
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  marginBottom: 1,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Order Lookup
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: "text.secondary",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                Enter your order details to view and manage your delivery order
              </Typography>
            </Box>

            {/* Search Form */}
            <Box sx={{ marginBottom: 4 }}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Order ID"
                variant="outlined"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                sx={{
                  marginBottom: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <AssignmentIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />
              <Button 
                variant="contained" 
                size="large"
                fullWidth 
                onClick={handleLookup}
                disabled={loading}
                sx={{
                  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  borderRadius: "50px",
                  height: 56,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(255, 105, 135, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(255, 105, 135, 0.5)",
                  },
                }}
              >
                {loading ? "Searching..." : "Search Order"}
              </Button>
            </Box>

            {/* Error Message */}
            {error && (
              <Slide direction="up" in={!!error} timeout={300}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    marginBottom: 3,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              </Slide>
            )}

            {/* Order Details */}
            {orderData && (
              <Slide direction="up" in={!!orderData} timeout={500}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    textAlign: "left",
                  }}
                >
                  <CardContent sx={{ padding: isMobile ? "24px" : "32px" }}>
                    {/* Order Header */}
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
                      <ReceiptIcon sx={{ color: "primary.main", marginRight: 1 }} />
                      <Typography 
                        variant="h5" 
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                        }}
                      >
                        Order Details
                      </Typography>
                    </Box>

                    {/* Order Info Grid */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 600 }}>Username:</Typography>
                        </Box>
                        <Chip 
                          label={orderData.username} 
                          size="small"
                          sx={{ 
                            backgroundColor: "rgba(102, 126, 234, 0.1)",
                            color: "primary.main",
                            fontWeight: 600,
                          }}
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AssignmentIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 600 }}>Order ID:</Typography>
                        </Box>
                        <Chip 
                          label={orderData.id} 
                          size="small"
                          sx={{ 
                            backgroundColor: "rgba(76, 175, 80, 0.1)",
                            color: "success.main",
                            fontWeight: 600,
                          }}
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOnIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 600 }}>Pickup Location:</Typography>
                        </Box>
                        <Typography sx={{ textAlign: "right", maxWidth: "200px" }}>
                          {orderData.pick_up_location}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <DateRangeIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 600 }}>Pickup Date:</Typography>
                        </Box>
                        <Typography sx={{ textAlign: "right" }}>
                          {orderData.pick_up_date ? new Date(orderData.pick_up_date).toISOString().split("T")[0] : ""}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AttachMoneyIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 600 }}>Total:</Typography>
                        </Box>
                        <Chip 
                          label={`$${Number(orderData?.total || 0).toFixed(2)}`}
                          size="small"
                          sx={{ 
                            backgroundColor: "rgba(255, 107, 107, 0.1)",
                            color: "error.main",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Disclaimer */}
                    <Alert 
                      severity="info" 
                      sx={{ 
                        marginBottom: 3,
                        borderRadius: 2,
                        backgroundColor: "rgba(33, 150, 243, 0.1)",
                      }}
                    >
                      The total shown is for reference only and may vary at delivery time.
                    </Alert>

                    {/* Notes */}
                    {orderData.notes && (
                      <Box sx={{ marginBottom: 3 }}>
                        <Typography sx={{ fontWeight: 600, marginBottom: 1 }}>Notes:</Typography>
                        <Paper
                          sx={{
                            padding: 2,
                            backgroundColor: "rgba(0, 0, 0, 0.03)",
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body2">{orderData.notes}</Typography>
                        </Paper>
                      </Box>
                    )}

                    {/* Ordered Dishes */}
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          marginBottom: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <RestaurantIcon sx={{ color: "primary.main" }} />
                        Ordered Dishes
                      </Typography>

                      {orderData.order_details &&
                        Object.entries(orderData.order_details).map(([restaurantId, dishes]) => (
                          <Card 
                            key={restaurantId} 
                            sx={{ 
                              marginBottom: 2,
                              backgroundColor: "rgba(255, 255, 255, 0.7)",
                              borderRadius: 2,
                            }}
                          >
                            <CardContent sx={{ padding: "16px !important" }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: "primary.main",
                                  marginBottom: 1,
                                }}
                              >
                                {dishes[0]?.restaurantName}
                              </Typography>

                              <List dense>
                                {dishes.map((dish, index) => (
                                  <ListItem 
                                    key={dish.id}
                                    sx={{
                                      padding: "4px 0",
                                      borderBottom: index < dishes.length - 1 ? "1px solid rgba(0, 0, 0, 0.05)" : "none",
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                          {index + 1}. {dish.name}
                                          {dish.selectedOptions && Object.keys(dish.selectedOptions).length > 0 && (
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                display: "block",
                                                color: "text.secondary",
                                                fontStyle: "italic",
                                              }}
                                            >
                                              ({Object.entries(dish.selectedOptions)
                                                .map(([optionKey, selected]) => selected.join(", "))
                                                .join("; ")})
                                            </Typography>
                                          )}
                                        </Typography>
                                      }
                                      secondary={
                                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                          Quantity: {dish.quantity}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                          </Card>
                        ))}
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, marginTop: 3 }}>
              {orderData && (
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate("/edit-order", { state: { orderData } })}
                  disabled={!disableEdit}
                  sx={{
                    background: disableEdit ? "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)" : "rgba(0, 0, 0, 0.12)",
                    borderRadius: "50px",
                    height: 48,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    flex: 1,
                    boxShadow: disableEdit ? "0 4px 15px rgba(76, 175, 80, 0.4)" : "none",
                    "&:hover": {
                      transform: disableEdit ? "translateY(-2px)" : "none",
                      boxShadow: disableEdit ? "0 6px 20px rgba(76, 175, 80, 0.5)" : "none",
                    },
                  }}
                >
                  <EditIcon sx={{ marginRight: 1 }} />
                  {disableEdit ? "Edit Order" : "Too Late to Edit"}
                </Button>
              )}
              
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate("/")}
                sx={{
                  borderRadius: "50px",
                  height: 48,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  flex: 1,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <HomeIcon sx={{ marginRight: 1 }} />
                Go to Home
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default OrderLookup;
