import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const OrderLookup = () => {
  const [wechatId, setWechatId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  const handleLookup = async () => {
    // Simulating the database query for now
    if (!wechatId || !orderId) {
      setError("Please enter both WeChat ID and Order ID.");
      return;
    }
    setError("");

    try {
      // In the future, this would be a real API call to your backend
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
          <Box sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h6">Order Details</Typography>
            <Typography>Order ID: {orderData.id}</Typography>
            <Typography>Status: {orderData.status}</Typography>
            <Typography>Total: ${orderData.total}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default OrderLookup;
