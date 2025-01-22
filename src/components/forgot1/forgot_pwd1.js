import React, { useState } from 'react';
import './forgot_pwd1.css';
import { useNavigate } from 'react-router-dom'; 
import logo from '../../assets/images/vdart-logo.png';
import authService from '../../ApiServices/ApiServices'; // Import API service
import LinLogo from '../../assets/images/linkedin_logo.png';
import TLogo from '../../assets/images/t_logo.png';
import ILogo from '../../assets/images/ins_logo.png';
import CLogo from '../../assets/images/internet_logo.png';
import FbLogo from '../../assets/images/fb_logo.webp';

const Forgot_pwd1 = () => {
    const [username, setEmailOrUsername] = useState('');
     const [errorMessage, setErrorMessage] = useState('');
      const [successMessage, setSuccessMessage] = useState('');
      const [isOtpSent, setIsOtpSent] = useState(false);
      const [otp, setOtp] = useState('');
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
    
    
  return (
    <div className='reset-outer-container1'>
    <div className="forgot1-container">
      <div className="forgot1-left">
        <img src={logo} alt="logo" className='forgot1_logo'/>
        <h1 className='forgot_title'>Lorem Ipsum</h1>
        <h1 className='forgot1-h1'>
        Streamline Your Documents with <br/> Our DMS Solution
        </h1>
      </div>
      <div className="forgot1-right">
        <form className="forgot1-form" onSubmit={handleSubmit}>
        {errorMessage && (
          <><span className="resetalert-icon1">⚠️</span>
          <span className="reset-error-text1">{errorMessage}</span></> 
        )}
        <span className="reset-success-text1">{successMessage}</span>
          <h2>Reset Password</h2>
          <div className="forgot1-group">
            <label>
                Email/Username <span className="rqrd">*</span>
              <input type="text"
              className='reset-text1'
              id="email-username"
              value={username}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter your email or username"
              required />
            </label>
          </div>

          {isOtpSent && (
            <div className="form-group1">
              <label htmlFor="otp">Enter OTP:</label>
              <input
                type="text"
                className='reset-text1'
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>
          )}
          <center>
          <button type="submit" className="forgot_submitbtn">{isOtpSent ? 'Verify OTP' : 'Submit'}</button>
          </center>
          <div className="back-to-login1">
            <a href="/Login1" className="back-to-login1-link">Back to Login</a>
            </div>
        </form>
        <div className='forgot_footer'>
        <p className='forgot_text'>© VDart 2025. All Rights Reserved.| <a href='https://www.vdart.com/contact-us/'>Contact Us</a></p>
          <a href='https://www.vdart.com/'>
          <img className='c_logo1' src={CLogo} alt='CLogo'/>
          </a>
          <a href='https://www.facebook.com/VDartIncs/'>
          <img className='fb_logo1' src={FbLogo} alt='FbLogo'/>
          </a>
          <a href='https://x.com/VDartInc'>
          <img className='t_logo1' src={TLogo} alt='TLogo'/>
          </a>
          <a href='https://www.linkedin.com/company/vdart/'>
          <img className='lin_logo1' src={LinLogo} alt='LinLogo'/>
          </a>
          <a href='https://www.instagram.com/vdartinc/'>
          <img className='i_logo1' src={ILogo} alt='ILogo'/>
          </a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Forgot_pwd1;