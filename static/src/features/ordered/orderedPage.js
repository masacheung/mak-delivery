import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  Alert,
  Container,
  Fade,
  Slide
} from "@mui/material";
import PaymentMethod from "../paymentMethod/paymentMethod";
import { useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PaymentIcon from '@mui/icons-material/Payment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import NotesIcon from '@mui/icons-material/Notes';
import ReceiptIcon from '@mui/icons-material/Receipt';

const OrderedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const order = location.state?.order;
  const [showPaymentMethod, setPaymentMethod] = useState(false);

  if (!order) {
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
              <Typography variant="h5" sx={{ fontWeight: 600, color: "text.secondary" }}>
                No order found
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 2, color: "text.secondary" }}>
                Please navigate from a valid order confirmation.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{
                  marginTop: 3,
                  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  borderRadius: "50px",
                  height: 48,
                  paddingX: 3,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Go to Home
              </Button>
            </Paper>
          </Fade>
        </Container>
      </Box>
    );
  }

  const orderDetails = typeof order.order_details === "string"
      ? JSON.parse(order.order_details)
      : order.order_details;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
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
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Success Header */}
            <Box sx={{ textAlign: "center", marginBottom: 4 }}>
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 64, 
                  color: "success.main", 
                  marginBottom: 2 
                }} 
              />
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                sx={{
                  fontWeight: 700,
                  color: "success.main",
                  marginBottom: 1,
                }}
              >
                Order Confirmed!
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: "text.secondary",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                Your order has been successfully placed and confirmed.
              </Typography>
            </Box>

            {/* Important Notice */}
            <Alert 
              severity="warning" 
              sx={{ 
                marginBottom: 3,
                borderRadius: 2,
                backgroundColor: "rgba(255, 193, 7, 0.1)",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                📱 Please take a screenshot of this confirmation
              </Typography>
              <Typography variant="caption">
                Save your Order ID and WeChat ID for future order lookup
              </Typography>
            </Alert>

            {/* Order Summary Card */}
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                marginBottom: 3,
              }}
            >
              <CardContent sx={{ padding: isMobile ? "24px" : "32px" }}>
                {/* Order Info Header */}
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
                  <ReceiptIcon sx={{ color: "primary.main", marginRight: 1 }} />
                  <Typography 
                    variant="h5" 
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                    }}
                  >
                    Order Summary
                  </Typography>
                </Box>

                {/* Key Information Grid */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AssignmentIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 600 }}>Order ID:</Typography>
                    </Box>
                    <Chip 
                      label={order.id} 
                      size="small"
                      sx={{ 
                        backgroundColor: "rgba(76, 175, 80, 0.1)",
                        color: "success.main",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 600 }}>WeChat ID:</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 500 }}>
                      {order.wechat_id || "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOnIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 600 }}>Pickup Location:</Typography>
                    </Box>
                    <Typography sx={{ textAlign: "right", maxWidth: "200px" }}>
                      {order.pick_up_location || "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DateRangeIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 600 }}>Pickup Date:</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 500 }}>
                      {order.pick_up_date ? new Date(order.pick_up_date).toISOString().split("T")[0] : ""}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoneyIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 600 }}>Total:</Typography>
                    </Box>
                    <Chip 
                      label={`$${Number(order.total) ? Number(order.total).toFixed(2) : "N/A"}`}
                      size="small"
                      sx={{ 
                        backgroundColor: "rgba(255, 107, 107, 0.1)",
                        color: "error.main",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    />
                  </Box>
                </Box>

                {/* Total Disclaimer */}
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

                {/* Notes Section */}
                {order.notes && (
                  <Box sx={{ marginBottom: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                      <NotesIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 600 }}>Order Notes:</Typography>
                    </Box>
                    <Paper
                      sx={{
                        padding: 2,
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2">{order.notes}</Typography>
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

                  {orderDetails && Object.keys(orderDetails).length > 0 ? (
                    Object.entries(orderDetails).map(([restaurantId, dishes]) => (
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
                            {dishes.length > 0 ? dishes[0].restaurantName || `Restaurant ${restaurantId}` : `Restaurant ${restaurantId}`}
                          </Typography>

                          <List dense>
                            {dishes.map((dish, index) => (
                              <ListItem 
                                key={`${restaurantId}-${dish.id}`}
                                sx={{
                                  padding: "4px 0",
                                  borderBottom: index < dishes.length - 1 ? "1px solid rgba(0, 0, 0, 0.05)" : "none",
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {dish.name}
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
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 0.5 }}>
                                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                        Quantity: {dish.quantity}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                        {isNaN(dish.price) ? "SP (Check with restaurant)" : `$${Number(dish.price).toFixed(2)} each`}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      No order details available.
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row", 
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate("/")}
                sx={{
                  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  borderRadius: "50px",
                  height: 48,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  flex: 1,
                  maxWidth: isMobile ? "100%" : "200px",
                  boxShadow: "0 4px 15px rgba(255, 105, 135, 0.4)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(255, 105, 135, 0.5)",
                  },
                }}
              >
                <HomeIcon sx={{ marginRight: 1 }} />
                Go to Home
              </Button>
              
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate("/lookup-order")}
                sx={{
                  borderRadius: "50px",
                  height: 48,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  flex: 1,
                  maxWidth: isMobile ? "100%" : "200px",
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <SearchIcon sx={{ marginRight: 1 }} />
                Lookup Order
              </Button>
              
              <Button 
                variant="contained" 
                size="large"
                onClick={() => setPaymentMethod(true)}
                sx={{
                  background: "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
                  borderRadius: "50px",
                  height: 48,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  flex: 1,
                  maxWidth: isMobile ? "100%" : "200px",
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.5)",
                  },
                }}
              >
                <PaymentIcon sx={{ marginRight: 1 }} />
                Payment Method
              </Button>
            </Box>
          </Paper>
        </Fade>

        {/* Payment Method Modal */}
        {showPaymentMethod && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1300,
            }}
          >
            <PaymentMethod order={order} onClose={() => setPaymentMethod(false)}/>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default OrderedPage;
