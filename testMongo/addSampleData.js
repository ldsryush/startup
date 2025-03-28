const { MongoClient } = require('mongodb');


const uri = "mongodb+srv://ldsryush:Sanghwa1204@cluster0.zkv4yq6.mongodb.net/mydatabase?retryWrites=true&w=majority";


const sampleProducts = [
  {
    name: "Running Shoes",
    description: "Lightweight and durable running shoes for athletes.",
    price: 59.99,
    category: "Apparel",
    image: "/path/to/running-shoes.jpg"
  },
  {
    name: "Winter Jacket",
    description: "Warm and waterproof jacket, perfect for winter activities.",
    price: 99.99,
    category: "Apparel",
    image: "/path/to/winter-jacket.jpg"
  },
  {
    name: "Hiking Backpack",
    description: "A spacious backpack with multiple compartments for outdoor enthusiasts.",
    price: 79.99,
    category: "Equipment",
    image: "/path/to/hiking-backpack.jpg"
  },
  {
    name: "Tent",
    description: "Two-person lightweight tent, ideal for camping trips.",
    price: 129.99,
    category: "Equipment",
    image: "/path/to/tent.jpg"
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
