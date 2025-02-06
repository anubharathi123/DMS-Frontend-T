import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import avatar from "../../assets/images/candidate-profile.png";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ProfileEdit from "../../assets/images/edit_icon.png";
import authService from "../../ApiServices/ApiServices";

function ProfileCard() {
  const [cropperVisible, setCropperVisible] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [mail, setMail] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);
  const cropperRef = useRef();
  const fileInputRef = useRef();
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || avatar);

  useEffect(() => {
    const updateProfileImage = () => {
      setProfileImage(avatar);
    };

    const fetchProfileDetails = async () => {
      try {
        const response = await authService.details();
        if (response?.details) {
          setName(response.details[1]?.username || "N/A");
          setRole(response.details[5]?.name || "Unknown");
          setMail(response.details[1]?.email || "No email provided");
          setMobile(response.details[3]?.mobile || "No mobile provided");
        }
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };
    const fetchImage = async()=>{
      try{
      const image = await authService.getprofile();
        console.log("Profile image response:", image.profile_image.image);
        const url = image.profile_image.image;
        console.log("Profile image URL:", url);
            const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
            // Ensure no double slashes in the URL
            const fullImageUrl = `${baseUrl.replace(/\/$/, "")}${url}`;
          
            setProfileImage(fullImageUrl);
            // localStorage.setItem("profileImage", fullImageUrl);
      }
      catch(error){
        console.error("Error fetching profile details:", error);
      }
    }
    fetchImage();
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

  const handleSaveCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      croppedCanvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image", blob, "profile.jpg");

        try {
          const response = await authService.profile(formData);
          // localStorage.setItem("profileImage", croppedCanvas);
          // localStorage.setItem("profileImage", croppedDataUrl);
          console.log("Profile update response:", response);
          if (response) {
            const url = response.profile_image.image;
            console.log("Profile image URL:", url);
            const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
            // Ensure no double slashes in the URL
            const fullImageUrl = `${baseUrl.replace(/\/$/, "")}${response.profile_image.image}`;
          
            setProfileImage(fullImageUrl);
            localStorage.setItem("profileImage", fullImageUrl);
            window.dispatchEvent(new Event("profileImageUpdated"));
          
            alert("Profile image has been successfully changed.");
          } else {
            console.error("Failed to update profile image:", response.profile_image.image);
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

  const formattedRole = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "Unknown";
  const isAdminOrDocumentRole = ["ADMIN", "UPLOADER", "APPROVER", "REVIEWER", "VIEWER"].includes(role);
  const isProductOwner = role === "PRODUCT_OWNER";

  return (
    <>
      <h1 className="profile-title">Profile</h1>
      <div className="card-container">
        <header className="profile-header">
          <img className="profile_img" src={profileImage} alt="Profile" />
          <button className="edit_photo" onClick={() => fileInputRef.current.click()}>
            <img className="profile_edit" src={ProfileEdit} alt="Edit Profile" />
            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
          </button>
        </header>
        <h1 className="bold-text">{name}</h1>
        <h2 className="normal-text">Role: {formattedRole}</h2>
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
      </div>
    </>
  );
}

export default ProfileCard;
