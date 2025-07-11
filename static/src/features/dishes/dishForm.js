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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';

const DishForm = ({ restaurant, quantities, onQuantityChange, onAddDish, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [expandedDishes, setExpandedDishes] = useState({});
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
    // Check if dish has required options that aren't expanded
    const hasRequiredOptions = dish.options && Object.values(dish.options).some(opt => opt.limit === 1);
    
    if (hasRequiredOptions && !expandedDishes[dish.id]) {
      // Auto-expand to show required options
      setExpandedDishes(prev => ({
        ...prev,
        [dish.id]: true
      }));
      alert("Please select the required options for this dish.");
      return;
    }

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

  const toggleDishExpansion = (dishId) => {
    setExpandedDishes(prev => ({
      ...prev,
      [dishId]: !prev[dishId]
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header - Always Visible */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(15px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          zIndex: 1300,
          top: 0,
          left: 0,
          right: 0,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "0 16px" : "0 24px",
            minHeight: isMobile ? "56px" : "64px",
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
                backgroundColor: "rgba(102, 126, 234, 0.1)",
                borderRadius: "50%",
                width: 40,
                height: 40,
                transition: "all 0.3s ease",
                "&:hover": { 
                  transform: "scale(1.1)",
                  backgroundColor: "rgba(102, 126, 234, 0.2)",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                },
              }}
            >
              <CloseIcon fontSize="medium" />
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
          paddingTop: isMobile ? "72px" : "80px", // Add top padding for fixed header
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
            // Remove maxHeight constraint to allow cards to expand
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
                  height: "auto",
                  // Remove minHeight to allow full expansion based on content
                  marginBottom: 2,
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 1, // Ensure cards stay below header
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <CardContent sx={{ 
                  padding: isMobile ? 2 : 3,
                  // Remove height constraint to allow natural content flow
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  flex: 1
                }}>
                  {/* Dish Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 2,
                      // Remove minHeight to allow natural sizing
                      width: "100%",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                        <Typography
                          variant={isMobile ? "h6" : "h5"}
                          sx={{
                            fontWeight: 600,
                            color: "#1976d2",
                            fontSize: isMobile ? "1rem" : "1.1rem",
                            lineHeight: 1.2,
                            wordBreak: "break-word",
                          }}
                        >
                          {dish.name}
                        </Typography>
                        {dish.options && Object.keys(dish.options).length > 0 && (
                          <Chip
                            icon={<TuneIcon />}
                            label={`${Object.keys(dish.options).length} options`}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(102, 126, 234, 0.1)",
                              color: "primary.main",
                              fontWeight: 500,
                              height: "24px",
                              fontSize: "0.7rem",
                            }}
                          />
                        )}
                      </Box>
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

                  {/* Options Expand Button */}
                  {dish.options && Object.keys(dish.options).length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toggleDishExpansion(dish.id)}
                        startIcon={<TuneIcon />}
                        endIcon={expandedDishes[dish.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{
                          borderRadius: "20px",
                          borderColor: "rgba(102, 126, 234, 0.3)",
                          color: "primary.main",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          textTransform: "none",
                          padding: "6px 16px",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: "rgba(102, 126, 234, 0.1)",
                          },
                        }}
                      >
                        {expandedDishes[dish.id] ? "Hide Options" : `Show Options (${Object.keys(dish.options).length})`}
                      </Button>
                    </Box>
                  )}

                  {/* Options - Conditionally Rendered */}
                  {dish.options && expandedDishes[dish.id] && Object.entries(dish.options).map(([optionKey, optionData]) => (
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
