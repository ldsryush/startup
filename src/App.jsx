import React, { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { Apparel } from "./apparel/apparel";
import { Equipment } from "./equipment/equipment";
import Sell from "./sell/sell";
import Signup from "./auth/signup";
import Login from "./auth/login";
import PasswordReset from "./auth/password-reset";
import SetNewPassword from "./auth/SetNewPassword";
import Messages from "./messages/messages"; // Renamed from Products
import { Weather } from "./weather";
import "./index/index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user); // Store user data including userId, username, etc.
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "10px",
        }}
      >
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink
          to="/apparel"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Apparel
        </NavLink>
        <NavLink
          to="/equipment"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Equipment
        </NavLink>
        <NavLink
          to="/sell"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Sell
        </NavLink>
        <NavLink
          to="/messages" // Updated to use Messages component
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Messages
        </NavLink>

        {!isAuthenticated ? (
          <>
            <NavLink
              to="/signup"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Sign Up
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
          </>
        ) : (
          <>
            <span>Welcome, {currentUser?.username || "User"}!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Home</h1>
                {isAuthenticated && (
                  <p>
                    Welcome back,{" "}
                    {currentUser?.username || currentUser?.email}!
                  </p>
                )}
                <img
                  src="/uploads/snowboarding.jpg"
                  alt="Home"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <Weather />
              </div>
            }
          />
          <Route path="/apparel" element={<Apparel />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route
            path="/sell"
            element={
              isAuthenticated ? (
                <Sell email={currentUser?.email} /> // Pass user's email to Sell component
              ) : (
                <p>
                  Please <NavLink to="/login">log in</NavLink> to access this
                  page.
                </p>
              )
            }
          />
          <Route path="/messages" element={<Messages />} /> {/* Updated route */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
