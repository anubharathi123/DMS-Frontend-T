import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login1.css';
import logo from '../../assets/images/vdart-logo.png';
import authService from '../../ApiServices/ApiServices';
import LinLogo from '../../assets/images/linkedin_logo.png';
import TLogo from '../../assets/images/t_logo.png';
import ILogo from '../../assets/images/ins_logo.png';
import CLogo from '../../assets/images/internet_logo.png';
import FbLogo from '../../assets/images/fb_logo.webp';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const Login1 = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [counter, setCounter] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
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
      // eslint-disable-next-line no-cond-assign
      if (details_data.type === "User") {
        console.log('user')
        const name = details_data.details[5].name
        console.log(name)
        localStorage.setItem('name', name);
        const role = details_data.details[1].name
        console.log(role)
        localStorage.setItem('role', role);
      }
      // eslint-disable-next-line no-cond-assign
      if (details_data.type === "Organization") {
        console.log('Org')
        const name = details_data.details[1].company_name
        console.log(name)
        localStorage.setItem('name', name);
        const role = details_data.details[3].name
        console.log(role)
        if (role === 'ADMIN'){
          localStorage.setItem('role', role);
        }
        if (role === 'Organization Admin'){
          localStorage.setItem('role', 'ADMIN');
        }
        // localStorage.setItem('role', role);
      }
      
      localStorage.setItem('access_status', true);

      navigate('/Dashboard');
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="login1-container">
      <div className="login1-left">
        <img src={logo} alt="logo" className='login_logo'/>
        <h1 className='login1_title'>Lorem Ipsum</h1>
        <h1 className='login1-h1'>
          Streamline Your Documents with <br/> Our DMS Solution
        </h1>
      </div>
      <div className="login1-right">
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <h1 className="login-h2"><center>Login</center></h1>
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
              type={isPasswordVisible ? 'text' : 'password'} // Toggle password visibility
              id="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button
              type="button"
              className="login1_vpwd"
              onClick={togglePasswordVisibility} // Toggle password visibility on click
            >
              {isPasswordVisible ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>

          <div className="forgot-password-link">
            <Link to="/ResetPassword">Forgot Password?</Link>
          </div>
          <br />
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
            <button className="btn-signin" type="submit">
              {isOtpVisible ? 'Verify OTP' : 'Login'}
            </button>
          </div>
        </form>
      </div>
      <div className='login1_footer'>
        <p className='login1_text'><center>© VDart 2025. All Rights Reserved.</center></p>
      </div>
    </div>
  );
};

export default Login1;
