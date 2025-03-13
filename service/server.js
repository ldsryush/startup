const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Mock database
const mockDatabase = [
  { id: 1, username: "ldsryush", email: "ldsryush@example.com", password: "Sanghwa1204", resetCode: null },
  { id: 2, username: "user2", email: "user2@example.com", password: "securePass456", resetCode: null },
];

// Middleware
app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.json()); // Parse JSON request bodies

// Authentication Endpoints

// User Login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockDatabase.find((user) => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ id: user.id, email: user.email, username: user.username });
});

// User Registration
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;

  // Check if email is already registered
  const userExists = mockDatabase.find((user) => user.email === email);
  if (userExists) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  // Add new user to the mock database
  const newUser = { id: mockDatabase.length + 1, username: name, email, password, resetCode: null };
  mockDatabase.push(newUser);

  res.status(201).json({ message: 'User registered successfully', email });
});

// Send Password Reset Code
app.post('/api/users/send-reset-code', (req, res) => {
  const { email } = req.body;
  const user = mockDatabase.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ error: 'Email not found' });
  }

  // Generate a random reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000); // Six-digit code
  user.resetCode = resetCode;

  console.log(`Reset code for ${email}: ${resetCode}`); // Mock sending email
  res.json({ message: 'Reset code sent to your email' });
});

// Verify Reset Code
app.post('/api/users/verify-reset-code', (req, res) => {
  const { email, resetCode } = req.body;
  const user = mockDatabase.find((user) => user.email === email && user.resetCode === parseInt(resetCode, 10));

  if (!user) {
    return res.status(400).json({ error: 'Invalid reset code' });
  }

  res.json({ message: 'Reset code verified' });
});

// Weather Endpoint
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
