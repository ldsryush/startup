import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Apparel } from './apparel/apparel';
import { Equipment } from './equipment/equipment';
import { Input } from './input/input';
import { Media } from './media/media';
import { Sell } from './sell/sell';
import Chatbox from './chatbox/chatbox';
import Signup from './signup'; // Import the Signup component
import './index/index.css';

function App() {
  const mockDatabase = []; // Mockup database to temporarily store user data

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/apparel">Apparel</NavLink>
        <NavLink to="/equipment">Equipment</NavLink>
        <NavLink to="/input">Input</NavLink>
        <NavLink to="/media">Media</NavLink>
        <NavLink to="/sell">Sell</NavLink>
        <NavLink to="/signup">Sign Up</NavLink> {/* Add Sign Up link */}
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
                  style={{ maxWidth: '100%', height: 'auto' }}
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
          <Route path="/signup" element={<Signup mockDatabase={mockDatabase} />} /> {/* Add Sign Up route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
