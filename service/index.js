const express = require("express");
const cors = require("cors");
const path = require("path");
const connectToDatabase = require("../testMongo/connectToDatabase"); // Updated to use credentials from dbConfig.json

const app = express();
const port = process.env.PORT || 4000;

// Resolve the absolute path to the public folder
const staticPath = path.resolve("/workspaces/startup/public");
console.log("Serving static files from:", staticPath);

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files under the '/public' URL prefix
app.use("/public", express.static(staticPath));

// Test endpoint to manually serve an image
app.get("/manual-image", (req, res) => {
  const imagePath = path.join(staticPath, "images", "boots.jpg");
  console.log("Trying to serve file from:", imagePath);

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("File not found or inaccessible");
    }
  });
});

// Simple test endpoint
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// User login endpoint
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db;
    const user = await db.collection("users").findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ id: user._id, email: user.email, username: user.username });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User registration (sign-up) endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = req.app.locals.db;
    const userExists = await db.collection("users").findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: "Email is already registered" });
    }
    const newUser = { username: name, email, password, resetCode: null };
    await db.collection("users").insertOne(newUser);
    res.status(201).json({ message: "User registered successfully", email });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to send a password reset code
app.post("/api/users/send-reset-code", async (req, res) => {
  try {
    const { email } = req.body;
    const db = req.app.locals.db;
    const resetCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit reset code
    const result = await db.collection("users").findOneAndUpdate(
      { email },
      { $set: { resetCode } },
      { returnDocument: "after" }
    );
    if (!result.value) {
      return res.status(404).json({ error: "Email not found" });
    }
    console.log(`Reset code for ${email}: ${resetCode}`); // Debugging purposes
    res.json({ message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Error sending reset code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to verify the reset code
app.post("/api/users/verify-reset-code", async (req, res) => {
  try {
    const { email, resetCode } = req.body;
    const db = req.app.locals.db;
    const user = await db.collection("users").findOne({ email, resetCode: parseInt(resetCode, 10) });
    if (!user) {
      return res.status(400).json({ error: "Invalid reset code" });
    }
    res.json({ message: "Reset code verified" });
  } catch (error) {
    console.error("Error verifying reset code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Weather endpoint (calls an external API for air temperature)
app.get("/api/weather", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const url = "https://api.data.gov.sg/v1/environment/air-temperature";
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
    console.error("Error fetching weather data:", error);
    res.status(500).send("Failed to fetch weather data");
  }
});

// GET endpoint to fetch all products (for the Equipment component)
app.get("/api/products", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const products = await db.collection("products").find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Initialize the database connection and then start the server.
connectToDatabase()
  .then((client) => {
    const db = client.db("mydatabase");
    app.locals.db = db;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database connection:", error);
    process.exit(1);
  });