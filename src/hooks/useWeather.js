import { useState, useEffect } from 'react';

// Hook to fetch weather data based on coordinates
const useWeather = (latitude, longitude) => {
  const [temperature, setTemperature] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState('');
  const [isNight, setIsNight] = useState(false);
  const [windSpeed, setWindSpeed] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=sunrise,sunset&timezone=auto`
    )
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch weather data');
        return response.json();
      })
      .then((data) => {
        if (data.current_weather) {
          setTemperature(data.current_weather.temperature);
          setWindSpeed(data.current_weather.windspeed);

          let condition = getWeatherCondition(data.current_weather.weathercode);

          if (data.current_weather.windspeed >= 20) {
            condition = 'windy';
          }

          // TO HARDCODE WIND: setWeatherCondition('windy'); & COMMENT OUT LINE 24-28
          setWeatherCondition(condition);

          const utcOffsetSeconds = data.utc_offset_seconds || 0;
          const nowUTC = new Date();
          const nowLocal = new Date(nowUTC.getTime() + utcOffsetSeconds * 1000);

          const sunriseLocal = new Date(data.daily.sunrise[0]);
          const sunsetLocal = new Date(data.daily.sunset[0]);

          const isCurrentlyNight =
            nowLocal.getTime() < sunriseLocal.getTime() ||
            nowLocal.getTime() > sunsetLocal.getTime();
          setIsNight(isCurrentlyNight);
        } else {
          throw new Error('Invalid weather data received');
        }
      })
      .catch((err) => setError(err.message));
  }, [latitude, longitude]);

  const getWeatherCondition = (code) => {
    if (code === 0 || code === 1) return 'sun';

    if (code === 2) return 'sunwithcloud';

    if (code === 3) return 'cloudy';

    if (code === 45 || code === 48) return 'fog';

    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
      return 'rain';
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return 'snow';
    }

    if ([95, 96, 99].includes(code)) {
      return 'thunder';
    }

    return 'sun';
  };

  return { temperature, weatherCondition, windSpeed, isNight, error };
};

export default useWeather;
