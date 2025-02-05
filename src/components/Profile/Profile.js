import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import avatar from "../../assets/images/candidate-profile.png";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ProfileEdit from "../../assets/images/edit_icon.png";
import authService from "../../ApiServices/ApiServices";

function ProfileCard(props) {
  const [cropperVisible, setCropperVisible] = useState(false);
  const [name,setName]=useState("");
  const [role,setRole]=useState("");
  const [mail,setMail]=useState("");
  const [mobile,setMobile]=useState("");
  const [imageToCrop, setImageToCrop] = useState(null);
  const cropperRef = useRef();
  const fileInputRef = useRef();
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || avatar);


  useEffect(() => {
    const updateProfileImage = () => {
      setProfileImage(localStorage.getItem("profileImage") || avatar);
    };

    const fetchProfileDetails = async () => {
      try {
        const response = await authService.details();
        if (response?.details) {
          setName(response.details[1]?.first_name || "N/A");
          setRole(response.details[5]?.name || "Unknown");
          setMail(response.details[1]?.email || "No email provided");
          setMobile(response.details[3]?.mobile || "No mobile provided");
        }
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    window.addEventListener("profileImageUpdated", updateProfileImage);
    fetchProfileDetails();

    return () => window.removeEventListener("profileImageUpdated", updateProfileImage);
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

  const handleSaveCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedDataUrl = croppedCanvas.toDataURL();

      localStorage.setItem("profileImage", croppedDataUrl);
      setProfileImage(croppedDataUrl);

      // 🔥 Notify all components that the profile image has changed
      window.dispatchEvent(new Event("profileImageUpdated"));

      setCropperVisible(false);
      alert("Profile image has been successfully changed.");
    }
  };

  const formattedRole = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "Unknown";
  const isAdminOrDocumentRole = ['ADMIN', 'UPLOADER', 'APPROVER', 'REVIEWER', 'VIEWER'].includes(role);
  

  return (
    <>
      { role === "PRODUCT_OWNER" && (
      <><h1 className="profile-title">Profile</h1><div className="card-container">
          <header className="profile-header">
            <img className="profile_img" src={profileImage} alt="Profile" />
            <button className="edit_photo" onClick={() => fileInputRef.current.click()}>
              <img className="profile_edit" src={ProfileEdit} alt="Edit Profile" />
              <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
            </button>
          </header>
          <h1 className="bold-text">{name}</h1>
          <h2 className="normal-text">{formattedRole}</h2>
          <h2 className="normal-text">{mail}</h2>
          <h2 className="normal-text">{mobile}</h2>

          {cropperVisible && (
            <div className="cropper-modal">
              <div className="cropper-modal-content">
                <h2 className="cropper-header">Crop Your Photo</h2>
                <Cropper src={imageToCrop} ref={cropperRef} style={{ height: "300px", width: "100%" }} aspectRatio={1} guides={true} />
                <div className="cropper-actions">
                  <button onClick={handleSaveCrop} className="btn-save-crop">Save Changes</button>
                  <button onClick={() => setCropperVisible(false)} className="btn-cancel-crop">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div></>
    )}

{(isAdminOrDocumentRole) && (
      <><h1 className="profile-title">Profile</h1><div className="card-container">
          <header className="profile-header">
            <img className="profile_img" src={profileImage} alt="Profile" />
            <button className="edit_photo" onClick={() => fileInputRef.current.click()}>
              <img className="profile_edit" src={ProfileEdit} alt="Edit Profile" />
              <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
            </button>
          </header>
          <h1 className="bold-text">{name}</h1>
          <h2 className="normal-text">Role:{formattedRole}</h2>
        
          <h2 className="normal-text">Mail ID: {mail}</h2>
          <h2 className="normal-text">Mobile: {mobile}</h2>

          {cropperVisible && (
            <div className="cropper-modal">
              <div className="cropper-modal-content">
                <h2 className="cropper-header">Crop Your Photo</h2>
                <Cropper src={imageToCrop} ref={cropperRef} style={{ height: "300px", width: "100%" }} aspectRatio={1} guides={true} />
                <div className="cropper-actions">
                  <button onClick={handleSaveCrop} className="btn-save-crop">Save Changes</button>
                  <button onClick={() => setCropperVisible(false)} className="btn-cancel-crop">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div></>
    )}
    </>
  );
}

export default ProfileCard;
