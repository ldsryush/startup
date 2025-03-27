const { MongoClient } = require('mongodb');
const config = require('./db.json'); 

// Construct the MongoDB connection string using your credentials
const uri = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}/?retryWrites=true&w=majority`;

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

module.exports = { connectToDatabase, client };
