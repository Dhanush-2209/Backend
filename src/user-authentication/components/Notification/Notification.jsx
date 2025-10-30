import React, { useEffect, useState } from 'react';
import './Notification.css';

/**
 * Props:
 * - message: string
 * - type: 'success'|'error'|'info'
 * - visible: boolean
 */
export default function Notification({ message = '', type = 'info', visible = false }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible && message) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000); // auto-dismiss after 2s
      return () => clearTimeout(timer);
    }
  }, [visible, message]);

  if (!show || !message) return null;

  return (
    <div className="u-notif-wrap u-show" aria-live="polite">
      <div className={`u-notif u-${type}`}>
        <div className="u-notif-body">{message}</div>
      </div>
    </div>
  );
}
