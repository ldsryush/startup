const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const multer = require("multer");
const connectToDatabase = require("../testMongo/connectToDatabase");

const app = express();
const port = process.env.PORT || 4000;

/*
  Define two important paths:
  - uploadsPath: Points to the "uploads" folder inside your service directory,
    where uploaded images are stored.
  - projectRoot: Points one directory up (the root of your project, i.e. /workspaces/startup),
    where your index.html resides.
*/
const uploadsPath = path.join(__dirname, "uploads");
const projectRoot = path.join(__dirname, "..");

console.log("Uploads will be served from:", uploadsPath);
console.log("Front-end assets (index.html, etc.) will be served from:", projectRoot);

app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local development frontend (if used)
      "https://organic-robot-r4pwp45v54p63xrx-4000.app.github.dev", // Codespaces domain
    ],
    methods: "GET,POST",
    credentials: true,
  })
);

app.use(express.json());

// ---------------------
// Multer Configuration
// ---------------------
// Files will be stored in the "uploads" folder, inside the service directory.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Optional: Log every request for debugging purposes.
app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});

// ---------------------
// API Endpoints
// ---------------------

// Weather API endpoint (example)
app.get("/api/weather", async (req, res) => {
  try {
    const apiUrl = "http://api.weatherapi.com/v1/current.json";
    const city = "Orem, Utah";
    const apiKey = process.env.WEATHER_API_KEY || "cb4c756da7324f97ad210204250304";
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

// Products endpoint: Handles file uploads and saves products to MongoDB.
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, userId } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Image upload is required." });
    }
    console.log("File uploaded:", file);
    console.log("Product details:", { name, description, price, category, userId });

    // Save the product with imagePath as "uploads/<filename>"
    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      category,
      imagePath: `uploads/${file.filename}`, // Image is referenced via /uploads/filename
      imageName: file.originalname,
      createdAt: new Date(),
    };

    if (userId) {
      newProduct.userId = userId;
    }

    const db = req.app.locals.db;
    await db.collection("products").insertOne(newProduct);

    res.status(201).json({
      message: "Product added successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ error: "Failed to add product." });
  }
});

// GET endpoint to fetch products.
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

// Example user authentication endpoints.
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
    const newUser = {
      username: name,
      email,
      password,
      resetCode: null,
    };
    await db.collection("users").insertOne(newUser);
    res.status(201).json({ message: "User registered successfully", email });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------------
// Serve static content
// ---------------------

// 1. Serve uploaded images from the uploads folder (inside service)
app.use("/uploads", express.static(uploadsPath));

// 2. Serve front-end static files (index.html, JavaScript, CSS, etc.) from the project root.
// This ensures that your index.html (in /workspaces/startup) is served, along with any other assets.
app.use(express.static(projectRoot));

// Catch-all route: For any unmatched route, serve index.html from the project root (for SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(projectRoot, "index.html"));
});

// ---------------------
// Connect to the database and start the server.
// ---------------------
connectToDatabase()
  .then((client) => {
    const db = client.db("mydatabase"); // Replace with your actual database name
    app.locals.db = db;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log("Uploads are served from:", uploadsPath);
      console.log("Front-end assets are served from:", projectRoot);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database connection:", error);
    process.exit(1);
  });