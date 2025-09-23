import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./user-authentication/context/AuthContext";
import { CartProvider } from "./user-authentication/context/CartContext";
import { WishlistProvider } from "./user-authentication/context/WishlistContext";
import { ProductProvider } from "./user-authentication/context/ProductContext";

import MainLayout from "./layouts/MainLayout";

// product-management
import ShopAllPage from "./product-management/components/ShopAll";
import HomePage from "./product-management/components/HomePage";

// user-authentication
import Login from "./user-authentication/pages/Login/Login";
import Register from "./user-authentication/pages/Register/Register";
import User from "./user-authentication/pages/User/User";
import Profile from "./user-authentication/pages/Profile/Profile";
import Cart from "./user-authentication/pages/Cart/Cart";
import Wishlist from "./user-authentication/pages/Wishlist/Wishlist";
import ProductPage from "./user-authentication/pages/Product/Product";

// admin-module
import AdminDashboard from "./AdminModule/AdminDashboard.jsx";
import AdminCustomer from "./AdminModule/AdminCustomer.jsx";
import AdminProducts from "./AdminModule/Adminproducts.jsx";
import AdminOrders from "./AdminModule/AdminOrders.jsx";
import AdminUsers from "./AdminModule/AdminUsers.jsx";

// order-management
import Checkout from "./order-management/checkout";
import Payment from "./order-management/payment";
import OrderConfirmation from "./order-management/OrderConfirmation";
import Orders from "./order-management/orders";
import TrackPackage from "./order-management/TrackPackage";
import OrderDetails from "./order-management/OrderDetails";

// 🔒 protected route
import ProtectedRoute from "./user-authentication/components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Toaster position="bottom-right" />
              <Routes>
                {/* Shared layout routes */}
                <Route element={<MainLayout />}>
                  {/* product-management */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopAllPage />} />

                  {/* user-authentication */}
                  <Route path="/products" element={<ProductPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/user/:username" element={<User />} />

                  {/* protected user routes */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/:username"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* protected order-management routes with layout */}
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/track-package/:orderId"
                    element={
                      <ProtectedRoute>
                        <TrackPackage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-details"
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment"
                    element={
                      <ProtectedRoute>
                        <Payment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-confirmation"
                    element={
                      <ProtectedRoute>
                        <OrderConfirmation />
                      </ProtectedRoute>
                    }
                  />

                  {/* fallback */}
                  <Route path="*" element={<HomePage />} />
                </Route>

                {/* admin-module (no layout) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/customers"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminCustomer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin-home" element={<Navigate to="/admin" replace />} />
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
