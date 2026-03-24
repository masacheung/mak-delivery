import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import PickupNotificationBell from "../../components/PickupNotificationBell";

const HomePageHeader = ({
  isMobile,
  events,
  onOpenMenu,
  onOpenEvents,
  isAuthenticated,
  user,
  userMenuAnchor,
  onUserMenuOpen,
  onUserMenuClose,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
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
        onClick={onOpenMenu}
        sx={{
          color: "primary.main",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
          },
        }}
      >
        <DensityMediumIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
      </IconButton>

      <Typography
        variant={isMobile ? "h6" : "h5"}
        component="div"
        sx={{
          flexGrow: 1,
          textAlign: "center",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "Poppins, sans-serif",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.05)",
            transition: "transform 0.2s ease",
          },
        }}
        onClick={() => navigate("/")}
      >
        Mak Delivery
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PickupNotificationBell enabled={isAuthenticated} isMobile={isMobile} />
        <IconButton
          onClick={onOpenEvents}
          sx={{
            color: "primary.main",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
              backgroundColor: "rgba(102, 126, 234, 0.1)",
            },
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
              },
            }}
          >
            <EventIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
          </Badge>
        </IconButton>

        {isAuthenticated ? (
          <>
            <IconButton
              onClick={onUserMenuOpen}
              sx={{
                color: "primary.main",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                },
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={onUserMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem disabled>
                <PersonIcon sx={{ mr: 1 }} />
                {user?.username}
              </MenuItem>
              <MenuItem onClick={onLogout}>
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
              },
            }}
          >
            <PersonIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default HomePageHeader;
