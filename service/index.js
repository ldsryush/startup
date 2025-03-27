const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDatabase } = require('./database'); // Import the DB connection function

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

/*
  Instead of using a hard-coded mock database, we will connect
  to a MongoDB database and use a 'users' collection. Once the
  connection is established, we store the db instance in app.locals.
*/

// User login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ id: user._id, email: user.email, username: user.username });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = req.app.locals.db;
    const userExists = await db.collection('users').findOne({ email });

    if (userExists) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const newUser = { username: name, email, password, resetCode: null };
    await db.collection('users').insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully', email });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Send reset code
app.post('/api/users/send-reset-code', async (req, res) => {
  try {
    const { email } = req.body;
    const db = req.app.locals.db;
    const resetCode = Math.floor(100000 + Math.random() * 900000);

    // Update the user document with a reset code
    const result = await db.collection('users').findOneAndUpdate(
      { email },
      { $set: { resetCode } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Email not found' });
    }

    console.log(`Reset code for ${email}: ${resetCode}`);
    res.json({ message: 'Reset code sent to your email' });
  } catch (error) {
    console.error('Error sending reset code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Verify reset code
app.post('/api/users/verify-reset-code', async (req, res) => {
  try {
    const { email, resetCode } = req.body;
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne({ email, resetCode: parseInt(resetCode, 10) });

    if (!user) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    res.json({ message: 'Reset code verified' });
  } catch (error) {
    console.error('Error verifying reset code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Weather endpoint (using new API)
app.get('/api/weather', async (req, res) => {
  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;
    const url = 'https://api.data.gov.sg/v1/environment/air-temperature';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }

    const data = await response.json();
    const items = data.items?.[0]?.readings || [];
    const firstStation = items[0];

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

// Initialize the database connection and then start the server
connectToDatabase()
  .then((client) => {
    const db = client.db('mydatabase'); // Specify your database name
    app.locals.db = db; // Save the db instance for use in route handlers

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database connection:', error);
    process.exit(1);
  });
