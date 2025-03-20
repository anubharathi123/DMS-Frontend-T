import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import avatar from "../../assets/images/candidate-profile.png";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import authService from "../../ApiServices/ApiServices";
import removeIcon from "../../assets/images/remove_icon.png";
import editIcon from "../../assets/images/edit_icon.png";
import { useParams } from "react-router-dom";

function ProfileCard() {
  
  const [cropperVisible, setCropperVisible] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [mail, setMail] = useState("");
    const [iconColor, setIconColor] = useState("#000");
  
  const [mobile, setMobile] = useState("");
  const [imageToCrop, setImageToCrop] = useState(null);
  const cropperRef = useRef();
  const fileInputRef = useRef();
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage"));

  // State variables for editing
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editMail, setEditMail] = useState("");
  const [editMobile, setEditMobile] = useState("");

  // State for handling transitions
  const [showEditCard, setShowEditCard] = useState(false);
  useEffect(() => {
    // localStorage.removeItem("profileImage");
    const updateProfileImage = async () =>  {
      setProfileImage(localStorage.getItem("profileImage"));
      };
      const fetchProfileDetails = async () => {
        try {
          // const response = await authService.details();
          const image = await authService.getprofile();
          // console(image.profile_image.image);
          try{
            console.log("Profile image response:",(image.profile_image) );
            const url = (image.profile_image.image);
            console.log("Profile image URL:", url);
            const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
            // Ensure no double slashes in the URL
            const fullImageUrl = `${baseUrl.replace(/\/$/, "")}${url}`;
          
            setProfileImage(fullImageUrl);
            localStorage.setItem("profileImage", fullImageUrl);
          }
          catch(error){
            console.log("Profile image response:",(image.organization_image.image) );
            const url = (image.organization_image.image);
            console.log("Profile image URL:", url);
            const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
            // Ensure no double slashes in the URL
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
    const updateProfileImage = () => {
      setProfileImage(localStorage.getItem("profileImage"));
    };

    const fetchProfileDetails = async () => {
      try {
        const details_data = await authService.details();
        console.log(details_data)
        if (details_data.type === "User") {
          console.log('user')
          setName(details_data.details[1].first_name)
          console.log(name)
          setMail(details_data.details[1].email)
          console.log(mail)
          // localStorage.setItem('name', name);
          setRole(details_data.details[5].name)
          console.log(role)
          setMobile(details_data.details[3].mobile)
          console.log(mobile)
          // localStorage.setItem('role', fetchedRole);
          // setRole(fetchedRole);
          setEditName(details_data.details[1].first_name);
          setEditRole(details_data.details[5].name);
          setEditMail(details_data.details[1].email);
          setEditMobile(details_data.details[3].mobile);
        }
        // eslint-disable-next-line no-cond-assign
        if (details_data.type === "Organization") {
          console.log('Org')
          setName(details_data.details[5].first_name)
          console.log(name)
          setMail(details_data.details[5].email)
          console.log(mail)
          setMobile(details_data.details[1].mobile)
          console.log(mail)
          // localStorage.setItem('name', name);
          const fetchedRole = details_data.details[3].name
          localStorage.setItem('Company_name', name);
          // console.log(fetchedRole)
          if (fetchedRole === 'ADMIN'){
            localStorage.setItem('role', fetchedRole);
            setRole(fetchedRole);
          }
          if (fetchedRole === 'Organization Admin'){
            localStorage.setItem('role', 'ADMIN');
            setRole('ADMIN');
          }
            // setName(name);
            // setRole(role);
            // setMail(mail);
            // setMobile(mobile);

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
  // const handleSaveDetails = async (id) => {
  //   try {
  //     const response = await authService.saveprofile(id ,{editMobile,editMail,editRole,editName});
  //     console.log("Profile Update Response:",response.id)
  //     if(response.id) {
  //       const p = response.details_data;
  //       console.log(p);

  //       const saveprofile = {
  //         first_name:p.details[5].first_name,
  //         role:p.details[3].name,
  //         email:p.details[5].email,
  //         mobile:p.details[1].mobile,
  //       }
  //       setShowEditCard(saveprofile);
  //     }
  //   } catch (error) {
     
  //   } finally {

  //   }

  //   setName(editName);
  //   setRole(editRole);
  //   setMail(editMail);
  //   setMobile(editMobile);
  //   setShowEditCard(false); // Hide the edit card after saving
  //   alert("Profile details updated successfully!");
  // };


  const handleSaveDetails = async () => {
    try {
      // Fetch user details to get the correct user ID
      const data = await authService.details();
      let userId = null;
  
      if (data.type === "User") {
        userId = data.details[5].id;
      } else if (data.type === "Organization") {
        userId = data.details[1].id;
      }
  
      if (!userId) {
        console.error("User ID not found.");
        alert("Error: User ID is missing.");
        return;
      }
  
      // Prepare updated profile data
      const updatedProfile = {
        first_name: editName,
        // role: editRole,
        email: editMail,
        mobile: editMobile,
      };
  
      // Send update request
      const response = await authService.saveprofile(userId, updatedProfile);
      console.log("Profile Update Response:", response);
  
      if (response) {
        // Update profile details in state
        setName(editName);
        setRole(editRole);
        setMail(editMail);
        setMobile(editMobile);
  
        setShowEditCard(false); // Hide the edit form
        alert("Profile details updated successfully!");
      } else {
        alert("Failed to update profile details.");
      }
    } catch (error) {
      console.error("Error updating profile details:", error);
      alert("An error occurred while updating profile details.");
    }
  };
  


  const handleRemoveProfileImage = async () => {
    const data = await authService.details();
    console.log(data);
    let id = data.details[3]?.id || data.details[1]?.id;
    console.log(id);
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

  return (
    <>
      <div className={`profile-container ${showEditCard ? "shift-left" : ""}`}>
        {/* Left Profile Card */}
        <div className="profile-card">
          <div className="profile-photo">
            {profileImage && profileImage !== avatar ? (
              <img className="profile_img" src={profileImage} alt="Profile" />
            ) : (
              <div className="profile-initials" style={{ background: iconColor }}>{getInitials(name)}</div>
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

                      <h2 className="profile-name">{capitalizeFirst(name)}</h2>
                      <p className="profile-role">Role: {role}</p>
                      <p className="profile-location">Email: {mail}</p>
                      <p className="profile-role">Phone: {mobile}</p>

                      {(!profileImage || profileImage === avatar) && (
                      <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
                      <img className="upload-photo" src={editIcon}></img>
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
                        if (file.size > 5 * 1024 * 1024) { // Limit file size to 5MB
                        alert("File size exceeds the 5MB limit. Please upload a smaller image.");
                        e.target.value = ""; // Reset the input value
                        return;
                        }
                        if (file.type.startsWith("image/")) {
                        handleImageChange(e);
                        } else {
                        alert("Please upload a valid image file.");
                        e.target.value = ""; // Reset the input value
                        }
                      }
                      }}
                      />
                    
                  
                  
                </div>

                {/* Right Profile Edit Form */}
        {showEditCard && (
          <div className="profile-edit-card">
            <h2 className="profile-title">Profile</h2>
          {/* <p className="profile-subtitle">The information can be edited</p>*/}

                <div className="profile-form">
                  <div className="input-group">
                  <label>Name:</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => {
                      const value = e.target.value.trimStart(); // Prevent leading spaces
                      if (/^[a-zA-Z\s]*$/.test(value)) {
                        setEditName(value);
                      }
                    }} 
                    onBlur={() => {
                      if (!editName.trim()) {
                        alert("Empty Name Input Field cannot be saved") // Set a default name or keep the previous value
                      }
                    }}
                  />

                  </div>

                  <div className="input-group">
                  <label>Role:</label>
                  {/* onChange={(e) => setEditRole(e.target.value)} */}
                <input type="text" value={editRole}  disabled/>
              </div>

              <div className="input-group">
                <label>Email address: </label>
                {/* onChange={(e) => setEditMail(e.target.value)} */}
                <input type="email" value={editMail}  disabled />
              </div>

              <div className="input-group">
                <label>Phone number:</label>
                <input type="tel" value={editMobile} maxLength="10" onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '');
                  setEditMobile(numericValue);
                }} />
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
