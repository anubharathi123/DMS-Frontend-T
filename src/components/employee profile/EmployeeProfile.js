import React from 'react';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  // Static employee data
  const name = "John Doe"; 
  const role = "Software Engineer"; 
  const email = "john.doe@example.com"; 
  const mobile = "+1234567890"; 

  return (
    <div className="employee-profile-body">
      <div className="employee-profile-container">
       
        <div className="employee-profile-title">Profile Page</div>

        {/* Header Section */}
        <div className="employee-profile-header">
          <div className="employee-profile-profileSection">
            <div className="employee-profile-profilePicContainer">
              <img
                src="https://via.placeholder.com/100"
                alt="Profile"
                className="employee-profile-profilePic"
              />
            </div>
            <div className="employee-profile-name">{name || "Name of the Employee"}</div>
          </div>
          <div className="employee-profile-line"></div>
        </div>

        {/* Employee Info Section */}
        <div className="employee-profile-infoContainer">
          <div className="employee-profile-infoRow">
            <div className="employee-profile-label">Role:</div>
            <div>{role}</div>
          </div>

          <div className="employee-profile-infoRow">
            <div className="employee-profile-label">Email:</div>
            <div>{email}</div>
          </div>

          <div className="employee-profile-infoRow">
            <div className="employee-profile-label">Mobile:</div>
            <div>{mobile}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
