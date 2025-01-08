import React, { useState } from 'react';
import './ProfileManagementPage.css';
import { BiMobile } from 'react-icons/bi';
import avatar from "../../assets/images/candidate-profile.png";

const ProfileManagementPage = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    UserName: '',
    PersonName: '',
    MailID: '',
    Mobile: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="col-xl-7 mx-auto">
      {/* Profile Picture */}
      <div className='Profile-card'>
        <div className="card-body">
                  <img className="user_image" alt="Profile" src={avatar}/> 
                   </div>
      
      {/* Contact Information Form */}
      
      <form className="mb-6" onSubmit={handleSubmit}>
        
          
            <label className="user-name_label" htmlFor="firstName">Username</label>
            <br></br>
            <input className='user-name_input' type="text" id="firstName" value={formData.firstName} onChange={handleChange} />
          
          <div className="col-md-6">
            <label className="person-name_label" htmlFor="lastName">Person Name</label>
            <br></br>
            <input
              type="text"
              className="person-name_input"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
      
        </div>
      
            <label className="email-label" htmlFor="email">Mail ID</label>
            <br></br>
            <input
              type="email"
              className="email-input"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            <br></br>
            <label className="mobile-label" htmlFor="phoneNumber">Mobile</label>
            
            <input
              type="tel"
              className="mobile_input"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />

        <div className="text-end">
          <button type="button" className="profile_cancelbtn">Cancel</button>
          <button type="submit" className="profile_save">Save</button>
        </div>
        
      </form>
      </div>
    </div>
  );
};

export default ProfileManagementPage;
