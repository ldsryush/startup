import React, { useState } from "react";
import "./auth.css"; 

const Signup = ({ mockDatabase }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    const existingUser = mockDatabase.find((user) => user.email === email);
    if (existingUser) {
      setMessage("Email is already registered!");
      return;
    }
    mockDatabase.push({ id: Date.now(), name, email, password });
    setMessage("Sign-up successful!");
    setName("");
    setEmail("");
    setPassword("");
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
