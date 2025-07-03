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
            {/* Scrollable Content Area */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                paddingRight: 1,
                marginBottom: 2,
              }}
              className="custom-scroll"
            >
              {/* Order Items */}
              <Box sx={{ marginBottom: 2 }}>
              {Object.entries(addedDishes)
                .filter(([_, dishes]) => dishes.length > 0)
                .map(([restaurantId, dishes]) => (
                  <Slide key={restaurantId} direction="up" in={true} timeout={300}>
                    <Card
                      className="restaurant-card"
                      sx={{
                        marginBottom: 2,
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ padding: isMobile ? "16px" : "20px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            marginBottom: 2,
                          }}
                        >
                          <ReceiptIcon sx={{ color: "primary.main", fontSize: 20 }} />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "primary.main",
                            }}
                          >
                            {RESTAURANT_NAME[restaurantId]}
                          </Typography>
                        </Box>
                        
                        <List dense>
                          {dishes.map((dish) => (
                            <ListItem
                              key={dish.id}
                              sx={{
                                padding: "8px 0",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body1"
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
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Slide>
                ))}
              </Box>
            </Box>

            {/* Order Information Form */}
            <Card
              className="form-container"
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
                marginBottom: 2,
              }}
            >
              <CardContent sx={{ padding: isMobile ? "16px" : "20px" }}>
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: 2,
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                >
                  Order Information
                </Typography>
                
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
              </CardContent>
            </Card>

            {/* Total Summary - Always Visible */}
            <Card
              className="modern-card"
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
                flexShrink: 0,
                position: "sticky",
                bottom: 0,
                zIndex: 1,
              }}
            >
              <CardContent sx={{ padding: isMobile ? "16px" : "20px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2 }}>
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
                    marginBottom: 2,
                    fontStyle: "italic",
                  }}
                >
                  * Total shown is for reference only and may vary at delivery
                </Typography>

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
                    marginTop: 1,
                    marginBottom: isMobile ? 1 : 0,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(255, 105, 135, 0.5)",
                    },
                  }}
                >
                  Submit Order
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Box>
  );
};

export default OrderSummary;
