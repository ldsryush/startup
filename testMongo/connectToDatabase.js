const { MongoClient } = require("mongodb");
const path = require("path");
const fs = require("fs");

async function connectToDatabase() {
  try {
    // Read credentials from dbConfig.json
    const dbConfigPath = path.join(__dirname, "dbConfig.json");
    const { hostname, userName, password } = JSON.parse(fs.readFileSync(dbConfigPath, "utf-8"));

    // Construct MongoDB connection URI
    const uri = `mongodb+srv://${userName}:${password}@${hostname}/mydatabase?retryWrites=true&w=majority`;

    // Create a new MongoClient instance
    const client = new MongoClient(uri);

    // Connect to the database
    await client.connect();
    console.log("Connected to MongoDB");

    // Return the connected database instance
    return client;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

module.exports = connectToDatabase;