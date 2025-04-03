import React, { useState } from "react";
import "./sell.css"; // Adjust CSS file as needed

const Sell = () => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("Apparel");
  const [itemImage, setItemImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSell = async (e) => {
    e.preventDefault();

    try {
      // Build the FormData object for multipart/form-data
      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("description", itemDescription);
      formData.append("price", itemPrice);
      formData.append("category", itemCategory);
      formData.append("image", itemImage);

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData, // No need for "Content-Type" with FormData
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Item listed successfully!");
        setItemName("");
        setItemDescription("");
        setItemPrice("");
        setItemCategory("Apparel");
        setItemImage(null);
      } else if (response.status === 400) {
        setMessage("Image upload is required!");
      } else if (response.status >= 500) {
        setMessage("Server error. Please try again later.");
      } else {
        setMessage("Failed to list the item. Please try again.");
      }
    } catch (error) {
      console.error("Error listing item:", error);
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <form className="sell-form" onSubmit={handleSell}>
      <h2>Sell Your Item</h2>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        rows="5"
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        required
      ></textarea>
      <input
        type="number"
        placeholder="Price"
        value={itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
        step="0.01"
        required
      />
      <select
        value={itemCategory}
        onChange={(e) => setItemCategory(e.target.value)}
        required
      >
        <option value="Apparel">Apparel</option>
        <option value="Equipment">Equipment</option>
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setItemImage(e.target.files[0])}
        required
      />
      <button type="submit">List Item for Sale</button>
      {message && <p className="error-message">{message}</p>}
    </form>
  );
};

export default Sell;