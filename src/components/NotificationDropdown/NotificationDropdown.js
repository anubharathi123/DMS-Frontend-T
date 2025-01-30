import React, { useState } from 'react';
import './NotificationDropdown.css';

const NotificationPage = () => {
  const [isOpen, setIsOpen] = useState(true); // State to track if dropdown is open

  const notifications = [
    { message: 'Clear all declarations before the end of the year', time: '1 hour ago', read: true }
  ];

  const closeNotification = () => {
    setIsOpen(false); // Close the notification dropdown
  };

  if (!isOpen) {
    return null; // Prevent rendering any part of the component when closed
  }

  return (
    <div className="notification-page">
      <button type="button" className="notification-close" onClick={closeNotification}>
        x
      </button>
      <h3>Notifications</h3>
      {notifications.length > 0 ? (
        <ul className="notification-list">
          {notifications.map((notification, index) => (
            <li key={index} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
              <span className="message">{notification.message}</span>
              <div className="notification-time">{notification.time}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-notifications">No notifications available</p>
      )}
    </div>
  );
};

export default NotificationPage;
