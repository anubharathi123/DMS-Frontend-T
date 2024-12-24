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
  const result =""

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
      const result = await authService.changePassword({ password });
    
      // Check if the result indicates success
      if (result.success) {
        setSuccessMessage('Password changed successfully!');
        setOldPassword('');
        setpassword('');
        setConfirmPassword('');
    
        // Navigate to the login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Handle any unexpected response
        setErrorMessage(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error("Error occurred during password change:", error);
    
      // Handle OTP expiration error specifically
      if (error.response?.data?.detail === 'OTP validation has expired. Please request a new OTP.') {
        setErrorMessage('Your OTP has expired. Please request a new OTP to proceed.');
        // Optionally, trigger OTP resend flow here if applicable
      } else {
        // General error message fallback
        const errorMessage =
          error.response?.data?.message || 
          error.detail || 
          'An error occurred. Please try again later.';
        setErrorMessage(errorMessage);
      }
    }
    
  };

  return (
    <div className="change-password-container">
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      <form className="form2" onSubmit={handleSubmit}>
        <div className="form-group">
          <h2>Change Password</h2>

          
          
        </div>

        <div className="form-group">
          <label htmlFor="new-password">New Password:</label>
          <input
            type="password"
            id="new-password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
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

        <button className="form2-btn" type="submit">ok</button>
      </form>
    </div>
  );
};

export default ChangePassword;
