import { useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Divider, List, ListItem, ListItemText, Button } from "@mui/material";

const OrderedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Card sx={{ maxWidth: 500, width: "100%", p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            Order Confirmation
          </Typography>

          <Typography variant="body1" color="textSecondary">
            <strong>Order ID:</strong> {order.id}
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
                        primary={`${dish.name} x${dish.quantity}`}
                        secondary={`$${dish.price.toFixed(2)} each`}
                      />
                    </ListItem>
                  ))}
                </Box>
              ))}
            </List>
          ) : (
            <Typography color="error">No order details available.</Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1">
            <strong>Total:</strong> ${Number(order.total) ? Number(order.total).toFixed(2) : "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>WeChat ID:</strong> {order.wechat_id || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Pickup Location:</strong> {order.pick_up_location || "N/A"}
          </Typography>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate("/lookup")}>
          Look Up Another Order
        </Button>
      </Box>
    </Box>
  );
};

export default OrderedPage;
