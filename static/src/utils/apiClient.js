import { userAuthHeaders, adminAuthHeaders } from "./apiAuth";

/** Optional absolute API origin (e.g. `https://api.example.com`). Default: same origin. */
const API_BASE = (process.env.REACT_APP_API_BASE || "").replace(/\/$/, "");

/**
 * Central `fetch` for app API calls. Relative paths are resolved against `REACT_APP_API_BASE` when set.
 *
 * @param {string} path - e.g. `/api/users/me` or full URL
 * @param {object} [options]
 * @param {string} [options.method='GET']
 * @param {object|string|undefined} [options.body] - Plain objects are JSON-serialised
 * @param {'none'|'user'|'admin'} [options.auth='none'] - Merges Bearer + JSON headers from `apiAuth`
 * @param {Record<string, string>} [options.headers] - Merged on top (overrides)
 */
export function apiFetch(path, options = {}) {
  const {
    method = "GET",
    body,
    auth = "none",
    headers: extraHeaders = {},
  } = options;

  const isAbsolute = /^https?:\/\//i.test(path);
  const pathWithBase = isAbsolute
    ? path
    : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  let headers;
  if (auth === "user") {
    headers = { ...userAuthHeaders(), ...extraHeaders };
  } else if (auth === "admin") {
    headers = { ...adminAuthHeaders(), ...extraHeaders };
  } else {
    headers = {
      "Content-Type": "application/json",
      ...extraHeaders,
    };
  }

  const init = { method, headers };

  if (body !== undefined && method !== "GET" && method !== "HEAD") {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  return fetch(pathWithBase, init);
}
