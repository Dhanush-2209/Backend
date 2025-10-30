import React, { useEffect, useRef, useState } from "react";
import "./AddressSection.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AddressSection({ addresses, token, userId, onUpdate, setNotif }) {
  const [localAddresses, setLocalAddresses] = useState(addresses || []);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const firstInputRef = useRef(null);

  const [formAddr, setFormAddr] = useState({
    name: "", phone: "", line: "", city: "", pincode: ""
  });

  useEffect(() => {
    if (showModal && firstInputRef.current) {
      firstInputRef.current.focus();
    }

    const handleEsc = (e) => e.key === "Escape" && setShowModal(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  function validate(addr) {
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!nameRegex.test(addr.name)) return "Name should contain only alphabets and spaces.";
    if (!phoneRegex.test(addr.phone)) return "Phone number should be exactly 10 digits.";
    if (!addr.line.trim()) return "Address line is required.";
    if (!addr.city.trim()) return "City is required.";
    if (!pincodeRegex.test(addr.pincode)) return "Pincode should be exactly 6 digits.";
    return null;
  }

  async function handleSaveAddress(e) {
    e.preventDefault();
    const error = validate(formAddr);
    if (error) {
      setNotif({ message: error, type: "error", visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1200);
      return;
    }

    try {
      setSubmitting(true);
      const method = editingIndex !== null ? "PUT" : "POST";
      const endpoint = editingIndex !== null
        ? `${API_BASE}/users/${userId}/addresses/${localAddresses[editingIndex].id}`
        : `${API_BASE}/users/${userId}/addresses`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formAddr)
      });

      if (!res.ok) throw new Error("Failed to save address");

      const updated = await fetch(`${API_BASE}/users/${userId}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());

      setLocalAddresses(updated);
      onUpdate(prev => ({ ...prev, addresses: updated }));
      setFormAddr({ name: "", phone: "", line: "", city: "", pincode: "" });
      setShowModal(false);
      setEditingIndex(null);
      setNotif({ message: "Address saved", type: "success", visible: true });
    } catch (err) {
      console.error(err);
      setNotif({ message: "Failed to save address", type: "error", visible: true });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(index) {
    const addr = localAddresses[index];
    if (!addr?.id) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete address: ${addr.name}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/users/${userId}/addresses/${addr.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete address");

      const updated = localAddresses.filter((_, i) => i !== index);
      setLocalAddresses(updated);
      onUpdate(prev => ({ ...prev, addresses: updated }));
      setNotif({ message: "Address deleted", type: "info", visible: true });
    } catch (err) {
      console.error(err);
      setNotif({ message: "Failed to delete address", type: "error", visible: true });
    }
  }

  function openAddModal() {
    setFormAddr({ name: "", phone: "", line: "", city: "", pincode: "" });
    setEditingIndex(null);
    setShowModal(true);
  }

  function openEditModal(index) {
    setFormAddr(localAddresses[index]);
    setEditingIndex(index);
    setShowModal(true);
  }

  const visibleAddresses = showAll ? localAddresses : localAddresses.slice(0, 3);

  return (
    <div className="u-address-section">
      <ul className="u-list">
        {visibleAddresses.map((a, i) => (
          <li key={i}>
            <strong>{a.name}</strong><br />
            {a.line}, {a.city} - {a.pincode}<br />
            Phone: {a.phone}
            <div className="u-actions">
              <button onClick={() => openEditModal(i)}>Edit</button>
              <button onClick={() => handleDelete(i)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {localAddresses.length > 3 && (
        <button className="u-btn u-tertiary" onClick={() => setShowAll(v => !v)}>
          {showAll ? "Show Less ▲" : "Show More ▼"}
        </button>
      )}

      <button className="u-btn u-secondary" onClick={openAddModal}>
        ➕ Add New Address
      </button>

      {showModal && (
        <div className="u-modal-overlay" role="dialog" aria-modal="true">
          <form className="u-modal-card" onSubmit={handleSaveAddress}>
            <h4>{editingIndex !== null ? "Edit Address" : "Add Address"}</h4>

            <input
              ref={firstInputRef}
              required
              placeholder="Name"
              value={formAddr.name}
              onChange={e => setFormAddr({ ...formAddr, name: e.target.value })}
              pattern="^[A-Za-z\s]+$"
              title="Name should contain only alphabets and spaces"
            />

            <input
              required
              placeholder="Phone"
              value={formAddr.phone}
              onChange={e => setFormAddr({ ...formAddr, phone: e.target.value })}
              pattern="^[0-9]{10}$"
              title="Phone number should be exactly 10 digits"
            />

            <input
              required
              placeholder="Address line"
              value={formAddr.line}
              onChange={e => setFormAddr({ ...formAddr, line: e.target.value })}
            />

            <input
              required
              placeholder="City"
              value={formAddr.city}
              onChange={e => setFormAddr({ ...formAddr, city: e.target.value })}
              pattern="^[A-Za-z\s]+$"
              title="City should contain only alphabets and spaces"
            />

            <input
              required
              placeholder="Pincode"
              value={formAddr.pincode}
              onChange={e => setFormAddr({ ...formAddr, pincode: e.target.value })}
              pattern="^[0-9]{6}$"
              title="Pincode should be exactly 6 digits"
            />

            <div className="u-modal-actions">
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
