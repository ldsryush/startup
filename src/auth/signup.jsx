import React, { useState } from "react";

const Signup = ({ mockDatabase }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    // Check if the email already exists in the mock database
    const existingUser = mockDatabase.find((user) => user.email === email);
    if (existingUser) {
      setMessage("Email is already registered!");
      return;
    }

    // Add the user to the mock database
    mockDatabase.push({ id: Date.now(), name, email, password });
    setMessage("Sign-up successful!");
    setName(""); // Clear the name input field
    setEmail(""); // Clear the email input field
    setPassword(""); // Clear the password input field
  };

  return (
    <form onSubmit={handleSignup} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sign Up
      </button>
      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
    </form>
  );
};

export default Signup;
