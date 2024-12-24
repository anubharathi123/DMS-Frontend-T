
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
    <div className="company-register-container">
      <h2 className="company-register-title">Company Register</h2>
      <form  onSubmit={handleSubmit}>
        {/* Username */}
        <div className="company-form-group">
          <label className="username-label">
            Username<span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={company.username}
            onChange={handleChange}
            className="username-input"
            required
          />
        </div>

        {/* Company Name */}
        <div className="company-form-group">
          <label className="company-label">
            Company Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={company.companyName}
            onChange={handleChange}
            className="company-name-input"
            required
          />
        </div>

        {/* Person Name */}
        <div className="company-form-group">
          <label className="person-label">
            Person Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="personName"
            value={company.personName}
            onChange={handleChange}
            className="person-name-input"
            required
          />
        </div>

        {/* Mobile */}
        <div className="company-form-group">
          <label className="mobile-label">
            Mobile <span className="mandatory">*</span>
          </label>
          <input
            type="tel"
            name="mobile"
            value={company.mobile}
            onChange={handleChange}
            className="mobile-input"
            required
          />
        </div>

        {/* Email */}
        <div className="company-form-group">
          <label className="mailId-label">
            Mail ID <span className="mandatory">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={company.email}
            onChange={handleChange}
            className="email-input"
            required
          />
        </div>

        {/* Access Creation Date */}
        <div className="company-form-group">
          <label className="acd-label">
            Access Creation Date <span className="mandatory">*</span>
          </label>
          <input
            type="date"
            name="accessCreationDate"
            value={company.accessCreationDate}
            onChange={handleChange}
            className="accessCreationDate"
            required
          />
        </div>

        {/* Access Expiry Date */}
        <div className="company-form-group">
          <label className="aed-label">
            Access Expiry Date <span className="mandatory">*</span>
          </label>
          <input
            type="date"
            name="accessExpiryDate"
            value={company.accessExpiryDate}
            onChange={handleChange}
            className="accessExpiryDate"
            required
          />
        </div>

        {/* Attach Contract Document */}
        <div className="company-form-group">
          <label className="atcd-label">
            Attach Contract Document <span className="mandatory">*</span>
          </label>
          <div
            className={`file-upload-area ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <div className="upload-container">
              <FaCloudUploadAlt className="upload-icon" />
              {contractDocuments.length === 0 ? (
                <p>Drag & Drop files here</p>
              ) : (
                <div className="file-names">
                  {contractDocuments.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => handleRemoveFile(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              className="file-input"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Button Group */}
        <div className="button-group">
          <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="btn-submit">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CompanyCreation;
