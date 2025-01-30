import React from 'react';
import useWeather from '../hooks/useWeather';
import useTime from '../hooks/useTime';

const WeatherCard = ({ name, lat, lon, country, unit, onDelete }) => {
  const { temperature, error: weatherError } = useWeather(lat, lon);
  const { localTime, error: timeError } = useTime(lat, lon);

  const convertTemperature = (temp) =>
    unit === 'F' ? (temp * 9) / 5 + 32 : temp;

  if (weatherError) {
    return (
      <div className="weather-card error">
        <h3>{name}</h3>
        <p>{country}</p>
        <p>
          {weatherError === 'Failed to fetch weather data'
            ? 'Unable to load weather data.'
            : weatherError}
        </p>
        <button onClick={onDelete} className="delete-btn">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="weather-card">
      <h3 className="city-name">{name}</h3>
      <p className="country-name">{country}</p>
      {temperature !== null ? (
        <p className="temperature">
          Temperature: {convertTemperature(temperature).toFixed(1)}°{unit}
        </p>
      ) : (
        <p>Loading weather...</p>
      )}
      {timeError ? (
        <p className="time-error">Time: {timeError}</p>
      ) : localTime ? (
        <p className="local-time">Local Time: {localTime}</p>
      ) : (
        <p>Loading time...</p>
      )}
      <button onClick={onDelete} className="delete-btn">
        Remove
      </button>
    </div>
  );
};

export default WeatherCard;
