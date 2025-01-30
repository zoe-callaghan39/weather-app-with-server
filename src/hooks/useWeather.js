import { useState, useEffect } from 'react';

// Hook to fetch weather data based on coordinates
const useWeather = (latitude, longitude) => {
  const [temperature, setTemperature] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    )
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch weather data');
        return response.json();
      })
      .then((data) => {
        if (
          data &&
          data.current_weather &&
          data.current_weather.temperature !== undefined
        ) {
          setTemperature(data.current_weather.temperature);
        } else {
          throw new Error('Invalid weather data received');
        }
      })
      .catch((err) => {
        console.error('Error fetching weather data:', err);
        setError(err.message);
      });
  }, [latitude, longitude]);

  return { temperature, error };
};

export default useWeather;
