

import React, { useState, useRef } from 'react';
import './ProfileManagementPage.css';
import avatar from "../../assets/images/candidate-profile.png";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Ensure cropper styles are imported

const ProfileManagementPage = () => {
  const [formData, setFormData] = useState({
    UserName: '',
    PersonName: '',
    MailID: '',
    Mobile: '',
  });

  const [profileImage, setProfileImage] = useState(avatar);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const fileInputRef = useRef();
  const cropperRef = useRef();

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
    fileInputRef.current.click();
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);  
        setCropperVisible(true);  
      };
      reader.readAsDataURL(file);

      // Reset the file input so the user can select the same file again
      resetFileInput();
    }
  };

  // Reset the file input to allow re-selection of the same file
  const resetFileInput = () => {
    fileInputRef.current.value = '';  
  };

  // Handle cropping
  const handleSaveCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      setCroppedImage(croppedCanvas.toDataURL());  // Set the cropped image
    }
    setCropperVisible(false);  // Close the cropper modal after saving
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setCropperVisible(false);  // Close the cropper without saving changes
  };

  // Handle profile image click (opens the file input dialog)
  const handleImageClick = () => {
    fileInputRef.current.click();  // Trigger the file input click
  };

  return (
    <div className="col-xl-7 mx-auto">
      <h1 className="profile_heading">Profile Management</h1>
      {/* Profile Picture */}
      <div className="Profile-card">
        <input type="text" className="organization-search" placeholder="Search Organization" />
        <div className="card-body">
          <span className="circle"></span>
          <img
            className="user_image"
            alt="Profile"
            src={croppedImage || profileImage} // Show cropped image if available, otherwise show default
            onClick={handleImageClick}  // Trigger file input on image click
          />
          <button className="create-photo" onClick={handlePhotoUpload}>
            📸
          </button>
          <p className="text1">Create Your Picture</p>
        </div>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Contact Information Form */}
        <form className="mb-6" onSubmit={handleSubmit}>
          <div className="username-container">
            <label className="user-name_label1" htmlFor="UserName">Username</label>
            <label className="user-name_label2">AE22374926</label>
          </div>
          <div className="col-md-6">
            <label className="person-name_label" htmlFor="PersonName">Person Name</label>
            <input
              type="text"
              className="person-name_input"
              id="PersonName"
              value={formData.PersonName}
              onChange={handleChange}
            />
          </div>
          
          <label className="email-label" htmlFor="MailID">Mail ID</label>
          <input
            type="email"
            className="email-input"
            id="MailID"
            value={formData.MailID}
            onChange={handleChange}
          />
          <label className="mobile-label" htmlFor="Mobile">Mobile</label>
          <input
            type="tel"
            className="mobile_input"
            id="Mobile"
            value={formData.Mobile}
            onChange={handleChange}
          />
          <button type="button" className="profile_cancelbtn">Cancel</button>
          <button type="submit" className="profile_save">Save</button>
        </form>
      </div>

      {/* Image Cropping Modal */}
      {cropperVisible && (
        <div className="profile-management-cropperModal">
          <div className="profile-management-cropperModalContent">
            <Cropper
              src={imageToCrop}  // Use the image to crop, not the cropped image
              ref={cropperRef}
              style={{ height: 250, width: '100%' }}  // Adjust cropper size
              aspectRatio={1}  // Enforces a square crop
              guides={false}  // Disables guides in the cropper
              className='cropper-image'
            />
            <div className="profile-management-cropperActions">
              <button onClick={handleSaveCrop} className="profile-management-button">Save Changes</button>
              <button onClick={handleCancelCrop} className="profile-management-cancelButton">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManagementPage;
