import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function ApparelItem({ image, title, description, price }) {
  function messageSeller() {
    // This function can be replaced with a future implementation
    alert(`Messaging seller about: ${title}`);
  }

  return (
    <div className="apparel-item">
      <img src={image} width="200" height="150" alt={title} />
      <h3 className="font1">{title}</h3>
      <p className="font1">{description}</p>
      <p className="font1 orange-text">Price: ${price}</p>
      <button className="font1" onClick={messageSeller}>Message Seller</button>
    </div>
  );
}

function ApparelMarketplace() {
  const items = [
    {
      image: 'https://www.bluezonesports.com/prodimages/9912-TRUEBLACK-l.jpg',
      title: 'Snow Jacket',
      description: 'High-quality winter jacket to keep you warm.',
      price: '99.99',
    },
    {
      image: 'https://www.rei.com/media/879c8afd-6c09-4357-b761-dda9fd6faaa1.jpg?size=784x588',
      title: 'Snowboard Boots',
      description: 'Size 8 mens snowboard boots.',
      price: '89.99',
    },
    {
      image: 'https://www.rei.com/media/873614ad-e6d7-4f1f-89dd-153e236807da.jpg?size=784x588',
      title: 'Smith Goggles',
      description: 'Size medium like new.',
      price: '129.99',
    },
  ];

  return (
    <div className="container">
      <h2 className="font3">Apparel Category</h2>
      {items.map((item, index) => (
        <ApparelItem key={index} {...item} />
      ))}
    </div>
  );
}

function App() {
  return (
    <ApparelMarketplace />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
