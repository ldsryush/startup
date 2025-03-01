import React from 'react';

export function Sell(props) {
  const [itemName, setItemName] = React.useState('');
  const [itemDescription, setItemDescription] = React.useState('');
  const [itemPrice, setItemPrice] = React.useState('');
  const [itemImage, setItemImage] = React.useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    alert('Item listed for sale');
  }

  return (
    <div className="container">
      <h2 className="font3">Sell Your Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="font3" htmlFor="item-name">Item Name:</label>
          <input
            type="text"
            id="item-name"
            name="item-name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="font3" htmlFor="item-description">Description:</label>
          <textarea
            id="item-description"
            name="item-description"
            rows="5"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label className="font3" htmlFor="item-price">Price:</label>
          <input
            type="number"
            id="item-price"
            name="item-price"
            step="0.01"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="item-image">Image:</label>
          <input
            type="file"
            id="item-image"
            name="item-image"
            accept="image/*"
            onChange={(e) => setItemImage(e.target.files[0])}
            required
          />
        </div>
        <div className="form-group">
          <button className="font3" type="submit">List Item for Sale</button>
        </div>
      </form>
    </div>
  );
}
