

import React, { useState, useRef } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './ProfileManagement.css';
import Cropper from 'react-cropper';  
import 'cropperjs/dist/cropper.css';  

const ProfileManagement = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [image, setImage] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);  
  const [cropperVisible, setCropperVisible] = useState(false); 
  const [croppedImage, setCroppedImage] = useState(null);  

  const fileInputRef = useRef(); 
  const cropperRef = useRef();  

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get the image to be saved (either cropped image or uploaded image)
    const savedImage = croppedImage || image; 

    const employeeDetails = {
      email,
      role,
      mobile,
      image: savedImage,
    };

    console.log('Employee Details:', employeeDetails);

    // Clear input fields and image after saving
    setEmail('');
    setRole('');
    setMobile('');
    setImage(null);
    setCroppedImage(null);
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
      setCroppedImage(cropper.getCroppedCanvas().toDataURL());  
    }
    setCropperVisible(false);  
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setCropperVisible(false);  
  };

  // Reset form fields
  const handleCancel = () => {
    setRole('');
    setEmail('');
    setMobile('');
    setImage(null);
    setCroppedImage(null);
    resetFileInput();  
  };

  // Handle profile image click (opens the file input dialog)
  const handleImageClick = () => {
    fileInputRef.current.click();  // Trigger the file input click
  };

  return (
    <div className="profile-management-body">
      <div className="profile-management-container">
        {/* Header Section */}
        <div className="profile-management-header">
          <div className="profile-management-profileSection">
            <div className="profile-management-profilePicContainer" onClick={handleImageClick}>
              <img
                src={croppedImage || image || "https://via.placeholder.com/100"}
                alt="Profile"
                className="profile-management-profilePic"
              />
            </div>
            <div className="profile-management-companyName">Name of the Company</div>
          </div>
          <div className="profile-management-cameraIconContainer" onClick={handleImageClick}>
            <i className="fa fa-camera profile-management-cameraIcon"></i>
            <span>Create your picture</span>
          </div>
          <input
            ref={fileInputRef}  
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="profile-management-line"></div>
        </div>

        {/* Employee Info Form */}
        <form className="profile-management-formContainer" onSubmit={handleSubmit}>
          <div className="profile-management-formRow">
            <div className="profile-management-label">Mail ID:</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="profile-management-input"
              placeholder="Enter Email"
            />
          </div>

          <div className="profile-management-formRow">
            <div className="profile-management-label">Role:</div>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="profile-management-input"
              placeholder="Role"
            />
          </div>

          <div className="profile-management-formRow">
            <div className="profile-management-label">Mobile:</div>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="profile-management-input"
              placeholder="Enter Mobile"
            />
          </div>

          <div>
            <button
              type="button"
              className="profile-management-cancelButton"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="profile-management-button"
            >
              Save Details
            </button>
          </div>
        </form>
      </div>

      {/* Image Cropping Modal */}
      {cropperVisible && (
        <div className="profile-management-cropperModal">
          <div className="profile-management-cropperModalContent">
            <Cropper
              src={imageToCrop}
              ref={cropperRef}
              style={{ height: 250, width: '100%' }}  // Adjust cropper size
              aspectRatio={1}  
              guides={false}
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

export default ProfileManagement;





