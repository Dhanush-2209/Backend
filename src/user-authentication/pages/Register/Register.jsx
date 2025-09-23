import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import Notification from '../../components/Notification/Notification';

const API = 'http://localhost:3001';

export default function Register() {
  const [username, setUsername] = useState('');
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [notif, setNotif] = useState({ message: '', type: 'info', visible: false });
  const navigate = useNavigate();

  function validate() {
    const e = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setErrors({});
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      // check email
      const r1 = await fetch(`${API}/users?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      const e1 = await r1.json();
      if (e1.length > 0) {
        setErrors({ email: 'Email already registered' });
        return;
      }

      // check username
      const r2 = await fetch(`${API}/users?username=${encodeURIComponent(username.trim().toLowerCase())}`);
      const e2 = await r2.json();
      if (e2.length > 0) {
        setErrors({ username: 'Username already taken' });
        return;
      }

      // create user with initialized empty arrays
      const payload = {
        username: username.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        addresses: [],
        paymentMethods: [],
        cart: [],
        wishlist: [],
        orders: []
      };

      const resp = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) throw new Error('Failed to register');

      // show success toast then redirect to login
      setNotif({ message: `Registered successfully as ${payload.username}`, type: 'success', visible: true });
      setTimeout(() => {
        setNotif(v => ({ ...v, visible: false }));
        navigate('/login');
      }, 900);
    } catch (err) {
      console.error(err);
      setNotif({ message: 'Registration failed. Try again.', type: 'error', visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1200);
    }
  }

  return (
    <>
      <div className="auth-page container">
        <div className="register-card">
          <h2 className="title">Create Your Account</h2>
          <p className="subtitle">Join us and start shopping smarter</p>

          <form className="reg-form" onSubmit={onSubmit} noValidate>
            <div className="grid">
              <div>
                <label>Username*</label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Choose a username"
                />
                {errors.username && <div className="field-err">{errors.username}</div>}
              </div>

              <div>
                <label>First Name</label>
                <input
                  value={firstName}
                  onChange={e => setFirst(e.target.value)}
                  placeholder="First name"
                />
              </div>

              <div>
                <label>Last Name</label>
                <input
                  value={lastName}
                  onChange={e => setLast(e.target.value)}
                  placeholder="Last name"
                />
              </div>

              <div>
                <label>Email*</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                />
                {errors.email && <div className="field-err">{errors.email}</div>}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label>Password*</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password (min 6 chars)"
                />
                {errors.password && <div className="field-err">{errors.password}</div>}
              </div>

              <div>
                <label>Phone</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone (optional)"
                />
              </div>
            </div>

            <div className="auth-actions">
              <button className="btn primary" type="submit">Register</button>
            </div>

            <div className="alt-login">
              Already shopping with us? <Link to="/login">Sign in here</Link>
            </div>
          </form>
        </div>
      </div>

      <Notification message={notif.message} type={notif.type} visible={notif.visible} />
    </>
  );
}
