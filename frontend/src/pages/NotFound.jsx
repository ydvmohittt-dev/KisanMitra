import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";

const NotFound = () => (
  <div className="container section" style={{ textAlign: "center", padding: "80px 24px" }}>
    <FaLeaf size={40} color="var(--green)" />
    <h2 style={{ marginTop: 16 }}>Page Not Found</h2>
    <p style={{ color: "var(--muted)" }}>The page you're looking for doesn't exist.</p>
    <Link className="btn btn-primary" to="/" style={{ marginTop: 12 }}>Back to Home</Link>
  </div>
);

export default NotFound;
