const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const multer = require("multer");
const http = require("http");
const WebSocket = require("ws");
const connectToDatabase = require("./connectToDatabase");

const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server and bind WebSocket server to it.
// This allows clients to dynamically construct the WebSocket URL (using host, port, and protocol from window.location)
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const uploadsPath = path.join(__dirname, "uploads");
console.log("Uploads will be served from:", uploadsPath);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://organic-robot-r4pwp45v54p63xrx-4000.app.github.dev",
    ],
    methods: "GET,POST",
    credentials: true,
  })
);

app.use(express.json());

// ---------------------
// Multer Configuration
// ---------------------
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

// Log every request for debugging purposes
app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});

// ---------------------
// API Endpoints
// ---------------------

// Weather API endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const apiUrl = "http://api.weatherapi.com/v1/current.json";
    const city = "Orem, Utah";
    const apiKey =
      process.env.WEATHER_API_KEY || "cb4c756da7324f97ad210204250304";
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

// Signup endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const db = req.app.locals.db;
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const newUser = { name, email, password, createdAt: new Date() };
    await db.collection("users").insertOne(newUser);
    res
      .status(201)
      .json({ email: newUser.email, message: "User created successfully" });
  } catch (err) {
    console.error("Error in /api/users/register:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Save Message endpoint
app.post("/api/messages", async (req, res) => {
  try {
    const { sender, receiver, content, timestamp } = req.body;
    // Validate required fields
    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const db = req.app.locals.db;
    // Debugging incoming data
    console.log("Incoming request data:", req.body);
    // Verify if the sender exists in the database
    const userExists = await db.collection("users").findOne({ email: sender });
    if (!userExists) {
      console.error("Sender not found in database:", sender);
      return res
        .status(403)
        .json({ error: "Unauthorized: Sender not logged in or invalid." });
    }
    const newMessage = {
      sender,
      receiver,
      content,
      timestamp: timestamp || new Date(),
    };
    const result = await db.collection("messages").insertOne(newMessage);
    console.log("Message successfully saved with id:", result.insertedId);
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving message:", error.message);
    res.status(500).json({ error: "Failed to save message." });
  }
});

// Get Messages endpoint
app.get("/api/messages", async (req, res) => {
  try {
    const { user } = req.query;
    const db = req.app.locals.db;
    const query = user
      ? { $or: [{ sender: user }, { receiver: user }] }
      : {};
    const messages = await db.collection("messages").find(query).toArray();
    console.log("Fetched messages:", messages);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

// Products endpoint
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, email } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Image upload is required." });
    }
    console.log("File uploaded:", file);
    console.log("Product details:", { name, description, price, category, email });
    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      category,
      imagePath: `uploads/${file.filename}`,
      imageName: file.originalname,
      createdAt: new Date(),
      email,
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

// GET endpoint to fetch products
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

// Login endpoint
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received. Email:", email, "Password:", password);
    const db = req.app.locals.db;
    const user = await db.collection("users").findOne({ email, password });
    console.log("User lookup result:", user);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ id: user._id, email: user.email, username: user.username });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------------
// WebSocket Integration
// ---------------------
// The WebSocket server is bound to the same HTTP server that powers our API endpoints.
// This lets clients construct a dynamic WebSocket URL (using host, port, and protocol) on the frontend.
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");
  
  ws.on("message", (message) => {
    console.log("Received message:", message);
    const parsedMessage = JSON.parse(message);
    // Broadcast the message to all connected clients (except the sender)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage));
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// ---------------------
// Static Content & SPA
// ---------------------
app.use("/uploads", express.static(uploadsPath));

// Serve index.html directly from the root directory for any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ---------------------
// Start the Server & Initialize Database
// ---------------------
connectToDatabase()
  .then((client) => {
    const db = client.db("mydatabase");
    app.locals.db = db;

    // Ensure the "messages" collection exists
    db.listCollections({ name: "messages" }).next((err, collectionInfo) => {
      if (!collectionInfo) {
        db.createCollection("messages").then(() => {
          console.log("Messages collection created!");
        });
      }
    });

    console.log("Database connection initialized:", db);

    server.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log("Uploads are served from:", uploadsPath);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database connection:", error);
    process.exit(1);
  });
