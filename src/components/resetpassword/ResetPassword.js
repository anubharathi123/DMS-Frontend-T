import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import authService from '../../ApiServices/ApiServices'; // Import API service
import './ResetPassword.css'; 

const ResetPassword = () => {
  const [username, setEmailOrUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);  // Track if form is submitted
  const [token, setToken] = useState(null);  // Store token
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!isOtpSent) {
      if (!username) {
        setErrorMessage('Please enter your email or username.');
        return;
      }
      await handleResetPassword();
      setIsSubmitted(true);  // Set the form as submitted
    } else {
      await verifyOtp();
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await authService.resetPassword({username});
      setToken(response.token);  // Store the token
      setIsOtpSent(true);
      sendOtp();
      setSuccessMessage('OTP has been sent to your email.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to initiate password reset. Please try again.');
    }
  };

  const sendOtp = async () => {
    try {
      // Check if email or username exists before sending OTP
      // await authService.checkEmailOrUsernameExists(username);
      // If exists, send OTP
      await authService.sendOTP(username);
      setIsOtpSent(true);
      setSuccessMessage('OTP has been sent to your email.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const data = { token, otp };
      await authService.verifyOTP(data);
      setSuccessMessage('OTP verified successfully! You can now reset your password.');
      navigate('/changepassword');
    } catch (error) {
      setErrorMessage(error.message || 'Invalid OTP. Please try again.');
    }
  };

  // Close the error or success message
  const closeMessage = (setMessage) => {
    setMessage('');
  };

  return (
    <div className='reset-outer-container'>
      {errorMessage && (
        <div className="reset-error">
          <span className="resetalert-icon">⚠️</span>
          <span className="reset-error-text">{errorMessage}</span>
          <button className="reset-close-btn" onClick={() => closeMessage(setErrorMessage)}>×</button>
        </div>
      )}
      {successMessage && (
          <div className="reset-success">
            <span className="reset-success-text">{successMessage}</span>
            <button className="reset-close-btn" onClick={() => closeMessage(setSuccessMessage)}>×</button>
          </div>
        )}


      <div className="reset-password-container">
        <h2 className='reset-h2'>Reset Password</h2>

        
        <form className="form1" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email-username">Email/Username:</label>
            <input
              type="text"
              className='reset-text'
              id="email-username"
              value={username}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
          </div>
          {isOtpSent && (
            <div className="form-group">
              <label htmlFor="otp">Enter OTP:</label>
              <input
                type="text"
                className='reset-text'
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>
          )}
          <div className='reset-btn-adjustment'>
            <button className='reset-submit' type="submit">{isOtpSent ? 'Verify OTP' : 'Submit'}</button>
          </div>
        </form>
        
        <div className="back-to-login">
          <Link to="/login" className="back-to-login-link">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
