import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./orders.css";
import { useAuth } from "../user-authentication/context/AuthContext";
import { toast } from "react-hot-toast";

const STATUS_STAGES = ["Ordered", "Shipped", "Out for Delivery", "Delivered"];
const PAGE_SIZE = 5;
const API_BASE = "http://localhost:3001";

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const userId = location.state?.userId || user?.id;

    if (!userId) {
      toast.error("You must be logged in to view orders.");
      navigate("/");
      return;
    }

    fetch(`${API_BASE}/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        const userOrders = (data.orders || []).map(order => ({
          ...order,
          countdown: getDeliveryCountdown(order.deliveryDate, order.status)
        }));
        setOrders(userOrders);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders:", err);
        toast.error("Unable to load orders.");
        setLoading(false);
      });
  }, [user?.id, location.state, navigate]);

  useEffect(() => {
    let filtered = [...orders];

    if (activeStatus !== "All") {
      filtered = filtered.filter(order => order.status === activeStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.items.some(item => item.name.toLowerCase().includes(q)) ||
        order.id.toString().includes(q)
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, activeStatus, searchQuery]);

  function getDeliveryCountdown(deliveryDate, status) {
    if (status === "Cancelled") return "Order Cancelled";
    const now = new Date();
    const delivery = new Date(deliveryDate);
    const diffMs = delivery - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (status === "Delivered") return "Delivered";
    if (diffDays > 0) return `Arriving in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    return "Arriving today";
  }

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="orders-wrapper">
      <div className="orders-page">
        {/* Header */}
        <div className="orders-header">
          <h2>Your Orders</h2>
          <button className="back-home-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          {["All", ...STATUS_STAGES, "Cancelled"].map(status => (
            <button
              key={status}
              className={`filter-tab ${activeStatus === status ? "active" : ""}`}
              onClick={() => setActiveStatus(status)}
            >
              {status}
            </button>
          ))}
          <input
            type="text"
            className="search-bar"
            placeholder="Search by product or order ID"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <p className="loading-text">Loading your orders...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <img src="/images/empty-box.png" alt="No orders" />
            <p>You haven’t placed any orders yet.</p>
            <button onClick={() => navigate("/")}>Start Shopping</button>
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="orders-list">
              {paginatedOrders.map(order => (
                <div
                  key={order.id}
                  className={`order-card ${order.status === "Cancelled" ? "cancelled" : ""}`}
                >
                  {/* Summary */}
                  <div className="order-summary">
                    <div className="order-meta">
                      <div>
                        <span className="meta-label">ORDER PLACED</span>
                        <p>{order.orderedDay}, {order.orderedDate}</p>
                      </div>
                      <div>
                        <span className="meta-label">TOTAL</span>
                        <p>₹{order.total}</p>
                      </div>
                      <div>
                        <span className="meta-label">SHIP TO</span>
                        <p>
                          {order.address.name}<br />
                          {order.address.line}, {order.address.city} - {order.address.pincode}<br />
                          Phone: {order.address.phone}
                        </p>
                      </div>
                    </div>

                    <div className="delivery-status">
                      <p className={`delivery-date ${order.status === "Cancelled" ? "cancelled-text" : ""}`}>
                        {order.countdown}
                      </p>
                      <div className="status-timeline">
                        {STATUS_STAGES.map(stage => (
                          <span
                            key={stage}
                            className={`status-step ${
                              order.status === "Cancelled"
                                ? "inactive"
                                : order.status === stage || STATUS_STAGES.indexOf(order.status) > STATUS_STAGES.indexOf(stage)
                                ? "active"
                                : ""
                            }`}
                          >
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Products + Actions */}
                  <div className="order-body">
                    <div className="product-thumbnails">
                      {order.items.map(item => (
                        <div key={item.id} className="product-item">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/default-product.jpg";
                            }}
                          />
                          <p>{item.name} × {item.qty}</p>
                          <p className="item-brand">{item.brand}</p>
                          <p className="item-category">{item.category}</p>
                          <p className="item-sku">SKU: {item.sku}</p>
                          <p className="item-description">{item.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="order-actions">
                      <button
                        onClick={() => navigate("/order-details", {
                          state: { orderId: order.id }
                        })}
                      >
                        View Details
                      </button>

                      {order.status !== "Cancelled" && (
                        <button
                          className="track-btn"
                          onClick={() => navigate(`/track-package/${order.id}`)}
                        >
                          Track Package
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredOrders.length > PAGE_SIZE && (
              <div className="pagination">
                {Array.from({ length: Math.ceil(filteredOrders.length / PAGE_SIZE) }, (_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
