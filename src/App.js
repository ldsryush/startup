// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Apparel from './apparel';
import Equipment from './equipment';
import Input from './input';
import Media from './media';
import Sell from './sell';
import './index.css';

function App() {
  return (
    <div className="app">
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/apparel">Apparel</NavLink>
        <NavLink to="/equipment">Equipment</NavLink>
        <NavLink to="/input">Input</NavLink>
        <NavLink to="/media">Media</NavLink>
        <NavLink to="/sell">Sell</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
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
