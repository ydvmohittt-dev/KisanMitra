import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCloud,
  FiCloudRain,
  FiCloudLightning,
  FiCloudSnow,
  FiSun,
  FiDroplet,
  FiWind,
  FiEye,
  FiMapPin,
} from "react-icons/fi";
import { apiRequest } from "../services/api";
import StatusBox from "../components/StatusBox";
import { Eye } from "lucide-react";
import { Wind, Droplets } from "lucide-react";

const getWeatherIcon = (condition, size = 28) => {
  if (condition === "Clear") return <FiSun size={size} />;
  if (condition === "Rain" || condition === "Drizzle")
    return <FiCloudRain size={size} />;
  if (condition === "Thunderstorm") return <FiCloudLightning size={size} />;
  if (condition === "Snow") return <FiCloudSnow size={size} />;
  return <FiCloud size={size} />;
};

const Weather = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadWeather = async (city, state) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await apiRequest(
        `/weather?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`,
      );
      setWeather(data);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    const loadFarmerWeather = async () => {
      try {
        const user = await apiRequest("/auth/me");
        setValue("city", user.city);
        setValue("state", user.state);
        loadWeather(user.city, user.state);
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    };

    loadFarmerWeather();
  }, [setValue]);

  const onSubmit = (data) => loadWeather(data.city, data.state);

  return (
    <div className="container section">
      <h2 className="section-heading" style={{ textAlign: "left" }}>
        Current Weather
      </h2>
      <p className="section-subheading" style={{ textAlign: "left" }}>
        Enter your city and state to check the current weather.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="filter-bar">
        <input
          placeholder="City"
          {...register("city", { required: "city is required" })}
        />
        <input
          placeholder="State"
          {...register("state", { required: "State is required" })}
        />
        <button className="btn btn-primary" type="submit">
          Check Weather
        </button>
      </form>

      {status === "loading" && (
        <StatusBox type="loading" title="Fetching current weather..." />
      )}
      {status === "error" && (
        <StatusBox
          type="error"
          title="Could not load weather"
          message={errorMessage}
        />
      )}

      {status === "ready" && weather && (
        <div className="card">
          <div className="weather-current">
            <div>
              <p className="listing-meta">
                <FiMapPin size={15} /> {weather.location.name},{" "}
                {weather.location.state}
              </p>
              <p className="weather-temp">{weather.current.temp}&deg;C</p>
              <p style={{ color: "var(--muted)" }}>
                {weather.current.description} · Feels like{" "}
                {weather.current.feelsLike}&deg;C
              </p>
            </div>
            <div style={{ color: "var(--green)" }}>
              {getWeatherIcon(weather.current.condition, 64)}
            </div>
          </div>

          <div className="weather-stats-grid">
            <div className="weather-stat">
              <Droplets size={17} />
              <strong>{weather.current.humidity}%</strong>
              <span>Humidity</span>
            </div>
            <div className="weather-stat">
              <Wind size={17} />
              <strong>{weather.current.windSpeed} m/s</strong>
              <span>Wind Speed</span>
            </div>
            <div className="weather-stat">
              <strong>{weather.current.pressure} hPa</strong>
              <span>Pressure</span>
            </div>
            <div className="weather-stat">
              <Eye size={17} />
              <strong>{weather.current.visibility} km</strong>
              <span>Visibility</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
