import React, { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { Apparel } from "./apparel/apparel";
import { Equipment } from "./equipment/equipment";
import { Input } from "./input/input";
import { Media } from "./media/media";
import { Sell } from "./sell/sell";
import Chatbox from "./chatbox/chatbox";
import Signup from "./auth/signup";
import Login from "./auth/login";
import Products from "./products/products";
import PasswordReset from "./auth/password-reset"; // Import PasswordReset component
import { Weather } from "./weather"; // Import Weather component
import "./index/index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Login state tracking
  const [currentUser, setCurrentUser] = useState(null); // Current logged-in user

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-around", padding: "10px" }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/apparel">Apparel</NavLink>
        <NavLink to="/equipment">Equipment</NavLink>
        <NavLink to="/input">Input</NavLink>
        <NavLink to="/media">Media</NavLink>
        <NavLink to="/sell">Sell</NavLink>
        <NavLink to="/products">Products</NavLink>

        {!isAuthenticated && (
          <>
            <NavLink to="/signup">Sign Up</NavLink>
            <NavLink to="/login">Login</NavLink>
          </>
        )}

        {isAuthenticated && (
          <>
            <span>Welcome, {currentUser?.username}!</span>
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
                {isAuthenticated && <p>Welcome back, {currentUser?.username || currentUser?.email}!</p>}
                <img
                  src="/images/snowboarding.jpg"
                  alt="Home"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <Weather /> {/* Display weather on the homepage */}
              </div>
            }
          />
          <Route path="/apparel" element={<Apparel />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/input" element={<Input />} />
          <Route path="/media" element={<Media />} />
          <Route
            path="/sell"
            element={
              isAuthenticated ? (
                <Sell />
              ) : (
                <p>Please <NavLink to="/login">log in</NavLink> to access this page.</p>
              )
            }
          />
          <Route path="/products" element={<Products />} />
          <Route
            path="/chat/:sellerId/:itemTitle"
            element={
              isAuthenticated ? (
                <Chatbox />
              ) : (
                <p>Please <NavLink to="/login">log in</NavLink> to access this page.</p>
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
