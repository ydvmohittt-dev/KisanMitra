import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

// Wrap any page element with this to require a logged-in farmer.
// If there is no JWT in localStorage, send them to the login page.
const ProtectedRoute = ({ children }) => {
  
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
