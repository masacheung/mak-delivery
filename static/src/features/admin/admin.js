import React, { useState, useEffect } from "react";
import {
  Badge,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Chip,
  Tab,
  Tabs,
  Divider,
  Alert,
} from "@mui/material";
import {
  AccountCircle,
  Event as EventIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminDeliveryEvent from "../adminConfig/adminDeliveryEvent";
import AdminOrdersLookup from "../adminOrdersLookup/adminOrdersLookup";
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";

const Admin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleLogin = (e) => {
    e.preventDefault();
    const adminUser = "admin";
    const adminPass = "aDm1n";

    if (username === adminUser && password === adminPass) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleSearch = async () => {
    try {
      setError("");
      const response = await fetch("/api/adminConfig");
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    handleSearch();
    const interval = setInterval(() => {
      handleSearch();
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}>
        <Container maxWidth="sm">
          <Fade in={true} timeout={1000}>
            <Box>
              {/* Logo Section */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto',
                    mb: 2,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <img src="/delivery-truck.png" alt="Logo" style={{ width: 50, height: 50 }} />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'Poppins, sans-serif',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Mak Delivery
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 300,
                  }}
                >
                  Admin Panel
                </Typography>
              </Box>

              {/* Login Card */}
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <AdminIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#333',
                      mb: 1,
                    }}
                  >
                    Administrator Login
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please enter your credentials to access the admin panel
                  </Typography>
                </Box>

                <form onSubmit={handleLogin}>
                  <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                  
                  {error && (
                    <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 3,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}
                  >
                    Sign In
                  </Button>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Secured admin access for authorized personnel only
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          color: 'black',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img 
              src="/delivery-truck.png" 
              alt="Logo" 
              style={{ width: isMobile ? 30 : 40, height: isMobile ? 30 : 40 }} 
            />
          </Box>
          
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
            {isMobile ? "Admin Panel" : "Mak Delivery - Admin Panel"}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={() => navigate("/")}
              sx={{ 
                color: 'inherit',
                '&:hover': { 
                  background: 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <HomeIcon />
            </IconButton>
            
            <IconButton 
              onClick={() => setShowEvents(true)}
              sx={{ 
                color: 'inherit',
                '&:hover': { 
                  background: 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Badge 
                badgeContent={events.length > 0 ? events.length : null} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: '0.75rem',
                    minWidth: 20,
                    height: 20,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  }
                }}
              >
                <EventIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Upcoming Event */}
      {showEvents && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <UpcomingEvent events={events} onClose={() => setShowEvents(false)} />
        </Box>
      )}

      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <Fade in={true} timeout={1000}>
          <Box>
            {/* Admin Dashboard Header */}
            <Paper
              elevation={8}
              sx={{
                p: 4,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              <DashboardIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: isMobile ? '1.8rem' : '2.5rem',
                }}
              >
                Administrator Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Manage delivery events and monitor orders
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<SettingsIcon />}
                  label="Event Management"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
                <Chip
                  icon={<EventIcon />}
                  label={`${events.length} Active Events`}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            </Paper>

            {/* Admin Tabs */}
            <Paper
              elevation={8}
              sx={{
                mb: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none',
                  },
                  '& .Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  },
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: 3,
                  },
                }}
              >
                <Tab 
                  label="Delivery Events" 
                  icon={<SettingsIcon />}
                  iconPosition="start"
                />
                <Tab 
                  label="Orders Lookup" 
                  icon={<EventIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </Paper>

            {/* Tab Content */}
            <Paper
              elevation={8}
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                minHeight: '500px',
              }}
            >
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea', mb: 3 }}>
                    Delivery Event Management
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <AdminDeliveryEvent />
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea', mb: 3 }}>
                    Orders Lookup & Management
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <AdminOrdersLookup />
                </Box>
              )}
            </Paper>

            {/* Admin Info Footer */}
            <Paper
              elevation={8}
              sx={{
                p: 3,
                mt: 4,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Administrator Panel - Mak Delivery System
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Logged in as: <strong>admin</strong> | Session secured
              </Typography>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Admin;
