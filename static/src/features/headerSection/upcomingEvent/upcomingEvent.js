import React, { useState } from "react";
import {
  Box, IconButton, Typography, Card, CardContent, List, ListItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon

const UpcomingEvent = ({ events, onClose }) => {
  return (
    <>
      <Box
        sx={{
          position: "fixed",  // Ensure the container stays fixed
          width: "100%",      // Full width
          height: "100vh",    // Full height of the viewport
          backgroundColor: "white",  // White background
          zIndex: 1300,       // Ensure it's above other content
          display: "flex",     // Flexbox layout
          flexDirection: "column",  // Stack the content vertically
          alignItems: "center",     // Center content horizontally
          overflowX: "hidden"  // Prevent horizontal overflow
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "0.5rem",
            left: "0.25rem",
            backgroundColor: "gray",
            color: "white",
            zIndex: 1100, // Ensure the button stays above all content
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom
          sx={{
            fontWeight: "bold",
            fontFamily: "Poppins, sans-serif",
            marginTop: 5, // Space above the title
          }}
        >
          Upcoming Event(s)
        </Typography>

        {/* Scrollable Event List Container */}
        <Box
          sx={{
            width: "100%",
            flex: 1,             // Allow this container to take up the remaining height
            overflowY: "auto",   // Enable vertical scrolling
            padding: 2,          // Padding around the content
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,              // Gap between cards
          }}
        >
          {events.length > 0 ? (
            events.map((event) => (
              <Card
                key={event.id}
                sx={{
                  mt: 2,
                  p: 2,
                  width: "90%",
                  maxWidth: "400px",
                  overflow: "visible", // Make sure content inside the card can overflow
                }}
              >
                <CardContent>
                  {/* Pick-up Date */}
                  <Typography variant="h6" fontWeight="bold">
                    Pick-up Date: {new Date(event.pick_up_date).toISOString().split("T")[0]}
                  </Typography>

                  {/* Pick-up Locations */}
                  <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                    Pick-up Locations:
                  </Typography>
                  <List dense>
                    {event.pick_up_locations.map((location, index) => (
                      <ListItem key={index} sx={{ pl: 2 }}>
                        • {location}
                      </ListItem>
                    ))}
                  </List>

                  {/* Restaurants */}
                  <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                    Restaurants:
                  </Typography>
                  <List dense>
                    {event.restaurants.map((restaurant, index) => (
                      <ListItem key={index} sx={{ pl: 2 }}>
                        🍽️ {restaurant}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ mt: 2 }}>No upcoming events found.</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UpcomingEvent;
