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
import ApiService from "../../ApiServices/ApiServices";



const Header = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileImage, setProfileImage] = useState( );
  const [iconColor, setIconColor] = useState("#000");
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
  const email = localStorage.getItem("email") || "email";


  useEffect(() => {
    // localStorage.removeItem("profileImage");
    const updateProfileImage = async () =>  {
      setProfileImage(localStorage.getItem("profileImage"));
      };
      const fetchProfileDetails = async () => {
        try {
          // const response = await authService.details();
          const image = await ApiService.getprofile();
          try{
            console.log("Profile image response:",(image.profile_image.image) );
            const url = (image.profile_image.image);
            console.log("Profile image URL:", url);
            const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
            // Ensure no double slashes in the URL
            const fullImageUrl = `${baseUrl.replace(/\/$/, "")}${url}`;
          
            setProfileImage(fullImageUrl);
            localStorage.setItem("profileImage", fullImageUrl);
          }
          catch(error){
            console.log("Profile image response:",(image.organization_image.image) );
            const url = (image.organization_image.image);
            console.log("Profile image URL:", url);
            const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
            // Ensure no double slashes in the URL
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

  

  const handleLogout = async () => {
    try {
        await ApiService.logout(); // Call the logout API
        localStorage.removeItem("access_status");
        localStorage.removeItem("token");
        navigate("/");
    } catch (error) {
        console.warn("Error logging out:", error.message);
    }
};
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
};
useEffect(() => {
  setIconColor(getRandomColor());
}, []);

const handleNavigateHome =() => {
  navigate("/Dashboard");
}

const handleNavigate404 = () => {
  navigate("/NotFoundView")
}

 


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

      {/* Notification Dropdown */}
      

      {/* Profile Dropdown */}
      {activeDropdown === "profile" && (
  <div className="profile-dropdown" ref={profileDropdownRef}>
    <p><b></b> {name}</p>
    <p><b></b> {email}</p>
    <hr />
    <ul className="dropdown-menu">
      <li><button type="button" className="dropdown-item" onClick={handleNavigateHome}>Home</button></li>
      <li><button type="button" className="dropdown-item" onClick={handleNavigate404}>Settings</button></li>
      <li><button type="button" className="signout-button" onClick={handleLogout}>
        LogOut
      </button></li>
    </ul>
  </div>
)}

      {/* {renderCropperModal()} */}
    </div>
  );
};

export default Header;
