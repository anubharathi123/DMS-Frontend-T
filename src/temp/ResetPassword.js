import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate for page navigation
import './ResetPassword.css'; // Import CSS for styling

const ResetPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');  // Email/Username input
  const [otp, setOtp] = useState('');  // OTP input
  const [errorMessage, setErrorMessage] = useState('');  // Error message state
  const [successMessage, setSuccessMessage] = useState('');  // Success message state
  const [isOtpSent, setIsOtpSent] = useState(false);  // Track if OTP is sent
  const [generatedOtp, setGeneratedOtp] = useState(''); // Store the generated OTP

  const navigate = useNavigate(); // Initialize navigate function

  // Handle form submission for email/username
  const handleSubmit = (e) => {
    if (!isOtpSent){
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Check if the email/username is entered
    if (!emailOrUsername) {
      setErrorMessage("Please enter your email/username.");
      return;
    }

    // Simulate sending OTP
    sendOtp();
  }
  else{
    console.log("Otp Verify")
    verifyOtp()
  }
  };

  // Simulate sending OTP to the provided email/username
  const sendOtp = () => {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);  // Generates a number between 100000 and 999999
    setGeneratedOtp(otp.toString());  // Save OTP in state
    console.log(`OTP generated: ${otp}`);  // Log OTP for debugging
    
    setIsOtpSent(true);  // Show OTP input after submission
    setSuccessMessage("OTP has been sent to your email/username.");
  };

  // Handle OTP verification
  const handleOtpVerification = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Check if OTP is entered
    if (!otp) {
      setErrorMessage("Please enter the OTP.");
      return;
    }
    console.log("OTP Page Entered")
    // Log both entered OTP and generated OTP for debugging
    // console.log(`Entered OTP: ${!otp}`);
    // console.log(`Generated OTP: ${!generatedOtp}`);

    // Simulate OTP verification
    // verifyOtp();
  };

  // Simulate OTP verification and navigate to ChangePassword page
  const verifyOtp = () => {
    // Check if the entered OTP matches the generated OTP
    if (otp === generatedOtp) {
      setSuccessMessage("OTP verified successfully! You can now reset your password.");
      console.log("OTP verified successfully!");
      
      // Navigate to the ChangePassword page
      navigate('/change-password');
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
      console.log("Invalid OTP entered.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>

      {/* Display error or success messages */}
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      <form className='form1' onSubmit={handleSubmit}>
        {/* Step 1: Email/Username form */}
        <div className="form-group">
          <label htmlFor="email-username">Email/Username:</label>
          <input
            type="text"
            id="email-username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="Enter your email or username"
            required
          />
        </div>

        {/* Step 2: OTP form (displayed after email/username submission) */}
        {isOtpSent && (
          <div className="form-group">
            <label htmlFor="otp">Enter OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </div>
        )}

        <button type="submit">{isOtpSent ? "Verify OTP" : "Submit"}</button>
      </form>
    </div>
  );
};

export default ResetPassword;
