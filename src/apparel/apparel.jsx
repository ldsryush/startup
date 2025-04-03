import React, { useEffect, useState } from "react";
import axios from "axios";

export function Apparel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Fetching products from backend via relative URL...");
    axios
      .get("/api/products")
      .then((response) => {
        console.log("Fetched products:", response.data);
        // Filter items where category is "Apparel"
        const apparelItems = response.data.filter(
          (item) => item.category === "Apparel"
        );
        setItems(apparelItems);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          console.error("Error fetching apparel items (response):", err.response.data);
        } else if (err.request) {
          console.error("Error fetching apparel items (no response):", err.request);
        } else {
          console.error("Error fetching apparel items:", err.message);
        }
        setError("Failed to load apparel items. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading apparel items...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="apparel-container">
      <h2 className="font3">Apparel Listings</h2>
      {items.length === 0 ? (
        <p>No apparel items found.</p>
      ) : (
        <ul className="apparel-list">
          {items.map((item) => (
            <li key={item._id} className="apparel-item">
              <h3>{item.name}</h3>
              {/* Display image */}
              <img src={item.image} alt={item.name} />
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
//:)

export default Apparel;