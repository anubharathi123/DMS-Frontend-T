import React, { useState } from 'react';
import './CompanyCreation.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import authService from '../../ApiServices/ApiServices';

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
  const [error, setError] = useState(null); // For error handling

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
      setFileInputClicked(true); // Mark that a file is selected
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
      setFileInputClicked(true); // Mark that a file is selected
    }
  };

  // Removes a specific file without triggering the file input dialog
  const handleRemoveFile = () => {
    setContractDocuments([]); // Remove the file
    setFileInputClicked(false); // Prevent the file input dialog from popping up
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { ...company, contractDocuments };

    try {
      await authService.createCompany(formData); // Call the API service
      alert('Company registered successfully!');
      // Reset the form after successful submission
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
    } catch (error) {
      setError(error.message || 'Something went wrong.'); // Display error if API call fails
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
    setContractDocuments([]);
    setFileInputClicked(false);
  };

  // Triggers file input dialog when clicking anywhere on the upload area
  const handleUploadClick = () => {
    if (!fileInputClicked) { // Only trigger file input if no file is selected
      document.getElementById("file-input").click();
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
              className={`company-creation-upload-area ${dragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick} // Trigger file dialog on click anywhere in the area
            >
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                className="company-creation-file-input"
                hidden
              />
              <div className="company-creation-upload-text">
                <FaCloudUploadAlt />
                {fileInputClicked ? (
                  <div className="company-creation-file-name">
                    {contractDocuments[0].name}
                    {/* Cross button to remove the file */}
                    <span
                      className="company-creation-remove-icon"
                      onClick={handleRemoveFile}
                    >
                      &#10005;
                    </span>
                  </div>
                ) : (
                  <>
                    Drag and drop or browse&nbsp;<a href="#!" onClick={handleUploadClick}> here</a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="company-creation-error">{error}</div>}

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
    </div>
  );
};

export default CompanyCreation;
