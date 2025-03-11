import React, { useState } from "react";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSendResetCode = async () => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        setMessage("Reset code sent to your email!");
      } else {
        setMessage("Email not found. Please try again.");
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  const handleVerifyResetCode = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const users = await response.json();
      const user = users.find((user) => user.email === email && user.resetCode === resetCode);

      if (user) {
        setMessage("Reset code verified!");
      } else {
        setMessage("Invalid reset code. Please check and try again.");
      }
    } catch (error) {
      console.error("Error verifying reset code:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Password Reset</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendResetCode}>Send Reset Code</button>

      <br />

      <input
        type="text"
        placeholder="Enter reset code"
        value={resetCode}
        onChange={(e) => setResetCode(e.target.value)}
      />
      <button onClick={handleVerifyResetCode}>Verify Reset Code</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordReset;
