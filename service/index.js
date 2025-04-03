const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const multer = require("multer");
const connectToDatabase = require("../testMongo/connectToDatabase");

const app = express();
const port = process.env.PORT || 4000;

// Static files directory for hosting any public assets.
const staticPath = path.resolve("/workspaces/startup/public");
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
app.use(express.json());
app.use("/public", express.static(staticPath));

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Weather API Endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const apiUrl = "http://api.weatherapi.com/v1/current.json";
    const city = "Orem, Utah";
    const apiKey =
      process.env.WEATHER_API_KEY || "cb4c756da7324f97ad210204250304"; // Default API key

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

// Products Endpoint for Listing Items
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image upload is required." });
    }

    console.log("File uploaded:", file);
    console.log("Product details:", { name, description, price, category, userId });

    // Create product document with seller's ID
    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      category,
      imagePath: `uploads/${file.filename}`,
      imageName: file.originalname,
      userId, // Associate product with user who listed it
      createdAt: new Date(),
    };

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

// Products GET Endpoint with Seller Info
app.get("/api/products", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const products = await db.collection("products").find({}).toArray();
    const usersCollection = db.collection("users");

    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        const seller = await usersCollection.findOne({ _id: product.userId });
        return {
          ...product,
          sellerName: seller?.username || "Unknown Seller",
          sellerEmail: seller?.email || null, // Useful for messaging later
        };
      })
    );

    res.json(enrichedProducts);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// Base Endpoint
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// User Authentication Endpoints (Login & Register)
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

// Serve React Frontend (Production)
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect to Database & Start Server
connectToDatabase()
  .then((client) => {
    const db = client.db("mydatabase"); // Replace with actual database name
    app.locals.db = db;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log("Static uploads served from:", path.join(__dirname, "uploads"));
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database connection:", error);
    process.exit(1);
  });