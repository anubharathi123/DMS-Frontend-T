import React, { useState, useEffect } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateUser.css';
import apiServices from '../../ApiServices/ApiServices';
import Loader from "react-js-loader";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState({
    id: '',
    username: '',
    company_name: '',
    first_name: '',
    mobile: '',
    email: '',
    created_at: '',
    role: ''
  });
  const [formData, setFormData] = useState({});
  const [roleOptions] = useState(["Compiler", "Approver", "Viewer"]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const response = await apiServices.getUsersbyId(id);
        console.log("Fetch User ID:", id);
        console.log("API Response:", response.details);
  
        if (response.details) {
          const user = response.details;
          const formattedDate = user[7]?.created_at
            ? new Date(user[7].created_at).toISOString().split('T')[0]
            : '';
  
          // Properly formatted user object
          const userData = {
            id: user.id || '',
            username: user[1]?.username || '',
            company_name: user[7]?.company_name || "N/A",
            first_name: user[1]?.first_name || '',
            mobile: user[7]?.mobile || '',
            email: user[1]?.email || '',
            created_at: formattedDate,
            role: user[5]?.name || "N/A",
          };
          if (userData.role === "UPLOADER"){
            userData.role = 'Compiler'
          }
          if (userData.role === "REVIEWER"){
            userData.role = 'Approver'
          }
          if (userData.role === "VIEWER"){
            userData.role = 'Viewer'
          }

          setSelectedUser(userData);
          setFormData(userData);
          console.log("Processed User Data:", userData);
        } else {
          console.log("No User Data Found");
          setMessage("User data not found");
        }
      } catch (error) {
        console.error("Error Fetching Users:", error);
        setMessage("Error fetching user data");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (id) {
      fetchDetails();
    }
  }, [id]);
  
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
    
    // Also update selectedUser for display purposes
    setSelectedUser({
      ...selectedUser,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Use updateUser instead of register for updating an existing user
      const response = await apiServices.updateAdmin(id, formData);
      setMessage('User updated successfully!');
      setTimeout(() => {
        navigate('/user-list');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Unknown error occurred";
      console.error('Error updating user:', errorMessage);
      setMessage(`Error: ${errorMessage}`);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user-list');
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      role: value
    });
    setSelectedUser({
      ...selectedUser,
      role: value
    });
    // Don't filter roles - always show all options
    setIsDropdownVisible(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent cursor movement
      setHighlightedIndex((prevIndex) => 
        Math.min(prevIndex + 1, roleOptions.length - 1)
      );
    } 
    else if (e.key === "ArrowUp") {
      e.preventDefault(); // Prevent cursor movement
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
    else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault(); // Prevent form submission
      const selectedRole = roleOptions[highlightedIndex];
      setFormData({
        ...formData,
        role: selectedRole
      });
      setSelectedUser({
        ...selectedUser,
        role: selectedRole
      });
      setIsDropdownVisible(false);
      setHighlightedIndex(-1);
    }
    else if (e.key === "Escape") {
      setIsDropdownVisible(false);
      setHighlightedIndex(-1);
    }
  };

  const handleOptionClick = (option) => {
    setFormData({
      ...formData,
      role: option
    });
    setSelectedUser({
      ...selectedUser,
      role: option
    });
    setIsDropdownVisible(false);
    setHighlightedIndex(-1);
  };

  const handleInputClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
    if (isDropdownVisible) {
      setHighlightedIndex(-1);
    }
  };

  // Always show all role options regardless of input text
  // Removed the filtering that was here before

  return (
    <div className="company-register-container">
      <h2 className="company-register-title">Update User Access</h2>
      {message && (
        <div className={`documentapproval_message ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} px-4 py-2 rounded mb-4`} role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="company-form-group">
          <label className="company-label">
            Username <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={selectedUser.username || ''}
            className="company-input"
            disabled
          />
        </div>

        {/* Company Name */}
        <div className="company-form-group">
          <label className="company-label">
            Company Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={selectedUser.company_name || ''}
            className="company-input"
            disabled 
          />
        </div>

        {/* Person Name */}
        <div className="company-form-group">
          <label className="company-label">
            Person Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={selectedUser.first_name || ''}
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
            value={selectedUser.mobile || ''}
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
            value={selectedUser.email || ''}
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
            name="created_at"
            value={selectedUser.created_at || ''}
            className="company-input"
            disabled
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
              value={selectedUser.role || ''}
              onChange={handleRoleChange}
              onKeyDown={handleKeyDown}
              onClick={handleInputClick}
              className="company-input role-input"
              required
              autoComplete="off"
            />
            <RiArrowDropDownLine
              className="dropdown-icon"
              onClick={handleInputClick}
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
          <button type="submit" className="btn-submit" disabled={isLoading}>Update</button>
          <button type="button" className="btn-cancel" onClick={handleCancel} disabled={isLoading}>Cancel</button>
        </div>
      </form>
      {isLoading && (
        <div className="loading-popup">
          <div className="loading-popup-content">
            <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'} size={100} />
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;