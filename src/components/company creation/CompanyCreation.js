import React, { useState } from 'react';
import './CompanyCreation.css';
import { FaCloudUploadAlt } from 'react-icons/fa';

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

  const [contractDocuments, setContractDocuments] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [fileInputClicked, setFileInputClicked] = useState(false);

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  // Handles file selection (only one file at a time)
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Only take the first file
    if (file) {
      setContractDocuments([file]); // Replace the previous files with the selected one
      setFileInputClicked(true);
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
      setContractDocuments([file]); // Replace the previous files with the selected one
      setFileInputClicked(true);
    }
  };

  // Removes a specific file
  const handleRemoveFile = () => {
    setContractDocuments([]); // Remove the file
    setFileInputClicked(false); // Reset the file input click status
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { ...company, contractDocuments };
    console.log('Submitted Data:', formData);
    alert('Company registered successfully!');
    setCompany({
      username: 'AE-', 
      companyName: '',
      personName: '',
      mobile: '',
      email: '',
      accessCreationDate: '',
      accessExpiryDate: '',
    });
    setContractDocuments([]);
    setFileInputClicked(false);
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
    setContractDocuments([]);
    setFileInputClicked(false);
  };

  // Triggers file input dialog when clicking the upload text
  const handleUploadClick = (e) => {
    // Ensure the file input dialog only triggers when the span text is clicked
    if (e.target.classList.contains("company-creation-upload-text")) {
      if (!fileInputClicked) {
        document.getElementById("file-input").click();
      }
    }
  };

  return (
    <div className="company-creation-container">
      <div className="company-creation-inner-container">
        <h2 className="company-creation-title">Company Register</h2>
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

          {/* Date Inputs */}
          <div className="company-creation-date-group">
            <div className="company-creation-form-group">
              <label className="company-creation-label">
                Creation Date <span className="company-creation-mandatory">*</span>
              </label>
              <input
                type="date"
                name="accessCreationDate"
                value={company.accessCreationDate}
                onChange={handleChange}
                className="company-creation-date-input"
                required
              />
            </div>
          </div>

          {/* Contract Document */}
          <div className="company-creation-form-group">
            <label className="company-creation-label">
              Contract Document <span className="company-creation-mandatory">*</span>
            </label>
            <div
              className={`company-creation-upload-container ${dragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={(e) => handleUploadClick(e)}
            >
              <FaCloudUploadAlt className="company-creation-upload-icon" />
              {contractDocuments.length === 0 && (
                <span className="company-creation-upload-text">Drag & drop or select here</span>
              )}
              <input
                type="file" 
                id="file-input"
                onChange={handleFileChange}
                style={{ display: 'none' }}  // Hide the file input
              />
              {contractDocuments.length > 0 && (
                <div className="company-creation-file-names">
                  <div className="company-creation-file-item">
                    <span className="file-name">{contractDocuments[0].name}</span>
                    <button
                      type="button"
                      className="company-creation-remove-file-btn"
                      onClick={handleRemoveFile}
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="company-creation-button-group">
            <button type="submit" className="company-creation-submit-button">
              Create
            </button>
            <button type="button" className="company-creation-cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyCreation;
