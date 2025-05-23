import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import Notification from "../../assets/images/notification-icon.png";
import SearchIcon from "../../assets/images/search_icon.png";
import NotificationPage from "../NotificationDropdown/NotificationDropdown";
import "cropperjs/dist/cropper.css";
import avatar from "../../assets/images/candidate-profile.png";
import Logo from "../../assets/images/Logo.png"; // ✅ Logo import
import ApiService from "../../ApiServices/ApiServices";

const Header = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [profileImage, setProfileImage] = useState();
  const [iconColor, setIconColor] = useState("#000");

  const previousNotificationIds = useRef(new Set());
  const profileButtonRef = useRef();
  const profileDropdownRef = useRef();
  const notificationDropdownRef = useRef();
  const notificationButtonRef = useRef();
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "email";

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    document.body.className = theme === "light" ? "light-theme" : "dark-theme";
  }, []);

  const handleNotificationsUpdate = async (newNotifications) => {
    const updatedNotifications = newNotifications.map((notification) => ({
      ...notification,
      is_read: true,
    }));

    setNotifications(updatedNotifications);
    setNotificationCount(0);

    const response1 = await ApiService.OrgNotification();
    const unreadedCount = response1.filter((n) => !n.is_read).length;
    setNotificationCount(unreadedCount);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const details_data = await ApiService.details();
        let org_id =
          details_data?.details?.[7]?.id || details_data?.details?.[1]?.id;
        if (!org_id) throw new Error("Organization ID not found");

        const response = await ApiService.OrgNotification(org_id);
        const sortedNotifications = response
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map((not) => ({
            not_message: not.notification.message,
            not_title: not.notification.title,
          }));

        const response1 = await ApiService.OrgNotification();
        const unreadedCount = response1.filter((n) => !n.is_read).length;

        setNotifications(sortedNotifications);
        setNotificationCount(unreadedCount);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateProfileImage = async () => {
      setProfileImage(localStorage.getItem("profileImage"));
    };
    const fetchProfileDetails = async () => {
      try {
        const image = await ApiService.getprofile();
        try {
          const url = image.profile_image.image;
          const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
          const fullImageUrl = `${baseUrl.replace(/\/$/, "")}${url}`;
          setProfileImage(fullImageUrl);
          localStorage.setItem("profileImage", fullImageUrl);
        } catch (error) {
          const url = image.organization_image.image;
          const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
          const fullImageUrl = `${baseUrl.replace(/\/$/, "")}${url}`;
          setProfileImage(fullImageUrl);
          localStorage.setItem("profileImage", fullImageUrl);
        }
      } catch (error) {
        localStorage.setItem("profileImage", avatar);
        console.error("Error fetching profile details:", error);
      }
    };
    fetchProfileDetails();
    window.addEventListener("profileImageUpdated", updateProfileImage);
    return () => window.removeEventListener("profileImageUpdated", updateProfileImage);
  }, []);

  const getInitials = (name) => {
    if (!name.trim()) return "U";
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  const allSuggestions = [
    "Find Company",
    "Find Documents",
    "Find Admin",
    "Admin List",
    "Company List",
    "Announcement List",
    "Audit Log",
    "Settings",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current?.contains(event.target) ||
        notificationDropdownRef.current?.contains(event.target) ||
        profileButtonRef.current?.contains(event.target) ||
        notificationButtonRef.current?.contains(event.target)
      ) {
        return;
      }
      setActiveDropdown();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await ApiService.logout();
      localStorage.setItem("theme", "light");
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("profileImage");
      localStorage.removeItem("iconColor");
      localStorage.removeItem("headerColor");
      navigate("/login");
    } catch (error) {
      console.warn("Error logging out:", error.message);
    }
  };

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  };

  useEffect(() => {
    const iconColor1 = getRandomColor();
    setIconColor(iconColor1);
    localStorage.setItem("iconColor", iconColor1);
  }, []);

  const handleNavigateHome = () => {
    navigate("/Dashboard");
  };

  const handleNavigate404 = () => {
    navigate("/NotFoundView");
  };

  const handleNotificationClick = async () => {
    setActiveDropdown(activeDropdown === "notification" ? null : "notification");

    if (notificationCount > 0) {
      setNotificationCount(0);

      const updatedNotifications = notifications.map((n) => ({
        ...n,
        is_read: true,
      }));
      setNotifications(updatedNotifications);

      ApiService.markNotificationAsRead()
        .then(() => console.log("Notifications marked as read"))
        .catch((error) => console.error("Failed to mark notifications as read:", error));

      ApiService.OrgNotification()
        .then((response) => {
          const unreadedCount = response.filter((n) => !n.is_read).length;
          setNotificationCount(unreadedCount);
        })
        .catch((error) => console.error("Failed to fetch notifications:", error));
    }
  };

  return (
    <div className="header-container">
      {/* 🔹 Logo Section */}
      <img
        src={Logo}
        alt="Logo"
        className="logo"
        onClick={handleNavigateHome}
        style={{ cursor: "pointer", backgroundColor: "#fff", marginRight: "auto", height: "40px" }}
      />

    {/* 🔹 Search Bar Section */}
<div className="search-bar-container">
  <input
    type="text"
    value={query}
    onChange={(e) => {
      const value = e.target.value;
      setQuery(value);
      setSuggestions(
        value
          ? allSuggestions.filter((item) =>
              item.toLowerCase().includes(value.toLowerCase())
            )
          : []
      );
    }}
    className="search-input"
    placeholder="Search..."
  />
  <img src={SearchIcon} alt="search_icon" className="search_icon" />

  {(suggestions.length > 0 || query) && (
    <ul className="search-suggestions">
      {suggestions.length > 0 ? (
        suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="suggestion-item"
            onClick={() => setQuery(suggestion)}
          >
            {suggestion}
          </li>
        ))
      ) : (
        <li className="suggestion-item no-match">Not found</li>
      )}
    </ul>
  )}
</div>


      {/* 🔹 Notification Button */}
      <button
        type="button"
        className="notificationbtn"
        onClick={async () => {
          setNotificationCount(0);
          await handleNotificationClick();
        }}
        ref={notificationButtonRef}
      >
        {notificationCount > 0 && (
          <span className="notification-badge">{notificationCount}</span>
        )}
        {activeDropdown === "notification" && (
          <div className="notification-dropdown" ref={notificationDropdownRef}>
            <NotificationPage onNotificationsUpdate={handleNotificationsUpdate} />
          </div>
        )}
        <img src={Notification} alt="Notifications" className="notification-icon" />
      </button>

      {/* 🔹 Profile Button */}
      <button
        type="button"
        className="profilebtn"
        style={{ background: iconColor }}
        onClick={() =>
          setActiveDropdown(activeDropdown === "profile" ? null : "profile")
        }
        ref={profileButtonRef}
      >
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="profile-icon1" />
        ) : (
          <div className="profile-icon">{getInitials(name)}</div>
        )}
      </button>

      {/* 🔹 Profile Dropdown */}
      {activeDropdown === "profile" && (
        <div className="profile-dropdown" ref={profileDropdownRef}>
          <p><b></b> {name}</p>
          <p><b></b> {email}</p>
          <hr />
          <ul className="dropdown-menu">
            <li>
              <button type="button" className="dropdown-item" onClick={handleNavigateHome}>
                Home
              </button>
            </li>
            <li>
              <button type="button" className="dropdown-item" onClick={handleNavigate404}>
                Settings
              </button>
            </li>
            <li>
              <button type="button" className="signout-button" onClick={handleLogout}>
                LogOut
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;