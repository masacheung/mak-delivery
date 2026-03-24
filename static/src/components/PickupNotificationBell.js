import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  IconButton,
  Badge,
  Menu,
  Box,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { usePickupNotifications } from "../hooks/usePickupNotifications";

function formatWhen(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

/** Newest first (top), older toward bottom. */
function sortNotificationsNewestFirst(list) {
  if (!list || list.length === 0) return [];
  return [...list].sort((a, b) => {
    const ta = new Date(a.created_at).getTime();
    const tb = new Date(b.created_at).getTime();
    if (Number.isNaN(ta) || Number.isNaN(tb)) return (b.id || 0) - (a.id || 0);
    if (tb !== ta) return tb - ta;
    return (b.id || 0) - (a.id || 0);
  });
}

/**
 * Header bell: badge = unread count; menu lists pickup notices; optional one-time popup for new unread.
 */
export default function PickupNotificationBell({ enabled, isMobile }) {
  const { unreadCount, items, refresh, markRead, markAllRead } = usePickupNotifications(enabled);
  const sortedItems = useMemo(() => sortNotificationsNewestFirst(items), [items]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [autoDialog, setAutoDialog] = useState({ open: false, item: null });
  const prevUnreadRef = useRef(0);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!enabled || sortedItems.length === 0) return;
    const latest = sortedItems[0];
    const prev = prevUnreadRef.current;
    if (unreadCount > prev && latest && !latest.read_at) {
      const key = `makNotifPopup${latest.id}`;
      if (!sessionStorage.getItem(key)) {
        setAutoDialog({ open: true, item: latest });
        sessionStorage.setItem(key, "1");
      }
    }
    prevUnreadRef.current = unreadCount;
  }, [enabled, unreadCount, sortedItems]);

  if (!enabled) return null;

  const closeAuto = () => setAutoDialog({ open: false, item: null });

  const handleAutoMarkRead = async () => {
    if (autoDialog.item?.id) await markRead(autoDialog.item.id);
    closeAuto();
  };

  return (
    <>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
          refresh();
        }}
        sx={{
          color: "primary.main",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
          },
        }}
        aria-label="Pickup notifications"
      >
        <Badge
          badgeContent={unreadCount > 0 ? unreadCount : null}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: isMobile ? 10 : 11,
              minWidth: isMobile ? 16 : 18,
              height: isMobile ? 16 : 18,
            },
          }}
        >
          <NotificationsIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { maxHeight: 480, width: 360, maxWidth: "calc(100vw - 24px)" },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Pickup notices
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Newest first — updates from delivery for your pickup
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Box sx={{ px: 1, py: 0.5, textAlign: "center", borderBottom: 1, borderColor: "divider" }}>
            <Button size="small" onClick={() => markAllRead()}>
              Mark all read
            </Button>
          </Box>
        )}
        <Divider />
        {sortedItems.length === 0 ? (
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet.
            </Typography>
          </Box>
        ) : (
          sortedItems.map((n) => (
            <Box
              key={n.id}
              onClick={() => {
                if (!n.read_at) markRead(n.id);
              }}
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                cursor: n.read_at ? "default" : "pointer",
                bgcolor: n.read_at ? "transparent" : "action.hover",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {formatWhen(n.created_at)}
                {!n.read_at ? " · Unread" : ""}
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                {n.pick_up_location}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                Pickup date: {n.pick_up_date}
              </Typography>
              {n.eta_summary && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {n.eta_summary}
                </Typography>
              )}
              {n.message && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {n.message}
                </Typography>
              )}
            </Box>
          ))
        )}
      </Menu>

      <Dialog open={autoDialog.open} onClose={closeAuto} maxWidth="sm" fullWidth>
        <DialogTitle>New pickup notice</DialogTitle>
        <DialogContent>
          {autoDialog.item && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {formatWhen(autoDialog.item.created_at)}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {autoDialog.item.pick_up_location}
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Pickup date: {autoDialog.item.pick_up_date}
              </Typography>
              {autoDialog.item.eta_summary && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {autoDialog.item.eta_summary}
                </Typography>
              )}
              {autoDialog.item.message && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {autoDialog.item.message}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAuto}>Close</Button>
          <Button variant="contained" onClick={handleAutoMarkRead}>
            Mark as read
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
