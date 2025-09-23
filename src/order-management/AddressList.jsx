import React, { useState } from "react";
import "./addressList.css";

export default function AddressList({
  addresses,
  extraAddresses = [],
  selectedAddressId,
  setSelectedAddressId,
  onAdd
}) {
  const [showAll, setShowAll] = useState(false);

  // Helper to render an address card
  const renderAddress = (addr) => (
    <label
      key={addr.id}
      className={`addr-card ${selectedAddressId === addr.id ? "selected" : ""}`}
    >
      <input
        type="radio"
        name="deliveryAddress"
        aria-label={`Select address for ${addr.name}`}
        checked={selectedAddressId === addr.id}
        onChange={() => setSelectedAddressId(addr.id)}
      />
      <div>
        <span className="addr-name">
          {addr.name} • {addr.phone}
        </span>
        <span className="addr-line">
          {addr.line}, {addr.city} - {addr.pincode}
        </span>
      </div>
    </label>
  );

  return (
    <div className="checkout-card">
      <h3>Delivery Address</h3>

      <div className="addresses">
        {addresses.length === 0 && (
          <div className="no-addr">
            No address found.{" "}
            <button type="button" onClick={onAdd} className="inline-add-btn">
              Add one now
            </button>
          </div>
        )}

        {/* Always show first 2 addresses */}
        {addresses.map(renderAddress)}

        {/* Extra addresses - only show when toggled */}
        <div className={`extra-addresses ${showAll ? "open" : ""}`}>
          {showAll && extraAddresses.map(renderAddress)}
        </div>

        {/* Toggle button */}
        {extraAddresses.length > 0 && (
          <button
            type="button"
            className="toggle-extra-btn"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Hide Extra Addresses ▲" : "Show All Addresses ▼"}
          </button>
        )}
      </div>

      <button className="add-btn" onClick={onAdd}>
        Add New Address
      </button>
    </div>
  );
}
