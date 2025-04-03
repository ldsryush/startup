import React, { useEffect, useState } from "react";
import axios from "axios";

export function Equipment() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = "";

  useEffect(() => {
    console.log("Fetching products from backend via relative URL...");
    axios
      .get("/api/products")
      .then((response) => {
        console.log("Fetched products:", response.data);
        const equipmentItems = response.data.filter(
          (item) => item.category === "Equipment"
        );
        setItems(equipmentItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching equipment items:", err.message);
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
          {items.map((item) => {
            console.log("Equipment item image path:", item.imagePath);
            return (
              <li key={item._id} className="equipment-item">
                <h3>{item.name}</h3>
                <p>Listed by: {item.sellerName}</p>
                <img
                  src={`https://organic-robot-r4pwp45v54p63xrx-4000.app.github.dev/${item.imagePath}`}
                  alt={item.name}
                  className="equipment-image"
                />
                <p>{item.description}</p>
                <p>Price: ${item.price}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Equipment;