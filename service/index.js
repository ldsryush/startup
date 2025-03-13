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
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// User login
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockDatabase.find((user) => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({ id: user.id, email: user.email, username: user.username });
});

// User registration
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;

  const userExists = mockDatabase.find((user) => user.email === email);
  if (userExists) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  const newUser = { id: mockDatabase.length + 1, username: name, email, password, resetCode: null };
  mockDatabase.push(newUser);

  res.status(201).json({ message: 'User registered successfully', email });
});

// Send reset code
app.post('/api/users/send-reset-code', (req, res) => {
  const { email } = req.body;
  const user = mockDatabase.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ error: 'Email not found' });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000); 
  user.resetCode = resetCode;

  console.log(`Reset code for ${email}: ${resetCode}`);
  res.json({ message: 'Reset code sent to your email' });
});

// Verify reset code
app.post('/api/users/verify-reset-code', (req, res) => {
  const { email, resetCode } = req.body;
  const user = mockDatabase.find((user) => user.email === email && user.resetCode === parseInt(resetCode, 10));

  if (!user) {
    return res.status(400).json({ error: 'Invalid reset code' });
  }

  res.json({ message: 'Reset code verified' });
});

// Weather endpoint (using new API)
app.get('/api/weather', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;

    const url = 'https://api.data.gov.sg/v1/environment/air-temperature';

    // Fetch data from the new API
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }

    const data = await response.json();

    // Extract relevant data (adjust as necessary based on API response structure)
    const items = data.items?.[0]?.readings || [];
    const firstStation = items[0]; // Use the first station's data

    if (!firstStation) {
      throw new Error("No temperature data available");
    }

    res.json({
      location: firstStation.station_id || "Unknown location",
      temperature: firstStation.value || "N/A",
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
