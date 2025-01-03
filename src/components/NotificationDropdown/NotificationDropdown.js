import React from 'react';
import './NotificationDropdown.css';

const NotificationPage = () => {
  const notifications = [
    {   message: 'Clear the all declarations before end of the year', time: '1 hour ago', read: true }
   
];
    return (
        <div className="notification-page">
            <h3>Notifications</h3>
            {notifications && notifications.length > 0 ? (
                <ul className="notification-list">
                    {notifications.map((notification, index) => (
                        <li key={index} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                            <span className="name">{notification.name}</span>:{" "}
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
