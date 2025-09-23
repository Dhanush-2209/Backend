import './Navbar.css';
import profileImage from '../assets/PI.jpg';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-right">
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Navbar;
