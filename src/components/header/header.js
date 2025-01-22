import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
import Notification from "../../assets/images/notification-icon.png";
import CandidateProfile from "../../assets/images/candidate-profile.png";
import SearchIcon from "../../assets/images/search_icon.png";
import NotificationPage from "../NotificationDropdown/NotificationDropdown";

const Header = () => {
    const [query, setQuery] = useState(""); // State for search input
    const [suggestions, setSuggestions] = useState([]); // State for suggestions
    const [activeDropdown, setActiveDropdown] = useState(null); // Tracks which dropdown is open
    const [iconColor, setIconColor] = useState("#000"); // State for dynamic icon color
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
    const handleLogout = () =>
    {
        localStorage.removeItem('access_status')
        localStorage.removeItem('token')
        Navigate('/')
    }

    // Set a random color for the profile icon on component mount
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
            {/* Search Bar with Suggestions */}
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
                <div className="profile-icon">{getInitials(name)}</div>
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
                        onClick={() =>handleLogout()}
                    >
                        LogOut
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;
