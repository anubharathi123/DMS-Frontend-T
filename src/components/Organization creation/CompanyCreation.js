import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Button, CircularProgress } from "@mui/material";
import { FaCloudUploadAlt } from 'react-icons/fa';
import Loader from 'react-js-loader';
import authService from '../../ApiServices/ApiServices';
// import './CompanyCreation.css';
const CompanyCreation = () => {
  const [company, setCompany] = useState({
    username: 'AE-',
    companyName: '',
    firstname:'',
    Lastname: '',
    mobile: '',
    email: '',
    accessCreationDate: '',
  });

  const [contractDocuments, setContractDocuments] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setContractDocuments(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(company).forEach((key) => formData.append(key, company[key]));
    if (contractDocuments) formData.append('contractDocuments', contractDocuments);
    formData.append('personName', `${company.firstname} ${company.Lastname}`);
    
    setIsLoading(true);
    try {
      await authService.createOrganization(formData);
      alert('Company registered successfully!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Something went wrong.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="company-creation-container1" style={{ width: '100vw', maxWidth: '80%' }}>
      <div className="company-creation-inner-container1" >
        <h2 className="company-creation-title">Company Creation</h2>
        {error && <div className="documentapproval_message bg-red-100 text-red-800 px-4 py-2 rounded mb-4" role="alert">{error}</div>}
        <form className="company-creation-form" onSubmit={handleSubmit} style={{ width: '95%' }}>
          <div className="name-row">
            <TextField fullWidth label="First Name" name="firstname" value={company.firstname} onChange={handleChange} required margin="normal" size="small" />
            <TextField fullWidth label="Last Name" name="Lastname" value={company.Lastname} onChange={handleChange} required margin="normal" size="small"/>
          </div>
          <TextField fullWidth label="Username" name="username" value={company.username} onChange={handleChange} required margin="normal" size="small"/>
          <TextField fullWidth label="Company Name" name="companyName" value={company.companyName} onChange={handleChange} required margin="normal" size="small"/>
          <TextField fullWidth label="Mobile" name="mobile" value={company.mobile} onChange={handleChange} required margin="normal" size="small"/>
          <TextField fullWidth label="Email" name="email" type="email" value={company.email} onChange={handleChange} required margin="normal" size="small"/>
          <TextField fullWidth label="Creation Date" name="accessCreationDate" type="date" value={company.accessCreationDate} onChange={handleChange} required margin="normal" InputLabelProps={{ shrink: true }} size="small" />
          
          <div className="company-creation-form-group1" style={{ width: '100%' }}>
            <label className="company-creation-label">
              Master Services Agreement (MSA) <span className="company-creation-mandatory">*</span>
            </label>
            <div className="company-creation-upload-area1" onClick={() => document.getElementById('file-input').click()}>
              <input type="file" id="file-input" onChange={handleFileChange} className="company-creation-file-input" hidden />
              <div className="company-creation-upload-text">
                <FaCloudUploadAlt className="upload-icon" />
                {contractDocuments ? (
                  <div className="company-creation-file-name">
                    {contractDocuments.name}
                    <span className="company-creation-remove-icon" onClick={() => setContractDocuments(null)}>&#10005;</span>
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
            <button type="button" onClick={() => setCompany({
              username: 'AE-',
              companyName: '',
              firstname:'',
              Lastname: '',
              mobile: '',
              email: '',
              accessCreationDate: '',
            })} className="company-creation-cancel">Cancel</button>
          </div>
        </form>
      </div>
      {isLoading && <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'} size={100} />}
    </div>
  );
};

export default CompanyCreation;
