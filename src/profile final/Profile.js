import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import avatar from "../assets/images/candidate-profile.png";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import authService from "../ApiServices/ApiServices";
import removeIcon from "../assets/images/remove_icon.png";

function ProfileCard() {
  const [cropperVisible, setCropperVisible] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [mail, setMail] = useState("");
  const [mobile, setMobile] = useState("");
  const [imageToCrop, setImageToCrop] = useState(null);
  const cropperRef = useRef();
  const fileInputRef = useRef();
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || avatar);

  // State variables for editing
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editMail, setEditMail] = useState("");
  const [editMobile, setEditMobile] = useState("");

  // State for handling transitions
  const [showEditCard, setShowEditCard] = useState(false);

  useEffect(() => {
    const updateProfileImage = () => {
      setProfileImage(localStorage.getItem("profileImage") || avatar);
    };

    const fetchProfileDetails = async () => {
      try {
        const response = await authService.details();
        if (response?.details) {
          const fetchedName = response.details[1]?.username || response.details[5]?.first_name || "N/A";
          const fetchedRole = response.details[5]?.name || response.details[3]?.name || "Unknown";
          const fetchedMail = response.details[1]?.email || response.details[5]?.email || "No email provided";
          const fetchedMobile = response.details[3]?.mobile || response.details[1]?.mobile || "No mobile provided";

          setName(fetchedName);
          setRole(fetchedRole);
          setMail(fetchedMail);
          setMobile(fetchedMobile);

          setEditName(fetchedName);
          setEditRole(fetchedRole);
          setEditMail(fetchedMail);
          setEditMobile(fetchedMobile);
        }
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
    window.addEventListener("profileImageUpdated", updateProfileImage);

    return () => {
      window.removeEventListener("profileImageUpdated", updateProfileImage);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setCropperVisible(true);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleSaveCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      croppedCanvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image", blob, "profile.jpg");

        try {
          const response = await authService.profile(formData);
          let url = response?.profile_image?.image || response?.organization_image?.image;
          if (url) {
            const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
            const fullImageUrl = `${baseUrl.replace(/\/$/, "")}${url}`;
            setProfileImage(fullImageUrl);
            localStorage.setItem("profileImage", fullImageUrl);
            window.dispatchEvent(new Event("profileImageUpdated"));
            alert("Profile image has been successfully changed.");
          } else {
            alert("Failed to update profile image.");
          }
        } catch (error) {
          console.error("Error uploading profile image:", error);
          alert("Error uploading image.");
        }
      }, "image/jpeg");

      setCropperVisible(false);
    }
  };

  // ✅ Save changes should hide the edit card
  const handleSaveDetails = () => {
    setName(editName);
    setRole(editRole);
    setMail(editMail);
    setMobile(editMobile);
    setShowEditCard(false); // Hide the edit card after saving
    alert("Profile details updated successfully!");
  };

  const handleRemoveProfileImage = () => {
    setProfileImage(avatar);
    localStorage.setItem("profileImage", avatar);
    window.dispatchEvent(new Event("profileImageUpdated"));
  };

  return (
    <>
      <div className={`profile-container ${showEditCard ? "shift-left" : ""}`}>
        {/* Left Profile Card */}
        <div className="profile-card">
          <div className="profile-photo">
            {profileImage && profileImage !== avatar ? (
              <img className="profile_img" src={profileImage} alt="Profile" />
            ) : (
              <div className="profile-initials">{name.charAt(0).toUpperCase()}</div>
            )}

            {/* Remove Profile Icon */}
            {profileImage && profileImage !== avatar && (
              <img
                src={removeIcon}
                alt="Remove"
                className="remove-profile-icon"
                onClick={handleRemoveProfileImage}
              />
            )}
          </div>

          <h2 className="profile-name">{name}</h2>
          <p className="profile-role">Role: {role}</p>
          <p className="profile-location">Email: {mail}</p>
          <p className="profile-role">Phone: {mobile}</p>

          <div className="divider-container">
            <div className="profile-divider"></div>
          </div>

          <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
            Upload picture
          </button>
      
          <div className="divider-container">
            <div className="profile-divider"></div>
          </div>

          <button className="edit-btn" onClick={() => setShowEditCard(true)}>Edit</button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Right Profile Edit Form */}
        {showEditCard && (
          <div className="profile-edit-card">
            <h2 className="profile-title">Profile</h2>
            <p className="profile-subtitle">The information can be edited</p>

            <div className="profile-form">
              <div className="input-group">
                <label>Name:</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>

              <div className="input-group">
                <label>Role:</label>
                <input type="text" value={editRole} onChange={(e) => setEditRole(e.target.value)} />
              </div>

              <div className="input-group">
                <label>Email address: </label>
                <input type="email" value={editMail} onChange={(e) => setEditMail(e.target.value)} />
              </div>

              <div className="input-group">
                <label>Phone number:</label>
                <input type="text" value={editMobile} onChange={(e) => setEditMobile(e.target.value)} />
              </div>
            </div>

            <button className="save-btn" onClick={handleSaveDetails}>Save details</button>
          </div>
        )}
      </div>

     {/* 🖼️ Compact Cropper Modal */}
<div className={`cropper-modal ${cropperVisible ? "show" : ""}`}>
  <div className="cropper-modal-content">
    <h2 className="cropper-header">Crop Your Photo</h2>
    <div className="cropper-container">
      <Cropper
        ref={cropperRef}
        src={imageToCrop}
        style={{ height: "220px", width: "100%" }} /* 👈 Reduced size */
        aspectRatio={1}
        guides={false} /* Removes unnecessary grid lines */
      />
    </div>
    <div className="cropper-actions">
      <button onClick={handleSaveCrop} className="btn-save-crop">Save</button>
      <button onClick={() => setCropperVisible(false)} className="btn-cancel-crop">Cancel</button>
    </div>
  </div>
</div>


    </>
  );
}

export default ProfileCard;
