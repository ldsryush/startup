const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files if needed

// Weather endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;

    // Orem's Latitude and Longitude
    const latitude = 40.2969; // Orem latitude
    const longitude = -111.6946; // Orem longitude

    // Open-Meteo API URL with query parameters
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,weather_code`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }

    const data = await response.json();

    // Parse the data to extract required information
    const currentTemperature = data.hourly.temperature_2m[0];
    const precipitationProbability = data.hourly.precipitation_probability[0];
    const weatherCode = data.hourly.weather_code[0];

    res.json({
      location: "Orem",
      temperature: currentTemperature,
      precipitationProbability: precipitationProbability,
      weatherCode: weatherCode,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Failed to fetch weather data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
