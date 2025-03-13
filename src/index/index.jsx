import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '/src/App';
import './index.css';

const HomePageImage = () => (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <h1>Oyee Marketplace</h1>
    <h1>Sanghwa Ryu</h1>
    <h1><a href="https://github.com/ldsryush/startup.git">github link</a></h1>
</div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <HomePageImage /> {/* Displays the image at the top of your app */}
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
