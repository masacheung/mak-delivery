import React, { useState } from "react";
import {
    Box, IconButton , Typography, Card, CardContent, List, ListItem,
  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon

const UpcomingEvent = ({events, onClose }) => {
    return (
        <>
        <Box sx={{
            position: "fixed",  // Make sure it stays fixed at the top
            width: "100%",      // Take the full width of the screen
            height: "100vh",    // Take the full height of the screen
            backgroundColor: "white",  // White background
            zIndex: 1300,       // Ensure it's above all content including the header
            display: "flex",     // Use flexbox to position the content
            flexDirection: "column",  // Stack content vertically
            alignItems: "center",     // Horizontally center content
            overflowX: "hidden"
          }}>
            <IconButton 
                onClick={onClose} 
                sx={{
                    position: "absolute",
                    top: 10,
                    left: 20,
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
                }}>
                Upcoming Event(s)
            </Typography>
            {/* Display Events */}
            {events.length > 0 ? (
                events.map((event) => (
                <Card key={event.id} sx={{ mt: 2, p: 2, width: "400px", maxWidth: "100%" }}>
                    <CardContent>
                    {/* Pick-up Date */}
                    <Typography variant="h6" fontWeight="bold">
                        Pick-up Date: {new Date(event.pick_up_date).toLocaleDateString()}
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
        </>
    )
};

export default UpcomingEvent;