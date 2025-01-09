import React, { useState } from "react";

const LocationInput = ({ addLocation }) => {
  const [cityName, setCityName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=6fe20c614e5849e1ad489081dc9e3709`
      );
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      const suggestionList = data.results.map((result) => result.formatted);
      setSuggestions(suggestionList);
    } catch (error) {}
  };

  const handleChange = (e) => {
    setCityName(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    addLocation(suggestion);
    setCityName("");
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityName.trim()) {
      addLocation(cityName);
      setCityName("");
      setSuggestions([]);
    }
  };

  return (
    <div className="location-input">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={cityName}
          onChange={handleChange}
        />
        <button type="submit">Add Location</button>
      </form>
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
