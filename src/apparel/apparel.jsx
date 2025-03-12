import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // To make HTTP requests

export function Apparel() {
  const [items, setItems] = useState([]); // State to hold product data
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the backend
    axios.get("http://localhost:5000/api/products")
      .then((response) => {
        setItems(response.data); // Update state with fetched products
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []); // Run once on component mount

  function ApparelItem({ sellerId, image, title, description, price }) {
    function handleMessageSeller() {
      navigate(`/chat/${sellerId}/${encodeURIComponent(title)}`);
    }

    return (
      <div className="apparel-item">
        <img src={image} width="200" height="150" alt={title} />
        <h3 className="font1">{title}</h3>
        <p className="font1">{description}</p>
        <p className="font1 orange-text">Price: ${price}</p>
        <button className="font1" onClick={handleMessageSeller}>
          Message Seller
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="font3">Apparel Category</h2>
      {items.map((item) => (
        <ApparelItem key={item.id} {...item} />
      ))}
    </div>
  );
}
