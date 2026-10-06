import React, { useState, useEffect } from "react";
import { useAdminConfigEvents } from "../../hooks/useAdminConfigEvents";
import {
  Badge,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  Paper,
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
  Event as EventIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  Visibility,
  VisibilityOff,
  NotificationsActive as NotifyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminDeliveryEvent from "../adminConfig/adminDeliveryEvent";
import AdminOrdersLookup from "../adminOrdersLookup/adminOrdersLookup";
import AdminArrivalTimes from './AdminArrivalTimes';
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";
import { getAdminSessionFromToken } from "../../utils/apiAuth";
import { apiFetch } from "../../utils/apiClient";

const Admin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [error, setError] = useState("");
  const { events } = useAdminConfigEvents({ errorMode: "silent" });
  const [showEvents, setShowEvents] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await apiFetch("/api/users/login", {
        method: "POST",
        auth: "none",
        body: { username, password },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.message || "Invalid username or password");
        return;
      }
      if (data.user?.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }
      if (data.token) {
        sessionStorage.setItem("makAdminToken", data.token);
      }
      setAdminUsername(data.user?.username || username);
      setIsAuthenticated(true);
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    const session = getAdminSessionFromToken();
    if (session) {
      setAdminUsername(session.username);
      setIsAuthenticated(true);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: '#f7f7fb',
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
                    background: '#ffffff',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e5ef',
                  }}
                >
                  <img src="/admin/icon-192.png" alt="Logo" style={{ width: 50, height: 50 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 'bold',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  Mak Delivery Admin
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 300,
                  }}
                >
                  Admin Panel
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  Add this page to your phone’s Home Screen as Mak Delivery Admin to open the dashboard directly.
                </Typography>
              </Box>

              {/* Login Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: '#ffffff',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid #e5e5ef',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <AdminIcon sx={{ fontSize: 60, color: '#5557d9', mb: 2 }} />
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
                    Sign in with your administrator account.
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
                        '&:hover fieldset': { borderColor: '#5557d9' },
                        '&.Mui-focused fieldset': { borderColor: '#5557d9' },
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
                        '&:hover fieldset': { borderColor: '#5557d9' },
                        '&.Mui-focused fieldset': { borderColor: '#5557d9' },
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
                      background: '#5557d9',
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
      background: '#f7f7fb',
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
          background: '#ffffff',
          backdropFilter: 'blur(10px)',
          border: '1px solid #e5e5ef',
          boxShadow: 'none',
          color: 'black',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img
              src="/admin/icon-192.png"
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
              background: '#5557d9',
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
            {isMobile ? "Mak Admin" : "Mak Delivery Admin"}
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box>
                <Typography variant="h5" component="h1" fontWeight={800}>Manage deliveries</Typography>
                <Typography variant="body2" color="text.secondary">Orders, delivery dates and arrival times.</Typography>
              </Box>
              <Chip variant="outlined" label={`Signed in as ${adminUsername || 'admin'}`} />
            </Box>
            {/* Admin Tabs */}
            <Paper
              elevation={0}
              sx={{
                mb: 2,
                background: '#ffffff',
                backdropFilter: 'blur(10px)',
                border: '1px solid #e5e5ef',
                borderRadius: 2,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered={!isMobile}
                variant={isMobile ? 'scrollable' : 'standard'}
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none',
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  },
                  '& .MuiTabs-indicator': {
                    background: '#5557d9',
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
                <Tab label="Arrival times" icon={<NotifyIcon />} iconPosition="start" />
              </Tabs>
            </Paper>

            {/* Tab Content */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1, sm: 3 },
                background: '#ffffff',
                backdropFilter: 'blur(10px)',
                border: '1px solid #e5e5ef',
                borderRadius: 2,
                minHeight: '300px',
              }}
            >
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5557d9', mb: 3 }}>
                    Delivery Event Management
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <AdminDeliveryEvent />
                </Box>
              )}

              {activeTab === 1 && (
                <AdminOrdersLookup />
              )}

              {activeTab === 2 && <AdminArrivalTimes />}
            </Paper>

          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Admin;
