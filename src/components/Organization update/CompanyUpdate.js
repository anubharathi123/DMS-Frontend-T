import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CompanyUpdate.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Loader from "react-js-loader";
import authService from '../../ApiServices/ApiServices';

const CompanyUpdate = () => {
  const [company, setCompany] = useState({  });
  const { id } = useParams();
  const [contractDocuments, setContractDocuments] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileInputClicked, setFileInputClicked] = useState(false);
  const [error, setError] = useState(null); // For error handling
  const [selectedCompany, setSelectedCompany] = useState(null);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);  
  
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching Organization ID:", id);
        const response = await authService.getOrganizationById(id);
        console.log("API Response:", response.details);
  
        if (response) {
          const org = response.details;
          console.log(org);
  
          // Convert created_at to a valid date format (YYYY-MM-DD)
          const formattedDate = org.created_at ? new Date(org.created_at).toISOString().split('T')[0] : '';
  
          const organization = {
            id: org.auth_user?.id,
            username: org.auth_user?.username,
            company_name: org.company_name,
            first_name: org.auth_user?.first_name,
            mobile: org.mobile,
            email: org.auth_user?.email,
            contract_doc: org.contract_doc,
            created_at: formattedDate, // Correctly formatted date
            status: org.is_frozen,
            delete: org.is_delete,
          };
  
          setContractDocuments(org.contract_doc);
          setFileInputClicked(true);
          setCompany(organization);
          setSelectedCompany(organization);
          console.log("Updated Company State:", organization);
        } else {
          console.log("No organization found.");
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (id) {
      fetchOrganization();
    }
  }, [id]);
  
  
    
  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,  // Ensure the correct state keys are updated
    }));
  };
  

  

  // Handles file selection (only one file at a time)
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
  
    if (file) {
      setContractDocuments(file); // Update the state with the new file
  
      // Update the company state with the new file name
      setCompany((prevCompany) => ({
        ...prevCompany,
        contract_doc: file.name, // Update the contract_doc with the new file name
      }));
  
      // Force re-render by clearing the file input field
      e.target.value = null;
  
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
      setContractDocuments(file); // Replace the previous files with the selected one
  
      // Update the company state with the new file name
      setCompany((prevCompany) => ({
        ...prevCompany,
        contract_doc: file.name, // Update the contract_doc with the new file name
      }));
  
      setFileInputClicked(true); // Mark that a file is selected
    }
  };
  // Removes a specific file without triggering the file input dialog
  const handleRemoveFile = () => {
    setContractDocuments(null); // Remove the file
    setCompany((prevCompany) => ({
      ...prevCompany,
      contrxact_doc: '', // Reset the contract_doc field
    }));
    setFileInputClicked(false); // Prevent the file input dialog from popping up
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!contractDocuments) {
      setError("Please upload the Master Services Agreement (MSA) before proceeding.");
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    const formData = new FormData();
  
    // Append company details
    Object.keys(company).forEach((key) => {
      if (company[key]) {
        formData.append(key, company[key]);
      }
    });
  
    // Append file
    if (contractDocuments) {
      formData.append('contractDocuments', contractDocuments);
    }
  
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  
    setIsLoading(true);
  
    try {
      const response = await authService.updateOrganization(id, formData);
      console.log("Update Response:", response);
      alert("Company Details have been updated successfully!");
      setTimeout(() => {
        navigate('/OrganizationList');
      }, 500); 
  
    } catch (error) {
      setError(error.message || "Something went wrong.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
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
    document.getElementById("contract_doc").click();
  };

  return (
    <div className="company-creation-container">
      <div className="company-creation-inner-container">
        <h2 className="company-creation-title1">Update Company</h2>
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
              value={company?.username || ''}
              onChange={handleChange}
              className="company-creation-input"
              required
              disabled
            />
          </div>

          {/* Company Name */}
          <div className="company-creation-form-group">
            <label className="company-creation-label">
              Company Name <span className="company-creation-mandatory">*</span>
            </label>
            <input
              type="text"
              name="company_name"
              value={company?.company_name || ''}
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
              name="first_name"
              value={company?.first_name || ''}
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
              value={company?.mobile || ''}
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
              value={company?.email || ''}
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
                name="created_at"
                value={company?.created_at || ''}
                onChange={handleChange}
                className="company-creation-date-input"
                required
                disabled
              />
            </div>
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
            <input type="file" id="contract_doc" onChange={handleFileChange} className="company-creation-file-input"
              hidden />
            <div className="company-creation-upload-text">
              <FaCloudUploadAlt />
              {fileInputClicked && contractDocuments ? (
              <div className="company-creation-file-name">
              {company?.contract_doc}
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
              Update
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

export default CompanyUpdate;
