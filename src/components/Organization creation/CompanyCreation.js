import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyCreation.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Loader from 'react-js-loader';
import authService from '../../ApiServices/ApiServices';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileImage, faFileVideo, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const CompanyCreation = () => {
  const [company, setCompany] = useState({
    username: 'AE-',
    companyName: '',
    firstname:'',
    Lastname: '',
    personName: '',
    mobile: '',
    email: '',
    accessCreationDate: '',
  });

  const [contractDocuments, setContractDocuments] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileInputClicked, setFileInputClicked] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setContractDocuments(file);
      setFileInputClicked(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setContractDocuments(file);
      setFileInputClicked(true);
    }
  };

  const handleRemoveFile = () => {
    setContractDocuments(null);
    setFileInputClicked(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(company).forEach((key) => {
      formData.append(key, company[key]);
    });
    setIsLoading(true);
    if (contractDocuments) {
      formData.append('contractDocuments', contractDocuments);
    }
    // Add personName as combination of firstname and Lastname
    formData.append('personName', `${company.firstname} ${company.Lastname}`);
    try {
      await authService.createOrganization(formData);
      alert('Company registered successfully!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Something went wrong.');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCompany({
      username: 'AE-',
      companyName: '',
      firstname:'',
      Lastname: '',
      personName: '',
      mobile: '',
      email: '',
      accessCreationDate: '',
    });
    setContractDocuments(null);
    setFileInputClicked(false);
  };

  const handleUploadClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div className="company-creation-container1">
      <div className="company-creation-inner-container1">
        <h2 className="company-creation-title">Company Creation</h2>
        {error && (
          <div className="documentapproval_message bg-red-100 text-red-800 px-4 py-2 rounded mb-4" role="alert">
            {error}
          </div>
        )}
        <form className="company-creation-form" onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="company-creation-form-group1">
              <label className="company-creation-label">
                First name<span className="company-creation-mandatory">*</span>
              </label>
              <input type="text" name="firstname" value={company.firstname} onChange={handleChange} className="company-creation-input1" required />
            </div>
            <div className="company-creation-form-group1">
              <label className="company-creation-label">
                Last Name <span className="company-creation-mandatory">*</span>
              </label>
              <input type="text" name="Lastname" value={company.Lastname} onChange={handleChange} className="company-creation-input1" required />
            </div>
          </div>
          <div className="company-creation-form-group1">
            <label className="company-creation-label">
              Username <span className="company-creation-mandatory">*</span>
            </label>
            <input type="text" name="username" value={company.username} onChange={handleChange} className="company-creation-input1" required />
          </div>
          <div className="company-creation-form-group1">
            <label className="company-creation-label">
              Company Name <span className="company-creation-mandatory">*</span>
            </label>
            <input type="text" name="companyName" value={company.companyName} onChange={handleChange} className="company-creation-input1" required />
          </div>
          <div className="company-creation-form-group1">
            <label className="company-creation-label">
              Mobile <span className="company-creation-mandatory">*</span>
            </label>
            <input type="tel" name="mobile" value={company.mobile} onChange={handleChange} className="company-creation-input1" required />
          </div>
          <div className="company-creation-form-group1">
            <label className="company-creation-label">
              Mail ID <span className="company-creation-mandatory">*</span>
            </label>
            <input type="email" name="email" value={company.email} onChange={handleChange} className="company-creation-input1" required />
          </div>
          <div className="company-creation-form-group1">
            <label className="company-creation-label">
              Creation Date <span className="company-creation-mandatory">*</span>
            </label>
            <input type="date" name="accessCreationDate" value={company.accessCreationDate} onChange={handleChange} className="company-creation-input1" required />
          </div>
          <div className="company-creation-form-group1">
            <label className="company-creation-label">
              Master Services Agreement (MSA) <span className="company-creation-mandatory">*</span>
            </label>
            <div 
              className={`company-creation-upload-area1 ${dragging ? 'dragging' : ''}`} 
              onDragOver={handleDragOver} 
              onDragLeave={handleDragLeave} 
              onDrop={handleDrop} 
              onClick={handleUploadClick}
            >
              <input 
                type="file" 
                id="file-input" 
                onChange={handleFileChange} 
                className="company-creation-file-input" 
                hidden 
              />
              <div className="company-creation-upload-text">
                <FaCloudUploadAlt className="upload-icon" />
                {fileInputClicked ? (
                  <div className="company-creation-file-name">
                    {contractDocuments.name}
                    <span className="company-creation-remove-icon" onClick={handleRemoveFile}>&#10005;</span>
                  </div>
                ) : (
                  <div>
                    <p>Drag your documents, photos, or videos here to start uploading.</p>
                    <p>-----------------OR-----------------</p>
                    <button className="browse-btn">Browse files</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="company-creation-buttons">
            <button type="submit" className="company-creation-submit">Create</button>
            <button type="button" onClick={handleCancel} className="company-creation-cancel">Cancel</button>
          </div>
        </form>
      </div>
      {isLoading && <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'} size={100} />}
    </div>
  );
};

export default CompanyCreation;