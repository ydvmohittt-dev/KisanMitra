import { Link } from "react-router-dom";
import {
  FiTruck,
  FiUsers,
  FiCloud,
  FiBarChart2,
  FiCreditCard,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { isLoggedIn } from "../services/auth";

const services = [
  {
    icon: FiTruck,
    title: "Rent Machinery",
    desc: "Find tractors and farm machines available near you.",
    to: "/machinery",
  },
  {
    icon: FiUsers,
    title: "Hire Labour",
    desc: "Find labour available in your village and city.",
    to: "/labour",
  },
  {
    icon: FiCloud,
    title: "Weather",
    desc: "Check current weather for your village.",
    to: "/weather",
  },
  {
    icon: FiBarChart2,
    title: "Live Mandi Prices",
    desc: "Track the latest prices from nearby markets.",
    to: "/mandi",
  },
  {
    icon: FiCreditCard,
    title: "Finance",
    desc: "Keep track of money you need to receive and pay.",
    to: "/finance",
  },
];

const Home = () => {
  const loggedIn = isLoggedIn();

  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">
            Kisan<span>Mitra</span>
          </p>
          <h2>One simple platform for everyday farming needs.</h2>
          <p>
            Find local labour and machinery, check current weather and mandi
            prices, and manage your farm finances in one place.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
            <Link
              className="btn btn-primary"
              to={loggedIn ? "/dashboard" : "/register"}>
              {loggedIn ? "Open Dashboard" : "Get Started"}{" "}
              <FiArrowRight size={16} />
            </Link>
            <a className="btn btn-outline" href="#services">
              Explore Services
            </a>
          </div>
        </div>
      </section>

      <section className="section container" id="services">
        <h2 className="section-heading">Services</h2>
        <p className="section-subheading">
          Useful tools organised around everyday farming work.
        </p>
        <div className="grid grid-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div className="card service-card" key={service.title}>
                <div className="service-icon">
                  <Icon size={26} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <Link
                  className="service-link"
                  to={loggedIn ? service.to : "/login"}>
                  {loggedIn ? "Open" : "Login to access"}{" "}
                  <FiArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section container">
        <div
          className="card"
          style={{ background: "var(--light-green)", border: "none" }}>
          <h2 className="section-heading">Why KisanMitra?</h2>
          <div className="grid grid-4" style={{ marginTop: 20 }}>
            {[
              "Location-based labour and machinery",
              "Simple current weather information",
              "Latest mandi price listings",
              "Easy farm finance tracking",
            ].map((text) => (
              <div key={text} style={{ textAlign: "center" }}>
                <div
                  className="service-icon"
                  style={{ margin: "0 auto 10px", background: "#fff" }}>
                  <FiCheckCircle size={22} />
                </div>
                <p style={{ color: "var(--muted)", fontSize: 13.5, margin: 0 }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
