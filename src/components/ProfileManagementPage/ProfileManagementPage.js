import React, { useState } from 'react';
import './ProfileManagementPage.css';
import { BiMobile } from 'react-icons/bi';
import avatar from "../../assets/images/candidate-profile.png";

const ProfileManagementPage = () => {
  const [formData, setFormData] = useState({
    UserName: '',
    PersonName: '',
    MailID: '',
    Mobile: '',
  });

  const [profileImage, setProfileImage] = useState(avatar);

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

  // Handle "Create Photo" button click
  const handlePhotoUpload = () => {
    document.getElementById('photoInput').click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="col-xl-7 mx-auto">
      <h1 className="profile_heading">Profile Management</h1>
      {/* Profile Picture */}
      <div className="Profile-card">
        <input type="text" className="organization-search" placeholder="Search Organization" />
        <div className="card-body">
          <span className="circle"></span>
          <img className="user_image" alt="Profile" src={profileImage} />
          <button className="create-photo" onClick={handlePhotoUpload}>
            📸
          </button>
          <p className="text1">Create Your Picture</p>
        </div>
        {/* Hidden file input */}
        <input
          type="file"
          id="photoInput"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        {/* Contact Information Form */}
        <form className="mb-6" onSubmit={handleSubmit}>
          <div className="username-container">
            <label className="user-name_label1" htmlFor="firstName">Username</label>
            <label className="user-name_label2">AE22374926</label>
          </div>
          <div className="col-md-6">
            <label className="person-name_label" htmlFor="lastName">Person Name</label>
            <input
              type="text"
              className="person-name_input"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <label className="email-label" htmlFor="email">Mail ID</label>
          <input
            type="email"
            className="email-input"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label className="mobile-label" htmlFor="phoneNumber">Mobile</label>
          <input
            type="tel"
            className="mobile_input"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <button type="button" className="profile_cancelbtn">Cancel</button>
          <button type="submit" className="profile_save">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileManagementPage;