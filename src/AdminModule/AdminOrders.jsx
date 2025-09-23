import React, { useEffect, useState } from 'react';
import './AdminOrders.css';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../user-authentication/context/AuthContext'; // ✅ import auth context

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const ordersPerPage = 5;

  const { user } = useAuth(); // ✅ get logged-in user

  // ✅ build adminProfile dynamically
  const adminProfile = {
    name: user?.username || user?.name || 'Admin',
    email: user?.email || 'admin@example.com'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, customersRes] = await Promise.all([
          fetch('http://localhost:5000/orders'),
          fetch('http://localhost:5000/customers')
        ]);

        const ordersData = await ordersRes.json();
        const customersData = await customersRes.json();

        const customersMap = new Map(
          customersData.map(c => {
            const id = c.id?.toString();
            const name = `${c.name?.firstname ?? ''} ${c.name?.lastname ?? ''}`.trim() || 'Unnamed';
            return [id, name];
          })
        );

        const rawOrders = Array.isArray(ordersData)
          ? ordersData
          : Array.isArray(ordersData.orders)
          ? ordersData.orders
          : Array.isArray(ordersData.data?.orders)
          ? ordersData.data.orders
          : [];

        const mapped = rawOrders.map(o => {
          const customerId = o.customersId?.toString();
          const customerName = customersMap.get(customerId) ?? 'Unknown';
          const itemCount = Array.isArray(o.products)
            ? o.products.reduce((sum, p) => sum + (p.quantity || 0), 0)
            : 0;
          const formattedDate = o.orderDate
            ? new Date(o.orderDate).toLocaleDateString()
            : new Date().toLocaleDateString();

          return {
            id: o.id ?? o._id ?? `ORD-${Math.random().toString(36).slice(2, 8)}`,
            orderId: o.orderId ?? o.id ?? o._id,
            customer: customerName,
            items: itemCount,
            status: o.status ?? 'Confirmed',
            date: formattedDate
          };
        });

        setOrders(mapped);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch orders or customers:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    fetch(`http://localhost:5000/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(() => {
        setOrders(prev =>
          prev.map(o => (o.id === id ? { ...o, status: newStatus } : o))
        );
      })
      .catch(err => console.error('Failed to update order status:', err));
  };

  const handleCancel = id => {
    fetch(`http://localhost:5000/orders/${id}`, { method: 'DELETE' })
      .then(() => {
        setOrders(prev => prev.filter(o => o.id !== id));
      })
      .catch(err => console.error('Failed to cancel order:', err));
  };

  const filteredOrders = statusFilter
    ? orders.filter(o => o.status === statusFilter)
    : orders;

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfFirst = (currentPage - 1) * ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfFirst + ordersPerPage);

  return (
    <div className="admin-orders-wrapper">
      {/* ✅ Sidebar now gets dynamic adminProfile */}
      <Sidebar adminProfile={adminProfile} />
      <div className="orders-main">
        <div className="admin-orders">
          <div className="orders-header">
            <h2>Order Management</h2>
          </div>

          <div className="table-container">
            <div className="filter-controls">
              <label htmlFor="statusFilter">Filter by Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipping">Shipping</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {loading ? (
              <p className="loading-text">Loading orders...</p>
            ) : error ? (
              <p className="error-text">Failed to load orders.</p>
            ) : currentOrders.length === 0 ? (
              <p className="empty-text">No orders found.</p>
            ) : (
              <>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Sno</th>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((o, i) => (
                      <tr key={o.id}>
                        <td>{indexOfFirst + i + 1}</td>
                        <td>{o.orderId}</td>
                        <td>{o.customer}</td>
                        <td>{o.items}</td>
                        <td>
                          <select
                            value={o.status}
                            onChange={e => handleStatusChange(o.id, e.target.value)}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipping">Shipping</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>{o.date}</td>
                        <td>
                          <button className="delete-btn" onClick={() => handleCancel(o.id)}>
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <button
                    className="page-btn arrow"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ⟨
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="page-btn arrow"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    ⟩
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
