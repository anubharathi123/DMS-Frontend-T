import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import Notification from "../../assets/images/notification-icon.png";
import CandidateProfile from "../../assets/images/candidate-profile.png";
import SearchIcon from "../../assets/images/search_icon.png";
import NotificationPage from "../NotificationDropdown/NotificationDropdown";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import avatar from "../../assets/images/candidate-profile.png";
import { FaBullseye } from "react-icons/fa6";

const Header = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || CandidateProfile
  );
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropperVisible, setCropperVisible] = useState(false);

  const fileInputRef = useRef();
  const cropperRef = useRef();
  const profileButtonRef = useRef();
  const profileDropdownRef = useRef();
  const notificationDropdownRef = useRef();
  const notificationButtonRef = useRef();
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";

  useEffect(() => {
    const updateProfileImage = () => {
      setProfileImage(localStorage.getItem("profileImage") || avatar);
    };

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

  // Updates profile image if it changes in localStorage
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

  const handleNotificationClick = (event) => {
    event.stopPropagation(); // Prevents unwanted event bubbling

    if (activeDropdown !== "notification") {
      setActiveDropdown("notification"); // Open notification dropdown
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_status");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePhotoUpload = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setCropperVisible(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSaveCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
    setProfileImage(croppedDataUrl);
    localStorage.setItem("profileImage", croppedDataUrl);
    setCropperVisible(false);
  };

  const renderCropperModal = () =>
    cropperVisible && (
      <div className="cropper-modal">
        <div className="cropper-modal-content">
          <h2 className="cropper-header">Crop Your Photo</h2>
          <Cropper
            src={imageToCrop}
            ref={cropperRef}
            style={{ height: "300px", width: "100%" }}
            aspectRatio={1}
            guides={true}
          />
          <div className="cropper-actions">
            <button onClick={handleSaveCrop} className="btn-save-crop">
              Save Changes
            </button>
            <button
              onClick={() => setCropperVisible(false)}
              className="btn-cancel-crop"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="header-container">
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
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {query && suggestions.length === 0 && (
          <p className="no-suggestions">No suggestions found</p>
        )}
      </div>

      {/* Notification Button */}
      <button
        type="button"
        className="notificationbtn"
        onClick={() =>
          setActiveDropdown(activeDropdown === "notification" ? null : "notification")
          
        }
      >
        {activeDropdown === "notification" && (
        <div className="notification-dropdown" ref={notificationDropdownRef}>
          <NotificationPage />
        </div>
      )}
        <img src={Notification} alt="Notifications" className="notification-icon" />
      </button>

      {/* Profile Icon */}
      <button
        type="button"
        className="profilebtn"
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

      {/* Notification Dropdown */}
      

      {/* Profile Dropdown */}
      {activeDropdown === "profile" && (
        <div className="profile-dropdown" ref={profileDropdownRef}>
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

      {renderCropperModal()}
    </div>
  );
};

export default Header;
