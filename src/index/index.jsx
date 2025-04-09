import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from "../App";  
import './index.css';

const HomePageBanner = () => (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <h1>Oyee Marketplace</h1>
    <h2>Sanghwa Ryu</h2>
    <h3>
      <a 
        href="https://github.com/ldsryush/startup.git" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        github link
      </a>
    </h3>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <HomePageBanner /> {/* Displays the banner at the top of your app */}
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);