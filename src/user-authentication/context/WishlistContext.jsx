import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  addToWishlist as addToWishlistAPI,
  removeFromUserWishlist,
  getUserWishlist
} from '../../product-management/api/productApi';

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const { user, token, updateWishlistCount } = useAuth(); // ✅ include updateWishlistCount
  const [wishlist, setWishlist] = useState([]);

  // ✅ Sync wishlist from backend when user changes
  useEffect(() => {
    if (user?.id && token) {
      fetchUserWishlist();
    } else {
      setWishlist([]);
      updateWishlistCount?.(0); // ✅ reset count on logout
    }
  }, [user, token]);

  // ✅ Add product to wishlist and backend
  function addToWishlist(product) {
    if (!user?.id || !token) return;

    const alreadyExists = wishlist.some(item => item.id === product.id);
    if (alreadyExists) return;

    const updated = [...wishlist, product];
    setWishlist(updated);
    updateWishlistCount?.(updated.length); // ✅ sync count

    addToWishlistAPI(user.id, product.id, token)
      .catch(err => {
        console.error("Add to wishlist failed:", err);
        setWishlist(prev => {
          const rollback = prev.filter(item => item.id !== product.id);
          updateWishlistCount?.(rollback.length); // ✅ rollback count
          return rollback;
        });
      });
  }

  // ✅ Remove product locally
  function removeFromWishlist(id) {
    setWishlist(prev => {
      const updated = prev.filter(item => item.id !== id);
      updateWishlistCount?.(updated.length); // ✅ sync count
      return updated;
    });
  }

  // ✅ Remove product and sync with backend
  function removeFromWishlistAndSync(id) {
    if (!user?.id || !token) return;

    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    updateWishlistCount?.(updated.length); // ✅ sync count

    removeFromUserWishlist(user.id, id, token)
      .then(() => fetchUserWishlist())
      .catch(err => {
        console.error("Remove from wishlist failed:", err);
        setWishlist(prev => {
          updateWishlistCount?.(prev.length); // ✅ fallback count
          return [...prev];
        });
      });
  }

  // ✅ Fetch wishlist from backend
  async function fetchUserWishlist() {
    if (!user?.id || !token) return;
    try {
      const latest = await getUserWishlist(user.id, token);
      setWishlist(latest);
      updateWishlistCount?.(latest.length); // ✅ sync count
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  }

  // ✅ Clear wishlist locally
  function clearWishlist() {
    setWishlist([]);
    updateWishlistCount?.(0); // ✅ sync count
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        removeFromWishlistAndSync,
        clearWishlist,
        fetchUserWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
