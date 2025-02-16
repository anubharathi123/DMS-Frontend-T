import React, { useState, useEffect } from 'react';
import apiServices from '../../ApiServices/ApiServices'; // Ensure correct import path
import './NotificationDropdown.css';

const NotificationPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 notifications initially

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch organization details to get org_id
        const details_data = await apiServices.details();
        const org_id = details_data?.details?.[7]?.id; // Safely access org_id
        
        if (!org_id) {
          throw new Error('Organization ID not found');
        }

        // Fetch notifications
        const response = await apiServices.OrgNotification(org_id);
        const notificationData = response;
        
        setNotifications(notificationData);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const closeNotification = () => {
    setIsOpen(false);
  };

  // Ensure "Show More" does not affect `isOpen`
  const handleShowMore = (event) => {
    event.stopPropagation(); // Prevent accidental closure
    setVisibleCount((prevCount) => prevCount + 10);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="notification-page">
      <button type="button" className="notification-close" onClick={closeNotification}>
        x
      </button>
      <h3>Notifications</h3>
      {loading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : notifications.length > 0 ? (
        <>
          <ul className="notification-list">
            {notifications.slice(0, visibleCount).map((notification, index) => (
              <li key={notification.id || index} className="notification-item">
                <span className="message">
                  <strong>{notification.action}</strong> on <strong>{notification.entity_type}</strong>
                </span>
                <div className="notification-time">{notification.description}</div>
              </li>
            ))}
          </ul>
          {notifications.length > visibleCount && (
            <button className="show-more" onClick={handleShowMore}>
              Show More
            </button>
          )}
        </>
      ) : (
        <p className="no-notifications">No notifications available</p>
      )}
    </div>
  );
};

export default NotificationPage;
