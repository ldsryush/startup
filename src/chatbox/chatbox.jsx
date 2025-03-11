import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './chatbox.css';


const Chatbox = () => {
  const { sellerId, itemTitle } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Simulate messages from the seller
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "seller", text: `Hello! I'm the seller of ${itemTitle}. How can I help?` },
      ]);
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [itemTitle]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [...prev, { sender: "user", text: newMessage }]);
      setNewMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="chatbox">
      <h2>Chat with Seller: {sellerId}</h2>
      <div className="messages" style={{ border: "1px solid #ccc", padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ color: msg.sender === "user" ? "blue" : "green" }}>
            {msg.sender === "user" ? "You: " : "Seller: "}
            {msg.text}
          </p>
        ))}
      </div>
      <div className="input-box" style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
