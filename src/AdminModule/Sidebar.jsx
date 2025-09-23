import './Sidebar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../user-authentication/context/AuthContext';

function Sidebar({ adminProfile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, setRedirectPath } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Customers', path: '/admin/customers' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Orders', path: '/admin/orders' },
    { label: 'Users', path: '/admin/users' }
  ];

  const handleLogout = () => {
    logout();                     // clear user from context + localStorage
    setRedirectPath(null);        // clear any leftover redirect
    navigate('/login', { replace: true }); // replace history so back button won't reopen admin
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2><span className="sidebar-name">{adminProfile.name}</span></h2>
        <span className="sidebar-email">{adminProfile.email}</span>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li
            key={item.label}
            className={location.pathname === item.path ? 'active' : ''}
            onClick={() => navigate(item.path, { replace: true })}
          >
            {item.label}
          </li>
        ))}
      </ul>

      <div className="sidebar-logout">
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
