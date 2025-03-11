import React, { useState } from "react";

const Login = ({ mockDatabase, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = mockDatabase.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      onLoginSuccess(user);
      setError(""); 
    } else {
      // If not valid, show error message
      setError("Wrong username or password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        Login
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </form>
  );
};

export default Login;
