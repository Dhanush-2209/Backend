import './AdminDashboard.css';
import Sidebar from './Sidebar.jsx';
import RevenueChart from './RevenueChart.jsx';
import SalesChart from './SalesChart.jsx';
import { useState, useEffect } from 'react';
import { useAuth } from '../user-authentication/context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
  });

  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    shippingOrders: 0,
    cancelledOrders: 0,
    avgItemsPerOrder: "0.00",
  });

  useEffect(() => {
    if (user) {
      setAdminProfile({
        name: user.username || user.name || 'Admin',
        email: user.email || 'admin@example.com',
      });
    }
  }, [user]);

  useEffect(() => {
    fetch('http://localhost:5001/products')
      .then(res => res.json())
      .then(data => {
        const productList = Array.isArray(data) ? data : data.products || [];

        const totalSales = productList.reduce((sum, p) => sum + (p.sold || 0), 0);
        const totalRevenue = productList.reduce((sum, p) => sum + (p.price || 0) * (p.sold || 0), 0);
        const totalProducts = productList.length;
        const totalCustomers = totalSales * 2;

        setProducts(productList);
        setMetrics({ totalSales, totalRevenue, totalCustomers, totalProducts });
      })
      .catch(err => console.error('Failed to fetch products:', err));

    fetch('http://localhost:5000/orders')
      .then(res => res.json())
      .then(data => {
        const orderList = Array.isArray(data) ? data : data.orders || [];

        const totalOrders = orderList.length;
        const completedOrders = orderList.filter(o => o.status === 'Completed').length;
        const shippingOrders = orderList.filter(o => o.status === 'Shipping').length;
        const cancelledOrders = orderList.filter(o => o.status === 'Cancelled').length;

        setOrders(orderList);
        setOrderStats({ totalOrders, completedOrders, shippingOrders, cancelledOrders });
      })
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  return (
    <div className="admin-dashboard">
      <Sidebar adminProfile={adminProfile} />
      <div className="dashboard-main">
        <div className="dashboard-greeting">
          <h2>Good afternoon, {adminProfile.name} 👋</h2>
          <p>{adminProfile.email}</p>
          <p>Here’s what’s happening with your dashboard today:</p>
        </div>

        {/* Metrics */}
        <div className="metrics-container">
          <h3 className="metrics-title">Total Sales <div>Sales Summary</div></h3>
          <div className="summary-section">
            <div className="summary-card summary-card1">
              <div className="metric-value">{metrics.totalSales.toLocaleString()}</div>
              <div className="metric-label">Total Sales</div>
            </div>
            <div className="summary-card summary-card2">
              <div className="metric-value">₹{metrics.totalRevenue.toLocaleString()}</div>
              <div className="metric-label">Total Revenue</div>
            </div>
            <div className="summary-card summary-card3">
              <div className="metric-value">{metrics.totalCustomers}</div>
              <div className="metric-label">Total Customers</div>
            </div>
            <div className="summary-card summary-card4">
              <div className="metric-value">{metrics.totalProducts}</div>
              <div className="metric-label">Total Products</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-section">
          <div className="chart-box"><RevenueChart /></div>
          <div className="chart-box"><SalesChart /></div>
        </div>

        {/* Order Statistics */}
        <div className="metrics-container">
          <h3 className="metrics-title">Order Statistics <div>Order Summary</div></h3>
          <div className="summary-section">
            <div className="summary-card summary-card1">
              <div className="metric-value">{orderStats.totalOrders}</div>
              <div className="metric-label">Total Orders</div>
            </div>
            <div className="summary-card summary-card2">
              <div className="metric-value">{orderStats.completedOrders}</div>
              <div className="metric-label">Completed</div>
            </div>
            <div className="summary-card summary-card3">
              <div className="metric-value">{orderStats.shippingOrders}</div>
              <div className="metric-label">Shipping</div>
            </div>
            <div className="summary-card summary-card4">
              <div className="metric-value">{orderStats.cancelledOrders}</div>
              <div className="metric-label">Cancelled</div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="product-stock-section">
          <div className="table-section">
            <h3>Top Selling Products</h3>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Sold</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .sort((a, b) => (b.sold || 0) - (a.sold || 0))
                  .slice(0, 7)
                  .map(product => (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>₹{product.price}</td>
                      <td>{product.sold}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`status-badge ${product.stock > 10 ? 'in-stock' : 'out-stock'}`}>
                          {product.stock > 10 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
