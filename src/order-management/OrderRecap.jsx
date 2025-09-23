import React from "react";
import "./OrderRecap.css";

export default function OrderRecap({
  orderData,
  canPay,
  isProcessing,
  payNowLabel,
  handlePayNow,
  paymentMethod,
  navigate,
  upiVerified,
  upiId,
  selectedCardIndex,
  paymentDetails
}) {
  if (!orderData || !orderData.address || !orderData.items?.length) {
    return (
      <div className="payment-right">
        <div className="payment-card">
          <h3>Order Recap</h3>
          <p className="validation-error">Missing order data. Please return to checkout.</p>
          <button
            onClick={() => navigate("/checkout")}
            className="back-checkout-btn"
          >
            ← Return to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-right">
      <div className="payment-card">
        <h3>Order Recap</h3>

        <div className="delivery-info">
          <p>
            <strong>Address:</strong> {orderData.address.line},{" "}
            {orderData.address.city} - {orderData.address.pincode}
          </p>
          <p>
            <strong>Delivery Date:</strong> {orderData.deliveryDate}
          </p>
          <button
            onClick={() =>
              navigate("/checkout", {
                state: { cartItems: orderData.items, userId: orderData.userId }
              })
            }
          >
            Change
          </button>
        </div>

        <div className="items-list">
          {orderData.items.map((item) => (
            <div key={item.id} className="item-row">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <div className="pricing-breakdown">
          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{orderData.subtotal?.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Shipping</span>
            <span>₹{orderData.shipping?.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Tax</span>
            <span>₹{orderData.tax?.toFixed(2)}</span>
          </div>
          <div className="price-row total">
            <strong>Total</strong>
            <strong>₹{orderData.total?.toFixed(2)}</strong>
          </div>
        </div>

        {/* Verified UPI display */}
        {paymentMethod === "upi" && upiVerified && (
          <p className="verified-upi">
            <strong>UPI ID:</strong> {upiId}
          </p>
        )}

        {/* Selected card preview */}
        {paymentMethod === "card" && selectedCardIndex !== null && (
          <p className="card-preview">
            <strong>Card:</strong>{" "}
            {paymentDetails[selectedCardIndex].cardType} -{" "}
            {paymentDetails[selectedCardIndex].cardMasked} (Exp:{" "}
            {paymentDetails[selectedCardIndex].expiry})
          </p>
        )}

        {!canPay() && (
          <p className="validation-error">
            {paymentMethod === ""
              ? "Select a payment method to continue."
              : paymentMethod === "card"
              ? "Select or add a card to continue."
              : paymentMethod === "upi"
              ? "Verify your UPI ID to continue."
              : ""}
          </p>
        )}

        <div className="payment-actions">
          <button
            onClick={handlePayNow}
            disabled={!canPay() || isProcessing}
            className={isProcessing ? "processing" : ""}
          >
            {isProcessing ? "Processing..." : payNowLabel()}
          </button>
        </div>
      </div>
    </div>
  );
}
