import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import authService from '../../ApiServices/ApiServices';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [counter, setCounter] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isOtpVisible && counter > 0) {
      timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
    } else if (counter === 0) {
      setIsResendEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [counter, isOtpVisible]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (isOtpVisible) {
      await handleOtpSubmit();
      return;
    }

    if (!username || !password) {
      setMessages(['Please fill in all fields']);
      return;
    }

    try {
      const loginResponse = await authService.login({ username, password });
      console.log('Login successful:', loginResponse);
      setIsLoginSuccessful(true);
      setIsOtpVisible(true);
      setCounter(30);
      setIsResendEnabled(false);
      
      const otpResponse = await authService.sendOTP();
      console.log('OTP sent successfully:', otpResponse);

      
      setMessages([]);
    } catch (error) {
      console.error('Login error:', error.message || error);
      setMessages([error.message || 'Login failed']);
      setIsLoginSuccessful(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      setMessages(['Please enter the OTP']);
      return;
    }

    try {
      const verifyResponse = await authService.verifyOTP({ email: username, otp });
      console.log('OTP verification successful:', verifyResponse);

      setIsOtpVerified(true);
      setMessages([]);
      alert('OTP Verified!');
      const details_data = await authService.details();
      console.log(details_data)
      const role = details_data.details[1].name
      console.log(role)
      localStorage.setItem('role', role);
      localStorage.setItem('access_status', true);

      navigate('/');
    } catch (error) {
      console.error('OTP verification error:', error.message || error);
      setMessages([error.message || 'Invalid OTP. Please try again.']);
      setIsOtpVerified(false);
    }
  };

  
  const handleResendOtp = async () => {
    try {
      setCounter(30);
      setIsResendEnabled(false);
      const resendResponse = await authService.resendOTP();
      console.log('OTP resent successfully:', resendResponse);

      
      setMessages(['OTP resent successfully.']);
    } catch (error) {
      console.error('Resend OTP error:', error.message || error);
      setMessages([error.message || 'Failed to resend OTP.']);
    }
  };

  return (
    <div className="login-div">
      {isLoginSuccessful && !isOtpVerified && (
        <div className="login-status login-success">
          <p>Welcome User! Please verify the OTP.</p>
        </div>
      )}

      {messages.length > 0 && (
        <div className="messages">
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="login-container">
        <h1 className="login-h2">Login</h1>
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              Username/Email Id <span className="required">*</span>
            </label>
            <input
              type="text"
              id="username"
              className="login-input"
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
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password-link">
            <Link to="/ResetPassword">Forgot Password?</Link>
          </div>

          {isOtpVisible && (
            <div className="form-group">
              <label htmlFor="otp">
                OTP <span className="required">*</span>
              </label>
              <input
                type="text"
                className="login-input"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <div className="otp-timer">
                {isResendEnabled ? (
                  <a
                    href="#"
                    className="resend-otp-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResendOtp();
                    }}
                  >
                    Resend OTP
                  </a>
                ) : (
                  <p>Resend OTP in {counter} seconds</p>
                )}
              </div>
            </div>
          )}

          <div className="login-div-alignment">
            <button className="login-btn" type="submit">
              {isOtpVisible ? 'Verify OTP' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
