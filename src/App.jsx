import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Apparel } from './apparel/apparel';
import { Equipment } from './equipment/equipment';
import { Input } from './input/input';
import { Media } from './media/media';
import { Sell } from './sell/sell';

import './index/index.css';

function App() {
  return (
    <div className="app">
      <nav style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/apparel">Apparel</NavLink>
        <NavLink to="/equipment">Equipment</NavLink>
        <NavLink to="/input">Input</NavLink>
        <NavLink to="/media">Media</NavLink>
        <NavLink to="/sell">Sell</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<div>
            <h1>Home</h1>
            <img src="https://th.bing.com/th/id/OIP.EyzlDZLLcdmZYnihvwhEGwHaEK?rs=1&pid=ImgDetMain" alt="Home" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>} />
          <Route path="/apparel" element={<Apparel />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/input" element={<Input />} />
          <Route path="/media" element={<Media />} />
          <Route path="/sell" element={<Sell />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
