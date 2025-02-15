import React from 'react';
import { Box, Typography, TextField, IconButton, Button, Card, CardContent, CardActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';

const DishForm = ({ restaurant, quantities, onQuantityChange, onAddDish }) => {
  const handleAddDish = (dish) => {
    if (quantities[dish.id] > 0) {
      onAddDish(restaurant.id, [
        {
          id: dish.id,
          name: dish.name || "Unknown",
          price: dish.price ?? 0,
          quantity: quantities[dish.id] ?? 0,
        },
      ]);
    }
  };

  const handleResetDish = (dishId) => {
    onQuantityChange(dishId, 0); // Reset quantity to 0
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
