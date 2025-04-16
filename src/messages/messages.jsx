import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./messages.css";

// ───── ChatClient Class ─────
// Manages the WebSocket connection and notifies registered observers
class ChatClient {
  observers = [];
  connected = false;

  constructor() {
    // Choose ws or wss based on the current page protocol
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

    this.socket.onopen = () => {
      this.connected = true;
      console.log("WebSocket connected");
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        // Expect message to be an object with keys: sender, receiver, content, timestamp
        console.log("WebSocket message received:", message);
        this.notifyObservers(message);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    this.socket.onclose = () => {
      this.connected = false;
      console.log("WebSocket disconnected");
    };
  }

  // (Not used for sending in this app since we use the REST endpoint)
  sendMessage(message) {
    this.socket.send(JSON.stringify(message));
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers(message) {
    this.observers.forEach((callback) => callback(message));
  }
}

// ───── Name Component ─────
// A simple input element that lets the user update their name.
// If currentUser is available, we default to that value.
function Name({ updateName, value }) {
  return (
    <div className="name">
      <fieldset id="name-controls">
        <legend>My Name</legend>
        <input
          id="my-name"
          type="text"
          placeholder="Enter your name"
          value={value}
          onChange={(e) => updateName(e.target.value)}
        />
      </fieldset>
    </div>
  );
}

// ───── Message Component ─────
// Provides an input and a send button to create a new message.
// It calls the provided send handler when the Enter key is pressed or the button is clicked.
function Message({ name, newMessage, setNewMessage, handleSendMessage, webSocket }) {
  function doneMessage(e) {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }

  const disabled = name === "" || (webSocket && !webSocket.connected);

  return (
    <fieldset id="chat-controls">
      <legend>Chat</legend>
      <input
        type="text"
        disabled={disabled}
        placeholder={disabled ? "Enter your name first" : "Type your message..."}
        value={newMessage}
        onKeyDown={doneMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button disabled={disabled || !newMessage} onClick={handleSendMessage}>
        Send
      </button>
    </fieldset>
  );
}

// ───── Conversation Component ─────
// Displays the conversation list (left side) and the chat messages (right side).
// Messages are grouped by conversation partner.
function Conversation({ conversations, selectedPartner, setSelectedPartner, currentUser }) {
  const partners = Object.keys(conversations || {});

  return (
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
          </>
        ) : (
          <div>Please select a conversation to view and reply.</div>
        )}
      </div>
    </div>
  );
}

// ───── Top-Level Chat Component (Messages) ─────
// This component combines the REST-based initial fetch, real-time updates via WebSocket,
// conversation grouping, and the ability to send messages.
export function Messages({ currentUser }) {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  // Use local state for the name; default to the currentUser email if available.
  const [name, setName] = useState(
    currentUser && currentUser.email ? currentUser.email : ""
  );
  // Create a ChatClient instance only once.
  const chatClientRef = useRef(null);

  // Initialize ChatClient and set up its observer.
  useEffect(() => {
    if (!chatClientRef.current) {
      chatClientRef.current = new ChatClient();
      chatClientRef.current.addObserver((incomingMessage) => {
        // Append the incoming message from the WebSocket broadcast.
        setAllMessages((prevMessages) => [...prevMessages, incomingMessage]);
      });
    }
  }, []);

  // REST: Fetch all messages on mount from your API.
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
  const conversations = {};
  allMessages.forEach((msg) => {
    // Group by partner based on whether the current user is the sender
    const partner = msg.sender === currentUser.email ? msg.receiver : msg.sender;
    if (!conversations[partner]) {
      conversations[partner] = [];
    }
    conversations[partner].push(msg);
  });

  // Sort messages in each conversation by timestamp.
  Object.keys(conversations).forEach((partner) => {
    conversations[partner].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  });

  // When sending a message, we POST it via REST.
  // The backend will broadcast the message over WebSocket which updates the state.
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
      // Removed local state update here to prevent duplication.
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

  return (
    <div className="messages-container">
      <h2 className="font3">Messages</h2>
      {/* Name component to let the user adjust their chat name */}
      <Name updateName={setName} value={name} />
      {/* Conversation component displays the conversation list and chat messages */}
      <Conversation
        conversations={conversations}
        selectedPartner={selectedPartner}
        setSelectedPartner={setSelectedPartner}
        currentUser={currentUser}
      />
      {/* Message component for composing and sending new messages */}
      <Message
        name={name}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        webSocket={chatClientRef.current}
      />
    </div>
  );
}

export default Messages;
