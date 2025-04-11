const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const multer = require("multer");
const http = require("http");
const WebSocket = require("ws");
const connectToDatabase = require("./connectToDatabase");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 4000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const uploadsPath = path.join(__dirname, "uploads");
console.log("Uploads will be served from:", uploadsPath);
if (!fs.existsSync(uploadsPath)) {
  console.log(`Uploads directory not found. Creating ${uploadsPath}`);
  fs.mkdirSync(uploadsPath, { recursive: true });
}

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

async function createMailTransporter() {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Missing SMTP configuration for production.");
    }
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
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

let resetCodes = {};

app.use(express.static("public"));

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

app.get("/api/weather", async (req, res) => {
  try {
    const apiUrl = "http://api.weatherapi.com/v1/current.json";
    const city = "Orem, Utah";
    const apiKey = process.env.WEATHER_API_KEY || "cb4c756da7324f97ad210204250304";
    if (!apiKey) {
      return res.status(500).json({ error: "Weather API Key is missing!" });
    }
    const response = await axios.get(apiUrl, { params: { key: apiKey, q: city } });
    res.json({ city, temperature: response.data.current.temp_c });
  } catch (error) {
    console.error("Error fetching weather data:", error.stack);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

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
    return res
      .status(201)
      .json({ email: newUser.email, message: "User created successfully" });
  } catch (err) {
    console.error("Error in /api/users/register:", err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/users/send-reset-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Store the reset code along with an expiration time (15 minutes)
    resetCodes[email] = { code: resetCode, expiresAt: Date.now() + 15 * 60 * 1000 };
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
    console.error("Error sending reset code email:", error.stack);
    res.status(500).json({ error: "Failed to send reset code email." });
  }
});

app.post("/api/users/verify-reset-code", async (req, res) => {
  try {
    const { email, resetCode } = req.body;
    if (!email || !resetCode) {
      return res.status(400).json({ error: "Email and reset code are required" });
    }
    const stored = resetCodes[email];
    if (!stored) {
      return res.status(400).json({ error: "Reset code expired or not found" });
    }
    if (stored.expiresAt < Date.now()) {
      delete resetCodes[email];
      return res.status(400).json({ error: "Reset code expired. Please request a new one." });
    }
    if (stored.code !== resetCode) {
      return res.status(400).json({ error: "Invalid reset code. Please try again." });
    }
    delete resetCodes[email];
    res.status(200).json({ message: "Reset code verified!" });
  } catch (error) {
    console.error("Error verifying reset code:", error.stack);
    res.status(500).json({ error: "Failed to verify reset code." });
  }
});

// NEW: Reset Password Endpoint
app.post("/api/users/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }
    const db = req.app.locals.db;
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // NOTE: For production security, you should hash the new password before storing it.
    await db.collection("users").updateOne({ email }, { $set: { password: newPassword } });
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error.stack);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

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
      return res.status(403).json({ error: "Unauthorized: Sender not logged in or invalid." });
    }
    const newMessage = { sender, receiver, content, timestamp: timestamp || new Date() };
    const result = await db.collection("messages").insertOne(newMessage);
    console.log("Message successfully saved with id:", result.insertedId);
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving message:", error.stack);
    res.status(500).json({ error: "Failed to save message." });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const { user } = req.query;
    const db = req.app.locals.db;
    const query = user ? { $or: [{ sender: user }, { receiver: user }] } : {};
    const messages = await db.collection("messages").find(query).sort({ timestamp: 1 }).toArray();
    console.log("Fetched messages:", messages);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.stack);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, email } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Image upload is required." });
    }
    console.log("File uploaded:", file);
    console.log("Product details:", { name, description, price, category, email });
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ error: "Invalid price provided." });
    }
    const newProduct = {
      name,
      description,
      price: parsedPrice,
      category,
      imagePath: `uploads/${file.filename}`,
      imageName: file.originalname,
      createdAt: new Date(),
      email,
    };
    const db = req.app.locals.db;
    await db.collection("products").insertOne(newProduct);
    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error.stack);
    res.status(500).json({ error: "Failed to add product." });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const products = await db.collection("products").find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.stack);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

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
    console.error("Error during login:", error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
