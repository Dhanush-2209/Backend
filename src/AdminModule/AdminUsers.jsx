import React, { useEffect, useState } from 'react';
import './AdminUsers.css';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../user-authentication/context/AuthContext'; // ✅ import auth context

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ id: '', firstName: '', lastName: '', email: '', address: '' });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const { user } = useAuth(); // ✅ get logged-in user

  // ✅ build adminProfile dynamically
  const adminProfile = {
    name: user?.username || user?.name || 'Admin',
    email: user?.email || 'admin@example.com'
  };

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map(u => ({
            id: u.id?.toString() ?? '',
            firstName: u.firstName ?? '',
            lastName: u.lastName ?? '',
            name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
            email: u.email ?? '',
            address: typeof u.address === 'object'
              ? `${u.address.address}, ${u.address.city}, ${u.address.postalCode}`
              : u.address ?? ''
          }));
          setUsers(mapped);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  const openModal = () => {
    setNewUser({ id: '', firstName: '', lastName: '', email: '', address: '' });
    setShowModal(true);
  };

  const handleUserIdChange = e => {
    const id = e.target.value.trim();
    const match = users.find(u => u.id === id);
    if (match) {
      setNewUser({
        id: match.id,
        firstName: match.firstName,
        lastName: match.lastName,
        email: match.email,
        address: match.address
      });
    } else {
      setNewUser({ id, firstName: '', lastName: '', email: '', address: '' });
    }
  };

  const handleSubmitUser = () => {
    const { id, firstName, lastName, email, address } = newUser;
    if (!firstName.trim() || !email.trim()) {
      alert("First name and email are required.");
      return;
    }

    const payload = { firstName, lastName, email, address };
    const exists = users.some(u => u.id === id);

    if (exists) {
      fetch(`http://localhost:5000/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(() => {
          setUsers(prev => prev.map(u =>
            u.id === id
              ? { ...u, ...payload, name: `${payload.firstName} ${payload.lastName}` }
              : u
          ));
          setShowModal(false);
        })
        .catch(err => console.error('Failed to update user:', err));
    } else {
      fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload })
      })
        .then(res => res.json())
        .then(newEntry => {
          const fullName = `${newEntry.firstName ?? ''} ${newEntry.lastName ?? ''}`.trim();
          setUsers(prev => [...prev, { ...newEntry, id: newEntry.id.toString(), name: fullName }]);
          setShowModal(false);
        })
        .catch(err => console.error('Failed to add user:', err));
    }

    setNewUser({ id: '', firstName: '', lastName: '', email: '', address: '' });
  };

  const handleDeleteUser = () => {
    const { id } = newUser;
    fetch(`http://localhost:5000/users/${id}`, { method: 'DELETE' })
      .then(() => {
        setUsers(prev => prev.filter(u => u.id !== id));
        setShowModal(false);
        setNewUser({ id: '', firstName: '', lastName: '', email: '', address: '' });
      })
      .catch(err => console.error('Failed to delete user:', err));
  };

  const handleRemoveUser = id => {
    fetch(`http://localhost:5000/users/${id}`, { method: 'DELETE' })
      .then(() => {
        setUsers(prev => prev.filter(u => u.id !== id));
      })
      .catch(err => console.error('Failed to remove user:', err));
  };

  const filteredUsers = [...users].filter(u =>
    (u.firstName ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOrder === 'asc') {
    filteredUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (sortOrder === 'desc') {
    filteredUsers.sort((a, b) => b.firstName.localeCompare(a.firstName));
  }

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  return (
  <div className="admin-user-wrapper">
    {/* ✅ Sidebar now gets dynamic adminProfile */}
    <Sidebar adminProfile={adminProfile} />
    <div className="user-main">
      <div className="admin-user">
        <div className="user-header">
          <h2>User Management</h2>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by first name..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            value={sortOrder}
            onChange={e => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            className="user-sort"
          >
            <option value="">No Sort</option>
            <option value="asc">Sort A–Z</option>
            <option value="desc">Sort Z–A</option>
          </select>
          <button className="user-add-btn" onClick={openModal}>
            Add / Update User
          </button>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(u => (
              <tr
                key={u.id}
                onClick={() => {
                  setNewUser({
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    address: u.address,
                  });
                  setShowModal(true);
                }}
              >
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveUser(u.id);
                    }}
                  >
                    Remove
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

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>User Details</h3>
              <form className="user-form" onSubmit={e => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="User ID"
                  value={newUser.id}
                  onChange={handleUserIdChange}
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={newUser.firstName}
                  onChange={e =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newUser.lastName}
                  onChange={e =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={e =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={newUser.address}
                  onChange={e =>
                    setNewUser({ ...newUser, address: e.target.value })
                  }
                />

                <div className="modal-actions">
                  <button type="submit" onClick={handleSubmitUser}>
                    Save
                  </button>
                  <button type="button" onClick={handleDeleteUser}>
                    Delete
                  </button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}


export default AdminUsers;
