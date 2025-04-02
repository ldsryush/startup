import React, { useState } from "react";
import "./auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Sign-up successful! Welcome, ${data.email}`);
        setName("");
        setEmail("");
        setPassword("");
      } else if (response.status === 409) { // Email already registered
        setMessage("Email is already registered!");
      } else if (response.status >= 500) { // Server error
        setMessage("Server error. Please try again later.");
      } else {
        setMessage("Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
      {message && <p className="error-message">{message}</p>}
    </form>
  );
};

export default Signup;