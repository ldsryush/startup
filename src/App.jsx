import React, { useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Apparel } from "./apparel/apparel";
import { Equipment } from "./equipment/equipment";
import { Input } from "./input/input";
import { Media } from "./media/media";
import { Sell } from "./sell/sell";
import Chatbox from "./chatbox/chatbox";
import Signup from "./auth/Signup";
import Login from "./auth/Login"; // Import Login component
import "./index/index.css";

function App() {
  const mockDatabase = [
    { id: 1, username: "user1", password: "password123" },
    { id: 2, username: "user2", password: "securePass456" },
  ]; // Mock database

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state
  const [currentUser, setCurrentUser] = useState(null); // Track logged-in user

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user); // Save logged-in user's data
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null); // Clear user data
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
                <img
                  src="https://th.bing.com/th/id/OIP.EyzlDZLLcdmZYnihvwhEGwHaEK?rs=1&pid=ImgDetMain"
                  alt="Home"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            }
          />
          <Route path="/apparel" element={<Apparel />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/input" element={<Input />} />
          <Route path="/media" element={<Media />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/chat/:sellerId/:itemTitle" element={<Chatbox />} />
          <Route path="/signup" element={<Signup mockDatabase={mockDatabase} />} />
          <Route path="/login" element={<Login mockDatabase={mockDatabase} onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
