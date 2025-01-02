

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom'; 
// import authService from '../../ApiServices/ApiServices'; // Import API service
// import './ResetPassword.css'; 

// const ResetPassword = () => {
//   const [emailOrUsername, setEmailOrUsername] = useState('');
//   const [otp, setOtp] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);  // Track if form is submitted
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');
//     if (!isOtpSent) {
//       if (!emailOrUsername) {
//         setErrorMessage('Please enter your email or username.');
//         return;
//       }
//       await sendOtp();
//       setIsSubmitted(true);  // Set the form as submitted
//     } else {
//       await verifyOtp();
//     }
//   };

//   const sendOtp = async () => {
//     try {
//       const response = await authService.sendOTP(emailOrUsername);
//       setIsOtpSent(true);
//       setSuccessMessage('OTP has been sent to your email.');
//     } catch (error) {
//       setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       const data = { email: emailOrUsername, otp };
//       await authService.verifyOTP(data);
//       setSuccessMessage('OTP verified successfully! You can now reset your password.');
//       navigate('/changepassword');
//     } catch (error) {
//       setErrorMessage(error.message || 'Invalid OTP. Please try again.');
//     }
//   };

//   // Close the error message
//   const closeError = () => {
//     setErrorMessage('');
//   };

//   return (
//     <div className='reset-outer-container'>
//       {errorMessage && (
//         <div className="error">
//           {/* Alert icon */}
//           <span className="alert-icon">⚠️</span>
//           <span className="error-text">{errorMessage}</span>
//           {/* Close button */}
//           <button className="close-btn" onClick={closeError}>×</button>
//         </div>
//       )}

//       <div className="reset-password-container">
//         <h2 className='reset-h2'>Reset Password</h2>

//         {successMessage && <div className="success">{successMessage}</div>}

//         <form className="form1" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email-username">Email/Username:</label>
//             <input
//               type="text"
//               className='reset-text'
//               id="email-username"
//               value={emailOrUsername}
//               onChange={(e) => setEmailOrUsername(e.target.value)}
//               placeholder="Enter your email or username"
//               required
//             />
//             {!isSubmitted && (
//               <div className="back-to-login">
//                 <Link to="/login" className="back-to-login-link">
//                   Back to Login
//                 </Link>
//               </div>
//             )}
//           </div>
//           {isOtpSent && (
//             <div className="form-group">
//               <label htmlFor="otp">Enter OTP:</label>
//               <input
//                 type="text"
//                 className='reset-text'
//                 id="otp"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="Enter OTP"
//                 required
//               />
//             </div>
//           )}
//           <div className='reset-btn-adjustment'>
//             <button className='reset-submit' type="submit">{isOtpSent ? 'Verify OTP' : 'Submit'}</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;




import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import authService from '../../ApiServices/ApiServices'; // Import API service
import './ResetPassword.css'; 

const ResetPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);  // Track if form is submitted
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!isOtpSent) {
      if (!emailOrUsername) {
        setErrorMessage('Please enter your email or username.');
        return;
      }
      await sendOtp();
      setIsSubmitted(true);  // Set the form as submitted
    } else {
      await verifyOtp();
    }
  };

  const sendOtp = async () => {
    try {
      const response = await authService.sendOTP(emailOrUsername);
      setIsOtpSent(true);
      setSuccessMessage('OTP has been sent to your email.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const data = { email: emailOrUsername, otp };
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
      {/* {errorMessage && (
        <div className="reset-error">
          <span className="reset-alert-icon">⚠️</span>
          <span className="reset-error-text">{errorMessage}</span>
          <button className="reset-close-btn" onClick={() => closeMessage(setErrorMessage)}>×</button>
        </div>
      )}

      {successMessage && (
        <div className="reset-success">
          <span className="reset-success-icon">✔️</span>
          <span className="reset-success-text">{successMessage}</span>
          <button className="reset-close-btn" onClick={() => closeMessage(setSuccessMessage)}>×</button>
        </div>
      )} */}

      <div className="reset-password-container">
        <h2 className='reset-h2'>Reset Password</h2>

        <form className="form1" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email-username">Email/Username:</label>
            <input
              type="text"
              className='reset-text'
              id="email-username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
            {!isSubmitted && (
              <div className="back-to-login">
                <Link to="/login" className="back-to-login-link">
                  Back to Login
                </Link>
              </div>
            )}
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
      </div>
    </div>
  );
};

export default ResetPassword;
