import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import avatar from "../../assets/images/candidate-profile.png";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import authService from "../../ApiServices/ApiServices";
import removeIcon from "../../assets/images/remove_icon.png";
import editIcon from "../../assets/images/edit_icon.png";

function ProfileCard() {
  const [cropperVisible, setCropperVisible] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [mail, setMail] = useState("");
  const [iconColor, setIconColor] = useState("#000");
  const [mobile, setMobile] = useState("");
  const [imageToCrop, setImageToCrop] = useState(null);
  const [mobileError, setMobileError] = useState("");
  const cropperRef = useRef();
  const fileInputRef = useRef();
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage"));

  // State variables for editing
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editMail, setEditMail] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [showEditCard, setShowEditCard] = useState(false);

  // Refs for input fields
  const nameInputRef = useRef();
  const mobileInputRef = useRef();

  useEffect(() => {
    const updateProfileImage = async () => {
      setProfileImage(localStorage.getItem("profileImage"));
    };
    
    const fetchProfileDetails = async () => {
      try {
        const image = await authService.getprofile();
        try {
          const url = (image.profile_image.image);
          const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
          const fullImageUrl = `${baseUrl.replace(/\/$/, "")}${url}`;
          setProfileImage(fullImageUrl);
          localStorage.setItem("profileImage", fullImageUrl);
        } catch(error) {
          const url = (image.organization_image.image);
          const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
          const fullImageUrl = `${baseUrl.replace(/\/$/, "")}${url}`;
          setProfileImage(fullImageUrl);
          localStorage.setItem("profileImage", fullImageUrl);
        }
      } catch (error) {
        localStorage.setItem("profileImage", avatar);
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
    window.addEventListener("profileImageUpdated", updateProfileImage);
    return () => window.removeEventListener("profileImageUpdated", updateProfileImage);
  }, []);

  const getInitials = (name) => {
    if (!name.trim()) return "U";
    return name
      .split(" ")
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getRandomColor = () => {
    return localStorage.getItem('iconColor') || `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
  };

  useEffect(() => {
    setIconColor(getRandomColor());
  }, []);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const details_data = await authService.details();
        console.log(details_data)
        if (details_data.type === "User") {
          setName(details_data.details[1].first_name)
          setMail(details_data.details[1].email)
          setRole(details_data.details[5].name)
          setMobile(details_data.details[3].mobile)
          setEditName(details_data.details[1].first_name);
          setEditRole(details_data.details[5].name);
          setEditMail(details_data.details[1].email);
          setEditMobile(details_data.details[3].mobile);
        }
        if (details_data.type === "Organization") {
          setName(details_data.details[5].first_name)
          setMail(details_data.details[5].email)
          setMobile(details_data.details[1].mobile)
          const fetchedRole = details_data.details[3].name
          localStorage.setItem('Company_name', name);
          
          if (fetchedRole === 'ADMIN'){
            localStorage.setItem('role', fetchedRole);
            setRole(fetchedRole);
          }
          if (fetchedRole === 'Organization Admin'){
            localStorage.setItem('role', 'ADMIN');
            setRole('ADMIN');
          }

          setEditName(details_data.details[5].first_name);
          setEditRole(details_data.details[3].name);
          setEditMail(details_data.details[5].email);
          setEditMobile(details_data.details[1].mobile);
        }
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, []);

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

  const handleSaveDetails = async () => {
    if (editMobile.length !== 10) {
      setMobileError("Phone number must be exactly 10 digits");
      mobileInputRef.current?.focus();
      return;
    }

    try {
      const data = await authService.details();
      console.log(data, "data from profile card");
      let userId = null;
  
      if (data.type === "User") {
        userId = data.details[3].id;
      } else if (data.type === "Organization") {
        userId = data.details[1].id;
      }
  
      if (!userId) {
        console.error("User ID not found.");
        alert("Error: User ID is missing.");
        return;
      }
  
      const updatedProfile = {
        first_name: editName,
        email: editMail,
        mobile: editMobile,
      };
      console.log("Updated Profile Data:", updatedProfile);
  
      const response = await authService.saveprofile(userId, updatedProfile);
      console.log("Profile Update Response:", response);
  
      if (response) {
        setName(editName);
        setMail(editMail);
        setMobile(editMobile);
        setShowEditCard(false);
        setMobileError("");
        alert("Profile details updated successfully!");
      } else {
        alert("Failed to update profile details.");
      }
    } catch (error) {
      console.error("Error updating profile details:", error);
      alert("An error occurred while updating profile details.");
    }
  };

  const compressImage = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = (error) => reject(error);
      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds the 5MB limit. Please upload a smaller image.");
        e.target.value = "";
        return;
      }

      if (file.type.startsWith("image/")) {
        try {
          const compressedImage = await compressImage(file, 800, 800, 0.8);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageToCrop(reader.result);
            setCropperVisible(true);
          };
          reader.readAsDataURL(compressedImage);
        } catch (error) {
          console.error("Error compressing image:", error);
          alert("Failed to process the image. Please try again.");
        }
      } else {
        alert("Please upload a valid image file.");
        e.target.value = "";
      }
    }
  };

  const handleRemoveProfileImage = async () => {
    const data = await authService.details();
    let id = ""
    if (role === "ADMIN") {
      id = data.details[1]?.id;
    } else {
      id = data.details[3]?.id;
    }
    
    if (id) {
      await authService.delprofile(id);
      setProfileImage(avatar);
      localStorage.removeItem("profileImage");
      window.dispatchEvent(new Event("profileImageUpdated"));
    } else {
      console.error("No valid ID found for profile image removal.");
      alert("Error: No valid ID found for profile image removal.");
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setEditMobile(value);
      if (value.length === 10) {
        setMobileError("");
      } else {
        setMobileError(value.length > 0 ? "Phone number must be exactly 10 digits" : "");
      }
    }
  };

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (showEditCard && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showEditCard]);

  return (
    <>
      <div className={`profile-container ${showEditCard ? "shift-left" : ""}`}>
        <div className="profile-card">
          <div className="profile-photo">
            {profileImage && profileImage !== avatar ? (
              <img className="profile_img" src={profileImage} alt="Profile" />
            ) : (
              <div className="profile-initials" style={{ background: iconColor }}>{getInitials(name)}</div>
            )}

            {profileImage && profileImage !== avatar && (
              <img
                src={removeIcon}
                alt="Remove"
                className="remove-profile-icon"
                onClick={handleRemoveProfileImage}
              />
            )}
          </div>

          <h2 className="profile-name">{capitalizeFirst(name)}</h2>
          <p className="profile-role">Role: {role}</p>
          <p className="profile-location">Email: {mail}</p>
          <p className="profile-role">Phone: {mobile}</p>

          {(!profileImage || profileImage === avatar) && (
            <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
              <img className="upload-photo" src={editIcon} alt="Upload"></img>
            </button>
          )}
        
          <div className="divider-container">
            <div className="profile-divider"></div>
          </div>

          <button className="edit-btn" onClick={() => setShowEditCard(true)}>Edit</button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  alert("File size exceeds the 5MB limit. Please upload a smaller image.");
                  e.target.value = "";
                  return;
                }
                if (file.type.startsWith("image/")) {
                  handleImageChange(e);
                } else {
                  alert("Please upload a valid image file.");
                  e.target.value = "";
                }
              }
            }}
          />
        </div>

        {showEditCard && (
          <div className="profile-edit-card">
            <div className="edit-card-header">
              <h2 className="profile-title">Profile</h2>
              <button 
                className="close-edit-card"
                onClick={() => {
                  setShowEditCard(false);
                  setMobileError("");
                }}
              >
                <span className="close-icon">×</span>
              </button>
            </div>

            <div className="profile-form">
              <div className="input-group">
                <label>Name:</label>
                <input 
                  type="text" 
                  ref={nameInputRef}
                  value={editName} 
                  onChange={(e) => {
                    const value = e.target.value.trimStart();
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      setEditName(value);
                    } else {
                      alert("Special characters are not allowed");
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, mobileInputRef)}
                  onBlur={() => {
                    if (!editName.trim()) {
                      alert("Name cannot be empty");
                    }
                  }}
                />
              </div>

              <div className="input-group">
                <label>Role:</label>
                <input 
                  type="text" 
                  value={editRole} 
                  disabled
                  tabIndex="-1"
                />
              </div>

              <div className="input-group">
                <label>Email address: </label>
                <input 
                  type="email" 
                  value={editMail} 
                  disabled
                  tabIndex="-1"
                />
              </div>

              <div className="input-group">
                <label>Phone number:</label>
                <input 
                  type="tel" 
                  ref={mobileInputRef}
                  value={editMobile} 
                  onChange={handleMobileChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveDetails();
                    }
                  }}
                  maxLength="10"
                  placeholder="Enter 10-digit number"
                />
                {mobileError && <span className="error-message">{mobileError}</span>}
              </div>
            </div>

            <button 
              className="save-btn" 
              onClick={handleSaveDetails}
              disabled={
                (editName === name && editMobile === mobile) ||
                !editName.trim() ||
                editMobile.length !== 10
              }
            >
              Save details
            </button>
            <button 
              className="cancelbtn" 
              onClick={() => {
                setShowEditCard(false);
                setMobileError("");
              }}
            >
              Cancel
            </button> 
          </div>
        )}
      </div>

      <div className={`cropper-modal ${cropperVisible ? "show" : ""}`}>
        <div className="cropper-modal-content">
          <h2 className="cropper-header">Crop Your Photo</h2>
          <div className="cropper-container">
            <Cropper
              ref={cropperRef}
              src={imageToCrop}
              style={{ height: "220px", width: "100%" }}
              aspectRatio={1}
              guides={false}
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