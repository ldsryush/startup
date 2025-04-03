const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const multer = require("multer"); // Import multer for file uploads
const connectToDatabase = require("../testMongo/connectToDatabase");

const app = express();
const port = process.env.PORT || 4000; // Use an environment variable for the port
const staticPath = path.resolve("/workspaces/startup/public"); // Static files directory

console.log("Serving static files from:", staticPath);

// CORS configuration for development and production
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Development frontend
      "https://organic-robot-r4pwp45v54p63xrx-4000.app.github.dev", // Production frontend
    ],
    methods: "GET,POST",
    credentials: true,
  })
);

// Middlewares
app.use(express.json()); // To parse JSON in request bodies
app.use("/public", express.static(staticPath)); // Serve static files

// Configure multer to save uploaded files in the "uploads" folder
const upload = multer({ dest: "uploads/" }); // Uploaded files will be stored in the "uploads" directory

// Weather API endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const apiUrl = "http://api.weatherapi.com/v1/current.json";
    const city = "Orem, Utah";
    const apiKey = process.env.WEATHER_API_KEY || "cb4c756da7324f97ad210204250304"; // Default API key

    if (!apiKey) {
      return res.status(500).json({ error: "Weather API Key is missing!" });
    }

    const response = await axios.get(apiUrl, {
      params: { key: apiKey, q: city },
    });

    res.json({ city, temperature: response.data.current.temp_c });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Products endpoint for file upload (new feature)
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const file = req.file; // Uploaded file information

    if (!file) {
      return res.status(400).json({ error: "Image upload is required." });
    }

    console.log("File uploaded:", file);
    console.log("Product details:", { name, description, price, category });

    // Simulate saving the product in the database
    const db = req.app.locals.db;
    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      category,
      imagePath: file.path, // Save the file's path
      imageName: file.originalname, // Original file name
    };
    await db.collection("products").insertOne(newProduct);

    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ error: "Failed to add product." });
  }
});

// Base endpoint
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// User authentication endpoints
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
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Products GET endpoint
app.get("/api/products", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const products = await db.collection("products").find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// Serve React frontend (for production)
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect to the database and start the server
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