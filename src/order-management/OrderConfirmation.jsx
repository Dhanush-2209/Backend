import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";
import { toast } from "react-hot-toast";
import { useAuth } from "../user-authentication/context/AuthContext";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const orderId = location.state?.orderId || sessionStorage.getItem("lastOrderId");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);
  const API_BASE = "http://localhost:3001";

  // Block back navigation
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const blockBack = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  // Fetch order from user's orders
  useEffect(() => {
    if (!orderId || !user?.id) {
      toast.error("Missing order ID or user.");
      setError(true);
      return;
    }

    fetch(`${API_BASE}/users/${user.id}`)
      .then(res => res.json())
      .then(data => {
        const matchedOrder = data.orders?.find(o => o.id === Number(orderId));
        if (!matchedOrder) throw new Error("Order not found");
        setOrder(matchedOrder);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        toast.error("Failed to load order.");
        setError(true);
      });
  }, [orderId, user?.id]);

  // Clean up session
  useEffect(() => {
    return () => sessionStorage.removeItem("lastOrderId");
  }, []);

  const paymentSummary = () => {
    const method = order?.paymentMethod;
    if (!method) return "Unknown";
    if (method.cardMasked) {
      return `${method.cardType} - ${method.cardMasked} (Exp: ${method.expiry})`;
    }
    if (method.upiId) return `UPI ID: ${method.upiId}`;
    return method.method || "Unknown";
  };

  if (error) {
    return (
      <div className="order-confirmation">
        <div className="confirmation-card fade-in">
          <h2>⚠️ Unable to Load Order</h2>
          <p className="order-id">Order ID: {orderId || "Not available"}</p>
          <p>Please check your connection or try again later.</p>
          <div className="confirmation-actions">
            <button onClick={() => navigate("/")}>Back to Home</button>
            <button onClick={() => navigate("/orders")}>View All Orders</button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation">
        <div className="confirmation-card fade-in">
          <h2>Loading Order Confirmation...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      {/* Confetti burst wrapper with randomized positions */}
      <div className="confetti-wrapper">
        {[...Array(40)].map((_, i) => {
          const x = Math.floor(Math.random() * 300 - 150);
          const r = Math.floor(Math.random() * 360);
          return (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `calc(50% + ${x}px)`,
                transform: `rotate(${r}deg)`
              }}
            />
          );
        })}
      </div>

      <div className="confirmation-card fade-in">
        <h2 className="pulse bounce">🎉 Order Confirmed!</h2>
        <p className="order-id">Order ID: {order.id}</p>

        <div className="confirmation-grid">
          <div className="left-column">
            <div className="section fade-in">
              <strong>Delivery Address:</strong>
              <p>
                {order.address.name}, {order.address.phone}<br />
                {order.address.line}, {order.address.city} - {order.address.pincode}
              </p>
            </div>

            <div className="section fade-in">
              <strong>Delivery Date:</strong>
              <p>{order.deliveryDate}</p>
              <small className="delivery-note">
                Your order will arrive on or before this date. We'll keep you posted!
              </small>
            </div>

            <div className="section fade-in">
              <strong>Payment Method:</strong>
              <p>{paymentSummary()}</p>
            </div>
          </div>

          <div className="right-column">
            <div className="section slide-in">
              <strong>Items:</strong>
              <ul>
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.name} × {item.qty} — ₹{item.price * item.qty}
                  </li>
                ))}
              </ul>
            </div>

            <div className="section total fade-in">
              <strong>Total:</strong> ₹{order.total.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="confirmation-actions fade-in">
          <button onClick={() => navigate("/")}>Back to Home</button>
          <button onClick={() => navigate("/orders", { state: { userId: order.userId } })}>View All Orders</button>
        </div>
      </div>
    </div>
  );
}
