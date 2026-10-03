import { userAuthHeaders, adminAuthHeaders } from "./apiAuth";

/** Optional absolute API origin (e.g. `https://api.example.com`). Default: same origin. */
const API_BASE = (process.env.REACT_APP_API_BASE || "").replace(/\/$/, "");
let refreshPending;
export async function refreshSession() {
  if (localStorage.getItem('makSignedOut') === '1') return false;
  if (!refreshPending) refreshPending = fetch(`${API_BASE}/api/users/refresh`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } })
    .then(async response => {
      if (!response.ok) return false;
      const data = await response.json();
      localStorage.setItem('authToken', data.token); localStorage.setItem('userData', JSON.stringify(data.user));
      if (sessionStorage.getItem('makAdminToken') && data.user.role === 'admin') sessionStorage.setItem('makAdminToken', data.token);
      return true;
    }).finally(() => { refreshPending = null; });
  return refreshPending;
}

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
export async function apiFetch(path, options = {}) {
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

  const init = { method, headers, credentials: 'include' };

  if (body !== undefined && method !== "GET" && method !== "HEAD") {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(pathWithBase, init);
  if (response.status === 401 && auth !== 'none' && await refreshSession()) {
    init.headers = { ...(auth === 'admin' ? adminAuthHeaders() : userAuthHeaders()), ...extraHeaders };
    return fetch(pathWithBase, init);
  }
  return response;
}
