const API_URL = import.meta.env.VITE_API_URL || " https://kisanmitra-y5so.onrender.com/api";

// One small helper for all API calls. It adds the JWT and returns JSON.
export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
