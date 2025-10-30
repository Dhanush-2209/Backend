import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import AddressSection from "./AddressSection";
import CardSection from "./CardSection";
import Notification from "../../components/Notification/Notification";
import "./ProfilePage.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, token, login: setAuthUser, syncProfileStats } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ message: "", type: "info", visible: false });
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);

  const [showAddresses, setShowAddresses] = useState(true);
  const [showCards, setShowCards] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.username !== username) {
      navigate(`/profile/${user.username}`);
    }
  }, [user, username, navigate]);

  useEffect(() => {
    let timeout;
    async function fetchProfile() {
      timeout = setTimeout(() => setLoading(true), 100);
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfileData(data);
        setHasFetchedProfile(true);

        // ✅ Sync header stats into user context (lastLogin removed)
        syncProfileStats({
          orders: data.orders,
          payments: data.payments
        });
      } catch (err) {
        console.error(err);
        setNotif({ message: "Unable to load profile", type: "error", visible: true });
        setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1200);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    }

    if (user && token && !hasFetchedProfile) {
      fetchProfile();
    }

    return () => clearTimeout(timeout);
  }, [user, token, hasFetchedProfile, syncProfileStats]);

  function handleProfileUpdate(updatedUser) {
    setAuthUser(prev => ({
      ...prev,
      ...updatedUser
    }));
    setNotif({ message: "Profile updated successfully", type: "success", visible: true });
    setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1000);
  }

  if (loading || !profileData) {
    return (
      <div className="u-profile-page">
        <div className="u-profile-card u-loading">Loading profile…</div>
      </div>
    );
  }

  const stats = {
    orders: user && user.orders ? user.orders.length : 0,
    wishlist: user && user.wishlistCount ? user.wishlistCount : 0,
    cards: user && user.payments ? user.payments.length : 0
  };

  return (
    <div className="u-profile-page">
      <ProfileHeader
        name={`${user.firstName} ${user.lastName}`}
        email={user.email}
        role={user.role}
        stats={stats} 
      />

      <div className="u-profile-card">
        <h2 className="u-section-title">👤 Personal Info</h2>
        <ProfileForm
          initialData={profileData}
          token={token}
          onUpdate={handleProfileUpdate}
          setNotif={setNotif}
        />
      </div>

      <div className="u-profile-card">
        <div className="u-section-title" onClick={() => setShowAddresses(v => !v)} style={{ cursor: "pointer" }}>
          🏠 Saved Addresses {showAddresses ? "▲" : "▼"}
        </div>
        {showAddresses && (
          <AddressSection
            addresses={profileData.addresses}
            token={token}
            userId={user.id}
            onUpdate={setProfileData}
            setNotif={setNotif}
          />
        )}
      </div>

      <div className="u-profile-card">
        <div className="u-section-title" onClick={() => setShowCards(v => !v)} style={{ cursor: "pointer" }}>
          💳 Saved Cards {showCards ? "▲" : "▼"}
        </div>
        {showCards && (
          <CardSection
            cards={profileData.payments}
            token={token}
            userId={user.id}
            onUpdate={setProfileData}
            setNotif={setNotif}
          />
        )}
      </div>

      <Notification message={notif.message} type={notif.type} visible={notif.visible} />
    </div>
  );
}
