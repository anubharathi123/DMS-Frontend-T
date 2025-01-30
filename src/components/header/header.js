import React, { useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import Notification from "../../assets/images/notification-icon.png";
import CandidateProfile from "../../assets/images/candidate-profile.png";
import SearchIcon from "../../assets/images/search_icon.png";
import NotificationPage from "../NotificationDropdown/NotificationDropdown";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const Header = () => {
  const [query, setQuery] = useState(""); // State for search input
  const [suggestions, setSuggestions] = useState([]); // State for suggestions
  const [activeDropdown, setActiveDropdown] = useState(null); // Tracks which dropdown is open
  const [iconColor, setIconColor] = useState("#000"); // State for dynamic icon color
  const [profileImage, setProfileImage] = useState(
    sessionStorage.getItem("profileImage") || CandidateProfile
);

  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  

  const fileInputRef = useRef();
  const cropperRef = useRef();

  const Navigate = useNavigate();
  const name = localStorage.getItem("name");

  const allSuggestions = [
    "Find Company",
    "Find Documents",
    "Find Admin",
    "Admin List",
    "Company List",
    "Announcement List",
    "Audit Log",
    "Settings",
  ]; // Define allSuggestions
  useEffect(() => {
    // Function to update the profile image
    const updateProfileImage = () => {
        setProfileImage(localStorage.getItem("profileImage") || CandidateProfile);
    };

    // Listen for changes from ProfileManagementPage
    window.addEventListener("profileImageUpdated", updateProfileImage);

    return () => {
        window.removeEventListener("profileImageUpdated", updateProfileImage);
    };
}, []);
  // Function to extract initials
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const nameParts = fullName.split(" ");
    return nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2) // Take only the first two initials
      .join("");
  };

  // Function to generate a random color
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('access_status')
    localStorage.removeItem('token')
    Navigate('/')
  }

  // Set a random color for the profile icon on component mount
  useEffect(() => {
    setIconColor(getRandomColor());
  }, []);

  // Handle image upload
  const handlePhotoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Opens the file input dialog
    }
  };

  // Handle image change and cropping
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result); // Set the image for cropping
        setCropperVisible(true); // Show the cropping modal
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset file input to allow re-upload
    }
  };

  // Handle cropping and saving image
  const handleSaveCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedDataUrl = croppedCanvas.toDataURL();
      setCroppedImage(croppedDataUrl); // Save cropped image
      setProfileImage(croppedDataUrl); // Set profile image
      setCropperVisible(false); // Close cropping modal
    }
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setCropperVisible(false);
  };

  // Render cropping modal
  const renderCropperModal = () => (
    cropperVisible && (
      <div className="cropper-modal">
        <div className="cropper-modal-content">
          <h2 className="cropper-header">Crop Your Photo</h2>
          <Cropper
            src={imageToCrop}
            ref={cropperRef}
            style={{ height: '300px', width: '100%' }}
            aspectRatio={1} // Keep aspect ratio 1:1 for square crop
            guides={true}
          />
          <div className="cropper-actions">
            <button onClick={handleSaveCrop} className="btn-save-crop">
              Save Changes
            </button>
            <button onClick={handleCancelCrop} className="btn-cancel-crop">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
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
        <img src={Notification} alt="Notifications" className="notification-icon" />
      </button>

      {/* Profile Icon */}
      <button
        type="button"
        className="profilebtn"
        style={{ background: iconColor }} // Use the dynamic icon color
        onClick={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")}
      >
        {profileImage ? (
        <img src={profileImage} alt="Profile" className="profile-icon1" />
    ) : (
        <div className="profile-icon">{getInitials(name)}</div>
    )}
      </button>

      {/* Profile Dropdown */}
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
            onClick={() => handleLogout()}
          >
            LogOut
          </button>
        </div>
      )}

      {/* Render Cropper Modal */}
      {renderCropperModal()}
    </div>
  );
};

export default Header;
