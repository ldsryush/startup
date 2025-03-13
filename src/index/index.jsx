import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '/src/App';
import './index.css';

// Adding a simple image component to display the image from public/images
const HomePageImage = () => (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <h1>Welcome to My Website</h1>
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
