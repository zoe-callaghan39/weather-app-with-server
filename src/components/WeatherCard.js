import React from 'react';
import useWeather from '../hooks/useWeather';
import useTime from '../hooks/useTime';
import WeatherAnimation from './WeatherAnimation';
import removeIcon from '../assets/remove.png';

// TO STOP HARDCODE WEATHER CONDITION: uncomment this line
// const hardcodedWeatherCondition = 'wind';

const WeatherCard = ({ name, lat, lon, country, unit, onDelete }) => {
  const {
    temperature,
    weatherCondition,
    isNight,
    error: weatherError,
  } = useWeather(lat, lon);
  const { localTime } = useTime(lat, lon);

  const convertTemperature = (temp) =>
    unit === 'F' ? (temp * 9) / 5 + 32 : temp;

  const getWeatherLabel = () => {
    if (isNight) return 'Night Time';
    const conditionMap = {
      sun: 'Sunny',
      cloudy: 'Cloudy',
      sunwithcloud: 'Sun with Clouds',
      rain: 'Raining',
      snow: 'Snowing',
      thunder: 'Thunder Storms',
      fog: 'Foggy',
      wind: 'Windy',
    };
    return conditionMap[weatherCondition] || null;
  };

  const weatherLabel = getWeatherLabel();

  if (weatherError) {
    return (
      <div className="weather-card error">
        <img
          src={removeIcon}
          alt="Remove"
          className="remove-icon"
          onClick={onDelete}
        />
        <h3 className="city-name">{name}</h3>
        <p className="country-name">{country}</p>
        <p>{weatherError}</p>
      </div>
    );
  }

  return (
    <div
      className={`weather-card ${isNight ? 'night-mode' : ''} 
        ${weatherCondition === 'sun' && !isNight ? 'sunny' : ''}`}
    >
      <img
        src={removeIcon}
        alt="Remove"
        className="remove-icon"
        onClick={onDelete}
      />
      <h3 className="city-name">{name}</h3>
      <p className="country-name">{country}</p>

      {localTime && <p className="local-time">{localTime}</p>}

      {/* TO HARDCODE: Change `weatherCondition` to `hardcodedWeatherCondition` */}
      {weatherCondition && (
        <WeatherAnimation weatherType={weatherCondition} isNight={isNight} />
      )}

      {temperature !== null && (
        <p className="temperature">
          {Math.round(convertTemperature(temperature))}°{unit}
        </p>
      )}

      {weatherLabel && <div className="weather-condition">{weatherLabel}</div>}
    </div>
  );
};

export default WeatherCard;
