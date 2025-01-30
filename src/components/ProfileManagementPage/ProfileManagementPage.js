import React, { useState, useRef, useEffect } from 'react';
import './ProfileManagementPage.css';
import avatar from "../../assets/images/candidate-profile.png";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { setProfileImage as updateProfileImage } from '../../utils/profileUtils'; // Utility function for managing images

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

  const role = localStorage.getItem('role'); // Fetch role dynamically

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

  // Handle "Create Photo" button click
  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
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
    }
  };

  // Handle cropping
  const handleSaveCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas({
            width: 200, // Increase width
            height: 200, // Increase height
            imageSmoothingEnabled: true, // Enable smoothing for better quality
            imageSmoothingQuality: 'high' // Set smoothing quality to high
            
        });

        if (croppedCanvas) {
            const croppedDataUrl = croppedCanvas.toDataURL("image/png", 1.0); // Max quality

            // Save cropped image
            setCroppedImage(croppedDataUrl);
            setProfileImage(croppedDataUrl);
            localStorage.setItem("profileImage", croppedDataUrl);

            // Notify other components (Header)
            window.dispatchEvent(new Event("profileImageUpdated"));

            // Hide Cropper modal
            setCropperVisible(false);
        }
    }
};


  useEffect(() => {
    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

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
      {(role === 'PRODUCT_OWNER' || role === 'CLIENT ADMIN') && (
        <>
          <h1 className="profile_heading">
            <center>Profile Management</center>
          </h1>

          <div className={`Profile-card${role === 'CLIENT ADMIN' ? "1" : ""}`}>
            <div className={`card-body${role === 'CLIENT ADMIN' ? "1" : ""}`}>
              <span className={`circle${role === 'CLIENT ADMIN' ? "1" : ""}`}></span>
              <img
                className={`user_image${role === 'CLIENT ADMIN' ? "1" : ""}`}
                alt="Profile"
                src={croppedImage || profileImage}
              />
              <button
                className={`create-photo${role === 'CLIENT ADMIN' ? "1" : ""}`}
                onClick={handlePhotoUpload}
                style={{ cursor: 'pointer' }}
              >
                📸
              </button>
              <p className={`text${role === 'CLIENT ADMIN' ? "2" : "1"}`}>
                Create Your Picture
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <form className={`mb-6${role === 'CLIENT ADMIN' ? "_1" : ""}`} onSubmit={handleSubmit}>
            {role === 'PRODUCT_OWNER' && (
              <>
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
                  className="person-name_input"
                />

                <br />
              </>
            )}

            <label className={`${role === 'CLIENT ADMIN' ? "mail_id_label1" : "email-label"}`} htmlFor="MailID">
              Mail ID
            </label>
            {role === 'CLIENT ADMIN' ? (
              <p className="mail_id_label2">abcd12345@gmail.com</p>
            ) : (
              <input
                type="email"
                id="MailID"
                value={formData.MailID}
                onChange={handleChange}
                className="email-input"
              />
            )}

            <br />

            <label className={`${role === 'CLIENT ADMIN' ? "role_label" : "mobile-label"}`} htmlFor={role === 'CLIENT ADMIN' ? "Role" : "Mobile"}>
              {role === 'CLIENT ADMIN' ? "Role" : "Mobile"}
            </label>
            <input
              type="text"
              id={role === 'CLIENT ADMIN' ? "Role" : "Mobile"}
              value={role === 'CLIENT ADMIN' ? formData.Role : formData.Mobile}
              onChange={handleChange}
              className={role === 'CLIENT ADMIN' ? "role_input" : "mobile-input"}
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

      {renderCropperModal()}
    </div>
  );
};

export default ProfileManagementPage;
