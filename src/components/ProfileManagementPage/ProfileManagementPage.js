import React, { useState, useRef } from 'react';
import './ProfileManagementPage.css';
import avatar from "../../assets/images/candidate-profile.png";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ProfileManagementPage = () => {
  const [formData, setFormData] = useState({
    UserName: '',
    PersonName: '',
    MailID: '',
    Mobile: '',
    Role: '',
  });

  const [profileImage, setProfileImage] = useState(avatar);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const fileInputRef = useRef();
  const cropperRef = useRef();

  const role = localStorage.getItem('role'); // Dynamically fetch role

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  // Handle "Create Photo" button click (trigger file input)
  const handlePhotoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Opens the file input dialog
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result); // Set the image for cropping
        setCropperVisible(true); // Show the cropping modal
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset file input to allow re-upload
    }
  };

  // Handle cropping
  const handleSaveCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedDataUrl = croppedCanvas.toDataURL();
      setCroppedImage(croppedDataUrl); // Save cropped image
      setProfileImage(croppedDataUrl); // Set profile image
      setCropperVisible(false); // Close cropping modal
    }
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setCropperVisible(false);
  };

  // Render cropping modal
  const renderCropperModal = () => (
    cropperVisible && (
      <div className="cropper-modal">
        <div className="cropper-modal-content">
          <h2 className="cropper-header">Crop Your Photo</h2>
          <Cropper
            src={imageToCrop}
            ref={cropperRef}
            style={{ height: '300px', width: '100%' }}
            aspectRatio={1} // Keep aspect ratio 1:1 for square crop
            guides={true}
          />
          <div className="cropper-actions">
            <button onClick={handleSaveCrop} className="btn-save-crop">
              Save Changes
            </button>
            <button onClick={handleCancelCrop} className="btn-cancel-crop">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="col-xl-7 mx-auto">
      {role === 'PRODUCT OWNER' && (
        <>
        <h1 className="profile_heading">
              <center>Profile Management</center>
            </h1>
          <div className="Profile-card">
          
            <div className="card-body">
              <span className="circle"></span>
              <img
                className="user_image"
                alt="Profile"
                src={croppedImage || profileImage} // Show cropped image if available
              />
              <button 
                className="create-photo" 
                onClick={handlePhotoUpload}
                style={{ cursor: 'pointer' }} // Ensure pointer cursor on hover
              >
                📸
              </button>
              <p className="text1">Create Your Picture</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }} // Hide the file input
              accept="image/*"
              onChange={handleImageChange} 
            />
          </div>

          {/* Contact Information Form */}
          <form className="mb-6" onSubmit={handleSubmit}>
            
            <div className="username-container">
              <label className="user-name_label1" htmlFor="UserName">
                Username
              </label>
              <p className="user-name_label1">AE22374926</p>
            </div>

            <label className="person-name_label" htmlFor="PersonName">
              Person Name
            </label>
            <input
              type="text"
              id="PersonName"
              value={formData.PersonName}
              onChange={handleChange}
              className="person-name_input" />

            <br />

            <label className="email-label" htmlFor="MailID">
              Mail ID
            </label>
            <input
              type="email"
              id="MailID"
              value={formData.MailID}
              onChange={handleChange}
              className="email-input" />

            <br />

            <label className="mobile-label" htmlFor="Mobile">
              Mobile
            </label>
            <input
              type="tel"
              id="Mobile"
              value={formData.Mobile}
              onChange={handleChange}
              className="mobile-input" />

            <div className="form-actions">
              <button type="button" className="profile_cancelbtn">
                Cancel
              </button>
              <button type="submit" className="profile_save">
                Save
              </button>
            </div>
          </form>
        </>
      )}

      {role === 'CLIENT ADMIN' && (
        <>
         <h1 className="profile_heading1">
              <center>Profile Management</center>
            </h1>
          <div className="Profile-card1">
            <div className="card-body1">
              <span className="circle1"></span>
              <img
                className="user_image1"
                alt="Profile"
                src={croppedImage || profileImage} // Show cropped image if available
              />
              <button 
                className="create-photo1" 
                onClick={handlePhotoUpload}
                style={{ cursor: 'pointer' }} // Ensure pointer cursor on hover
              >
                📸
              </button>
              <p className="text2">Create Your Picture</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }} // Hide the file input
              accept="image/*"
              onChange={handleImageChange} 
            />
          </div>

          <form className="mb-6_1" onSubmit={handleSubmit}>
           
            <div className="mail_id_container">
              <label className="mail_id_label1" htmlFor="MailID">
                Mail ID
              </label>
              <p className="mail_id_label2">abcd12345@gmail.com</p>
            </div>

            <label className="role_label" htmlFor="Role">
              Role
            </label>
            <input
              type="text"
              id="Role"
              value={formData.Role}
              onChange={handleChange}
              className="role-input" />

            <br />

            <label className="mobile_label" htmlFor="Mobile">
              Mobile
            </label>
            <input
              type="tel"
              id="Mobile"
              value={formData.Mobile}
              onChange={handleChange}
              className="mobile_input" />

            <div className="form-actions">
              <button type="button" className="profile_cancelbtn">
                Cancel
              </button>
              <button type="submit" className="profile_save">
                Save
              </button>
            </div>
          </form>
        </>
      )}

      {/* Render Cropper Modal */}
      {renderCropperModal()}
    </div>
  );
};

export default ProfileManagementPage;
