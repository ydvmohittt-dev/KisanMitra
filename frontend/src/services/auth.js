// Small helpers around the JWT stored in localStorage.
// Keeping auth this simple (no context, no global store) makes it easy
// to follow: the token is the single source of truth for "logged in".

export const isLoggedIn = () => Boolean(localStorage.getItem("token"));

export const saveToken = (token) => localStorage.setItem("token", token);

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
