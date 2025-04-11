import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const navigate = useNavigate();

  const handleSendResetCode = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoadingSend(true);
    setMessage("");
    try {
      const response = await fetch("/api/users/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Reset code sent to your email!");
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to send reset code. Please try again.");
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoadingSend(false);
    }
  };

  const handleVerifyResetCode = async () => {
    if (!email || !resetCode) {
      setMessage("Please fill in both email and reset code.");
      return;
    }

    setLoadingVerify(true);
    setMessage("");
    try {
      const response = await fetch("/api/users/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode }),
      });

      if (response.ok) {
        setMessage("Reset code verified! Redirecting to set a new password...");
        setTimeout(() => navigate("/set-new-password"), 2000);
      } else {
        const data = await response.json();
        setMessage(data.error || "Invalid reset code. Please check and try again.");
      }
    } catch (error) {
      console.error("Error verifying reset code:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Password Reset</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loadingSend || loadingVerify}
          style={{
            padding: "10px",
            marginRight: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSendResetCode}
          disabled={loadingSend}
          style={{
            padding: "10px 20px",
            backgroundColor: loadingSend ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loadingSend ? "not-allowed" : "pointer",
          }}
        >
          {loadingSend ? "Sending..." : "Send Reset Code"}
        </button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter reset code"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          disabled={loadingSend || loadingVerify}
          style={{
            padding: "10px",
            marginRight: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleVerifyResetCode}
          disabled={loadingVerify}
          style={{
            padding: "10px 20px",
            backgroundColor: loadingVerify ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loadingVerify ? "not-allowed" : "pointer",
          }}
        >
          {loadingVerify ? "Verifying..." : "Verify Reset Code"}
        </button>
      </div>
      {message && <p style={{ color: message.includes("error") ? "red" : "green" }}>{message}</p>}
    </div>
  );
};

export default PasswordReset;
