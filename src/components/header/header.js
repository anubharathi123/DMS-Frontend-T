import React, { useState } from "react";
import './header.css';
import Notification from '../../assets/images/notification-icon.png'
import CandidateProfile from '../../assets/images/candidate-profile.png'
import SearchIcon from '../../assets/images/search_icon.png'
import { Link, useNavigate, NavLink } from 'react-router-dom';
import NotificationPage from "../NotificationDropdown/NotificationDropdown";

const App = () => {
    return (
        <div style={{ background: "rgb(248, 249, 250)" }}>
            <Header />
        </div>
    );
};

const Header = () => {
    const [query, setQuery] = useState(""); // State for search input
    const [suggestions, setSuggestions] = useState([]); // State for suggestions
    const [activeDropdown, setActiveDropdown] = useState(null); // Tracks which dropdown is open
    const notifications = [
        { id: 1, name: 'Ansari', message: 'marked the task as done', time: '1 hour ago', read: true },
        { id: 2, name: 'AnuBharathi', message: 'answered your comment', time: '2 hours ago', read: true },
        { id: 3, name: 'Alex', message: 'mentioned you in her comment', time: '3 hours ago', read: false },
        { id: 4, name: 'Stev', message: 'mentioned you in her comment on Invoices', time: '2 days ago', read: false },
        { id: 5, name: 'Sidd Ahamahad', message: 'assigned a new task to you', time: '3 days ago', read: false },
        { id: 6, name: 'Vimal Kumar', message: 'updated the project deadline', time: '4 days ago', read: false },
        { id: 7, name: 'Tamil', message: 'commented on your post', time: '5 days ago', read: false },
        { id: 8, name: 'Shreenivas', message: 'liked your comment on the report', time: '6 days ago', read: false },
    ];
    const Navigate = useNavigate();
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
    const handleLogout=()=>{
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("access_status");
        localStorage.removeItem("role");
        localStorage.removeItem("Company_name")
        Navigate('/login');

    }

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
                    <p><b>Name:</b> {localStorage.getItem('name')}</p>
                    <p><b>Email:</b> {localStorage.getItem('email')}</p>
                    <button
                        type="button"
                        className="signout-button"
                        onClick={() => handleLogout()}
                    >
                        LogOut
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
