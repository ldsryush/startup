import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom"; 
import "./auth.css"; 

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState(""); // Changed from "username" to "email"
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Sending data to the backend
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data); // Pass user data to parent component
        setError("");
        navigate("/"); // Redirect to home page
      } else {
        setError("Wrong email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error connecting to the server.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email" // Changed to "email" for consistency with your backend
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
      <button type="submit">Login</button>
      {error && <p className="error-message">{error}</p>}

      <p>
        Forgot your password? <NavLink to="/reset-password">Reset it here</NavLink>.
      </p>
    </form>
  );
};

export default Login;
