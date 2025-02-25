
import React, { useState, useEffect } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri";  // Import the dropdown icon
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateUser.css';
import apiServices from '../../ApiServices/ApiServices'; // Adjust the import path for apiServices
import Loader from "react-js-loader";

const UpdateUser = () => {
  const [formData, setFormData] = useState({});
  const { id }  = useParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);  
const [selectedUser, setSelectedUser] = useState();
  const [roleOptions] = useState(["Compiler", "Approver", "Viewer"]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const response = await apiServices.getUsersbyId(id);
        console.log("Fetch User ID:", id)
        console.log("API Response:", response.details)

        if (response && response.details) {
          const user = response.details;

          const users = {
            id:user.id,
            username:user.auth_user.first_name || '',
            email: user.auth_user.email,
            createdAt: user.created_at,
            role: user.role.name,
        };
        setSelectedUser(users);
       setFormData(users);
       console.log("Processed User Data:", users);
      } else {
        console.log("No User data Found")
      }
       
      } catch (error) {
        console.error("Error Fetching users:", error);
       
      } finally {
        setIsLoading(false);
      }
    };
    if(id) {
    fetchDetails();
  }
  }, [id]);

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      
      const response = await apiServices.register(formData);
      setMessage('User registered successfully!');
      navigate('/user-list');
    } catch (error) {
      // setIsLoading(false);
      const errorMessage = error.response?.data?.error || error.error;
      console.log('Error registering user:', errorMessage);
      // console.error('Error registering user:', error);
      setMessage(`Error: ${errorMessage}`);
      setTimeout(() => {
        setMessage(`Error: ${errorMessage}`);
        setMessage(``);
        // setLoading(false);
      }, 3000);
    }
    finally {
      setIsLoading(false); // End loading
    }
  };

  const handleCancel = () => {
    setFormData({
      username: '',
      name: '',
      mobile: '',
      email: '',
      created_at: '',
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
      
      {/* {message && <div className="createuser_message">{message}</div>} */}
      <h2 className="company-register-title">Update User Access</h2>
      {message && (
        <div className="documentapproval_message bg-red-100 text-red-800 px-4 py-2 rounded mb-4" role="alert">
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
            value={selectedUser?.username}
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
            name="companyname"
            value={selectedUser?.companyname}
            onChange={handleChange}
            className="company-input"
            required
            readOnly 
          />
        </div>

        {/* Person Name */}
        <div className="company-form-group">
          <label className="company-label">
            Person Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={selectedUser?.name}
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
            value={selectedUser?.mobile}
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
            value={selectedUser?.email}
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
            value={selectedUser?.created_at}
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
              value={selectedUser?.role}
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
          <button type="submit" className="btn-submit">Update</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
         
        </div>
      </form>
      {isLoading && (
        <div className="loading-popup">
          <div className="loading-popup-content">
            <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'}size={100} />
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
