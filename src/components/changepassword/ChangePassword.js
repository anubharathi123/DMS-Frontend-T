import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ChangePassword.css';
import authService from '../../ApiServices/ApiServices';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate input
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Call API to change the password
    try {
      await authService.changePassword({
        password
      });
      setSuccessMessage('Password changed successfully!');
      setOldPassword('');
      setpassword('');
      setConfirmPassword('');

      // Navigate to the login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to change the password. Please try again.');
    }
  };

  return (
    <div className="changepassword-div">
      <div className="change-password-container">
        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <form className="form2" onSubmit={handleSubmit}>
          <div className="form-group">
            <h2 className="changepassword-h2">Change Password</h2>
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              className="changepassword-input"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              className="changepassword-input"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="form2-btn" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
