import { useState, useEffect } from "react";

// Hook to fetch weather data based on coordinates
const useWeather = (latitude, longitude) => {
  const [temperature, setTemperature] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        if (!response.ok) throw new Error("Failed to fetch weather data");
        const data = await response.json();
        setTemperature(data.current_weather.temperature);
        setWindSpeed(data.current_weather.windspeed);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { temperature, windSpeed, error };
};

export default useWeather;
