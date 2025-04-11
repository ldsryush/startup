import React, { useState } from "react";
import "./auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://startup.oyeemarket.click" 
      : "https://organic-robot-r4pwp45v54p63xrx-5173.app.github.dev"; 
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
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
      } else if (response.status === 409) {
        setMessage("Email is already registered!");
      } else if (response.status >= 500) {
        setMessage("Server error. Please try again later.");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Error connecting to the server.");
    } finally {
      setLoading(false);
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
      <button type="submit" disabled={loading}>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
      {message && (
        <p className={message.includes("successful") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}
    </form>
  );
};

export default Signup;
