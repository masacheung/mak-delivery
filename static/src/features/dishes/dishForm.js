import React from 'react';
import { useState } from "react"; // If using state to manage selections
import { FormControlLabel, Checkbox } from "@mui/material"; // Missing Material-UI components
import { Box, Typography, TextField, IconButton, Button, Card, CardContent, CardActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';

const DishForm = ({ restaurant, quantities, onQuantityChange, onAddDish }) => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleAddDish = (dish) => {
    if (quantities[dish.id] > 0) {
      onAddDish(restaurant.id, [
        {
          id: dish.id,
          name: dish.name || "Unknown",
          price: dish.price ?? 0,
          quantity: quantities[dish.id] ?? 0,
          options: dish.options || [],
          selectedOptions: selectedOptions[dish.id] || [], // ✅ Include selected options
        },
      ]);
    }
  };

  const handleResetDish = (dishId) => {
    onQuantityChange(dishId, 0); // Reset quantity to 0
  };

  const handleOptionChange = (dishId, option, limit) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[dishId] || [];

      if (currentOptions.includes(option)) {
        // ✅ Remove option if already selected
        return { ...prev, [dishId]: currentOptions.filter((opt) => opt !== option) };
      } else {
        // ✅ Only add if the selected count is within the limit
        if (currentOptions.length < limit) {
          return { ...prev, [dishId]: [...currentOptions, option] };
        } else {
          return prev; // Prevent exceeding the limit
        }
      }
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add Dishes to {restaurant.name}
      </Typography>

      {restaurant.dishes.map((dish) => (
        <Card key={dish.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{dish.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Price: ${dish.price}
            </Typography>
            {/* Display options if available */}
              {dish.options && dish.options.length > 0 && (
                <Box sx={{ marginTop: 1 }}>
                  <Typography variant="body2">Select {dish.limit} options:</Typography>
                  <Box>
                    {dish.options.map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={selectedOptions[dish.id]?.includes(option) || false} // ✅ Use selectedOptions state
                            onChange={() => handleOptionChange(dish.id, option, dish.limit)}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </Box>
                </Box>
              )}
          </CardContent>
          <CardActions>
            <IconButton onClick={() => onQuantityChange(dish.id, 'decrease')} disabled={quantities[dish.id] === 0}>
              <RemoveIcon />
            </IconButton>
            <TextField
              type="number"
              value={quantities[dish.id] || 0}
              onChange={(e) => {
                const newQuantity = Math.max(0, Math.min(10, Number(e.target.value)));
                onQuantityChange(dish.id, newQuantity);
              }}
              sx={{ width: 50, textAlign: 'center' }}
            />
            <IconButton onClick={() => onQuantityChange(dish.id, 'increase')} disabled={quantities[dish.id] === 10}>
              <AddIcon />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddDish(dish)}
              disabled={quantities[dish.id] === 0}
              sx={{ marginLeft: 1 }}
            >
              Add
            </Button>
            <IconButton onClick={() => onQuantityChange(dish.id, "reset")} sx={{ marginLeft: 1 }}>
              <ClearIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default DishForm;
