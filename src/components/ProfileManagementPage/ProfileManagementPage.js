import React, { useState, useRef, useEffect } from 'react';
import './ProfileManagementPage.css';
import avatar from "../../assets/images/candidate-profile.png";
import 'cropperjs/dist/cropper.css';
import ProfileEdit from "../../assets/images/edit_icon.png";
import Cropper from 'react-cropper';

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
  const cropperRef = useRef();
  const fileInputRef = useRef();

  const role = localStorage.getItem('role'); // Dynamically fetch role

  // Check for saved profile image in localStorage
  useEffect(() => {
    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Your profile has been successfully saved.");
  };

  // Handle photo upload click
  const handlePhotoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Opens the file input dialog
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setCropperVisible(true);
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset file input
    }
  };

  // Handle cropping
  const handleSaveCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedDataUrl = croppedCanvas.toDataURL();
      setProfileImage(croppedDataUrl);
      localStorage.setItem("profileImage", croppedDataUrl);
      setCropperVisible(false);
      alert("Profile image has been successfully changed.");
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
            aspectRatio={1}
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
      {role === 'PRODUCT_OWNER' && (
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
                src={profileImage}
              />
              <form className="mb-6" onSubmit={handleSubmit}>
                {/* <div className="username-container"> */}
                  <label className="user-name_label1" htmlFor="UserName">
                    Username:
                  </label>
                  
                  <p className="user-name_label2">AE22374926</p>
                {/* </div> */}
                {/* <div className='personname_container'>
                   */}
                  <label className="person-name_label" htmlFor="PersonName">
                    Person Name:
                  </label>
                  <br/>
                  <input
                    type="text"
                    id="PersonName"
                    value={formData.PersonName}
                    onChange={handleChange}
                    placeholder='Person Name'
                    className="person-name_input"
                  />
                {/* </div> */}
                <div className='email_container'>
                  <label className="email-label" htmlFor="MailID">
                    Mail ID:
                  </label>
                  <br/>
                  <input
                    type="email"
                    id="MailID"
                    value={formData.MailID}
                    onChange={handleChange}
                    placeholder='Mail ID'
                    className="email-input"
                  />
                </div>
                <div className='mobile-container'>
                  <label className="mobile-label" htmlFor="Mobile">
                    Mobile:
                  </label>
                  <br/>
                  <input
                    type="tel"
                    id="Mobile"
                    value={formData.Mobile}
                    onChange={handleChange}
                    placeholder='Mobile Number'
                    className="mobile_input"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="profile_cancelbtn">
                    Cancel
                  </button>
                  <button type="submit" className="profile_save">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {role === 'ADMIN' && (
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
                src={profileImage}
              />
            </div>
          </div>
          <form className="mb-6_1" onSubmit={handleSubmit}>
            {/* <div className="username-container"> */}
              <label className="mail-id_label1" htmlFor="UserName">
                Mail ID
              </label>
              <br/>
              <p className="mail-id_label2">abcdefg12345@gmail.com</p>
            {/* </div> */}
            <label className="role_label" htmlFor="Role">
              Role
            </label>
            <br/>
            <input
              type="text"
              id="Role"
              value={formData.Role}
              onChange={handleChange}
              className="role_input"
            />
          <br/>
            <label className="mobile_label" htmlFor="Mobile">
              Mobile
            </label>
            <br/>
            <input
              type="tel"
              id="Mobile"
              value={formData.Mobile}
              onChange={handleChange}
              className="mobile-input"
            />
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

      
    </div>
  );
};

export default ProfileManagementPage;
