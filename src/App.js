import React, { useState, useEffect } from 'react';
import LocationInput from './components/LocationInput';
import WeatherCard from './components/WeatherCard';
import UnitToggle from './components/UnitToggle';
import './styles/App.css';
import weatherImage from './assets/weather.png';
import { getCoordinates } from './utils/geocode';

const App = () => {
  const [locations, setLocations] = useState([]);
  const [unit, setUnit] = useState(localStorage.getItem('unit') || 'C');
  const [error, setError] = useState('');

  // Fetch locations from the database when the app loads
  useEffect(() => {
    fetch('http://localhost:5000/locations')
      .then((res) => res.json())
      .then(setLocations)
      .catch((err) => console.error('Error fetching locations:', err));
  }, []);

  // Toggle temperature unit (Celsius/Fahrenheit)
  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
  };

  // Add a new location and save it to the database
  const addLocation = (cityName) => {
    setError('');

    getCoordinates(cityName)
      .then((newLocation) => {
        if (!newLocation) {
          throw new Error('City not found. Please try a different name.');
        }

        // Check for duplicates before saving
        const isDuplicate = locations.some(
          (loc) =>
            loc.name.toLowerCase() === newLocation.name.toLowerCase() &&
            Math.abs(loc.lat - newLocation.lat) < 0.01 &&
            Math.abs(loc.lon - newLocation.lon) < 0.01
        );

        if (isDuplicate) {
          throw new Error(`${newLocation.name} is already in your list.`);
        }

        // Save the new location to the backend
        fetch('http://localhost:5000/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newLocation),
        })
          .then((res) => res.json())
          .then((savedLocation) => {
            setLocations((prev) => [...prev, savedLocation]);
          })
          .catch((err) => {
            console.error('Error saving location:', err);
            setError('Failed to save location.');
          });
      })
      .catch((err) => {
        console.error('Error adding location:', err);
        setError(err.message || 'An error occurred.');
      });
  };

  // Delete a location from the database
  const deleteLocation = (id) => {
    fetch(`http://localhost:5000/locations/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
      })
      .catch((err) => {
        console.error('Error deleting location:', err);
        setError('Failed to delete location.');
      });
  };

  return (
    <div className="app">
      <img src={weatherImage} alt="Weather App Logo" className="app-logo" />
      <LocationInput addLocation={addLocation} />
      {error && <p className="error-message">{error}</p>}
      <UnitToggle unit={unit} toggleUnit={toggleUnit} />
      <div className="weather-cards">
        {locations.map((location) => (
          <WeatherCard
            key={location.id}
            name={location.name}
            lat={location.lat}
            lon={location.lon}
            country={location.country}
            unit={unit}
            onDelete={() => deleteLocation(location.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
