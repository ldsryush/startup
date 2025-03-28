import React, { useEffect, useState } from "react";
import axios from "axios";

export function Equipment() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch products from the backend
    axios
      .get("http://localhost:5000/api/products") // Replace with your live API URL if deployed
      .then((response) => {
        // Filter items where category is "Equipment"
        const equipmentItems = response.data.filter((item) => item.category === "Equipment");
        setItems(equipmentItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching equipment items:", err);
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
            <li key={item.id || item._id} className="equipment-item">
              <h3>{item.title || item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              {/* Additional item details can be rendered here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Equipment;
