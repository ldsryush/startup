const { MongoClient } = require("mongodb");
const config = require("./dbConfig.json");

async function connectToDatabase() {
  try {
    // Construct the connection string.
    const uri = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}/mydatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

module.exports = connectToDatabase;
