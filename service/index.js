const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const multer = require("multer");
const http = require("http");
const WebSocket = require("ws");
const connectToDatabase = require("./connectToDatabase");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 4000;
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
// Nodemailer Configuration
// ---------------------
async function createMailTransporter() {
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false otherwise
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // In development, use Ethereal account for testing
    let testAccount = await nodemailer.createTestAccount();
    console.log("Ethereal test account created", testAccount);
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
}

app.use(express.static('public'));

let resetCodes = {};

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

app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});

// API Endpoints

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

// Send Reset Code endpoint
app.post("/api/users/send-reset-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes[email] = resetCode;
    const transporter = await createMailTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || "no-reply@example.com",
      to: email,
      subject: "Your Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
      html: `<p>Your password reset code is: <strong>${resetCode}</strong></p>`,
    };
    let info = await transporter.sendMail(mailOptions);
    console.log("Reset code email sent:", info.messageId);
    if (process.env.NODE_ENV !== "production") {
      console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
    }
    res.status(200).json({ message: "Reset code sent to your email!" });
  } catch (error) {
    console.error("Error sending reset code email:", error);
    res.status(500).json({ error: "Failed to send reset code email." });
  }
});

app.post("/api/users/verify-reset-code", async (req, res) => {
  try {
    const { email, resetCode } = req.body;
    if (!email || !resetCode) {
      return res.status(400).json({ error: "Email and reset code are required" });
    }
    if (resetCodes[email] && resetCodes[email] === resetCode) {
      delete resetCodes[email];
      res.status(200).json({ message: "Reset code verified!" });
    } else {
      res.status(400).json({ error: "Invalid reset code. Please try again." });
    }
  } catch (error) {
    console.error("Error verifying reset code:", error);
    res.status(500).json({ error: "Failed to verify reset code." });
  }
});

// Save Message endpoint
app.post("/api/messages", async (req, res) => {
  try {
    const { sender, receiver, content, timestamp } = req.body;
    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const db = req.app.locals.db;
    console.log("Incoming request data:", req.body);
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
    const query = user ? { $or: [{ sender: user }, { receiver: user }] } : {};
    const messages = await db
      .collection("messages")
      .find(query)
      .sort({ timestamp: 1 })
      .toArray();
    console.log("Fetched messages:", messages);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

// Save Product endpoint
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

// Get Products endpoint
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

app.use((_req, res) => {
  res.sendFile('index.html', {root:'public'});
});

// WebSocket Integration
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");
  
  ws.on("message", (message) => {
    console.log("Received message:", message);
    const parsedMessage = JSON.parse(message);
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

// Static Content & SPA
app.use("/uploads", express.static(uploadsPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

connectToDatabase()
  .then((client) => {
    const db = client.db("mydatabase");
    app.locals.db = db;

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
