import React, { useState, useEffect } from "react";
import axios from "axios";

export function Messages({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Ensure the current user is valid before making the request
        if (currentUser?.email) {
          const response = await axios.get("/api/messages", {
            params: { user: currentUser.email }, // Match backend data using email
          });
          console.log("Fetched messages:", response.data); // Debugging log
          setMessages(response.data);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser]);

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="messages-container">
      <h2 className="font3">Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="messages-list">
          {messages.map((msg) => (
            <li key={msg._id} className="message-item">
              <p>
                <strong>From:</strong> {msg.sender}
              </p>
              <p>
                <strong>To:</strong> {msg.receiver}
              </p>
              <p>{msg.content}</p>
              <p>
                <small>
                  <strong>Time:</strong> {new Date(msg.timestamp).toLocaleString()}
                </small>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Messages;
