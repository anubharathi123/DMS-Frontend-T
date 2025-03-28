import React, { useState, useEffect } from 'react';
import apiServices from '../../ApiServices/ApiServices'; // Ensure correct import path
import './NotificationDropdown.css';

const NotificationPage = ({ newNotification, onNotificationsUpdate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 notifications initially
  const [orgId, setOrgId] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);


  
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const details_data = await apiServices.details();
        let org_id = details_data?.details?.[7]?.id || details_data?.details?.[1]?.id;
        if (!org_id) throw new Error("Organization ID not found");

        setOrgId(org_id);

        // Fetch notifications using the obtained org_id
        const response = await apiServices.OrgNotification(org_id);
        console.log(response);
        const sortedNotifications = response.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(not => ({
            not_message:not.message,
            not_title:not.title,
        }));

        setNotifications(sortedNotifications);
        onNotificationsUpdate(sortedNotifications); // Pass to parent
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    if (!orgId) {
      fetchNotifications();
    }
  }, [orgId, onNotificationsUpdate]); // Re-run when orgId updates

  useEffect(() => {
    const fetchOrgAndNotifications = async () => {
      try {
        const details_data = await apiServices.details();
        let org_id = details_data?.details?.[7]?.id || details_data?.details?.[1]?.id;
        
        if (!org_id) {
          throw new Error('Organization ID not found');
        }

        setOrgId(org_id);
        
        // Fetch notifications using the obtained org_id
        const response = await apiServices.OrgNotification(org_id);
        console.log(response);
        const sortedNotifications = response.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(not => ({
            not_message:not.notification.message,
            not_title:not.notification.title,
        }));
        
        setNotifications(response.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),sortedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    if (!orgId) { // Prevent multiple API calls
      fetchOrgAndNotifications();
    }
  }, [orgId]); // Depend only on orgId

  useEffect(() => {
    if (newNotification) {
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      setIsOpen(true); // Ensure the dropdown opens when a new notification is received
    }
  }, [newNotification]);

  const closeNotification = () => {
    setIsOpen(false);
  };

  const handleShowMore = (event) => {
    event.stopPropagation();
    setVisibleCount((prevCount) => prevCount + 10);
  };

  if (!isOpen) {
    return null;
  }



  const handleNotificationClick = async (event, type, id) => {
    event.stopPropagation(); // Prevents dropdown from closing
    try {
      if (type === "item") {
        setClickedIndex(id); // Set the clicked notification's ID
        
        const response = await apiServices.notificationMarkasRead(id);
        console.log("Mark as Read:", response);

        // Update the notification's status locally
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

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
        <li
          key={notification.id || index}
          className={`notification-item ${clickedIndex === notification.id ? "active" : ""}`}
          onClick={(event) => handleNotificationClick(event, "item", notification.id)}>
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
