import React, { useState, useEffect } from 'react';
import apiServices from '../../ApiServices/ApiServices';
import Loader from "react-js-loader";
import './NotificationDropdown.css';

const NotificationPage = ({ newNotification, onNotificationsUpdate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [orgId, setOrgId] = useState("");

  const fetchOrgAndNotifications = async () => {
    try {
      const details_data = await apiServices.details();
      let org_id = details_data?.details?.[7]?.id || details_data?.details?.[1]?.id;
      
      if (!org_id) {
        throw new Error('Organization ID not found');
      }

      setOrgId(org_id);
      
      const response = await apiServices.OrgNotification();
      const sortedNotifications = response.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map((not) => ({
          not_message: not.notification.message,
          not_title: not.notification.title,
          id: not.id,
          is_read: not.is_read,
        }));
      
      setNotifications(sortedNotifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  useEffect(() => {
    if (!orgId) {
      fetchOrgAndNotifications();
    }
  }, [orgId]);

  useEffect(() => {
    if (newNotification) {
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      setIsOpen(true);
    }
  }, [newNotification]);

  const closeNotification = () => {
    setIsOpen(false);
  };

  const handleShowMore = (event) => {
    event.stopPropagation();
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleNotificationClick = async (event, type, id) => {
    event.stopPropagation();
    try {
      if (type === "item") {
        await apiServices.notificationMarkasRead(id);
        fetchOrgAndNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="notification-page">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button 
          type="button" 
          className="notification-close" 
          onClick={closeNotification}
          aria-label="Close notifications"
        >
          ×
        </button>
      </div>
      
      {loading ? (
        <div className="notification-loading">
          <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'} size={60} />
          <p style={{ marginTop: "10px", color: "#555" }}>Loading notifications...</p>
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : notifications.length > 0 ? (
        <>
          <ul className="notification-list">
            {notifications.map((notification, index) => (
              <li
                key={notification.id || index}
                className={`notification-item ${notification.is_read ? "read" : ""}`}
                onClick={(event) => handleNotificationClick(event, "item", notification.id)}
              >
                {!notification.is_read && (
                  <div className="unread-indicator"></div>
                )}
                <span className="message">
                  <strong>{notification.not_message}</strong>
                </span>
                <div className="notification-time">{notification.not_title}</div>
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