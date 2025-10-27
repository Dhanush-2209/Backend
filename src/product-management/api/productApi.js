const BASE_URL = import.meta.env.VITE_API_URL;

// ✅ Fetch products with optional category filter
export const fetchProducts = async (category = "") => {
  try {
    const url = category
      ? `${BASE_URL}/products?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/products`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch products from backend:", error);
    return [];
  }
};

// ✅ Fetch deal products (discount >= 15%)
export const fetchDealProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/deals`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch deal products:", error);
    return [];
  }
};

// ✅ Fetch filtered products from backend
export const fetchFilteredProducts = async (filters) => {
  try {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.append("search", filters.searchTerm);
    if (filters.brands?.length) filters.brands.forEach(b => params.append("brands", b));
    if (filters.categories?.length) filters.categories.forEach(c => params.append("categories", c));
    if (filters.priceMin) params.append("priceMin", filters.priceMin);
    if (filters.priceMax) params.append("priceMax", filters.priceMax);
    if (filters.ratingMin) params.append("ratingMin", filters.ratingMin);
    if (filters.sortBy) params.append("sort", filters.sortBy);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const response = await fetch(`${BASE_URL}/products/filter?${params.toString()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch filtered products:", error);
    return [];
  }
};

// ✅ Add product to wishlist
export const addToWishlist = async (userId, productId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/wishlist/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to add to wishlist");
    return await response.json();
  } catch (error) {
    console.error("Wishlist error:", error);
    throw error;
  }
};

// ✅ Remove product from wishlist
export const removeFromUserWishlist = async (userId, productId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/wishlist/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to remove from wishlist");
    return true;
  } catch (error) {
    console.error("Remove wishlist error:", error);
    throw error;
  }
};

// ✅ Get user's wishlist
export const getUserWishlist = async (userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch wishlist");
    return await response.json();
  } catch (error) {
    console.error("Fetch wishlist error:", error);
    return [];
  }
};

// ✅ Add product to cart
export const addToUserCart = async (userId, productId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/cart/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to add to cart");
    return await response.json();
  } catch (error) {
    console.error("Cart error:", error);
    throw error;
  }
};

// ✅ Update cart item quantity
export const updateCartItem = async (userId, productId, quantity, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/cart/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) throw new Error("Failed to update cart item");
    return await response.json();
  } catch (error) {
    console.error("Update cart error:", error);
    throw error;
  }
};

// ✅ Remove product from cart
export const removeFromUserCart = async (userId, productId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to remove from cart");
    return true;
  } catch (error) {
    console.error("Remove cart error:", error);
    throw error;
  }
};

// ✅ Clear entire cart
export const clearUserCart = async (userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to clear cart");
    return true;
  } catch (error) {
    console.error("Clear cart error:", error);
    throw error;
  }
};

// ✅ Get user's cart
export const getUserCart = async (userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch cart");
    return await response.json();
  } catch (error) {
    console.error("Fetch cart error:", error);
    return [];
  }
};
