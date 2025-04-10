import React, { useState, useEffect } from "react";
import axios from "axios";

export function Messages({ currentUser }) {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !currentUser.email) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("/api/messages", {
          params: { user: currentUser.email },
        });
        console.log("Fetched messages:", response.data);
        setAllMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser]);

  // Group messages by conversation partner.
  // For each message, if the current user is the sender, the partner is the receiver; otherwise, the partner is the sender.
  const conversations = {};
  allMessages.forEach((msg) => {
    const partner = msg.sender === currentUser.email ? msg.receiver : msg.sender;
    if (!conversations[partner]) {
      conversations[partner] = [];
    }
    conversations[partner].push(msg);
  });

  // Sort messages in each conversation by timestamp (ascending order)
  Object.keys(conversations).forEach((partner) => {
    conversations[partner].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  });

  // Handle sending a new message in the selected conversation
  const handleSendMessage = async () => {
    if (!selectedPartner || !newMessage) return;
    const messageToSend = {
      sender: currentUser.email,
      receiver: selectedPartner,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    try {
      await axios.post("/api/messages", messageToSend);
      // Append the new message locally
      setAllMessages((prev) => [...prev, messageToSend]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!currentUser || !currentUser.email) {
    return <div>Please log in to view your messages.</div>;
  }
  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>{error}</div>;

  const partners = Object.keys(conversations);

  return (
    <div className="messages-container">
      <h2 className="font3">Messages</h2>
      <div className="chat-layout">
        <div className="conversation-list">
          {partners.length === 0 ? (
            <p>No conversations yet.</p>
          ) : (
            partners.map((partner) => (
              <div
                key={partner}
                className={`conversation-item ${selectedPartner === partner ? "active" : ""}`}
                onClick={() => setSelectedPartner(partner)}
              >
                {partner}
              </div>
            ))
          )}
        </div>
        <div className="chat-box">
          {selectedPartner ? (
            <>
              <h3>Chat with {selectedPartner}</h3>
              <div className="message-log">
                {conversations[selectedPartner].map((msg, index) => (
                  <div
                    key={index}
                    className={`message-bubble ${
                      msg.sender === currentUser.email ? "sent" : "received"
                    }`}
                  >
                    <div className="message-text">{msg.content}</div>
                    <div className="message-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div>Please select a conversation to view and reply.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
