import React, { useState, useEffect } from "react";
import axios from "axios";

export function Messages({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch messages from the backend for the current user
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/messages", {
          params: { user: currentUser?.username }, // Fetch only messages relevant to logged-in user
        });
        setMessages(response.data); // Assume response contains an array of messages
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.username) {
      fetchMessages();
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [currentUser]); // Re-fetch messages when currentUser changes

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="messages-container">
      <h2 className="font3">Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="messages-list">
          {messages.map((msg, index) => (
            <li key={index} className="message-item">
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
