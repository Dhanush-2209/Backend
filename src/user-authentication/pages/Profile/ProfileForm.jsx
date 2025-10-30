import React, { useState, useEffect } from "react";
import "./ProfileForm.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function ProfileForm({ initialData, token, onUpdate, setNotif }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        password: ""
      });
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/profile/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Update failed");
      onUpdate({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone
      });

      setNotif({ message: "Profile updated successfully", type: "success", visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1000);
    } catch (err) {
      console.error(err);
      setNotif({ message: "Failed to update profile", type: "error", visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1200);
    }
  }

  async function handleRevert() {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to reload profile");
      const data = await res.json();
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        password: ""
      });
      setNotif({ message: "Reverted to saved profile", type: "info", visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1000);
    } catch (err) {
      console.error(err);
      setNotif({ message: "Failed to revert", type: "error", visible: true });
    }
  }

  return (
    <form className="u-profile-form" onSubmit={handleSubmit}>
      <div className="u-row">
        <div className="u-field">
          <label>First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="u-field">
          <label>Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
      </div>

      <div className="u-row">
        <div className="u-field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="u-field">
          <label>Phone</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
        </div>
      </div>

      <div className="u-row">
        <div className="u-field u-field-full">
          <label>New Password (optional)</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </div>
      </div>

      <div className="u-actions">
        <button type="submit" className="u-btn u-primary">Save Profile</button>
        <button type="button" className="u-btn u-secondary" onClick={handleRevert}>Revert</button>
      </div>
    </form>
  );
}
