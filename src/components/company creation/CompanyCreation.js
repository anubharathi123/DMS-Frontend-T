import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyCreation.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Loader from "react-js-loader";
import authService from '../../ApiServices/ApiServices';
import apiServices from '../../ApiServices/ApiServices';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Box } from "@mui/material"; // already imported
import { Typography, Switch } from '@mui/material';


const CompanyCreation = () => {
  const [company, setCompany] = useState({
    username: 'AE-',
    companyName: '',
    personName: '',
    mobile: '',
    email: '',
    companyType: '',
  });
const handleAuditToggle = (e) => {
  setCompany({ 
    ...company, 
    requiresAudit: e.target.checked,
    auditFrequency: e.target.checked ? company.auditFrequency : '',
    auditStartDate: e.target.checked ? company.auditStartDate : ''
  });
};

  const [contractDocuments, setContractDocuments] = useState(null);
  // const [dragging, setDragging] = useState(false);
  const [fileInputClicked, setFileInputClicked] = useState(false);
  const [error, setError] = useState(null); // For error handling
  // const [companyName, setCompanyName] = useState('');
  // const [newNotification, setNewNotification] = useState(null);
  const navigate = useNavigate();
  // const [ showinfo , setshowinfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  
  

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target || {};
    setCompany({ ...company, [name]: value });
  };

  const handlePhoneChange = (value) => {
    setCompany({ ...company, mobile: value });
  };

  // Handles file selection (only one file at a time)
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0]; // Only take the first file
  //   if (file) {
  //     setContractDocuments(file); // Store the selected file
  //     setFileInputClicked(true); // Mark that a file is selected
  //   }
  // };

  // const handleCreateCompany = async () => {
  //   try {
  //     const response = await apiServices.createCompany({ name: companyName });
      
  //     if (response.success) {
  //       // Set notification when the company is successfully created
  //       setNewNotification({
  //         id: new Date().getTime(),
  //         action: 'Organization Created',
  //         entity_type: companyName,
  //         description: 'Organization has been created successfully.',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Company creation failed:', error);
  //   }
  // };

  // Handles drag-over event
  // const handleDragOver = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragging(true);
  // };

  // // Handles drag-leave event
  // const handleDragLeave = () => {
  //   setDragging(false);
  // };

  // Handles drop event
  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragging(false);
  //   const file = e.dataTransfer.files[0]; // Only take the first dropped file
  //   if (file) {
  //     setContractDocuments(file); // Replace the previous files with the selected one
  //     setFileInputClicked(true); // Mark that a file is selected
  //   }
  // };

  // Removes a specific file without triggering the file input dialog
  // const handleRemoveFile = () => {
  //   setContractDocuments(null); // Remove the file
  //   setFileInputClicked(false); // Prevent the file input dialog from popping up
  // };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if contract document is uploaded
    // if (!contractDocuments) {
    //   setError("Please upload the Master Services Agreement (MSA) before proceeding.");
    //   setTimeout(() => setError(null), 3000);
    //   return; // Stop form submission
    // }
  
    const formData = new FormData();
    // Append company details to FormData
    Object.keys(company).forEach((key) => {
      formData.append(key, company[key]);
    });
  
    // formData.append('contractDocuments', contractDocuments); // Append file to FormData
  
    setIsLoading(true);
  
    try {
      const response = await authService.createOrganization(formData); // Call the API service
      alert('Company registered successfully!');
      console.log("Create Response", response)
      navigate('/MsiPending');
    } catch (error) {
      setError(error.message || 'Something went wrong.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false); // End loading
    }
  };
  
  // const handleInfo = () => {
  //   setshowinfo(!showinfo);
  // }

  // Handles cancel action
  const handleCancel = () => {
    setCompany({
      username: 'AE-',
      companyName: '',
      personName: '',
      mobile: '',
      email: '',
    });
    setContractDocuments(null);
    setFileInputClicked(false);
    navigate('/OrganizationList');
  };

  // Triggers file input dialog when clicking anywhere on the upload area
  // const handleUploadClick = () => {
  //   document.getElementById("file-input").click();
  // };

  const isFormValid = Object.values(company).every((value) =>
  typeof value === 'string' ? value.trim() !== '' : true
);


  return (
    <div className="company-creation-container">
      <div className="company-creation-inner-container">
        <h2 className="company-creation-title1">Company Hub</h2>
        {error && (
          <div className="documentapproval_message bg-red-100 text-red-800 px-4 py-2 rounded mb-4" role="alert">
            {error}
          </div>
        )}
        <form className="company-creation-form" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="company-creation-form-group">
            <label className="company-creation-label">
              Username<span className="company-creation-mandatory">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={company.username}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length > 100) {
                  setError("Username is too lengthy");
                  setTimeout(() => setError(null), 3000);
                } else if (/^[a-zA-Z0-9-_]*$/.test(value) || value === '') {
                  handleChange(e);
                  setError(null);
                } else {
                  setError("Only alphanumeric characters, hyphen (-), and underscore (_) are allowed.");
                  setTimeout(() => setError(null), 3000);
                }
              }}
              className="company-creation-input"
              required
            />
            {/* <button className='input-info' onClick={handleInfo}><IoMdInformationCircleOutline /></button>
            {showinfo && (
                        <div className='input-info-popup'>
                          Only alphanumeric characters, hyphen (-), and underscore (_) are allowed.
                          </div>
                      )} */}
          </div>

          {/* Company Name */}
          <div className="company-creation-form-group">
            <label className="company-creation-label">
              Company Name <span className="company-creation-mandatory">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={company.companyName}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length > 500) {
                  setError("Company Name is too long");
                  setTimeout(() => setError(null), 3000);
                } else if (/^[a-zA-Z0-9\s]*$/.test(value) || value === '') {
                  // Allow only letters, numbers, and spaces
                  handleChange(e);
                  setError(null);
                } else {
                  setError("Special Characters are not allowed.");
                  setTimeout(() => setError(null), 5000);
                }
              }}
              className="company-creation-input"
              required
            />
            {/* <button className='input-info' onClick={handleInfo}><IoMdInformationCircleOutline /></button>
            {showinfo && (
                        <div className='input-info-popup'>
                          Special Characters are not allowed.
                          </div>
                      )} */}
          </div>

          {/* Person Name */}
                      <div className="company-creation-form-group">
                      <label className="company-creation-label">
                        Person Name <span className="company-creation-mandatory">*</span>
                      </label>
                      <input
                        type="text"
                        name="personName"
                        value={company.personName}
                        onChange={(e) => {
                        const value = e.target.value;
                        if (value.length > 100) {
                          setError("Person Name is too long");
                          setTimeout(() => setError(null), 3000);
                        } else if (/^[\p{L}\s]*$/u.test(value) || value === '') {
                          // Allow letters (including non-English characters) and spaces
                          handleChange(e);
                          setError(null);
                        } else {
                          setError("Only alphabetic characters and spaces are allowed.");
                          setTimeout(() => setError(null), 3000);
                        }
                        }}
                        className="company-creation-input"
                        required
                      />
                      {/* <button className='input-info' onClick={handleInfo}><IoMdInformationCircleOutline /></button> */}
                      {/* {showinfo && (
                        <div className='input-info-popup'>
                          Only alphabetic characters and spaces are allowed.
                          </div>
                      )} */}
                      </div>
  {/* Company Type */}
