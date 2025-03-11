import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css"; // Updated from login.css to auth.css

const Login = ({ mockDatabase, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = mockDatabase.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      onLoginSuccess(user);
      setError("");
      navigate("/");
    } else {
      setError("Wrong username or password. Please try again.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
    </form>
  );
};

export default Login;
