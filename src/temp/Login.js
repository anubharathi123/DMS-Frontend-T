
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(''); // Store generated OTP
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification status

  // Simulated correct credentials (replace with real authentication logic)
  const correctUsername = 'admin';
  const correctPassword = '1234';

  // Simulate OTP generation
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    setGeneratedOtp(otp.toString());
    console.log('Generated OTP:', otp); // Log OTP for testing
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      setMessages(['Please fill in all fields']);
      setIsLoginSuccessful(false);
      setIsLoginFailed(false);
      setIsOtpVisible(false); // Hide OTP section when login fails
    } else if (username === correctUsername && password === correctPassword) {
      setIsLoginSuccessful(true); // If credentials are correct, show success
      setIsLoginFailed(false); // Hide failure message
      setMessages([]); // Clear any previous error messages
      generateOtp(); // Generate OTP when login is successful
      setIsOtpVisible(true); // Show OTP field after successful login
    } else {
      setIsLoginFailed(true); // Show failure message
      setIsLoginSuccessful(false); // Hide success message
      setMessages(['Invalid username or password']); // Display error message
      setIsOtpVisible(false); // Hide OTP field in case of failed login
    }
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    if (otp.trim() === '') {
      setMessages(['Please enter the OTP']);
    } else if (otp === generatedOtp) {
      setMessages([]);
      setIsOtpVerified(true); // Mark OTP as verified
      console.log('OTP verified successfully');
      alert('OTP Verified!');
    } else {
      setMessages(['Invalid OTP. Please try again.']);
      setIsOtpVerified(false); // OTP verification failed
    }
  };

  return (
    <div className="container">
      {/* Show login success or failure message at the top */}
      {isLoginSuccessful && !isOtpVerified && (
        <div className="login-status success">
          <p>Welcome User! Please verify the OTP.</p>
        </div>
      )}

      {isLoginFailed && !isOtpVisible && (
        <div className="login-status failure">
          <p>Invalid Username or Password</p>
        </div>
      )}

      {/* Show messages for other errors */}
      {messages.length > 0 && (
        <div className="messages">
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Login Form */}
      <h1>Login</h1>
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="username">
            Username/Email Id <span className="required">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Forgot Password link */}
        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        {/* OTP input only shows when login is successful */}
        {isOtpVisible && (
          <div className="form-group">
            <label htmlFor="otp">
              OTP <span className="required">*</span>
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit">{isOtpVisible ? 'Verify OTP' : 'Login'}</button>
      </form>
    </div>
  );
};

export default Login;