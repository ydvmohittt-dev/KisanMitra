
export const getWeather = async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const { city, state } = req.query;

    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "Weather service is not configured" });
    }

    if (!city || !state) {
      return res.status(400).json({ message: "City and state are required" });
    }

    const locationQuery = `${city},${state},IN`;
    const geoUrl = new URL("https://api.openweathermap.org/geo/1.0/direct");
    geoUrl.searchParams.set("q", locationQuery);
    geoUrl.searchParams.set("limit", "1");
    geoUrl.searchParams.set("appid", apiKey);

    const geoResponse = await fetch(geoUrl);

    const locations = await geoResponse.json();

    if (!geoResponse.ok || locations.length === 0) {
      return res.status(404).json({
        message: `Could not find weather location for ${city}, ${state}`,
      });
    }
    const { lat, lon, name } = locations[0];

    const weatherUrl = new URL(
      "https://api.openweathermap.org/data/2.5/weather",
    );
    weatherUrl.searchParams.set("lat", lat);
    weatherUrl.searchParams.set("lon", lon);
    weatherUrl.searchParams.set("appid", apiKey);
    weatherUrl.searchParams.set("units", "metric");

    const weatherResponse = await fetch(weatherUrl);

   
    const current = await weatherResponse.json();
   
  

    if (!weatherResponse.ok) {
      return res
        .status(500)
        .json({ message: "Unable to fetch current weather" });
    }

    res.json({
      location: { name, state },
      current: {
        temp: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        condition: current.weather[0].main,
        description: current.weather[0].description,
        humidity: current.main.humidity,
        windSpeed: current.wind.speed,
        pressure: current.main.pressure,
        visibility: (current.visibility / 1000).toFixed(1),
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
};
