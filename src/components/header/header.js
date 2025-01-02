import React, { useState, useEffect, useRef } from "react";
import './header.css';
import Notification from '../../assets/images/notification-icon.png';
import CandidateProfile from '../../assets/images/candidate-profile.png';
import SearchIcon from '../../assets/images/search_icon.png';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import NotificationPage from "../NotificationDropdown/NotificationDropdown";

const Header = () => {
    const [query, setQuery] = useState(""); // State for search input
    const [suggestions, setSuggestions] = useState([]); // State for suggestions
    const [activeDropdown, setActiveDropdown] = useState(null); // Tracks which dropdown is open
    const Navigate = useNavigate();
    const dropdownRef = useRef(null); // Ref for the dropdown container

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

    const handleSearchInput = (event) => {
        const value = event.target.value;
        setQuery(value);
        if (value) {
            const filteredSuggestions = allSuggestions.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("access_status");
        localStorage.removeItem("role");
        Navigate('/login');
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActiveDropdown(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="header-container" style={{ background: "#0b3041", padding: "10px", height: "45px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            {/* Search Bar with Suggestions */}
            <div className="search-bar-container">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchInput}
                    className="search-input"
                    placeholder="Search..."
                />
                <img src={SearchIcon} alt="search_icon" className="search_icon"></img>
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
            <div ref={dropdownRef}>
                <button
                    type="button"
                    className="notificationbtn"
                    onClick={() => setActiveDropdown(activeDropdown === "notification" ? null : "notification")}
                >
                    <img
                        src={Notification}
                        alt="Notifications"
                        className="notification-icon"
                    />
                </button>

                {/* Notification Dropdown */}
                {activeDropdown === "notification" && (
                    <div className="notification-dropdown">
                        <NotificationPage />
                    </div>
                )}

                {/* Profile Button */}
                <button
                    type="button"
                    className="profilebtn"
                    onClick={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")}
                >
                    <img
                        src={CandidateProfile}
                        alt="Candidate profile"
                        className="profile-image"
                    />
                </button>

                {/* Profile Dropdown */}
                {activeDropdown === "profile" && (
                    <div className="profile-dropdown">
                        <p><b>Name:</b> John Doe</p>
                        <p><b>Email:</b> john.doe@example.com</p>
                        <button
                            type="button"
                            className="signout-button"
                            onClick={handleLogout}
                        >
                            LogOut
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
