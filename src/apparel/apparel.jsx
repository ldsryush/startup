import React, { useEffect, useState } from "react";
import axios from "axios";

export function Apparel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = true;
  const [error, setError] = "";

  useEffect(() => {
    console.log("Fetching products from backend via relative URL...");
    axios
      .get("/api/products")
      .then((response) => {
        console.log("Fetched products:", response.data);
        const apparelItems = response.data.filter(
          (item) => item.category === "Apparel"
        );
        setItems(apparelItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching apparel items:", err.message);
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
          {items.map((item) => {
            console.log("Apparel item image path:", item.imagePath);
            return (
              <li key={item._id} className="apparel-item">
                <h3>{item.name}</h3>
                <p>Listed by: {item.sellerName}</p>
                <img
                  src={`https://organic-robot-r4pwp45v54p63xrx-4000.app.github.dev/${item.imagePath}`}
                  alt={item.name}
                  className="apparel-image"
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

export default Apparel;