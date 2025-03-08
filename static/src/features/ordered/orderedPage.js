import { useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Divider, List, ListItem, ListItemText, Button } from "@mui/material";
import PaymentMethod from "../paymentMethod/paymentMethod";
import { useState } from "react";

const OrderedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [showPaymentMethod, setPaymentMethod] = useState(false); // Controls visibility

  if (!order) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">No order found</Typography>
      </Box>
    );
  }

  const orderDetails = typeof order.order_details === "string"
      ? JSON.parse(order.order_details)
      : order.order_details;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5" overflowX="hidden">
      <Card sx={{ maxWidth: 500, width: "100%", p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            Order Confirmation
          </Typography>
          <Typography color="error" variant="caption" display="block">
            (Please take a screenshot of this order confirmation and remember your Order ID and WeChat ID for order lookup.)
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" fontWeight="bold">
            Order Details
          </Typography>
          {orderDetails && Object.keys(orderDetails).length > 0 ? (
            <List>
              {Object.entries(orderDetails).map(([restaurantId, dishes]) => (
                <Box key={restaurantId} sx={{ marginBottom: 2 }}>
                  {/* Display Restaurant Name */}
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {dishes.length > 0 ? dishes[0].restaurantName || `Restaurant ${restaurantId}` : `Restaurant ${restaurantId}`}
                  </Typography>

                  {/* Display Ordered Dishes */}
                  {dishes.map((dish) => (
                    <ListItem key={`${restaurantId}-${dish.id}`}>
                      <ListItemText
                        primary={`${dish.name} ${
                          dish.selectedOptions && Object.keys(dish.selectedOptions).length > 0
                            ? ` (${Object.entries(dish.selectedOptions)
                                .map(([optionKey, selected]) => selected.join(", "))
                                .join("; ")})` // ✅ Display all selected options correctly
                            : ""
                        } x${dish.quantity}`}
                        secondary={isNaN(dish.price) ? "SP (Check with restaurant)" : `$${Number(dish.price).toFixed(2)} each`}
                      />
                    </ListItem>
                  ))}
                </Box>
              ))}
            </List>
          ) : (
            <Typography color="error">No order details available.</Typography>
          )}

          <Typography><strong>Notes:</strong>{order.notes}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" color="textSecondary">
            <strong>Order ID:</strong> {order.id}
          </Typography>
          <Typography variant="body1">
            <strong>Total: </strong> ${Number(order.total) ? Number(order.total).toFixed(2) : "N/A"}
          </Typography>
          <Typography component="span" color="error" variant="caption">
            (Please note that the total shown is for reference only and may vary at the time of delivery.)
          </Typography>
          <Typography variant="body1">
            <strong>WeChat ID:</strong> {order.wechat_id || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Pickup Location:</strong> {order.pick_up_location || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Pickup Date:</strong> {order.pick_up_date ? new Date(order.pick_up_date).toISOString().split("T")[0] : ""}
          </Typography>

          {/* Navigation Buttons */}
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>
              Go to Home
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate("/lookup-order")}>
              Look Up Another Order
            </Button>
            <Button variant="contained" color="primary" onClick={() => setPaymentMethod(true)}>
              Payment Method
            </Button>
          </Box>
        </CardContent>
        {showPaymentMethod && (
          <Box
            sx={{
              position: "fixed", // Fix it to the screen
              top: 0, // Start from the top
              left: 0,
              width: "100vw", // Full width
              height: "100vh", // Full height
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1300, // Ensure it's above everything
            }}
          >
            <PaymentMethod order={order} onClose={() => setPaymentMethod(false)}/>
          </Box>
          )}
      </Card>
    </Box>
  );
};

export default OrderedPage;
