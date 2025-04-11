import React, { useEffect, useState } from "react";
import axios from "axios";
import "./apparel.css";

export function Apparel({ email }) { 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch product items and initialize WebSocket connection
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setItems(data.filter((item) => item.category === "Apparel")); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load apparel items. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();

    // Determine WebSocket URL dynamically
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? "wss://startup.oyeemarket.click" // Production WebSocket URL
        : "wss://organic-robot-r4pwp45v54p63xrx-4000.app.github.dev"; 

    console.log("Connecting to WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    ws.onopen = () => console.log("WebSocket connection established");
    ws.onclose = () => console.error("WebSocket connection closed");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    setSocket(ws);

    // Cleanup WebSocket connection on component unmount
    return () => ws.close();
  }, []);

  const handleMessageSend = async () => {
    if (socket && selectedItem) {
      const chatMessage = {
        itemId: selectedItem._id,
        sender: email, // Using the buyer's email
        recipient: selectedItem.email, // Seller's email
        message,
        timestamp: new Date().toISOString(),
      };

      // Send message via WebSocket
      socket.send(JSON.stringify(chatMessage));

      // Save the message to the backend
      try {
        await axios.post("/api/messages", {
          sender: chatMessage.sender,
          receiver: chatMessage.recipient,
          content: chatMessage.message,
          timestamp: chatMessage.timestamp,
        });

        console.log("Message saved to the backend");

        // Display the message locally
        setMessages((prev) => [...prev, chatMessage]);
        setMessage(""); 
      } catch (error) {
        console.error("Error saving message to the backend:", error);
      }
    }
  };

  if (loading) return <div>Loading apparel items...</div>;
  if (error) return <div>{error}</div>;

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
              <img
                src={item.imagePath}
                alt={item.name}
                className="apparel-image"
              />
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              <p>
                <strong>Seller:</strong> {item.email}
              </p>
              <button onClick={() => setSelectedItem(item)}>
                Message Seller
              </button>
              
              {/* Render chatbox directly below the item if it's selected */}
              {selectedItem && selectedItem._id === item._id && (
                <div className="chat-container">
                  <h3>Chat with the seller about {item.name}</h3>
                  <ul className="chat-messages">
                    {messages
                      .filter((msg) => msg.itemId === item._id) 
                      .map((msg, index) => (
                        <li key={index}>
                          <strong>{msg.sender}:</strong> {msg.message}
                        </li>
                      ))}
                  </ul>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message..."
                  />
                  <button onClick={handleMessageSend}>Send Message</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Apparel;
