import React from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Fade,
  Slide,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";

const DESKTOP_FEATURES = [
  { icon: "🍜", title: "Fresh Food", desc: "Quality ingredients" },
  { icon: "🚚", title: "Fast Delivery", desc: "Quick & reliable" },
  { icon: "📱", title: "Easy Ordering", desc: "Simple & intuitive" },
];

const HomeLandingContent = ({
  isMobile,
  isLoading,
  isAuthenticated,
  user,
  onStartOrdering,
  onTrackOrder,
  error,
}) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "80px 16px 40px" : "100px 24px 60px",
        position: "relative",
      }}
    >
      <Fade in={!isLoading} timeout={800}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: isMobile ? 3 : 4,
            width: "100%",
            maxWidth: isMobile ? "100%" : "500px",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: isMobile ? 3 : 4,
              padding: isMobile ? "24px" : "32px",
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              width: "100%",
            }}
          >
            <Slide direction="down" in={!isLoading} timeout={600}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
                    fontSize: isMobile ? "2.5rem" : "3.5rem",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    marginBottom: 2,
                    lineHeight: 1.2,
                  }}
                >
                  麥麥送
                </Typography>
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 300,
                    marginBottom: isAuthenticated ? 2 : 3,
                  }}
                >
                  Your favorite meals, delivered fresh
                </Typography>
                {isAuthenticated && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      background: "rgba(76, 175, 80, 0.2)",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      display: "inline-block",
                      marginBottom: 1,
                    }}
                  >
                    Welcome back, {user?.username}! 👋
                  </Typography>
                )}
              </Box>
            </Slide>
          </Paper>

          <Slide direction="up" in={!isLoading} timeout={800}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                maxWidth: isMobile ? "100%" : "400px",
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<RestaurantIcon />}
                onClick={onStartOrdering}
                sx={{
                  background: isAuthenticated
                    ? "linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)"
                    : "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  borderRadius: "50px",
                  height: isMobile ? "56px" : "64px",
                  fontSize: isMobile ? "1.1rem" : "1.3rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: isAuthenticated
                    ? "0 8px 30px rgba(76, 175, 80, 0.4)"
                    : "0 8px 30px rgba(255, 105, 135, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: isAuthenticated
                      ? "0 12px 40px rgba(76, 175, 80, 0.5)"
                      : "0 12px 40px rgba(255, 105, 135, 0.5)",
                  },
                }}
              >
                {isAuthenticated ? "Start Ordering" : "Login to Order"}
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<SearchIcon />}
                onClick={onTrackOrder}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  color: "white",
                  borderRadius: "50px",
                  height: isMobile ? "56px" : "64px",
                  fontSize: isMobile ? "1.1rem" : "1.3rem",
                  fontWeight: 600,
                  textTransform: "none",
                  backdropFilter: "blur(10px)",
                  background: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Track Your Order
              </Button>
            </Box>
          </Slide>

          {!isMobile && (
            <Fade in={!isLoading} timeout={1000}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 3,
                  width: "100%",
                  maxWidth: "600px",
                  marginTop: 4,
                }}
              >
                {DESKTOP_FEATURES.map((feature, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 2,
                      padding: 2,
                      textAlign: "center",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        background: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "2rem", marginBottom: 1 }}>
                      {feature.icon}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "white", fontWeight: 600, marginBottom: 0.5 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                      {feature.desc}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Fade>
          )}
        </Box>
      </Fade>

      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <div className="loading-spinner" />
        </Box>
      )}

      {error && (
        <Box className="error-message" sx={{ marginTop: 2 }}>
          <Typography>{error}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default HomeLandingContent;
