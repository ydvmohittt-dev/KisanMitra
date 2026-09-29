import { Link } from "react-router-dom";
import {  FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <h2>KisanMitra</h2>
        <p>One simple workspace for everyday farming needs.</p>
      </div>

      <div className="footer-column">
        <h3>Quick Links</h3>
        <Link to="/">Home</Link>
        <Link to="/weather">Weather</Link>
        <Link to="/mandi">Mandi Prices</Link>
        <Link to="/finance">Finance</Link>
      </div>

      <div className="footer-column">
        <h3>Services</h3>
        <Link to="/labour">Labour</Link>
        <Link to="/machinery">Rent Machinery</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>

      <div className="footer-column contact-column">
        <h3>Contact</h3>
        <p><FiPhone size={15} /> +91 1234567890</p>
        <p><FiMail size={15} /> support@kisanmitra.com</p>
        <p><FiMapPin size={15} /> Haryana, India</p>
      </div>
    </div>
    <div className="copyright">&copy; {new Date().getFullYear()} KisanMitra. Made With ❤️ and 🍵</div>
  </footer>
);

export default Footer;
