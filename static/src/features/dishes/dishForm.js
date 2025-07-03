import React from 'react';
import { useState } from "react";
import { 
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  Chip,
  Container,
  AppBar,
  Toolbar,
  Fade,
  Slide
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const DishForm = ({ restaurant, quantities, onQuantityChange, onAddDish, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));



  const calculateTotal = (dish) => {
    let total = dish.price === 'SP' ? 0 : dish.price;

    if (selectedOptions[dish.id] && dish.options) {
      const selectedOptionsKeys = Object.keys(selectedOptions[dish.id]);

      for (let key of selectedOptionsKeys) {
          const optionData = dish.options[key];
          const selectedOptionsValues = selectedOptions[dish.id][key];

          if (!selectedOptionsValues || !optionData) continue;

          if (optionData?.adjustable) {
              for (let value of selectedOptionsValues) {
                  const priceMatch = value.match(/\$\d+(\.\d+)?/);
                  const price = priceMatch ? parseFloat(priceMatch[0].replace('$', '')) : 0;
                  total += price;
              }
          } else if (optionData?.price) {
              total += optionData.price * selectedOptionsValues.length;
          }
      }
    }

    return total;
  };

  const handleAddDish = (dish) => {
    for (const [optionKey, optionData] of Object.entries(dish.options || {})) {
      if (optionData.limit === 1) {
        const selected = selectedOptions[dish.id]?.[optionKey] || [];
        if (selected.length !== 1) {
          alert(`Please select exactly one option for ${optionData.name || optionKey}.`);
          return;
        }
      }
    }
  
    const total = calculateTotal(dish);
  
    if (quantities[dish.id] > 0) {
      onAddDish(restaurant.id, [
        {
          id: dish.id,
          name: dish.name || "Unknown",
          price: total,
          quantity: quantities[dish.id] ?? 0,
          selectedOptions: selectedOptions[dish.id] || {},
        },
      ]);
  
      setSelectedOptions((prev) => ({
        ...prev,
        [dish.id]: {},
      }));
  
      onQuantityChange(dish.id, "reset", restaurant.id);
    }
  };

  const handleOptionChange = (dishId, optionKey, option, limit) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[dishId]?.[optionKey] || [];

      if (limit === 1) {
        if (option) {
          return {
            ...prev,
            [dishId]: {
              ...prev[dishId],
              [optionKey]: [option],
            },
          };
        } else {
          alert("You must select one option.");
          return prev;
        }
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "0 16px" : "0 24px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RestaurantIcon sx={{ color: "primary.main" }} />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              className="app-title"
              sx={{
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              {restaurant.name}
            </Typography>
          </Box>

          {onClose && (
            <IconButton
              onClick={onClose}
              sx={{
                color: "primary.main",
                transition: "all 0.3s ease",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          padding: isMobile ? "16px" : "24px",
          paddingBottom: isMobile ? "32px" : "40px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Slide direction="down" in={true} timeout={500}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              marginBottom: 2,
              fontWeight: 600,
              color: "primary.main",
              textAlign: "center",
            }}
          >
            Select Your Dishes
          </Typography>
        </Slide>

        {/* Dishes List */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
            paddingRight: 1,
            paddingBottom: isMobile ? "32px" : "24px",
          }}
          className="custom-scroll"
        >
          {restaurant?.dishes?.length > 0 ? (
            restaurant.dishes.map((dish, index) => (
            <Fade key={dish.id} in={true} timeout={300 + index * 100}>
              <Card
                className="dish-card"
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  borderRadius: 3,
                  overflow: "visible",
                  transition: "all 0.3s ease",
                  minHeight: "120px",
                  marginBottom: 2,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <CardContent sx={{ 
                  padding: isMobile ? 2 : 3,
                  minHeight: "80px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  {/* Dish Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 2,
                      minHeight: "60px",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant={isMobile ? "h6" : "h5"}
                        sx={{
                          fontWeight: 600,
                          color: "#1976d2",
                          marginBottom: 1,
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          lineHeight: 1.2,
                          wordBreak: "break-word",
                        }}
                      >
                        {dish.name}
                      </Typography>
                      <Chip
                        icon={<LocalOfferIcon />}
                        label={dish.price === 'SP' ? 'Special Price' : `$${dish.price}`}
                        size="small"
                        sx={{
                          backgroundColor: dish.price === 'SP' ? '#FF6B6B' : '#4CAF50',
                          color: 'white',
                          fontWeight: 600,
                          height: "28px",
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>

                    {/* Quantity Controls */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "rgba(102, 126, 234, 0.1)",
                        borderRadius: 3,
                        padding: "8px 12px",
                        minWidth: "120px",
                        height: "44px",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => onQuantityChange(dish.id, 'decrease', restaurant.id)}
                        disabled={quantities[dish.id] === 0}
                        sx={{
                          color: "primary.main",
                          backgroundColor: "white",
                          width: 32,
                          height: 32,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                          },
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          minWidth: 24,
                          textAlign: "center",
                          color: "#1976d2",
                          fontSize: "1rem",
                        }}
                      >
                        {quantities[dish.id] || 0}
                      </Typography>
                      
                      <IconButton
                        size="small"
                        onClick={() => onQuantityChange(dish.id, 'increase', restaurant.id)}
                        disabled={quantities[dish.id] >= 10}
                        sx={{
                          color: "primary.main",
                          backgroundColor: "white",
                          width: 32,
                          height: 32,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                          },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Options */}
                  {dish.options && Object.entries(dish.options).map(([optionKey, optionData]) => (
                    <Box key={optionKey} sx={{ marginBottom: 2 }}>
                      <Divider sx={{ marginBottom: 2 }} />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          marginBottom: 1,
                        }}
                      >
                        {optionData.name || optionKey}
                        {optionData.limit === 1 && <span style={{ color: '#FF6B6B' }}> (Required)</span>}
                        {optionData.limit > 1 && ` (Choose up to ${optionData.limit})`}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          marginTop: 1,
                        }}
                      >
                        {optionData.limit === 1 ? (
                          <RadioGroup
                            value={selectedOptions[dish.id]?.[optionKey]?.[0] || ""}
                            onChange={(e) =>
                              handleOptionChange(dish.id, optionKey, e.target.value, optionData.limit)
                            }
                            sx={{
                              display: "flex",
                              flexDirection: isMobile ? "column" : "row",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            {optionData.choices.map((option) => (
                              <FormControlLabel
                                key={option}
                                value={option}
                                control={<Radio size="small" />}
                                label={
                                  <Typography variant="body2" sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                                    {option}
                                  </Typography>
                                }
                                sx={{
                                  flex: "0 1 auto",
                                  margin: 0,
                                  padding: "8px 12px",
                                  backgroundColor: selectedOptions[dish.id]?.[optionKey]?.includes(option) 
                                    ? "rgba(102, 126, 234, 0.1)" 
                                    : "rgba(0, 0, 0, 0.04)",
                                  borderRadius: 2,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                                  },
                                }}
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
                              label={
                                <Typography variant="body2" sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                                  {option}
                                </Typography>
                              }
                              sx={{
                                flex: "0 1 auto",
                                margin: 0,
                                padding: "8px 12px",
                                backgroundColor: selectedOptions[dish.id]?.[optionKey]?.includes(option) 
                                  ? "rgba(102, 126, 234, 0.1)" 
                                  : "rgba(0, 0, 0, 0.04)",
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                                },
                              }}
                            />
                          ))
                        )}
                      </Box>
                    </Box>
                  ))}

                  {/* Add to Cart Button - Inside Card Content */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 3,
                      paddingTop: 2,
                      borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleAddDish(dish)}
                      disabled={quantities[dish.id] === 0}
                      sx={{
                        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                        borderRadius: "50px",
                        height: isMobile ? 48 : 56,
                        fontSize: isMobile ? "1rem" : "1.1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        width: "100%",
                        maxWidth: "300px",
                        boxShadow: "0 6px 20px rgba(255, 105, 135, 0.4)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(255, 105, 135, 0.5)",
                        },
                        "&:disabled": {
                          background: "rgba(0, 0, 0, 0.12)",
                          color: "rgba(0, 0, 0, 0.26)",
                          transform: "none",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Add to Cart
                      {quantities[dish.id] > 0 && (
                        <Chip
                          label={`${quantities[dish.id]}`}
                          size="small"
                          sx={{
                            marginLeft: 1,
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          ))
          ) : (
            <Paper
              elevation={0}
              sx={{
                padding: 4,
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  marginBottom: 1,
                }}
              >
                No dishes available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This restaurant currently has no dishes in the menu.
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default DishForm;
