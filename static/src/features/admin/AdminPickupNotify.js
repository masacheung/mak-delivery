import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { PICK_UP_LOCATION } from "../../constant/constant";
import { apiFetch } from "../../utils/apiClient";

function todayYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const AdminPickupNotify = () => {
  const [pickUpDate, setPickUpDate] = useState(todayYmd);
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [message, setMessage] = useState("");
  const [etaMinutes, setEtaMinutes] = useState("");
  const [sendStatus, setSendStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null);
  const [copyLoading, setCopyLoading] = useState(false);

  const canSend = useMemo(
    () => Boolean(pickUpDate && pickUpLocation.trim()),
    [pickUpDate, pickUpLocation]
  );

  const handleSend = async () => {
    setSendStatus(null);
    if (!canSend) return;
    setSending(true);
    try {
      const trimmedEta = String(etaMinutes).trim();
      let etaPayload;
      if (trimmedEta === "") {
        etaPayload = undefined;
      } else {
        const n = parseInt(trimmedEta, 10);
        if (Number.isNaN(n) || n < 0 || n > 1440) {
          setSendStatus({
            type: "error",
            text: "ETA must be a whole number of minutes between 0 and 1440, or leave blank.",
          });
          setSending(false);
          return;
        }
        etaPayload = n;
      }

      const body = {
        pickUpLocation: pickUpLocation.trim(),
        pickUpDate: pickUpDate.trim(),
        message: message.trim() || undefined,
        etaMinutes: etaPayload,
      };
      const res = await apiFetch("/api/notifications/admin/notify-pickup", {
        method: "POST",
        auth: "admin",
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSendStatus({ type: "error", text: data.error || "Request failed" });
        return;
      }
      setSendStatus({
        type: "success",
        text: data.message || `Sent to ${data.sent} user(s).`,
      });
    } catch (e) {
      setSendStatus({ type: "error", text: "Network error" });
    } finally {
      setSending(false);
    }
  };

  const handleCopyPhones = async () => {
    setCopyStatus(null);
    if (!canSend) return;
    setCopyLoading(true);
    try {
      const q = new URLSearchParams({
        pick_up_date: pickUpDate.trim(),
        pick_up_location: pickUpLocation.trim(),
      });
      const res = await apiFetch(`/api/notifications/admin/order-phones?${q.toString()}`, {
        auth: "admin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCopyStatus({ type: "error", text: data.error || "Failed to load numbers" });
        return;
      }
      const text = data.phonesComma || "";
      if (!text) {
        setCopyStatus({
          type: "warning",
          text: "No phone numbers found for that date and location (orders may use guest checkout without a linked account).",
        });
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopyStatus({
          type: "success",
          text: `Copied ${data.count} number(s), comma-separated — paste into your SMS app’s recipient field.`,
        });
      } catch {
        const preview = text.length > 120 ? `${text.slice(0, 120)}…` : text;
        setCopyStatus({
          type: "warning",
          text: `Clipboard blocked — select and copy from your browser, or try again over HTTPS. Preview: ${preview}`,
        });
      }
    } catch {
      setCopyStatus({ type: "error", text: "Network error" });
    } finally {
      setCopyLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Send a notice to every customer who has an order on the selected date at the selected pickup
        location. Optionally add an ETA in minutes (no maps API — you enter the time yourself).
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        <strong>Manual SMS:</strong> choose the same date and location below, then use{" "}
        <strong>Copy customer phones</strong> to copy all registered phone numbers (comma-separated)
        for pasting into your phone’s SMS app — no Twilio charge.
      </Typography>

      {sendStatus && (
        <Alert severity={sendStatus.type} sx={{ mb: 2 }} onClose={() => setSendStatus(null)}>
          {sendStatus.text}
        </Alert>
      )}
      {copyStatus && (
        <Alert severity={copyStatus.type} sx={{ mb: 2 }} onClose={() => setCopyStatus(null)}>
          {copyStatus.text}
        </Alert>
      )}

      <TextField
        fullWidth
        type="date"
        label="Order pickup date"
        value={pickUpDate}
        onChange={(e) => setPickUpDate(e.target.value)}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        select
        label="Pickup location"
        value={pickUpLocation}
        onChange={(e) => setPickUpLocation(e.target.value)}
        margin="normal"
        helperText="Must match the location string on customer orders exactly."
      >
        <MenuItem value="">
          <em>Select location</em>
        </MenuItem>
        {PICK_UP_LOCATION.map((loc) => (
          <MenuItem key={loc} value={loc}>
            {loc}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="outlined"
        startIcon={copyLoading ? <CircularProgress size={18} /> : <ContentCopyIcon />}
        disabled={!canSend || copyLoading}
        onClick={handleCopyPhones}
        sx={{ mt: 1, mb: 1 }}
      >
        Copy customer phones (for SMS app)
      </Button>

      <TextField
        fullWidth
        type="number"
        inputProps={{ min: 0, max: 1440, step: 1 }}
        label="ETA (minutes, optional)"
        value={etaMinutes}
        onChange={(e) => setEtaMinutes(e.target.value)}
        margin="normal"
        helperText="Whole minutes until you arrive at pickup (0–1440). Leave empty for no ETA line."
      />

      <TextField
        fullWidth
        multiline
        minRows={2}
        label="Optional message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        margin="normal"
        placeholder="e.g. Running 10 minutes late — thank you for waiting."
      />

      <Button
        variant="contained"
        color="primary"
        startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
        disabled={!canSend || sending}
        onClick={handleSend}
        sx={{
          mt: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        Send notification
      </Button>
    </Box>
  );
};

export default AdminPickupNotify;
