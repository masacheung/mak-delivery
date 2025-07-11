import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Typography, 
  IconButton, 
  Badge, 
  Container, 
  Paper, 
  useTheme, 
  useMediaQuery,
  Fade,
  Slide,
  Menu,
  MenuItem,
  Avatar
} from "@mui/material";
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import EventIcon from "@mui/icons-material/Event";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";
import MoreMenu from "../headerSection/menu/more";
import { useAuth } from "../../hooks/useAuth";

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  const { isAuthenticated, user, logout, loading } = useAuth();

  const handleSearch = async () => {
    try {
      setError(null);
      const response = await fetch("/api/adminConfig");
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }
      const data = await response.json();
      // Handle empty events gracefully
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("No events available or server not running:", err.message);
      setEvents([]); // Set empty array instead of showing error
      setError(null); // Don't show error to user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  
    const interval = setInterval(() => {
      handleSearch();
    }, 30 * 60 * 1000);
  
    return () => clearInterval(interval);
  }, []);

  const handleStartOrdering = () => {
    if (isAuthenticated) {
      navigate("/restaurants");
    } else {
      navigate("/auth?redirect=/restaurants");
    }
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="loading-spinner" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isMobile 
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        className={isMobile ? "app-header-mobile" : "app-header"}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "12px 16px" : "16px 24px",
          zIndex: 1100,
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <IconButton 
          onClick={() => setShowMenu(true)}
          sx={{
            color: "primary.main",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
              backgroundColor: "rgba(102, 126, 234, 0.1)",
            }
          }}
        >
          <DensityMediumIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
        </IconButton>

        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            textAlign: 'center',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Poppins, sans-serif',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease',
            }
          }}
          onClick={() => navigate("/")}
        >
          Mak Delivery
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={() => setShowEvents(true)}
            sx={{
              color: "primary.main",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
                backgroundColor: "rgba(102, 126, 234, 0.1)",
              }
            }}
          >
            <Badge 
              badgeContent={events.length > 0 ? events.length : null} 
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "linear-gradient(45deg, #FF6B6B, #FF8E53)",
                  color: "white",
                  fontSize: isMobile ? 10 : 12,
                  minWidth: isMobile ? 16 : 20,
                  height: isMobile ? 16 : 20,
                }
              }}
            >
              <EventIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
            </Badge>
          </IconButton>

          {/* User Menu */}
          {isAuthenticated ? (
            <>
              <IconButton 
                onClick={handleUserMenuOpen}
                sx={{
                  color: "primary.main",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                  }
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <PersonIcon sx={{ mr: 1 }} />
                  {user?.username}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton 
              onClick={() => navigate("/auth")}
              sx={{
                color: "primary.main",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                }
              }}
            >
              <PersonIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Menu Overlay */}
      {showMenu && (
        <Box className="overlay">
          <MoreMenu onClose={() => setShowMenu(false)} />
        </Box>
      )}

      {/* Events Overlay */}
      {showEvents && (
        <Box className="overlay">
          <UpcomingEvent events={events} onClose={() => setShowEvents(false)} />
        </Box>
      )}

      {/* Main Content */}
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
            {/* Hero Section */}
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

            {/* Action Buttons */}
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
                  onClick={handleStartOrdering}
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
                  onClick={() => navigate("/lookup-order")}
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

            {/* Features Section - Desktop Only */}
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
                  {[
                    { icon: "🍜", title: "Fresh Food", desc: "Quality ingredients" },
                    { icon: "🚚", title: "Fast Delivery", desc: "Quick & reliable" },
                    { icon: "📱", title: "Easy Ordering", desc: "Simple & intuitive" },
                  ].map((feature, index) => (
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
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                      >
                        {feature.desc}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Fade>
            )}
          </Box>
        </Fade>

        {/* Loading State */}
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

        {/* Error State */}
        {error && (
          <Box className="error-message" sx={{ marginTop: 2 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
