import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiTruck,
  FiUsers,
  FiCloud,
  FiBarChart2,
  FiCreditCard,
  FiArrowRight,
} from "react-icons/fi";
import { apiRequest } from "../services/api";
import StatusBox from "../components/StatusBox";

const services = [
  {
    icon: FiCloud,
    title: "Weather",
    desc: "Check current weather for your village.",
    to: "/weather",
  },
  {
    icon: FiUsers,
    title: "Hire Labour",
    desc: "Find labour in your village and city.",
    to: "/labour",
  },
  {
    icon: FiTruck,
    title: "Rent Machinery",
    desc: "Find machines available near you.",
    to: "/machinery",
  },
  {
    icon: FiBarChart2,
    title: "Mandi Prices",
    desc: "Check the latest market prices.",
    to: "/mandi",
  },
  {
    icon: FiCreditCard,
    title: "Finance",
    desc: "Track money you need to receive or pay.",
    to: "/finance",
  },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    apiRequest("/auth/me")
      .then((data) => {
        setUser(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading")
    return (
      <div className="container section">
        <StatusBox type="loading" title="Loading your dashboard..." />
      </div>
    );
  if (status === "error")
    return (
      <div className="container section">
        <StatusBox
          type="error"
          title="Could not load your profile"
          message="Please login again."
        />
      </div>
    );

  return (
    <div className="container section">
      <div className="welcome-banner">
        <div>
          <h1>Welcome back, {user.name.split(" ")[0]}!</h1>
          <p>
            <FiMapPin size={15} /> {user.village}, {user.city}, {user.state}
          </p>
        </div>
      </div>

      <h2 className="section-heading" style={{ textAlign: "left" }}>
        Quick Access
      </h2>
      <p className="section-subheading" style={{ textAlign: "left" }}>
        Choose a service for your farming needs.
      </p>

      <div className="grid grid-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              to={service.to}
              key={service.title}
              className="card service-card"
              style={{ textDecoration: "none" }}>
              <div className="service-icon">
                <Icon size={24} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <span className="service-link">
                Open <FiArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
