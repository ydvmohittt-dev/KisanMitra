import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {  FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { Leaf } from "lucide-react";
import { apiRequest } from "../services/api";
import { isLoggedIn, logout } from "../services/auth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const loggedIn = isLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) return;
    apiRequest("/auth/me").then(setUser).catch(() => setUser(null));
  }, [loggedIn]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="main-header">
      <Link to="/" className="logo">
      
        KisanMitra
      </Link>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <nav className={`top-nav ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" end className="nav-link" onClick={closeMenu}>Home</NavLink>
        {loggedIn && (
          <>
            <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</NavLink>
            <NavLink to="/weather" className="nav-link" onClick={closeMenu}>Weather</NavLink>
            <NavLink to="/labour" className="nav-link" onClick={closeMenu}>Labour</NavLink>
            <NavLink to="/machinery" className="nav-link" onClick={closeMenu}>Machinery</NavLink>
            <NavLink to="/mandi" className="nav-link" onClick={closeMenu}>Mandi</NavLink>
            <NavLink to="/finance" className="nav-link" onClick={closeMenu}>Finance</NavLink>
          </>
        )}

        <div className="nav-user">
          {loggedIn ? (
            <>
              {user && <span className="nav-user-name"><FiUser size={15} /> {user.name}</span>}
              <button className="logout-btn" onClick={logout}><FiLogOut size={15} /> Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={closeMenu}>Login</NavLink>
              <button className="btn btn-primary" onClick={() => navigate("/register")}>Get Started</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
