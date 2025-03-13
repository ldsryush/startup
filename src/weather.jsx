import React, { useEffect, useState } from "react";

export function Weather() {
  const [temperature, setTemperature] = useState(null);
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
        setTemperature(data.temperature); 
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setError("Failed to load weather data");
      });
  }, []);

  return (
    <div>
      <h2>Current Temperature</h2>
      {error ? (
        <p>{error}</p>
      ) : temperature !== null ? (
        <p>{temperature}°C</p>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}
