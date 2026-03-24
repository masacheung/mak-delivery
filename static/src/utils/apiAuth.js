/** Headers for authenticated customer API calls (JWT from login). */
export function userAuthHeaders() {
  const token = localStorage.getItem("authToken");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/** Headers for admin API calls (JWT from /api/users/login when user.role is admin). */
export function adminAuthHeaders() {
  const token = sessionStorage.getItem("makAdminToken");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Restore admin dashboard session after refresh. Server still validates every request.
 * @returns {{ username: string } | null}
 */
export function getAdminSessionFromToken() {
  const token = sessionStorage.getItem("makAdminToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "admin" || !payload.username) return null;
    if (payload.exp * 1000 <= Date.now()) {
      sessionStorage.removeItem("makAdminToken");
      return null;
    }
    return { username: payload.username };
  } catch {
    return null;
  }
}
