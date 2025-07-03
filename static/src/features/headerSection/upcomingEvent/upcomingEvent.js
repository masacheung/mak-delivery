import React, { useState } from "react";
import {
  Box, 
  IconButton, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Container,
  Chip,
  Divider
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const UpcomingEvent = ({ events, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "16px" : "24px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventIcon sx={{ color: "primary.main" }} />
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Upcoming Events
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: "primary.main",
            transition: "all 0.3s ease",
            "&:hover": { 
              transform: "scale(1.1)",
              backgroundColor: "rgba(102, 126, 234, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          padding: isMobile ? "16px" : "24px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            paddingRight: 1,
          }}
          className="custom-scroll"
        >
          {events.length > 0 ? (
            events.map((event, index) => (
              <Slide key={event.id} direction="up" in={true} timeout={300 + index * 100}>
                <Card
                  className="modern-card"
                  sx={{
                    marginBottom: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 4,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ padding: isMobile ? "20px" : "24px" }}>
                    {/* Date Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginBottom: 3,
                        padding: "12px 16px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: 2,
                        color: "white",
                      }}
                    >
                      <EventIcon />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {new Date(event.pick_up_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>

                    {/* Pick-up Locations */}
                    <Box sx={{ marginBottom: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2 }}>
                        <LocationOnIcon sx={{ color: "primary.main" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                          }}
                        >
                          Pick-up Locations
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {event.pick_up_locations.map((location, index) => (
                          <Chip
                            key={index}
                            label={location}
                            variant="outlined"
                            sx={{
                              borderColor: "primary.main",
                              color: "primary.main",
                              "&:hover": {
                                backgroundColor: "rgba(102, 126, 234, 0.1)",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Divider sx={{ marginBottom: 3 }} />

                    {/* Restaurants */}
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2 }}>
                        <RestaurantIcon sx={{ color: "primary.main" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                          }}
                        >
                          Available Restaurants
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {event.restaurants.map((restaurant, index) => (
                          <Chip
                            key={index}
                            label={restaurant}
                            sx={{
                              backgroundColor: "rgba(76, 175, 80, 0.1)",
                              color: "#4CAF50",
                              fontWeight: 600,
                              "&:hover": {
                                backgroundColor: "rgba(76, 175, 80, 0.2)",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            ))
          ) : (
            <Fade in={true} timeout={500}>
              <Paper
                elevation={0}
                sx={{
                  padding: isMobile ? "40px 24px" : "60px 40px",
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <EventIcon sx={{ fontSize: 80, color: "text.secondary", opacity: 0.5 }} />
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    marginBottom: 1,
                  }}
                >
                  No Upcoming Events
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{
                    color: "text.secondary",
                    maxWidth: "400px",
                    lineHeight: 1.6,
                  }}
                >
                  There are currently no scheduled delivery events. Check back soon for updates on new restaurant partnerships and delivery schedules!
                </Typography>
                <Box
                  sx={{
                    marginTop: 2,
                    padding: "12px 24px",
                    background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                    borderRadius: 3,
                    color: "white",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    💡 Events are typically scheduled weekly
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default UpcomingEvent;
