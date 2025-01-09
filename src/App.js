import React, { useState, useEffect } from "react";
import LocationInput from "./components/LocationInput";
import WeatherCard from "./components/WeatherCard";
import UnitToggle from "./components/UnitToggle";
import "./styles/App.css";

const App = () => {
  const [locations, setLocations] = useState([
    { name: "Berlin", lat: 52.52, lon: 13.41, country: "Germany" },
    { name: "London", lat: 51.51, lon: -0.13, country: "United Kingdom" },
    { name: "New York", lat: 40.71, lon: -74.01, country: "United States" },
    { name: "Leeds", lat: 53.8, lon: -1.55, country: "United Kingdom" },
  ]);
  const [unit, setUnit] = useState(localStorage.getItem("unit") || "C");
  const [error, setError] = useState("");

  const toggleUnit = () => {
    const newUnit = unit === "C" ? "F" : "C";
    setUnit(newUnit);
    localStorage.setItem("unit", newUnit);
  };

  const addLocation = async (cityName) => {
    try {
      setError("");

      const geocode = await import("./utils/geocode");
      const newLocation = await geocode.getCoordinates(cityName);

      if (!newLocation) {
        setError("City not found. Please try a different name.");
        return;
      }

      const isDuplicate = locations.some(
        (loc) =>
          loc.name.toLowerCase() === newLocation.name.toLowerCase() &&
          Math.abs(loc.lat - newLocation.lat) < 0.01 &&
          Math.abs(loc.lon - newLocation.lon) < 0.01
      );

      if (isDuplicate) {
        setError(`${newLocation.name} is already in your list.`);
        return;
      }

      setLocations((prev) => [...prev, newLocation]);
    } catch (error) {
      console.error("Error adding location:", error);
      setError("An error occurred. Please check your network connection.");
    }
  };

  const deleteLocation = (index) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);
  };

  useEffect(() => {
    const savedLocations = JSON.parse(localStorage.getItem("locations")) || [];
    setLocations(savedLocations.length > 0 ? savedLocations : locations);
  }, []);

  useEffect(() => {
    localStorage.setItem("locations", JSON.stringify(locations));
  }, [locations]);

  return (
    <div className="app">
      <h1>Weather App</h1>
      <LocationInput addLocation={addLocation} />
      {error && <p className="error-message">{error}</p>}
      <UnitToggle unit={unit} toggleUnit={toggleUnit} />
      <div className="weather-cards">
        {locations.map((location, index) => (
          <WeatherCard
            key={`${location.lat},${location.lon}`}
            name={location.name}
            lat={location.lat}
            lon={location.lon}
            country={location.country}
            unit={unit}
            onDelete={() => deleteLocation(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
