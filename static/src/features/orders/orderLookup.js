import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Grid } from "@mui/material";

const OrderLookup = () => {
  const navigate = useNavigate();
  const [wechatId, setWechatId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  const handleLookup = async () => {
    if (!wechatId || !orderId) {
      setError("Please enter both WeChat ID and Order ID.");
      return;
    }
    setError("");

    try {
      const response = await fetch(`/api/orders?wechatId=${wechatId}&orderId=${orderId}`);
      if (!response.ok) throw new Error("Order not found");

      const data = await response.json();
      setOrderData(data);
    } catch (err) {
      setOrderData(null);
      setError("Order not found. Please check your details and try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Order Lookup
        </Typography>
        <TextField
          fullWidth
          label="WeChat ID"
          variant="outlined"
          margin="normal"
          value={wechatId}
          onChange={(e) => setWechatId(e.target.value)}
        />
        <TextField
          fullWidth
          label="Order ID"
          variant="outlined"
          margin="normal"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLookup}>
          Submit
        </Button>

        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

        {orderData && (
          <Box sx={{ mt: 3, p: 3, border: "1px solid #ccc", borderRadius: 2, backgroundColor: "#f9f9f9" }}>
            {/* Order Details Header */}
            <Typography variant="h5" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
              Order Details
            </Typography>

            {/* Order Summary - Flexbox for Alignment */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold", minWidth: "150px", textAlign: "left" }}>WeChat ID:</Typography>
                <Typography sx={{ textAlign: "right" }}>{orderData.wechat_id}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold", minWidth: "150px", textAlign: "left" }}>Order ID:</Typography>
                <Typography sx={{ textAlign: "right" }}>{orderData.id}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold", minWidth: "150px", textAlign: "left" }}>Pickup Location:</Typography>
                <Typography sx={{ textAlign: "right" }}>{orderData.pick_up_location}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold", minWidth: "150px", textAlign: "left" }}>Pickup Date:</Typography>
                <Typography sx={{ textAlign: "right" }}>
                  {orderData.pick_up_date ? new Date(orderData.pick_up_date).toISOString().split("T")[0] : ""}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold", minWidth: "150px", textAlign: "left" }}>Total: </Typography>
                <Typography sx={{ textAlign: "right" }}>${Number(orderData?.total || 0).toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography component="span" color="error" variant="caption">
                  (Please note that the total shown is for reference only and may vary at the time of delivery.)
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography><strong>Notes:</strong>{orderData.notes}</Typography>
              </Box>
            </Box>

            {/* Ordered Dishes */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", mb: 1 }}>
                Ordered Dishes
              </Typography>

              {orderData.order_details &&
                Object.entries(orderData.order_details).map(([restaurantId, dishes]) => (
                  <Box key={restaurantId} sx={{ mt: 2 }}>
                    {/* Restaurant Name */}
                    <Typography variant="h6" sx={{ fontWeight: "bold", textDecoration: "underline" }}>
                      {dishes[0]?.restaurantName}
                    </Typography>

                    {/* Dish List */}
                    {dishes.map((dish, index) => (
                      <Typography key={dish.id} sx={{ ml: 2 }}>
                        {index + 1}. {`${dish.name} ${
                          dish.selectedOptions && Object.keys(dish.selectedOptions).length > 0
                            ? ` (${Object.entries(dish.selectedOptions)
                                .map(([optionKey, selected]) => selected.join(", "))
                                .join("; ")})` // ✅ Display all selected options correctly
                            : ""
                        }`} x {dish.quantity}
                      </Typography>
                    ))}
                  </Box>
                ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} color="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default OrderLookup;
