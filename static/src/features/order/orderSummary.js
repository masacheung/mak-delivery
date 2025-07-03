import React, { useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Container,
  Slide,
  Fade
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { RESTAURANT_NAME } from "../../constant/constant";

const TAX_RATE = 0.0625;

const OrderSummary = ({ orderState, updateOrderState, onClose, onSubmit, updateTotal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const addedDishes = orderState?.addedDishes || {};
  
  const restaurantCount = Object.values(addedDishes).filter(dishes => dishes.length > 0).length;

  let deliveryFee = 0;
  if (restaurantCount === 1) deliveryFee = 5;
  else if (restaurantCount === 2) deliveryFee = 8;
  else if (restaurantCount >= 3) deliveryFee = 10;

  const subtotal = Object.values(addedDishes)
    .flat()
    .reduce((acc, dish) => {
      const price = isNaN(dish.price) ? 0 : Number(dish.price);
      return acc + price * (dish.quantity ?? 0);
    }, 0);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + deliveryFee;

  useEffect(() => {
    if (total !== undefined) {
      updateTotal(total);
    }
  }, [total]);

  const hasItems = Object.values(addedDishes).some(dishes => dishes.length > 0);

  const handleRemoveDish = (restaurantId, dishId) => {
    const updatedAddedDishes = { ...addedDishes };
    if (updatedAddedDishes[restaurantId]) {
      updatedAddedDishes[restaurantId] = updatedAddedDishes[restaurantId].filter(dish => dish.id !== dishId);
      
      // Clean up empty restaurant arrays
      if (updatedAddedDishes[restaurantId].length === 0) {
        delete updatedAddedDishes[restaurantId];
      }
    }

    // Update the order state
    updateOrderState('addedDishes', updatedAddedDishes);
  };

  return (
    <Box
      sx={{
        minHeight: isMobile ? "60vh" : "70vh",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "16px" : "24px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingCartIcon sx={{ color: "primary.main" }} />
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Order Summary
          </Typography>
        </Box>
        
        <IconButton
          onClick={onClose}
          sx={{
            color: "primary.main",
            transition: "all 0.3s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          padding: isMobile ? "16px" : "24px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
          paddingBottom: isMobile ? "24px" : "32px",
        }}
      >
        {!hasItems ? (
          <Fade in={true} timeout={500}>
            <Paper
              elevation={0}
              sx={{
                padding: isMobile ? "32px 16px" : "48px 32px",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 64, color: "text.secondary" }} />
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some delicious dishes to get started!
              </Typography>
            </Paper>
          </Fade>
        ) : (
          <>
            {/* Section 1: Order Items - Fixed Height with Scroll */}
            <Card
              className="order-items-section"
              sx={{
                height: isMobile ? "30vh" : "35vh",
                minHeight: "200px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
                marginBottom: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ 
                padding: isMobile ? "16px" : "20px",
                paddingBottom: "8px",
                flexShrink: 0,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ReceiptIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                    }}
                  >
                    Order Items
                  </Typography>
                </Box>
              </CardContent>
              
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  paddingX: isMobile ? "16px" : "20px",
                  paddingBottom: "16px",
                }}
                className="custom-scroll"
              >
                {Object.entries(addedDishes)
                  .filter(([_, dishes]) => dishes.length > 0)
                  .map(([restaurantId, dishes]) => (
                    <Slide key={restaurantId} direction="up" in={true} timeout={300}>
                      <Card
                        className="restaurant-card"
                        sx={{
                          marginBottom: 2,
                          background: "rgba(255, 255, 255, 0.8)",
                          backdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          borderRadius: 2,
                        }}
                      >
                        <CardContent sx={{ padding: "12px" }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: "primary.main",
                              marginBottom: 1,
                            }}
                          >
                            {RESTAURANT_NAME[restaurantId]}
                          </Typography>
                          
                          <List dense>
                            {dishes.map((dish) => (
                              <ListItem
                                key={dish.id}
                                sx={{
                                  padding: "4px 0",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 500,
                                        color: "text.primary",
                                      }}
                                    >
                                      {dish.name}
                                      {dish.selectedOptions && Object.keys(dish.selectedOptions).length > 0 && (
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            display: "block",
                                            color: "text.secondary",
                                            marginTop: 0.5,
                                          }}
                                        >
                                          {Object.entries(dish.selectedOptions)
                                            .map(([_, selected]) => selected.join(", "))
                                            .join("; ")}
                                        </Typography>
                                      )}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 0.5 }}>
                                      <Chip
                                        label={`Qty: ${dish.quantity}`}
                                        size="small"
                                        sx={{
                                          backgroundColor: "rgba(102, 126, 234, 0.1)",
                                          color: "primary.main",
                                          fontWeight: 600,
                                        }}
                                      />
                                      {dish.price === "SP" ? (
                                        <Chip
                                          label="Special Price"
                                          size="small"
                                          sx={{
                                            backgroundColor: "#FF6B6B",
                                            color: "white",
                                            fontWeight: 600,
                                          }}
                                        />
                                      ) : (
                                        <Chip
                                          label={`$${(Number(dish.price) * Number(dish.quantity)).toFixed(2)}`}
                                          size="small"
                                          sx={{
                                            backgroundColor: "#4CAF50",
                                            color: "white",
                                            fontWeight: 600,
                                          }}
                                        />
                                      )}
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    aria-label="remove"
                                    size="small"
                                    onClick={() => handleRemoveDish(restaurantId, dish.id)}
                                    sx={{
                                      color: "#ff6b6b",
                                      backgroundColor: "rgba(255, 107, 107, 0.1)",
                                      border: "1px solid rgba(255, 107, 107, 0.3)",
                                      width: 28,
                                      height: 28,
                                      "&:hover": {
                                        backgroundColor: "rgba(255, 107, 107, 0.2)",
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <ClearIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Slide>
                  ))}
              </Box>
            </Card>

            {/* Section 2: Order Information Form - Fixed Height with Scroll */}
            <Card
              className="order-info-section"
              sx={{
                height: isMobile ? "25vh" : "20vh",
                minHeight: "150px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
                marginBottom: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ 
                padding: isMobile ? "16px" : "20px",
                paddingBottom: "8px",
                flexShrink: 0,
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                >
                  Order Information
                </Typography>
              </CardContent>
              
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  paddingX: isMobile ? "16px" : "20px",
                  paddingBottom: "16px",
                }}
                className="custom-scroll"
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    label="WeChat ID"
                    value={orderState?.wechatId || ""}
                    onChange={(e) => updateOrderState("wechatId", e.target.value)}
                    required
                    error={orderState?.errors?.wechatId}
                    helperText={orderState?.errors?.wechatId ? "WeChat ID is required" : ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Additional Notes"
                  value={orderState?.notes || ""}
                  onChange={(e) => updateOrderState("notes", e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Any special requests or notes for your order..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </Card>

            {/* Section 3: Order Total - Fixed Height with Scroll */}
            <Card
              className="order-total-section"
              sx={{
                height: isMobile ? "25vh" : "25vh",
                minHeight: "180px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              {/* Header - Always Visible */}
              <CardContent sx={{ 
                padding: isMobile ? "16px" : "20px",
                paddingBottom: "8px",
                flexShrink: 0,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalShippingIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                    }}
                  >
                    Order Total
                  </Typography>
                </Box>
              </CardContent>
              
              {/* Scrollable Price Details */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  paddingX: isMobile ? "16px" : "20px",
                  paddingBottom: "8px",
                  minHeight: 0,
                }}
                className="custom-scroll"
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1">Tax (6.625%):</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${tax.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1">Delivery Fee:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${deliveryFee.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ margin: "8px 0" }} />
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                      }}
                    >
                      Total:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                      }}
                    >
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    marginTop: 1,
                    fontStyle: "italic",
                  }}
                >
                  * Total shown is for reference only and may vary at delivery
                </Typography>
              </Box>

              {/* Submit Button - Always Visible at Bottom */}
              <Box
                sx={{
                  padding: isMobile ? "16px" : "20px",
                  paddingTop: "8px",
                  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  flexShrink: 0,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={onSubmit}
                  fullWidth
                  sx={{
                    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    borderRadius: "50px",
                    height: isMobile ? 48 : 56,
                    fontSize: isMobile ? "1rem" : "1.1rem",
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
                  Submit Order
                </Button>
              </Box>
            </Card>
          </>
        )}
      </Container>
    </Box>
  );
};

export default OrderSummary;