<div className="company-creation-form-group">
  <label className="company-creation-label">
    Company Type <span className="company-creation-mandatory">*</span>
  </label>
  <select
    name="companyType"
    value={company.companyType}
    onChange={handleChange}
    className="company-type-dropdown"
    required
  >
    <option value="">Select Company Type</option>
    <option value="FREEZONE">Freezone</option>
    <option value="MAINLAND">Mainland</option>
    <option value="WAREHOUSE">Warehouse</option>
    <option value="BROKER">Broker</option>
  </select>
</div>

                      {/* Mobile */}
          <div className="company-creation-form-group">
            <label className="company-creation-label">
              Mobile <span className="company-creation-mandatory">*</span>
            </label>
            <div className="company-phone-input">
              <PhoneInput
                className="phone"
                country={'ae'}
                onChange={(value) => {
                  if (value.length > 15) {
                    setError("Invalid Phone Number");
                    setTimeout(() => setError(null), 3000);
                  } else if (/^\d+$/.test(value) || value === '') {
                    handlePhoneChange(value);
                    setError(null);
                  } else {
                    setError("Only numbers are allowed to enter.");
                    setTimeout(() => setError(null), 3000);
                  }
                }}
                enableSearch
                required
                countryCodeEditable={false}
              />
            </div>
            {/* <button className='input-info'><IoMdInformationCircleOutline /></button> */}
          </div>

          {/* Email */}
                <div className="company-creation-form-group">
                <label className="company-creation-label">
                  Mail ID <span className="company-creation-mandatory">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={company.email}
                  onChange={(e) => {
                  const value = e.target.value;
                  if (value.length > 320) {
                    setError("Invalid Email ID");
                    setTimeout(() => setError(null), 3000);
                  } else if ( /^[\p{L}\p{N}@._-]*$/u.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === '') {
                    // Allow letters, numbers, @, ., _, and - (including non-English characters)
                    handleChange(e);
                    setError(null);
                  } else {
                    setError("Invalid characters in Email ID.");
                    setTimeout(() => setError(null), 3000);
                  }
                  }}
                  className="company-creation-input"
                  required
                />
                {/* <button className='input-info'><IoMdInformationCircleOutline /></button> */}
                </div>
<div className="company-creation-form-group">
  <label className="company-creation-label">
    Require Audit Service
  </label>
  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginRight: '1000px' }}>
  <Switch
    checked={company.requiresAudit}
    onChange={handleAuditToggle}
    color="primary"
    size="small"
    inputProps={{ 'aria-label': 'audit toggle' }}
  />
</div>

</div>





                {/* Submit and Cancel */}
          <div className="company-creation-buttons">
            <button type="submit" className="company-creation-submit" disabled={!isFormValid}>
              Create
            </button>
            <button type="button" onClick={handleCancel} className="company-creation-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="loading-popup">
          <div className="loading-popup-content">
            <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'} size={100} />
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyCreation;
