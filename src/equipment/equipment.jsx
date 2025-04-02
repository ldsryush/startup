import React, { useEffect, useState } from "react";
import axios from "axios";

export function Equipment() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Using a relative URL so that the proxy handles forwarding
    console.log("Fetching products from backend via relative URL...");
    axios
      .get("/api/products")
      .then((response) => {
        console.log("Fetched products:", response.data);
        // Filter items where category is "Equipment"
        const equipmentItems = response.data.filter(
          (item) => item.category === "Equipment"
        );
        setItems(equipmentItems);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          console.error("Error fetching equipment items (response):", err.response.data);
        } else if (err.request) {
          console.error("Error fetching equipment items (no response):", err.request);
        } else {
          console.error("Error fetching equipment items:", err.message);
        }
        setError("Failed to load equipment items. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading equipment items...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="equipment-container">
      <h2 className="font3">Equipment Listings</h2>
      {items.length === 0 ? (
        <p>No equipment items found.</p>
      ) : (
        <ul className="equipment-list">
          {items.map((item) => (
            <li key={item._id} className="equipment-item">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Equipment;