const express = require('express');
const router = express.Router();

// Mock product data (based on your Apparel.jsx items array)
const products = [
  {
    id: 1,
    sellerId: "seller123",
    image: "https://www.bluezonesports.com/prodimages/9912-TRUEBLACK-l.jpg",
    title: "Snow Jacket",
    description: "High-quality winter jacket to keep you warm.",
    price: "99.99",
  },
  {
    id: 2,
    sellerId: "seller456",
    image: "https://www.rei.com/media/879c8afd-6c09-4357-b761-dda9fd6faaa1.jpg?size=784x588",
    title: "Snowboard Boots",
    description: "Size 8 mens snowboard boots.",
    price: "89.99",
  },
  {
    id: 3,
    sellerId: "seller789",
    image: "https://www.rei.com/media/873614ad-e6d7-4f1f-89dd-153e236807da.jpg?size=784x588",
    title: "Smith Goggles",
    description: "Size medium like new.",
    price: "129.99",
  },
];

// Route to get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Export the router
module.exports = router;
