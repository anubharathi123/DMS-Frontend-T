import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css';
import Notification from "../../assets/images/notification-icon.png";
import SearchIcon from "../../assets/images/search_icon.png";
import CandidateProfile from "../../assets/images/candidate-profile.png";
import NotificationPage from "../NotificationDropdown/NotificationDropdown";
import avatar from "../../assets/images/candidate-profile.png";



const Header = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [iconColor, setIconColor] = useState('#000');
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || CandidateProfile);

  useEffect(() => {
    const updateProfileImage = () => {
        const newProfileImage = localStorage.getItem("profileImage") || avatar;
        setProfileImage(newProfileImage);
    };

    window.addEventListener("profileImageUpdated", updateProfileImage);
    return () => window.removeEventListener("profileImageUpdated", updateProfileImage);
}, []);

  const Navigate = useNavigate();
  const name = localStorage.getItem('name');

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

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
    return nameParts.map((part) => part.charAt(0).toUpperCase()).slice(0, 2).join('');
  };

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('access_status');
    localStorage.removeItem('token');
    Navigate('/');
  };

  const handlePhotoUpload = () => {
    document.getElementById('file-input').click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
            localStorage.setItem("profileImage", reader.result); // Save to localStorage
            window.dispatchEvent(new Event("profileImageUpdated")); // Notify other components
        };
        reader.readAsDataURL(file);
    }
};

  useEffect(() => {
    setIconColor(getRandomColor());
  }, []);

  return (
    <div
      className="header-container"
      style={{
        background: "#0b3041",
        padding: "10px",
        height: "45px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div className="search-bar-container">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (value) {
              const filteredSuggestions = allSuggestions.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
              );
              setSuggestions(filteredSuggestions);
            } else {
              setSuggestions([]);
            }
          }}
          className="search-input"
          placeholder="Search..."
        />
        <img src={SearchIcon} alt="search_icon" className="search_icon" />
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setQuery(suggestion);
                  setSuggestions([]);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="notificationbtn"
        onClick={() =>
          setActiveDropdown(activeDropdown === "notification" ? null : "notification")
        }
      >
        <img src={Notification} alt="Notifications" className="notification-icon" />
      </button>

      <button
        type="button"
        className="profilebtn"
        style={{ background: iconColor }}
        onClick={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")}
      >
        {profileImage ? (
        <img src={profileImage} alt="Profile" className="profile-icon1" />
    ) : (
        <div className="profile-icon">{getInitials(name)}</div>
    )}
      </button>

      {activeDropdown === "profile" && (
        <div className="profile-dropdown">
          <p>
            <b>Name:</b> {name}
          </p>
          <p>
            <b>Email:</b> {localStorage.getItem("email") || "Not Available"}
          </p>
          <button
            type="button"
            className="signout-button"
            onClick={handleLogout}
          >
            LogOut
          </button>
        </div>
      )}

      <input
        id="file-input"
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default Header;
