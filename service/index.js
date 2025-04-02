const express = require("express");
const cors = require("cors");
const path = require("path");
const connectToDatabase = require("../testMongo/connectToDatabase");

const app = express();
const port = process.env.PORT || 4000;

const staticPath = path.resolve("/workspaces/startup/public");
console.log("Serving static files from:", staticPath);

app.use(cors());
app.use(express.json());
app.use("/public", express.static(staticPath));

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

// User registration endpoint
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

// Password reset endpoints
app.post("/api/users/send-reset-code", async (req, res) => {
  try {
    const { email } = req.body;
    const db = req.app.locals.db;
    const resetCode = Math.floor(100000 + Math.random() * 900000);

    const result = await db.collection("users").findOneAndUpdate(
      { email },
      { $set: { resetCode } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Email not found" });
    }

    console.log(`Reset code for ${email}: ${resetCode}`);
    res.json({ message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Error sending reset code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

// Reset the password
app.post("/api/users/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const db = req.app.locals.db;

    const result = await db.collection("users").updateOne(
      { email },
      { $set: { password: newPassword, resetCode: null } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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