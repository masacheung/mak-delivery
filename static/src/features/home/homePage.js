import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";
import MoreMenu from "../headerSection/menu/more";
import { useAuth } from "../../hooks/useAuth";
import { useHomeEvents } from "./useHomeEvents";
import HomePageHeader from "./HomePageHeader";
import HomeLandingContent from "./HomeLandingContent";

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showMenu, setShowMenu] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const { events, isLoading, error } = useHomeEvents();
  const { isAuthenticated, user, logout, loading } = useAuth();

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
      <HomePageHeader
        isMobile={isMobile}
        events={events}
        onOpenMenu={() => setShowMenu(true)}
        onOpenEvents={() => setShowEvents(true)}
        isAuthenticated={isAuthenticated}
        user={user}
        userMenuAnchor={userMenuAnchor}
        onUserMenuOpen={handleUserMenuOpen}
        onUserMenuClose={handleUserMenuClose}
        onLogout={handleLogout}
      />

      {showMenu && (
        <Box className="overlay">
          <MoreMenu onClose={() => setShowMenu(false)} />
        </Box>
      )}

      {showEvents && (
        <Box className="overlay">
          <UpcomingEvent events={events} onClose={() => setShowEvents(false)} />
        </Box>
      )}

      <HomeLandingContent
        isMobile={isMobile}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        user={user}
        onStartOrdering={handleStartOrdering}
        onTrackOrder={() => navigate("/lookup-order")}
        error={error}
      />
    </Box>
  );
};

export default HomePage;
