import React, { useEffect, useRef, useState } from "react";
import "./CardSection.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function CardSection({ cards, token, userId, onUpdate, setNotif }) {
  const [localCards, setLocalCards] = useState(cards || []);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  const [formCard, setFormCard] = useState({
    cardType: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  useEffect(() => {
    if (showModal && firstInputRef.current) {
      firstInputRef.current.focus();
    }

    const handleEsc = (e) => e.key === "Escape" && setShowModal(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  function validate(card) {
    const nameRegex = /^[A-Za-z\s]+$/;
    const numberRegex = /^\d{16}$/;
    const expiryRegex = /^\d{2}\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!card.cardType) return "Card type is required.";
    if (!nameRegex.test(card.cardName)) return "Cardholder name is invalid.";
    if (!numberRegex.test(card.cardNumber)) return "Card number must be 16 digits.";
    if (!expiryRegex.test(card.expiry)) return "Expiry must be in MM/YY format.";
    if (!cvvRegex.test(card.cvv)) return "CVV must be 3 digits.";
    return null;
  }

  async function handleSaveCard(e) {
    e.preventDefault();
    const error = validate(formCard);
    if (error) {
      setNotif({ message: error, type: "error", visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1200);
      return;
    }

    const last4 = formCard.cardNumber.slice(-4);
    const isDuplicate = localCards.some(c => c.cardLast4 === last4);
    if (isDuplicate && editingIndex === null) {
      setNotif({ message: "This card is already saved", type: "info", visible: true });
      return;
    }

    const payload = {
      cardType: formCard.cardType,
      cardName: formCard.cardName,
      cardNumber: formCard.cardNumber,
      expiry: formCard.expiry,
      cardMasked: "**** **** **** " + last4,
      cardLast4: last4
    };

    try {
      setSubmitting(true);
      const method = editingIndex !== null ? "PUT" : "POST";
      const endpoint = editingIndex !== null
        ? `${API_BASE}/users/${userId}/cards/${localCards[editingIndex].id}`
        : `${API_BASE}/users/${userId}/cards`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save card");

      const updated = await fetch(`${API_BASE}/users/${userId}/cards`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());

      setLocalCards(updated);
      onUpdate(prev => ({ ...prev, payments: updated }));
      setFormCard({ cardType: "", cardName: "", cardNumber: "", expiry: "", cvv: "" });
      setShowModal(false);
      setEditingIndex(null);
      setNotif({ message: "Card saved", type: "success", visible: true });
    } catch (err) {
      console.error(err);
      setNotif({ message: "Failed to save card", type: "error", visible: true });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(index) {
    const card = localCards[index];
    if (!card?.id) return;

    const confirmDelete = window.confirm(`Delete card ending in ${card.cardLast4}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/users/${userId}/cards/${card.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete card");

      const updated = localCards.filter((_, i) => i !== index);
      setLocalCards(updated);
      onUpdate(prev => ({ ...prev, payments: updated }));
      setNotif({ message: "Card deleted", type: "info", visible: true });
    } catch (err) {
      console.error(err);
      setNotif({ message: "Failed to delete card", type: "error", visible: true });
    }
  }

  function openAddModal() {
    setFormCard({ cardType: "", cardName: "", cardNumber: "", expiry: "", cvv: "" });
    setEditingIndex(null);
    setShowModal(true);
  }

  function openEditModal(index) {
    const card = localCards[index];
    setFormCard({
      cardType: card.cardType,
      cardName: card.cardName,
      cardNumber: "", // don't prefill sensitive fields
      expiry: card.expiry,
      cvv: ""
    });
    setEditingIndex(index);
    setShowModal(true);
  }

  return (
    <div className="u-card-section">
      <ul className="u-list">
        {localCards.map((c, i) => (
          <li key={i}>
            <strong>{c.cardType}</strong> - {c.cardMasked} (Exp: {c.expiry})
            <div className="u-actions">
              <button onClick={() => openEditModal(i)}>Edit</button>
              <button onClick={() => handleDelete(i)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <button className="u-btn u-secondary" onClick={openAddModal}>
        ➕ Add New Card
      </button>

      {showModal && (
        <div className="u-modal-overlay" role="dialog" aria-modal="true">
          <form className="u-modal-card" onSubmit={handleSaveCard}>
            <h4>{editingIndex !== null ? "Edit Card" : "Add Card"}</h4>

            <div className="u-field">
              <label>Card Type</label>
              <select value={formCard.cardType} onChange={e => setFormCard({ ...formCard, cardType: e.target.value })} required>
                <option value="">Select</option>
                <option value="Visa">Visa</option>
                <option value="MasterCard">MasterCard</option>
                <option value="Amex">Amex</option>
                <option value="Rupay">Rupay</option>
              </select>
            </div>

            <div className="u-field">
              <label>Cardholder Name</label>
              <input
                ref={firstInputRef}
                value={formCard.cardName}
                onChange={e => setFormCard({ ...formCard, cardName: e.target.value })}
                required
              />
            </div>

            <div className="u-field">
              <label>Card Number</label>
              <input
                value={formCard.cardNumber}
                onChange={e => setFormCard({ ...formCard, cardNumber: e.target.value })}
                required
              />
            </div>

            <div className="u-field">
              <label>MM/YY</label>
              <input
                value={formCard.expiry}
                onChange={e => setFormCard({ ...formCard, expiry: e.target.value })}
                required
              />
            </div>

            <div className="u-field">
              <label>CVV</label>
              <input
                value={formCard.cvv}
                onChange={e => setFormCard({ ...formCard, cvv: e.target.value })}
                required
              />
            </div>

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
