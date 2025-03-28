const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// Construct the connection string using credentials from dbConfig.json.
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

/**
 * Connects to the MongoDB database.
 * This function connects the client, tests the connection via a ping,
 * and then returns the connected client.
 */
async function connectToDatabase() {
  try {
    await client.connect();
    // Use the "simon" database for connection testing—
    // you can change this if needed.
    const db = client.db('simon');
    // Test the connection with a ping command.
    await db.command({ ping: 1 });
    console.log(`Connected to database at ${config.hostname}`);
    return client;
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
}

// Once connected, you can define collections using a given database.
// If you plan to use these functions once you have connected in your server code,
// the database instance is assumed to be retrieved after calling connectToDatabase.
const db = client.db('simon');
const userCollection = db.collection('user');
const scoreCollection = db.collection('score');

// Helper functions for database operations:

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

async function addScore(score) {
  return scoreCollection.insertOne(score);
}

function getHighScores() {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
  connectToDatabase,
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addScore,
  getHighScores,
};
