import React, { useState, useEffect } from "react";
import "./sell.css";

const Sell = ({ userId }) => { // Receive the actual logged-in userId as a prop
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("Apparel");
  const [itemImage, setItemImage] = useState(null);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    console.log("Current userId:", userId); // Debug userId to verify it's being received
  }, [userId]);

  const handleSell = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("Error: User ID is missing. Please log in.");
      console.error("Error: userId is undefined!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("description", itemDescription);
      formData.append("price", itemPrice);
      formData.append("category", itemCategory);
      formData.append("image", itemImage);
      formData.append("userId", userId); // Ensure correct user ID is sent

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Item listed successfully!");
        setItemName("");
        setItemDescription("");
        setItemPrice("");
        setItemCategory("Apparel");
        setItemImage(null);
        setPreviewImage("");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div>
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
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <button type="submit">List Item for Sale</button>
        {message && <p className="error-message">{message}</p>}
      </form>

      {previewImage && (
        <div className="image-preview">
          <h3>Preview of Uploaded Image:</h3>
          <img src={previewImage} alt="Uploaded Item" />
        </div>
      )}
    </div>
  );
};

export default Sell;