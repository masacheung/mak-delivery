import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Event as EventIcon,
  DensityMedium as DensityMediumIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import MoreMenu from "../headerSection/menu/more";
import UpcomingEvent from "../headerSection/upcomingEvent/upcomingEvent";

const overlaySxFullscreen = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1300,
  display: "flex",
  justifyContent: "center",
};

const overlaySxInline = {
  width: "100%",
  padding: 0,
  display: "flex",
  justifyContent: "center",
};

/**
 * Shared MoreMenu + UpcomingEvent layers. `inline` matches the map list page; `fullscreen` matches gradient Information pages.
 */
export function InformationMenuEventOverlays({
  events,
  showMenu,
  setShowMenu,
  showEvents,
  setShowEvents,
  variant = "fullscreen",
}) {
  const sx = variant === "fullscreen" ? overlaySxFullscreen : overlaySxInline;
  return (
    <>
      {showMenu && (
        <Box sx={sx}>
          <MoreMenu onClose={() => setShowMenu(false)} />
        </Box>
      )}
      {showEvents && (
        <Box sx={sx}>
          <UpcomingEvent events={events} onClose={() => setShowEvents(false)} />
        </Box>
      )}
    </>
  );
}

/** Fixed gradient AppBar + Home + event badge; used by Pick-up and Restaurant Partners pages. */
export function InformationGradientAppBar({
  title,
  isMobile,
  events,
  showMenu,
  setShowMenu,
  showEvents,
  setShowEvents,
}) {
  const navigate = useNavigate();
  return (
    <AppBar
      position="fixed"
      sx={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        color: "black",
      }}
    >
      <Toolbar>
        <IconButton
          onClick={() => setShowMenu(true)}
          sx={{
            color: "inherit",
            "&:hover": {
              background: "rgba(0,0,0,0.1)",
              transform: "scale(1.1)",
            },
          }}
        >
          <DensityMediumIcon />
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
          {title}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              color: "inherit",
              "&:hover": {
                background: "rgba(0,0,0,0.1)",
                transform: "scale(1.1)",
              },
            }}
          >
            <HomeIcon />
          </IconButton>

          <IconButton
            onClick={() => setShowEvents(true)}
            sx={{
              color: "inherit",
              "&:hover": {
                background: "rgba(0,0,0,0.1)",
                transform: "scale(1.1)",
              },
            }}
          >
            <Badge
              badgeContent={events.length > 0 ? events.length : null}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.75rem",
                  minWidth: 20,
                  height: 20,
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                },
              }}
            >
              <EventIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
