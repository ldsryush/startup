import React from 'react';
import axios from 'axios';

export function Sell(props) {
  // If you require logged-in users, you can enforce a check:
  if (!props.user) {
    return <div>Please log in to list your item.</div>;
  }

  const [itemName, setItemName] = React.useState('');
  const [itemDescription, setItemDescription] = React.useState('');
  const [itemPrice, setItemPrice] = React.useState('');
  const [itemCategory, setItemCategory] = React.useState('Apparel');
  const [itemImage, setItemImage] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  // Dynamically determine the API endpoint based on environment:
  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : 'https://organic-robot-r4pwp45v54p63xrx-4000.app.github.dev';

  async function handleSubmit(event) {
    event.preventDefault();

    // Build the form data using FormData for multipart uploads
    const formData = new FormData();
    formData.append('name', itemName);
    formData.append('description', itemDescription);
    formData.append('price', itemPrice);
    formData.append('category', itemCategory);
    formData.append('image', itemImage);

    // Optionally add the logged-in user's id to associate the item with its owner
    if (props.user.id) {
      formData.append('userId', props.user.id);
    }

    try {
      await axios.post(`${BASE_URL}/api/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('Item listed successfully!');
      setErrorMessage('');
      // Optionally reset form fields after a successful submission:
      setItemName('');
      setItemDescription('');
      setItemPrice('');
      setItemCategory('Apparel');
      setItemImage(null);
    } catch (error) {
      console.error('Error listing item:', error.response || error.message);
      setErrorMessage('Failed to list the item. Please try again.');
      setSuccessMessage('');
    }
  }

  return (
    <div className="container">
      <h2 className="font3">Sell Your Item</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
          <label className="font3" htmlFor="item-category">Category:</label>
          <select
            id="item-category"
            name="item-category"
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
            required
          >
            <option value="Apparel">Apparel</option>
            <option value="Equipment">Equipment</option>
          </select>
        </div>
        <div className="form-group">
          <label className="font3" htmlFor="item-image">Image:</label>
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

export default Sell;