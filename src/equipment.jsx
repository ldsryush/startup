import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function EquipmentItem({ image, title, description, price }) {
  function messageSeller() {
    alert(`Messaging seller about: ${title}`);
  }

  return (
    <div className="apparel-item">
      <img src={image} width="300" height="250" alt={title} />
      <h3 className="font1">{title}</h3>
      <p className="font1">{description}</p>
      <p className="font1 orange-text">Price: ${price}</p>
      <button className="font1" onClick={messageSeller}>Message Seller</button>
    </div>
  );
}

function EquipmentMarketplace() {
  const items = [
    {
      image: 'https://www.tactics.com/a/ejjk/2/burton-family-tree-power-wagon-snowboard-1.webp',
      title: 'Burton Snowboard',
      description: 'Size 154cm',
      price: '190',
    },
    {
      image: 'https://cdn.skatepro.com/product/520/k2-disruption-mti-skis-xcell-12-tcx-bindings-i2.webp',
      title: 'K2 Skis',
      description: 'Size 160cm.',
      price: '289.99',
    },
    {
      image: 'https://cdn.skatepro.com/product/520/black-crows-duos-freebird-adjustable-ski-poles-v1.webp',
      title: 'Ski poles',
      description: 'Like new.',
      price: '59.99',
    },
  ];

  return (
    <div className="container">
      <h2 className="font3">Equipments</h2>
      {items.map((item, index) => (
        <EquipmentItem key={index} {...item} />
      ))}
    </div>
  );
}

function App() {
  return (
    <EquipmentMarketplace />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
