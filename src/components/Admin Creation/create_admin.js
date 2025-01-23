import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminCreation.css';
import Loader from "react-js-loader";
import authService from '../../ApiServices/ApiServices';

const AdminCreation = () => {
  const [admin, setAdmin] = useState({
    adminName: '',
    email: '',
    mobile: '',
    role: '',
    department: '',
  });

  const [error, setError] = useState(null); // For error handling
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.createAdmin(admin); // Replace with API service call for admin creation
      alert('Admin registered successfully!');
      navigate('/dashboard'); // Redirect after successful submission
    } catch (error) {
      setError(error.message || 'Something went wrong.'); // Handle error
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handles cancel action
  const handleCancel = () => {
    setAdmin({
      adminName: '',
      email: '',
      mobile: '',
      role: '',
      department: '',
    });
  };

  return (
    <div className="admin-creation-container">
      <div className="admin-creation-inner-container">
        <h2 className="admin-creation-title">Admin Creation</h2>
        {error && (
          <div className="admin-creation-error" role="alert">
            {error}
          </div>
        )}
        <form className="admin-creation-form" onSubmit={handleSubmit}>
          {/* Admin Name */}
          <div className="admin-creation-form-group">
            <label className="admin-creation-label">
              Admin Name<span className="admin-creation-mandatory">*</span>
            </label>
            <input
              type="text"
              name="adminName"
              value={admin.adminName}
              onChange={handleChange}
              className="admin-creation-input"
              required
            />
          </div>

          {/* Email */}
          <div className="admin-creation-form-group">
            <label className="admin-creation-label">
              Email<span className="admin-creation-mandatory">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={admin.email}
              onChange={handleChange}
              className="admin-creation-input"
              required
            />
          </div>

          {/* Mobile */}
          <div className="admin-creation-form-group">
            <label className="admin-creation-label">
              Mobile<span className="admin-creation-mandatory">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={admin.mobile}
              onChange={handleChange}
              className="admin-creation-input"
              required
            />
          </div>

          {/* Role */}
          <div className="admin-creation-form-group">
            <label className="admin-creation-label">
              Role<span className="admin-creation-mandatory">*</span>
            </label>
            <input
              type="text"
              name="role"
              value={admin.role}
              onChange={handleChange}
              className="admin-creation-input"
              required
            />
          </div>

          {/* Department */}
          <div className="admin-creation-form-group">
            <label className="admin-creation-label">
              Department<span className="admin-creation-mandatory">*</span>
            </label>
            <input
              type="text"
              name="department"
              value={admin.department}
              onChange={handleChange}
              className="admin-creation-input"
              required
            />
          </div>

          {/* Submit and Cancel */}
          <div className="admin-creation-buttons">
            <button type="submit" className="admin-creation-submit">
              Create
            </button>
            <button type="button" onClick={handleCancel} className="admin-creation-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
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

export default AdminCreation;
