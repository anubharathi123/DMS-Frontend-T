import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './changepassword1.css';
import logo from '../../assets/images/vdart-logo.png';
import authService from '../../ApiServices/ApiServices';
import LinLogo from '../../assets/images/linkedin_logo.png';
import TLogo from '../../assets/images/t_logo.png';
import ILogo from '../../assets/images/ins_logo.png';
import CLogo from '../../assets/images/internet_logo.png';
import FbLogo from '../../assets/images/fb_logo.webp';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const ChangePassword1 = () => {

 const [oldPassword, setOldPassword] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
   const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    
        <div className="changepwd-container">
        <div className="changepwd-left">
                   <img src={logo} alt="logo" className='changepwd_logo'/>
            <h1 className='changepwd_title'>Lorem Ipsum</h1>
            <h1 className='changepwd-h1'>
                Streamline Your Documents with <br/> Our DMS Solution
            </h1>
        </div>
       
         <div className="changepwd-right">
        
            <form className="changepwd-form" onSubmit={handleSubmit}>
            {errorMessage && <p className="changepwd-error">{errorMessage}</p>}
        {successMessage && <p className="changepwd-success">{successMessage}</p>}

                <h2>Change Password</h2>
                <div className="changepwd-group">
                <label htmlFor="new-password">
                    New Password:
                    <input type="password"
                           id="new-password"
                           className="changepwd-input"
                           value={password}
                           onChange={(e) => setpassword(e.target.value)}
                           required />
                          <button
                            type="button"
                            className="changepwd_vpwd1"
                            onClick={togglePasswordVisibility} // Toggle password visibility on click
                          >
                  {isPasswordVisible ? <IoEyeOff /> : <IoEye /> }
                          </button>
                  </label>
                </div>
          <div className="changepwd-group">
          <label htmlFor="confirm-password"> Confirm Password:
          <input type="password"
                 className="changepwd-input"
                 id="confirm-password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 required />
                 <button type="button" className="changepwd_vpwd" 
                    onClick={togglePasswordVisibility} // Toggle password visibility on click
                  >
                  {isPasswordVisible ? <IoEyeOff /> : <IoEye /> }
                  </button> 
            </label>
          </div>
            <br/>
          <button type="submit" className="changepwd_submitbtn">Submit</button>
        </form>
      </div>
    </div>
    
  );
};

export default ChangePassword1;