import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyCreation.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Loader from "react-js-loader";
import authService from '../../ApiServices/ApiServices';
import apiServices from '../../ApiServices/ApiServices';


const CompanyCreation = () => {
  const [company, setCompany] = useState({
    username: 'AE-',
    companyName: '',
    personName: '',
    mobile: '',
    email: '',
    accessCreationDate: '',
    accessExpiryDate: '',
  });

  const [contractDocuments, setContractDocuments] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileInputClicked, setFileInputClicked] = useState(false);
  const [error, setError] = useState(null); // For error handling
  const [companyName, setCompanyName] = useState('');
  const [newNotification, setNewNotification] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);  
  

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  // Handles file selection (only one file at a time)
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Only take the first file
    if (file) {
      setContractDocuments(file); // Store the selected file
      setFileInputClicked(true); // Mark that a file is selected
    }
  };

  const handleCreateCompany = async () => {
    try {
      const response = await apiServices.createCompany({ name: companyName });
      
      if (response.success) {
        // Set notification when the company is successfully created
        setNewNotification({
          id: new Date().getTime(),
          action: 'Organization Created',
          entity_type: companyName,
          description: 'Organization has been created successfully.',
        });
      }
    } catch (error) {
      console.error('Company creation failed:', error);
    }
  };

  // Handles drag-over event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  // Handles drag-leave event
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handles drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const file = e.dataTransfer.files[0]; // Only take the first dropped file
    if (file) {
      setContractDocuments(file); // Replace the previous files with the selected one
      setFileInputClicked(true); // Mark that a file is selected
    }
  };

  // Removes a specific file without triggering the file input dialog
  const handleRemoveFile = () => {
    setContractDocuments(null); // Remove the file
    setFileInputClicked(false); // Prevent the file input dialog from popping up
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if contract document is uploaded
    if (!contractDocuments) {
      setError("Please upload the Master Services Agreement (MSA) before proceeding.");
      setTimeout(() => setError(null), 3000);
      return; // Stop form submission
    }
  
    const formData = new FormData();
    // Append company details to FormData
    Object.keys(company).forEach((key) => {
      formData.append(key, company[key]);
    });
  
    formData.append('contractDocuments', contractDocuments); // Append file to FormData
  
    setIsLoading(true);
  
    try {
      await authService.createOrganization(formData); // Call the API service
      alert('Company registered successfully!');
      navigate('/OrganizationList');
    } catch (error) {
      setError(error.message || 'Something went wrong.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false); // End loading
    }
  };
  

  // Handles cancel action
  const handleCancel = () => {
    setCompany({
      username: 'AE-',
      companyName: '',
      personName: '',
      mobile: '',
      email: '',
      accessCreationDate: '',
      accessExpiryDate: '',
    });
    setContractDocuments(null);
    setFileInputClicked(false);
  };

  // Triggers file input dialog when clicking anywhere on the upload area
  const handleUploadClick = () => {
    document.getElementById("file-input").click();
  };

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
              onChange={handleChange}
              className="company-creation-input"
              required
            />
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
              onChange={handleChange}
              className="company-creation-input"
              required
            />
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
              onChange={handleChange}
              className="company-creation-input"
              required
            />
          </div>

          {/* Mobile */}
          <div className="company-creation-form-group">
            <label className="company-creation-label">
              Mobile <span className="company-creation-mandatory">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={company.mobile}
              onChange={handleChange}
              className="company-creation-input"
              required
            />
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
              onChange={handleChange}
              className="company-creation-input"
              required
            />
          </div>

          {/* Contract Document */}
          <div className="company-creation-form-group">
            <label className="company-creation-label">
              Master Services Agreement(MSA) <span className="company-creation-mandatory">*</span>
            </label>
            <div className={`company-creation-upload-area ${dragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleUploadClick} // Trigger file dialog on single click
>
            <input type="file" id="file-input" onChange={handleFileChange} className="company-creation-file-input"
              hidden />
            <div className="company-creation-upload-text">
              <FaCloudUploadAlt />
              {fileInputClicked ? (
              <div className="company-creation-file-name">
              {contractDocuments.name}
              {/* Cross button to remove the file */}
              <span className="company-creation-remove-icon" onClick={handleRemoveFile}>
              &#10005;
              </span>
            </div>
          ) : (
        <p> Drag and drop or browse
        <a href="#!">
          here
        </a>
      </p>
    )}
  </div>
</div>
          </div>

          {/* Error Message */}
          {/* {error && <div className="company-creation-error">{error}</div>} */}

          {/* Submit and Cancel */}
          <div className="company-creation-buttons">
            <button type="submit" className="company-creation-submit">
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
            <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'}size={100} />
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyCreation;
