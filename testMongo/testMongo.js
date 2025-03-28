// testMongo.js
const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// Construct the connection string (note: no trailing slash)
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Create a new MongoClient without deprecated options
const client = new MongoClient(url);

async function main() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    const db = client.db('rental'); // Use (or create) the 'rental' database
    const collection = db.collection('house'); // Use (or create) the 'house' collection

    // Test the connection with a ping command
    try {
      await db.command({ ping: 1 });
      console.log(`DB connected to ${config.hostname}`);
    } catch (ex) {
      console.log(`Connection failed to ${url} because ${ex.message}`);
      process.exit(1);
    }

    // --- Insert ---
    const house = {
      name: 'Beachfront views',
      summary: 'From your bedroom to the beach, no shoes required',
      property_type: 'Condo',
      beds: 1,
    };
    const insertResult = await collection.insertOne(house);
    console.log(`Inserted document with _id: ${insertResult.insertedId}`);

    // --- Query ---
    const query = { property_type: 'Condo', beds: { $lt: 2 } };
    const options = {
      sort: { name: -1 },
      limit: 10,
    };
    const cursor = collection.find(query, options);
    const rentals = await cursor.toArray();
    console.log('Query Results:');
    rentals.forEach((doc) => console.log(doc));

    // --- Delete ---
    const deleteResult = await collection.deleteMany(query);
    console.log(`Deleted ${deleteResult.deletedCount} document(s) matching the query`);
  
  } catch (error) {
    console.error(`Database error: ${error.message}`);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

main();
