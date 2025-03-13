import React, { useEffect, useState } from "react";

export function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/weather')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Weather data received:", data); 
        setWeather(data); 
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setError("Failed to load weather data");
      });
  }, []);

  return (
    <div>
      <h2>Current Weather in Orem</h2>
      {error ? (
        <p>{error}</p>
      ) : weather ? (
        <div>
          <p>Location: {weather.location}</p>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Precipitation Probability: {weather.precipitationProbability}%</p>
          <p>Weather Code: {weather.weatherCode}</p>
        </div>
      ) : (
        <p>Loading weather data...</p> 
      )}
    </div>
  );
}
