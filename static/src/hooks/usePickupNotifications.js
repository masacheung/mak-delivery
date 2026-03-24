import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/apiClient";

const POLL_MS = 45 * 1000;

/**
 * Poll unread pickup notifications for logged-in customers.
 */
export function usePickupNotifications(enabled) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setUnreadCount(0);
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const [cRes, lRes] = await Promise.all([
        apiFetch("/api/notifications/unread-count", { auth: "user" }),
        apiFetch("/api/notifications?limit=50", { auth: "user" }),
      ]);
      if (cRes.status === 401 || lRes.status === 401) {
        setUnreadCount(0);
        setItems([]);
        return;
      }
      const cData = await cRes.json().catch(() => ({}));
      const list = await lRes.json().catch(() => []);
      if (cRes.ok && typeof cData.count === "number") {
        setUnreadCount(cData.count);
      }
      if (lRes.ok && Array.isArray(list)) {
        setItems(list);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!enabled) return undefined;
    const t = setInterval(refresh, POLL_MS);
    return () => clearInterval(t);
  }, [enabled, refresh]);

  const markRead = useCallback(async (id) => {
    const res = await apiFetch(`/api/notifications/${id}/read`, { method: "PUT", auth: "user" });
    if (res.ok) await refresh();
  }, [refresh]);

  const markAllRead = useCallback(async () => {
    const res = await apiFetch("/api/notifications/mark-all-read", { method: "POST", auth: "user" });
    if (res.ok) await refresh();
  }, [refresh]);

  return {
    unreadCount,
    items,
    loading,
    refresh,
    markRead,
    markAllRead,
  };
}
