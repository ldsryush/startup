const { MongoClient } = require('mongodb');


const uri = "mongodb+srv://ldsryush:Sanghwa1204@cluster0.zkv4yq6.mongodb.net/mydatabase?retryWrites=true&w=majority";


const sampleProducts = [
  {
    name: "Snowboarding boots",
    description: "2022 snowboard boots",
    price: 59.99,
    category: "Apparel",
    image: "/public/images/boots.jpg"
  },
  {
    name: "Snowboard Jacket",
    description: "Warm and waterproof jacket, perfect for winter activities. Size L.",
    price: 99.99,
    category: "Apparel",
    image: "/public/images/jacket.jpg"
  },
  {
    name: "Burton Snowboard 154",
    description: "Great beginner snowboard size 154cm",
    price: 179.99,
    category: "Equipment",
    image: "/public/images/snowboard.jpg"
  },
  {
    name: "K2 Skis 160",
    description: "Great condition skis, size 160cm.",
    price: 229.99,
    category: "Equipment",
    image: "/public/images/skis.jpg"
  }
];

// Function to insert sample data into the database
async function addSampleData() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB.");

    // Select the database and collection
    const db = client.db("mydatabase"); // Replace "mydatabase" with your database name
    const collection = db.collection("products"); // Ensure your collection name is "products"

    // Insert the sample data
    const result = await collection.insertMany(sampleProducts);
    console.log(`${result.insertedCount} sample items added to the database.`);
  } catch (error) {
    console.error("Error adding sample data:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("Disconnected from MongoDB.");
  }
}

// Run the function
addSampleData();
