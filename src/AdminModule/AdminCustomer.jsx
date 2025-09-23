import React, { useEffect, useState } from 'react';
import './AdminCustomer.css';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../user-authentication/context/AuthContext'; // ✅ import auth context

function AdminCustomer() {
  const [customers, setCustomers] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  const { user } = useAuth(); // ✅ get logged-in user

  // ✅ build adminProfile dynamically
  const adminProfile = {
    name: user?.username || user?.name || 'Admin',
    email: user?.email || 'admin@example.com'
  };

  useEffect(() => {
    fetch('http://localhost:5000/customers')
      .then(res => res.json())
      .then(data => {
        const customerList =
          Array.isArray(data) ? data :
          Array.isArray(data.customers) ? data.customers :
          Array.isArray(data.data) ? data.data :
          [];

        const mapped = customerList.map(user => ({
          id: user.id ?? 'N/A',
          name: `${user.name?.firstname ?? ''} ${user.name?.lastname ?? ''}`.trim() || 'Unnamed',
          email: user.email ?? 'N/A',
          address: user.address
            ? `${user.address.number ?? ''}, ${user.address.street ?? ''}, ${user.address.city ?? ''}, ${user.address.zipcode ?? ''}`
            : 'Address not available'
        }));

        setCustomers(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customer data:', err);
        setError(true);
        setLoading(false);
      });

    fetch('http://localhost:5000/orders')
      .then(res => res.json())
      .then(data => {
        const orderList =
          Array.isArray(data) ? data :
          Array.isArray(data.orders) ? data.orders :
          Array.isArray(data.data) ? data.data :
          [];

        setTotalOrders(orderList.length);
      })
      .catch(err => {
        console.error('Error fetching order data:', err);
      });
  }, []);

  const filteredAndSortedCustomers = [...customers]
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (sortOrder === 'asc') {
    filteredAndSortedCustomers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'desc') {
    filteredAndSortedCustomers.sort((a, b) => b.name.localeCompare(a.name));
  }

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / customersPerPage);
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredAndSortedCustomers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="admin-customer-wrapper">
      {/* ✅ Sidebar now gets dynamic adminProfile */}
      <Sidebar adminProfile={adminProfile} />
      <div className="customer-main">
        <div className="admin-customer">
          <div className="customer-header">
            <h2>Customer Details</h2>
          </div>

          <div className="customer-controls">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="customer-search"
            />
            <select
              value={sortOrder}
              onChange={e => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="customer-sort"
            >
              <option value="">Filter</option>
              <option value="asc">Filter A–Z</option>
              <option value="desc">Filter Z–A</option>
            </select>
          </div>

          <div className="table-container">
            {loading ? (
              <p className="loading-text">Loading customer data...</p>
            ) : error ? (
              <p className="error-text">Failed to load customer data.</p>
            ) : currentCustomers.length === 0 ? (
              <p className="empty-text">No customers found.</p>
            ) : (
              <>
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.map(c => (
                      <tr key={c.id} className="clickable-row">
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.address}</td>
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

export default AdminCustomer;
