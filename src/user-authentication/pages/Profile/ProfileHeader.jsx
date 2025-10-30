import React from "react";
import "./ProfileHeader.css";

export default function ProfileHeader({
  name = "",
  email = "",
  role = "Verified User",
  stats = { orders: 0, wishlist: 0, cards: 0 }
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map(part => part[0])
    .join("")
    .toUpperCase();

  function calculateCompletion({ orders, wishlist, cards }) {
    let score = 0;
    if (orders > 0) score += 30;
    if (wishlist > 0) score += 30;
    if (cards > 0) score += 40;
    return Math.min(score, 100);
  }

  const completion = calculateCompletion(stats);

  return (
    <div className="u-profile-header">
      <div className="u-avatar-wrapper">
        <div className="u-avatar-circle">{initials || "?"}</div>
        <button className="u-avatar-edit" title="Change avatar">✎</button>
      </div>

      <div className="u-profile-info">
        <h1 className="u-profile-name">{name}</h1>
        <p className="u-profile-email">{email}</p>
        <div className="u-profile-meta">
          <span className="u-role-badge">{role}</span>
        </div>
        <p className="u-profile-subtitle">Welcome back to your dashboard</p>
      </div>

      <div className="u-profile-stats">
        <div className="u-stat">
          <label>Orders</label>
          <span>{stats.orders}</span>
        </div>
        <div className="u-stat">
          <label>Wishlist</label>
          <span>{stats.wishlist}</span>
        </div>
        <div className="u-stat">
          <label>Saved Cards</label>
          <span>{stats.cards}</span>
        </div>
        <div className="u-progress">
          <label>Profile Completion</label>
          <div className="u-progress-bar">
            <div className="u-progress-fill" style={{ width: `${completion}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
