import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../../user-authentication/context/CartContext";
import { useWishlist } from "../../user-authentication/context/WishlistContext";
import { useAuth } from "../../user-authentication/context/AuthContext";
import Notification from "../../user-authentication/components/Notification/Notification";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [notif, setNotif] = useState({ message: "", type: "info", visible: false });

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user, login } = useAuth();

  const inCart = user?.cart?.some((item) => item.id === product.id);
  const inWishlist = user?.wishlist?.some((item) => item.id === product.id);

  const showNotif = (message, type = "success") => {
    setNotif({ message, type, visible: true });
    setTimeout(() => setNotif((v) => ({ ...v, visible: false })), 1500);
  };

  const handleAddToCart = async () => {
    if (!user) {
      showNotif("Please login to add items", "error");
      return;
    }
    if (inCart) {
      showNotif("Already in cart", "info");
      return;
    }

    const updatedCart = [...(user.cart || []), { ...product, quantity: 1 }];
    addToCart(product);

    await fetch(`/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: updatedCart }),
    });

    login({ ...user, cart: updatedCart });
    showNotif("Added to cart ✅", "success");
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      showNotif("Please login to add items", "error");
      return;
    }
    if (inWishlist) {
      showNotif("Already in wishlist", "info");
      return;
    }

    const updatedWishlist = [...(user.wishlist || []), product];
    addToWishlist(product);

    await fetch(`/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishlist: updatedWishlist }),
    });

    login({ ...user, wishlist: updatedWishlist });
    showNotif("Added to wishlist ❤️", "success");
  };

  return (
    <>
      <div
        className="relative bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col justify-between h-full group 
                   transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="image-container relative w-full h-48 flex items-center justify-center mb-4 overflow-hidden rounded-t-lg">
          <img
            src={
              isHovered && product.images?.[0]
                ? product.images[0]
                : product.thumbnail
            }
            alt={product.title}
            className="max-h-full max-w-full object-contain 
                       transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center items-center space-x-3
                          transform translate-y-full group-hover:translate-y-0 
                          transition-transform duration-500 ease-in-out">
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`bg-white text-secondary p-3 rounded-full shadow-lg transform
                         hover:scale-110 transition-all duration-200 ${
                           inCart ? "opacity-50 cursor-not-allowed" : "hover:opacity-50"
                         }`}
              title={inCart ? "Already in Cart" : "Add to Cart"}
            >
              <ShoppingCart size={18} />
            </button>
            <button
              onClick={handleAddToWishlist}
              disabled={inWishlist}
              className={`bg-white text-secondary p-3 rounded-full shadow-lg transform
                         hover:scale-110 transition-all duration-200 ${
                           inWishlist ? "opacity-50 cursor-not-allowed" : "hover:opacity-50"
                         }`}
              title={inWishlist ? "Already in Wishlist" : "Add to Wishlist"}
            >
              <Heart size={18} />
            </button>
          </div>
        </div>

        <div className="text-left p-4 pt-0 flex-grow flex flex-col">
          <div className="flex justify-between items-center w-full mb-1">
            <p className="text-sm text-gray-500">{product.category}</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.445a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.445a1 1 0 00-1.175 0l-3.366 2.445c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.051 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
              ))}
            </div>
          </div>

          <h3 className="text-md font-semibold text-secondary line-clamp-2 my-1 h-12">
            {product.title}
          </h3>

          <div className="flex justify-between items-end mt-auto">
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                ₹{product.price}
              </span>
            </div>

            {product.stock > 0 ? (
              product.stock <= 10 ? (
                <span className="text-sm text-yellow-500">
                  only {product.stock} left
                </span>
              ) : (
                <span className="text-sm text-gray-500">
                  {product.stock} {product.unit || "in stock"}
                </span>
              )
            ) : (
              <span className="text-sm font-bold text-red-500">Out Of Stock</span>
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      <Notification message={notif.message} type={notif.type} visible={notif.visible} />
    </>
  );
};

export default ProductCard;
