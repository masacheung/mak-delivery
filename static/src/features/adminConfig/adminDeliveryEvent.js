import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Card, CardContent,
  FormControl, FormControlLabel, Checkbox, FormGroup
} from "@mui/material";
import {PICK_UP_LOCATION, RESTAURANT_NAME} from "../../constant/constant";

const AdminDeliveryEvent = () => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [deliveryEvent, setDeliveryEvent] = useState([]);
  const [isFieldsVisible, setIsFieldsVisible] = useState(false);

  const handleTitleClick = () => {
    setIsFieldsVisible(!isFieldsVisible); // Toggle the visibility of the form fields
  };

  const handleChange = (event) => {
    const { value, checked } = event.target;

    setSelectedLocations((prev) => {
      if (checked) {
        return [...prev, value];  // Add to array if checked
      } else {
        return prev.filter((item) => item !== value);  // Remove from array if unchecked
      }
    });
  };

  const handleChangeRestaurant = (event) => {
    const { value, checked } = event.target;

    setSelectedRestaurants((prev) => {
      if (checked) {
        return [...prev, value];  // Add to array if checked
      } else {
        return prev.filter((item) => item !== value);  // Remove from array if unchecked
      }
    });
  };

  const handleSubmit = async () => {
    const eventDate = {
      date: deliveryEvent,
      restaurants: selectedRestaurants,
      locations: selectedLocations
    }
    try {
      const response = await fetch("/api/adminConfig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDate),
      });

      if (!response.ok) {
        throw new Error("Failed to submit delivery event");
      }

      const data = await response.json();
      console.log("Delivery event submitted:", data);
      setSelectedLocations([]);
      setSelectedRestaurants([]);
      setDeliveryEvent([]);
    } catch (error) {
      console.error("Error submit delivery event:", error);
    }
    handleTitleClick();
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          paddingTop: (theme) => `calc(${theme.mixins.toolbar.minHeight}px + 16px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflowX: "hidden",
          gap: 3, // Space between sections
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginBottom: 3,
            fontFamily: 'Poppins, sans-serif',
            textAlign: 'center',
            color: 'text.primary', // Adjust color as needed
            cursor: "pointer", // Show pointer cursor to indicate it's clickable
            transition: "color 0.3s ease, transform 0.2s ease", // Smooth transition effect
            "&:hover": {
              color: "primary.main", // Change color on hover (use theme primary color)
              transform: "scale(1.05)", // Slightly increase size on hover
            }
          }}
          onClick={handleTitleClick}
        >
          Create Delivery Event
        </Typography>

        {isFieldsVisible && (
        <>
          <TextField
            type="date"
            label="Delivery Date"
            InputLabelProps={{ shrink: true }}
            sx={{
              width: "80%", // Adjust width to be more consistent
              maxWidth: 400, // Max width to avoid it stretching too much
              marginBottom: 3, // Space below the date picker
              backgroundColor: "#f5f5f5", // Light background color for better contrast
              borderRadius: "4px", // Slightly rounded corners
            }}
            value={deliveryEvent}
            onChange={(e) => setDeliveryEvent(e.target.value)}
          />

          {/* Pickup Location */}
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <FormControl sx={{ width: "100%", mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontFamily: 'Poppins, sans-serif',
                  color: 'text.primary',
                }}
              >
                Select Pickup Location
              </Typography>

              <Card
                sx={{
                  width: "100%",
                  boxShadow: 2,
                  borderRadius: 2,
                  padding: 2,
                  backgroundColor: "#fff",
                }}
              >
                <CardContent>
                  <FormGroup sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 2 }}>
                    {PICK_UP_LOCATION.map((location, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={selectedLocations.includes(location)}
                            onChange={handleChange}
                            value={location}
                            color="primary"
                          />
                        }
                        label={location}
                        sx={{
                          fontSize: '0.875rem',
                          color: 'text.primary',
                          '& .MuiFormControlLabel-label': {
                            fontWeight: 'normal', // Lighter label font weight
                          },
                        }}
                      />
                    ))}
                  </FormGroup>
                </CardContent>
              </Card>
            </FormControl>
          </Box>

          {/* Restaurant Selection */}
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <FormControl sx={{ width: "100%", mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 2,
                  fontFamily: 'Poppins, sans-serif',
                  color: 'text.primary',
                }}
              >
                Select Restaurants
              </Typography>

              <Card
                sx={{
                  width: "100%",
                  boxShadow: 2,
                  borderRadius: 2,
                  padding: 2,
                  backgroundColor: "#fff",
                }}
              >
                <CardContent>
                  <FormGroup sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 2 }}>
                    {Object.entries(RESTAURANT_NAME).map(([key, name]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            checked={selectedRestaurants.includes(name)}
                            onChange={handleChangeRestaurant}
                            value={name}
                            color="primary"
                          />
                        }
                        label={name}
                        sx={{
                          fontSize: '0.875rem',
                          color: 'text.primary',
                          '& .MuiFormControlLabel-label': {
                            fontWeight: 'normal', // Lighter label font weight
                          },
                        }}
                      />
                    ))}
                  </FormGroup>
                </CardContent>
              </Card>
            </FormControl>
          </Box>

          <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Delievery Event
          </Button>
        </>)}
      </Box>
    </>
  );
};

export default AdminDeliveryEvent;
