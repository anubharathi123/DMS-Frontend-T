
import React, { useState, useEffect } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri";  // Import the dropdown icon
import './CreateUser.css';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    companyName: '',
    personName: '',
    mobile: '',
    email: '',
    accessCreationDate: '',
    accessExpiryDate: '',
    role: ''
  });

  const [roleOptions, setRoleOptions] = useState(["Compiler", "Approver", "Viewer"]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.role-input-wrapper')) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('User created successfully!');
    setFormData({
      username: '',
      companyName: '',
      personName: '',
      mobile: '',
      email: '',
      accessCreationDate: '',
      accessExpiryDate: '',
      role: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      username: '',
      companyName: '',
      personName: '',
      mobile: '',
      email: '',
      accessCreationDate: '',
      accessExpiryDate: '',
      role: ''
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value
    });
    setIsDropdownVisible(true);  // Show dropdown when user types
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) => 
        Math.min(prevIndex + 1, roleOptions.length - 1)
      );
    } 
    if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
    if (e.key === "Enter" && highlightedIndex >= 0) {
      setFormData({
        ...formData,
        role: roleOptions[highlightedIndex]
      });
      setIsDropdownVisible(false);  // Close dropdown on Enter key press
    }
  };

  const handleOptionClick = (option) => {
    setFormData({
      ...formData,
      role: option
    });
    setIsDropdownVisible(false);  // Close dropdown on option click
  };

  const handleInputClick = () => {
    setIsDropdownVisible(!isDropdownVisible); // Toggle dropdown on input click or icon click
  };

  return (
    <div className="company-register-container">
      <h2 className="company-register-title">User Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="company-form-group">
          <label className="company-label">
            Username <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="company-input"
            required
          />
        </div>

        {/* Company Name */}
        <div className="company-form-group">
          <label className="company-label">
            Company Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="company-input"
            required
          />
        </div>

        {/* Person Name */}
        <div className="company-form-group">
          <label className="company-label">
            Person Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            className="company-input"
            required
          />
        </div>

        {/* Mobile */}
        <div className="company-form-group">
          <label className="company-label">
            Mobile <span className="mandatory">*</span>
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="company-input"
            required
          />
        </div>

        {/* Email */}
        <div className="company-form-group">
          <label className="company-label">
            Mail ID <span className="mandatory">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="company-input"
            required
          />
        </div>

        {/* Access Creation Date */}
        <div className="company-form-group">
          <label className="company-label">
            Access Creation Date <span className="mandatory">*</span>
          </label>
          <input
            type="date"
            name="accessCreationDate"
            value={formData.accessCreationDate}
            onChange={handleChange}
            className="company-input"
            required
          />
        </div>

        {/* Access Expiry Date */}
        <div className="company-form-group">
          <label className="company-label">
            Access Expiry Date <span className="mandatory">*</span>
          </label>
          <input
            type="date"
            name="accessExpiryDate"
            value={formData.accessExpiryDate}
            onChange={handleChange}
            className="company-input"
            required
          />
        </div>

        {/* Role with Dropdown */}
        <div className="company-form-group">
          <label className="company-label">
            Role <span className="mandatory">*</span>
          </label>
          <div className="role-input-wrapper">
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              onKeyDown={handleKeyDown}
              onClick={handleInputClick}
              className="company-input role-input"
              required
              autoComplete="off"
            />
            <RiArrowDropDownLine
              className="dropdown-icon"
              onClick={handleInputClick} // Toggle dropdown on icon click
            />
          </div>
          {isDropdownVisible && (
            <ul className="dropdown-list">
              {roleOptions.map((option, index) => (
                <li
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={highlightedIndex === index ? "highlighted" : ""}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Button Group */}
        <div className="button-group">
          <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="btn-submit">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
