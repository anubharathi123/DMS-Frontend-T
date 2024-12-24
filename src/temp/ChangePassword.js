import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ChangePassword.css';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Check password length
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    changePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
  };

  const changePassword = (newPassword) => {
    console.log("Password has been changed to:", newPassword);
    setSuccessMessage("Password changed successfully!");

    // Navigate to the login page after password change
    setTimeout(() => {
      navigate('/login'); // Navigates to the login page
    }, 2000); // Delay navigation for 2 seconds to allow the success message to be displayed
  };

  return (
    <div className="change-password-container">
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      <form className='form2' onSubmit={handleSubmit}>
        <div className="form-group">
          <h2>Change Password</h2>
          <label htmlFor="new-password">New Password:</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className='form2-btn' type="submit">OK</button>
      </form>
    </div>
  );
};

export default ChangePassword;
