import React from "react";
import { Box, Typography } from "@mui/material";

const TAX_RATE = 0.07;

const OrderSummary = ({ addedDishes = {} }) => {
  // Count the number of restaurants with at least one dish
  const restaurantCount = Object.values(addedDishes).filter(dishes => dishes.length > 0).length;

  // Calculate delivery fee based on restaurant count
  let deliveryFee = 0;
  if (restaurantCount === 1) {
    deliveryFee = 5;
  } else if (restaurantCount === 2) {
    deliveryFee = 8;
  } else if (restaurantCount >= 3) {
    deliveryFee = 10;
  }

  // Calculate subtotal
  const subtotal = Object.values(addedDishes)
    .flat()
    .reduce((acc, dish) => acc + (dish.price ?? 0) * (dish.quantity ?? 0), 0);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + deliveryFee;

  return (
    <Box sx={{ marginTop: 4, padding: 2, borderTop: "1px solid #ccc" }}>
      <Typography variant="h5" gutterBottom>
        Order Summary
      </Typography>

      <Box>
        {Object.entries(addedDishes)
          .filter(([_, dishes]) => dishes.length > 0) // Only include restaurants with orders
          .map(([restaurantId, dishes]) => (
            <Box key={restaurantId} sx={{ marginBottom: 2 }}>
              <Typography variant="h6">Restaurant {restaurantId}</Typography>
              {dishes.map((dish) => (
                <Typography key={dish.id} variant="body1">
                  {dish.name || "Unknown"} x{dish.quantity || 0}: $
                  {((dish.price ?? 0) * (dish.quantity ?? 0)).toFixed(2)}
                </Typography>
              ))}
            </Box>
          ))}
      </Box>

      <Box sx={{ marginTop: 2, borderTop: "1px solid #ccc", paddingTop: 2 }}>
        <Typography variant="body1">Tax (7%): ${tax.toFixed(2)}</Typography>
        <Typography variant="body1">Delivery Fee: ${deliveryFee.toFixed(2)}</Typography>
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          Total: ${total.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderSummary;
