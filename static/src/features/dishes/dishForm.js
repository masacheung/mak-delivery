import React from 'react';
import { useState } from "react"; // If using state to manage selections
import { FormControlLabel, Checkbox, Radio, RadioGroup } from "@mui/material";
import { Box, Typography, TextField, IconButton, Button, Card, CardContent, CardActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';

const DishForm = ({ restaurant, quantities, onQuantityChange, onAddDish }) => {
  const [selectedOptions, setSelectedOptions] = useState({});

//  const handleAddDish = (dish) => {
//    if (quantities[dish.id] > 0) {
//      onAddDish(restaurant.id, [
//        {
//          id: dish.id,
//          name: dish.name || "Unknown",
//          price: dish.price ?? 0,
//          quantity: quantities[dish.id] ?? 0,
//          options: dish.options || [],
//          selectedOptions: selectedOptions[dish.id] || [], // ✅ Include selected options
//        },
//      ]);
//    }
//  };
  const handleAddDish = (dish) => {
      if (quantities[dish.id] > 0) {
        onAddDish(restaurant.id, [
          {
            id: dish.id,
            name: dish.name || "Unknown",
            price: dish.price ?? 0,
            quantity: quantities[dish.id] ?? 0,
            selectedOptions: selectedOptions[dish.id] || {},
          },
        ]);
      }
  };

  const handleResetDish = (dishId) => {
    onQuantityChange(dishId, 0); // Reset quantity to 0
  };

//  const handleOptionChange = (dishId, option, limit) => {
//    setSelectedOptions((prev) => {
//      const currentOptions = prev[dishId] || [];
//
//      if (currentOptions.includes(option)) {
//        // ✅ Remove option if already selected
//        return { ...prev, [dishId]: currentOptions.filter((opt) => opt !== option) };
//      } else {
//        // ✅ Only add if the selected count is within the limit
//        if (currentOptions.length < limit) {
//          return { ...prev, [dishId]: [...currentOptions, option] };
//        } else {
//          return prev; // Prevent exceeding the limit
//        }
//      }
//    });
//  };
  const handleOptionChange = (dishId, optionKey, option, limit) => {
      setSelectedOptions((prev) => {
        const currentOptions = prev[dishId]?.[optionKey] || [];

        if (limit === 1) {
          return {
            ...prev,
            [dishId]: {
              ...prev[dishId],
              [optionKey]: [option],
            },
          };
        } else {
          if (currentOptions.includes(option)) {
            return {
              ...prev,
              [dishId]: {
                ...prev[dishId],
                [optionKey]: currentOptions.filter((opt) => opt !== option),
              },
            };
          } else {
            if (currentOptions.length < limit) {
              return {
                ...prev,
                [dishId]: {
                  ...prev[dishId],
                  [optionKey]: [...currentOptions, option],
                },
              };
            }
            return prev;
          }
        }
      });
    };

    console.log(restaurant.dishes);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add Dishes to {restaurant.name}
      </Typography>

        {restaurant.dishes.map((dish) => (
          <Card key={dish.id} sx={{ marginBottom: 0.5, padding: 0.1 }}>
            <CardContent sx={{ padding: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                {dish.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Price: ${dish.price}
              </Typography>

              {/* Display options if available */}
              {dish.options &&
                Object.entries(dish.options).map(([optionKey, optionData]) => (
                  <Box key={optionKey} sx={{ marginTop: 0.5 }}>
                    <Typography variant="caption">
                      Select {optionData.limit} option(s)
                      {optionData.name ? ` for ${optionData.name}` : ''}:
                    </Typography>
                    <Box>
                      {optionData.limit === 1 ? (
                        <RadioGroup
                          value={selectedOptions[dish.id]?.[optionKey]?.[0] || ""}
                          onChange={(e) =>
                            handleOptionChange(dish.id, optionKey, e.target.value, optionData.limit)
                          }
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            flexDirection: "row",
                          }}
                        >
                          {optionData.choices.map((option) => (
                            <FormControlLabel
                              key={option}
                              value={option}
                              control={<Radio size="small" />}
                              label={<Typography variant="caption">{option}</Typography>}
                              sx={{ flex: "0 1 auto", minWidth: "120px", whiteSpace: "nowrap" }}
                            />
                          ))}
                        </RadioGroup>
                      ) : (
                        optionData.choices.map((option) => (
                          <FormControlLabel
                            key={option}
                            control={
                              <Checkbox
                                size="small"
                                checked={selectedOptions[dish.id]?.[optionKey]?.includes(option) || false}
                                onChange={() => handleOptionChange(dish.id, optionKey, option, optionData.limit)}
                              />
                            }
                            label={<Typography variant="caption">{option}</Typography>}
                            sx={{ marginRight: 1 }}
                          />
                        ))
                      )}
                    </Box>
                  </Box>
                ))}
            </CardContent>

            <CardActions sx={{ padding: 0.5, justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconButton size="small" onClick={() => onQuantityChange(dish.id, 'decrease')} disabled={quantities[dish.id] === 0} sx={{ width: 24, height: 24 }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <TextField
                  type="number"
                  value={quantities[dish.id] || 0}
                  onChange={(e) => {
                    const newQuantity = Math.max(0, Math.min(10, Number(e.target.value)));
                    onQuantityChange(dish.id, newQuantity);
                  }}
                  sx={{ width: 32, height: 24, textAlign: 'center', fontSize: "0.75rem",
                   "& input": {
                             textAlign: "center",
                             padding: "4px",
                             fontSize: "0.75rem" // Ensure smaller text inside
                   }}}
                  inputProps={{ style: { textAlign: "center", fontSize: "0.75rem" } }}
                />
                <IconButton size="small" onClick={() => onQuantityChange(dish.id, 'increase')} disabled={quantities[dish.id] === 10} sx={{ width: 24, height: 24 }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddDish(dish)}
                disabled={quantities[dish.id] === 0}
                sx={{ minWidth: 70, fontSize: "0.7rem", padding: "3px 5px" }}
              >
                Add
              </Button>

              <IconButton size="small" onClick={() => onQuantityChange(dish.id, "reset")}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </CardActions>
          </Card>
        ))}
    </Box>
  );
};

export default DishForm;
