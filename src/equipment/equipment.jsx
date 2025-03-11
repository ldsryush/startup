import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./equipment.css";

export function Equipment() {
  const items = [
    {
      sellerId: "seller001",
      image: "https://www.tactics.com/a/ejjk/2/burton-family-tree-power-wagon-snowboard-1.webp",
      title: "Burton Snowboard",
      description: "Size 154cm",
      price: "190",
    },
    {
      sellerId: "seller002",
      image: "https://cdn.skatepro.com/product/520/k2-disruption-mti-skis-xcell-12-tcx-bindings-i2.webp",
      title: "K2 Skis",
      description: "Size 160cm.",
      price: "289.99",
    },
    {
      sellerId: "seller003",
      image: "https://cdn.skatepro.com/product/520/black-crows-duos-freebird-adjustable-ski-poles-v1.webp",
      title: "Ski poles",
      description: "Like new.",
      price: "59.99",
    },
  ];

  const navigate = useNavigate();

  function EquipmentItem({ sellerId, image, title, description, price }) {
    function handleMessageSeller() {
      navigate(`/chat/${sellerId}/${encodeURIComponent(title)}`);
    }

    return (
      <div className="apparel-item">
        <img src={image} width="300" height="250" alt={title} />
        <h3 className="font1">{title}</h3>
        <p className="font1">{description}</p>
        <p className="font1 orange-text">Price: ${price}</p>
        <button className="font1" onClick={handleMessageSeller}>
          Message Seller
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="font3">Equipments</h2>
      {items.map((item, index) => (
        <EquipmentItem key={index} {...item} />
      ))}
    </div>
  );
}
