import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { RESTAURANT_NAME } from "../../constant/constant";

const TAX_RATE = 0.0625;

const OrderSummary = ({ addedDishes = {}, updateTotal, handleSubmit }) => {
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

  return (
    <Box sx={{ 
      marginTop: 4, padding: 2, borderTop: "1px solid #ccc", 
      height: "100%", display: "flex", flexDirection: "column" 
    }}>
      <Typography variant="h5" gutterBottom>
        Order Summary
      </Typography>

      {/* Scrollable Content */}
      <Box sx={{ 
        flex: 1, overflowY: "auto", paddingBottom: 2, 
        maxHeight: "60vh" // Limits height for better mobile handling
      }}>
        {Object.entries(addedDishes)
          .filter(([_, dishes]) => dishes.length > 0)
          .map(([restaurantId, dishes]) => (
            <Box key={restaurantId} sx={{ marginBottom: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">{RESTAURANT_NAME[restaurantId]}</Typography>
              {dishes.map((dish) => (
                <Typography key={dish.id} variant="body1">
                  {`${dish.name} ${
                    dish.selectedOptions && Object.keys(dish.selectedOptions).length > 0
                      ? ` (${Object.entries(dish.selectedOptions)
                          .map(([_, selected]) => selected.join(", "))
                          .join("; ")})`
                      : ""
                  } x${dish.quantity}`} - 
                  {dish.price === "SP" ? (
                    <Typography color="error" variant="caption">
                      SP (Check with restaurant)
                    </Typography>
                  ) : `$${(Number(dish.price) * Number(dish.quantity)).toFixed(2)}`}
                </Typography>
              ))}
            </Box>
          ))}
      </Box>

      {/* Sticky Total Box */}
      <Box sx={{ 
        position: "sticky", bottom: 0, background: "white", 
        padding: 2, borderTop: "1px solid #ccc", pb: 3 
      }}>
        <Typography variant="body1">Tax (6.625%): ${tax.toFixed(2)}</Typography>
        <Typography variant="body1">Delivery Fee: ${deliveryFee.toFixed(2)}</Typography>
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          Total: ${total.toFixed(2)}
        </Typography>
        <Typography component="span" color="error" variant="caption">
          (Please note that the total shown is for reference only and may vary at the time of delivery.)
        </Typography>
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
          Submit Order
        </Button>
      </Box>
    </Box>
  );
};

export default OrderSummary;
