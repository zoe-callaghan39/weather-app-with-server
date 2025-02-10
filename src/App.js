import React, { useState, useEffect } from 'react';
import './styles/App.css';

import LocationInput from './components/LocationInput';
import WeatherCard from './components/WeatherCard';
import UnitToggle from './components/UnitToggle';
import Signup from './components/Signup';
import Login from './components/Login';

import weatherImage from './assets/weather.png';
import { getCoordinates } from './utils/geocode';

const DEFAULT_CITIES = [
  { name: 'Berlin', lat: 52.52, lon: 13.41, country: 'Germany' },
  { name: 'London', lat: 51.51, lon: -0.13, country: 'United Kingdom' },
  { name: 'New York', lat: 40.71, lon: -74.01, country: 'United States' },
  { name: 'Leeds', lat: 53.8, lon: -1.55, country: 'United Kingdom' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [authForm, setAuthForm] = useState('none');

  const [unit, setUnit] = useState(localStorage.getItem('unit') || 'C');
  const [error, setError] = useState('');

  const [localLocations, setLocalLocations] = useState(() => {
    const stored = localStorage.getItem('localLocations');
    return stored ? JSON.parse(stored) : DEFAULT_CITIES;
  });

  const [dbLocations, setDbLocations] = useState([]);

  useEffect(() => {
    localStorage.setItem('localLocations', JSON.stringify(localLocations));
  }, [localLocations]);

  // Fetch DB if logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setDbLocations([]);
      return;
    }
    fetch('http://localhost:5000/locations', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDbLocations(data))
      .catch((err) => console.error('Error fetching locations:', err));
  }, [isLoggedIn]);

  const activeLocations = isLoggedIn ? dbLocations : localLocations;

  // Toggle unit
  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    localStorage.setItem('unit', newUnit);
  };

  // Add location
  const addLocation = (cityName) => {
    setError('');
    getCoordinates(cityName)
      .then((newLocation) => {
        if (!newLocation) throw new Error('City not found. Please try again.');

        const isDuplicate = activeLocations.some(
          (loc) =>
            loc.name.toLowerCase() === newLocation.name.toLowerCase() &&
            Math.abs(loc.lat - newLocation.lat) < 0.01 &&
            Math.abs(loc.lon - newLocation.lon) < 0.01
        );
        if (isDuplicate)
          throw new Error(`${newLocation.name} is already in your list.`);

        if (isLoggedIn) {
          fetch('http://localhost:5000/locations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newLocation),
          })
            .then((res) => res.json())
            .then((savedLocation) =>
              setDbLocations((prev) => [...prev, savedLocation])
            )
            .catch((err) => {
              console.error('Error saving location:', err);
              setError('Failed to save location.');
            });
        } else {
          setLocalLocations((prev) => [...prev, newLocation]);
        }
      })
      .catch((err) => {
        console.error('Error adding location:', err);
        setError(err.message || 'An error occurred.');
      });
  };

  // Delete location
  const deleteLocation = (locIdOrIndex) => {
    if (isLoggedIn) {
      fetch(`http://localhost:5000/locations/${locIdOrIndex}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(() =>
          setDbLocations((prev) =>
            prev.filter((loc) => loc.id !== locIdOrIndex)
          )
        )
        .catch((err) => {
          console.error('Error deleting location:', err);
          setError('Failed to delete location.');
        });
    } else {
      setLocalLocations((prev) =>
        prev.filter((_, index) => index !== locIdOrIndex)
      );
    }
  };

  // Auth actions
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setAuthForm('none');
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setDbLocations([]);
    setAuthForm('none');
    setError('');
  };
  const handleSignupSuccess = () => {
    setAuthForm('login');
  };
  const closeModal = () => {
    setAuthForm('none');
  };

  return (
    <div className="app">
      <header className="app-header">
        <img src={weatherImage} alt="Weather App Logo" className="app-logo" />

        <div className="auth-buttons">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          ) : (
            <>
              <button onClick={() => setAuthForm('login')} className="auth-btn">
                Login
              </button>
              <button
                onClick={() => setAuthForm('signup')}
                className="auth-btn sign-up-btn"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* AUTH MODAL */}
      {authForm !== 'none' && !isLoggedIn && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <button className="close-modal-btn" onClick={closeModal}>
              &times;
            </button>

            {authForm === 'login' && (
              <Login onLoginSuccess={handleLoginSuccess} />
            )}
            {authForm === 'signup' && (
              <Signup onSignupSuccess={handleSignupSuccess} />
            )}
          </div>
        </div>
      )}

      {/* MAIN WEATHER UI */}
      <LocationInput addLocation={addLocation} />
      {error && <p className="error-message">{error}</p>}
      <UnitToggle unit={unit} toggleUnit={toggleUnit} />

      <div className="weather-cards">
        {activeLocations.map((location, index) => (
          <WeatherCard
            key={isLoggedIn ? location.id : index}
            name={location.name}
            lat={location.lat}
            lon={location.lon}
            country={location.country}
            unit={unit}
            onDelete={() => {
              const locIdOrIndex = isLoggedIn ? location.id : index;
              deleteLocation(locIdOrIndex);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
