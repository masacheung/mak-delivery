import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/apiClient";

const POLL_MS = 30 * 60 * 1000;

/**
 * Loads public `GET /api/adminConfig` on mount and every 30 minutes.
 *
 * @param {object} [options]
 * @param {'silent'|'surface'} [options.errorMode] — `silent`: log and clear events (home); `surface`: expose `error` string (Information pages).
 */
export function useAdminConfigEvents(options = {}) {
  const errorMode = options.errorMode ?? "surface";
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = useCallback(async () => {
    try {
      if (errorMode === "surface") {
        setError("");
      }
      const response = await apiFetch("/api/adminConfig", { auth: "none" });
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
      if (errorMode === "silent") {
        setError("");
      }
    } catch (err) {
      if (errorMode === "silent") {
        console.log("No events available or server not running:", err.message);
        setEvents([]);
        setError("");
      } else {
        setError(err.message);
        setEvents([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [errorMode]);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, POLL_MS);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return { events, isLoading, error, refetch: fetchEvents };
}

/** Home: same polling as `useAdminConfigEvents` but failures do not surface as UI error. */
export function useHomeEvents() {
  return useAdminConfigEvents({ errorMode: "silent" });
}
