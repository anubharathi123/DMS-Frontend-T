import React, { useState } from 'react';
import './CompanyCreation.css';
import { FaCloudUploadAlt } from 'react-icons/fa';

const CompanyCreation = () => {
  const [company, setCompany] = useState({
    username: '',
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

  // Handles file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setContractDocuments([...contractDocuments, ...files]);
    setFileInputClicked(true);
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
    const files = Array.from(e.dataTransfer.files);
    setContractDocuments([...contractDocuments, ...files]);
    setFileInputClicked(true);
  };

  // Removes a specific file
  const handleRemoveFile = (index) => {
    const updatedFiles = contractDocuments.filter((_, i) => i !== index);
    setContractDocuments(updatedFiles);
    if (updatedFiles.length === 0) {
      setFileInputClicked(false);
    }
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { ...company, contractDocuments };
    console.log('Submitted Data:', formData);
    alert('Company registered successfully!');
    setCompany({
      username: '',
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
      username: '',
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

  // Triggers file input dialog when clicking the upload area
  const handleUploadClick = () => {
    if (!fileInputClicked) {
      document.getElementById('file-input').click();
    }
  };

  return (
    <div className="company-register-body">
      <div className="company-register-content">
        <h2 className="company-register-title">Company Register</h2>
        <form className="company-creation-form" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="company-creation-formdiv">
            <label className="company-creation-label">
              Username<span className="mandatory">*</span>
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
          <div className="company-creation-form">
            <label className="company-creation-label">
              Company Name <span className="mandatory">*</span>
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
          <div className="company-creation-form">
            <label className="company-creation-label">
              Person Name <span className="mandatory">*</span>
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
          <div className="company-creation-form">
            <label className="company-creation-label">
              Mobile <span className="mandatory">*</span>
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
          <div className="company-creation-form">
            <label className="company-creation-label">
              Mail ID <span className="mandatory">*</span>
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
          <div className="company-creation-dates">
            <div className="company-creation-form">
              <label className="company-creation-label">
                Access Creation Date <span className="mandatory">*</span>
              </label>
              <input
                type="date"
                name="accessCreationDate"
                value={company.accessCreationDate}
                onChange={handleChange}
                className="company-creation-input"
                required
              />
            </div>
            <div className="company-creation-form">
              <label className="company-creation-label">
                Access Expiry Date <span className="mandatory">*</span>
              </label>
              <input
                type="date"
                name="accessExpiryDate"
                value={company.accessExpiryDate}
                onChange={handleChange}
                className="company-creation-input"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div
            className={`company-creation-upload-container ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <FaCloudUploadAlt className="company-creation-upload-icon" />
            <span>Drag & drop documents here, or click to select</span>
            <input
              type="file"
              id="file-input"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {contractDocuments.length > 0 && (
              <div className="company-creation-file-names">
                {contractDocuments.map((file, index) => (
                  <div className="company-creation-file-item" key={index}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="company-craetion-remove-file-btn"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="company-creation-button-group">
            <button type="submit" className="btn-submit">
              Submit
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyCreation;
