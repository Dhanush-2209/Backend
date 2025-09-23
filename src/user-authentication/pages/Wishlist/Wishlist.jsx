// src/pages/Wishlist/Wishlist.jsx
import React from 'react';
import './Wishlist.css';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = "http://localhost:3001/users"; // centralize base URL

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user, login } = useAuth();

  async function handleAddToCart(product) {
    if (!user) return;
    addToCart(product);
    removeFromWishlist(product.id);

    const updatedCart = [...(user.cart || []), { ...product, quantity: 1 }];

    try {
      await fetch(`${API_URL}/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: updatedCart })
      });
      login({ ...user, cart: updatedCart });
      toast.success(`${product.name || product.title} added to cart`);
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast.error("Failed to add to cart");
    }
  }

  async function handleRemoveFromWishlist(id) {
    if (!user) return;
    const updatedWishlist = wishlist.filter(item => item.id !== id);
    removeFromWishlist(id);

    try {
      await fetch(`${API_URL}/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlist: updatedWishlist })
      });
      login({ ...user, wishlist: updatedWishlist });
      toast.success("Item removed from wishlist");
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      toast.error("Failed to remove item");
    }
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-container">
        <div className="empty-wishlist">
          <h2>Your wishlist is empty</h2>
          <p>Add items you love to your wishlist to save them for later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">
        Your Wishlist <span className="wishlist-count">{wishlist.length} items</span>
      </h1>
      <div className="wishlist-items">
        {wishlist.map((product) => (
          <div key={product.id} className="wishlist-item">
            <div className="wishlist-item-image">
              <img src={product.image || product.thumbnail} alt={product.name || product.title} />
            </div>
            <div className="wishlist-item-details">
              <h3 className="wishlist-item-title">{product.name || product.title}</h3>
              <p className="wishlist-item-price">
                ${Number(product.price || 0).toFixed(2)} {product.unit ? `/ ${product.unit}` : ""}
              </p>
              <p className="wishlist-item-desc">{product.description}</p>
              <div className="wishlist-item-actions">
                <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
                <button className="btn btn-outline" onClick={() => handleRemoveFromWishlist(product.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
