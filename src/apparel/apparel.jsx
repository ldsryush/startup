import React from "react";
import { useNavigate } from "react-router-dom";

export function Apparel() {
  const items = [
    {
      sellerId: "seller123",
      image: "https://www.bluezonesports.com/prodimages/9912-TRUEBLACK-l.jpg",
      title: "Snow Jacket",
      description: "High-quality winter jacket to keep you warm.",
      price: "99.99",
    },
    {
      sellerId: "seller456",
      image: "https://www.rei.com/media/879c8afd-6c09-4357-b761-dda9fd6faaa1.jpg?size=784x588",
      title: "Snowboard Boots",
      description: "Size 8 mens snowboard boots.",
      price: "89.99",
    },
    {
      sellerId: "seller789",
      image: "https://www.rei.com/media/873614ad-e6d7-4f1f-89dd-153e236807da.jpg?size=784x588",
      title: "Smith Goggles",
      description: "Size medium like new.",
      price: "129.99",
    },
  ];

  const navigate = useNavigate();

  function ApparelItem({ sellerId, image, title, description, price }) {
    function handleMessageSeller() {
      navigate(`/chat/${sellerId}/${encodeURIComponent(title)}`);
    }

    return (
      <div className="apparel-item">
        <img src={image} width="200" height="150" alt={title} />
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
      <h2 className="font3">Apparel Category</h2>
      {items.map((item, index) => (
        <ApparelItem key={index} {...item} />
      ))}
    </div>
  );
}
