import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { RESTAURANT_NAME } from "../../constant/constant";

const TAX_RATE = 0.0625;

const OrderSummary = ({ addedDishes = {}, updateTotal }) => {
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
    .reduce((acc, dish) => {
      // Ensure price is a number, ignore "SP" prices
      const price = isNaN(dish.price) ? 0 : Number(dish.price);
      return acc + price * (dish.quantity ?? 0);
    }, 0);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + deliveryFee;

  // Update the total in the parent component
  useEffect(() => {
    if (total !== undefined) {
      updateTotal(total);
    }
  }, [total]); // Remove updateTotal from dependencies unless it's memoized

  return (
    <Box sx={{ marginTop: 4, padding: 2, borderTop: "1px solid #ccc", height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" gutterBottom>
        Order Summary
      </Typography>

      {/* Scrollable Content Container */}
      <Box sx={{
        overflowY: "auto",   // Allow vertical scrolling if the content overflows
        flex: 1,             // Take up remaining space
        paddingBottom: 2,    // Space at the bottom
      }}>
        <Box>
          {Object.entries(addedDishes)
            .filter(([_, dishes]) => dishes.length > 0) // Only include restaurants with orders
            .map(([restaurantId, dishes]) => (
              <Box key={restaurantId} sx={{ marginBottom: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">{RESTAURANT_NAME[restaurantId]}</Typography>
                {dishes.map((dish) => (
                  <Typography key={dish.id} variant="body1">
                    {`${dish.name} ${
                      dish.selectedOptions && Object.keys(dish.selectedOptions).length > 0
                        ? ` (${Object.entries(dish.selectedOptions)
                            .map(([optionKey, selected]) => selected.join(", "))
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
      </Box>

      <Box sx={{ marginTop: 2, borderTop: "1px solid #ccc", paddingTop: 2 }}>
        <Typography variant="body1">Tax (6.625%): ${tax.toFixed(2)}</Typography>
        <Typography variant="body1">Delivery Fee: ${deliveryFee.toFixed(2)}</Typography>
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          Total: ${total.toFixed(2)}
        </Typography>
        <Typography component="span" color="error" variant="caption">
          (Please note that the total shown is for reference only and may vary at the time of delivery.)
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderSummary;
