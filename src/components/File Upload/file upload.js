import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import './FileUploadPage.css';
import Loader from "react-js-loader";
import { useNavigate } from 'react-router-dom';
import apiServices from '../../ApiServices/ApiServices';
import { IoMdInformationCircleOutline } from "react-icons/io";

const FileUploadPage = () => {
  const [declarationNumber, setDeclarationNumber] = useState('');
  const [isFileUploadEnabled, setIsFileUploadEnabled] = useState(false);
  const [approvedFiles, setApprovedFiles] = useState([]); // Track approved files
  const [files, setFiles] = useState({
    declaration: null,
    invoice: null,
    packingList: null,
    awsBol: null,
    countryOfOrigin: null,
    deliveryOrder: null,
  });
  const [showSearchInfo, setShowSearchInfo] = useState(false);
  const [isGoButtonClicked, setIsGoButtonClicked] = useState(false); // Track if "Go" button has been clicked
  
  const searchInfoRef = useRef(null); // Reference for search info popup
  
  const handleSearchInfo = () => {
    setShowSearchInfo(!showSearchInfo);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInfoRef.current && !searchInfoRef.current.contains(event.target)) {
        setShowSearchInfo(false);
      }
    };
  
    if (showSearchInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchInfo]);

  const handleDeclarationNumberChange = (e) => {
    setDeclarationNumber(e.target.value);
  };

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false); 
  
 
  const handleGoClick = async () => {
    if (declarationNumber.length === 13) {
      try {
        setIsLoading(true);
        const response = await apiServices.checkdeclarationdoc(declarationNumber);
        if (response) {
          const updatedDocuments = {
            declaration: null,
            invoice: null,
            packingList: null,
            awsBol: null,
            countryOfOrigin: null,
            deliveryOrder: null,
          };
  
          Object.keys(response).forEach((key) => {
            const document = response[key];
            if (document?.document_type?.name) {
              const docTypeName = document.document_type.name.toLowerCase();
              const mappings = {
                'declaration': 'declaration',
                'invoice': 'invoice',
                'packinglist': 'packingList',
                'awsbol': 'awsBol',
                'countryoforigin': 'certificateOfOrigin',
                'deliveryorder': 'deliveryOrder',
                'other': 'other',
              };
  
              const mappedKey = mappings[docTypeName];
              if (mappedKey) {
                const filePath = document.current_version?.file_path || '';
                const fileName = filePath.split('/').pop();
                const status = document.status;
  
                updatedDocuments[mappedKey] = {
                  fileName,
                  alreadyUploaded: true,
                  status,
                };
  
                // Add to approved files if the file is approved
                if (status === 'approved') {
                  setApprovedFiles((prevApprovedFiles) => [
                    ...prevApprovedFiles,
                    fileName
                  ]);
                }
              }
            }
          });
  
          setFiles(updatedDocuments);
          setIsFileUploadEnabled(true);
          setIsGoButtonClicked(true);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error validating declaration number. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Declaration number must be 13 digits long.');
    }
  };
  
  const handleFileChange = (e, type) => {
    setFiles((prevFiles) => ({ ...prevFiles, [type]: e.target.files[0] }));
  };

  const handleFileDelete = (type) => {
    setFiles((prevFiles) => ({ ...prevFiles, [type]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('declaration_Number', declarationNumber);
  
    Object.keys(files).forEach((key) => {
      if (files[key] && !files[key].alreadyUploaded) {
        formData.append(key, files[key]);
      }
    });
  
    if (formData.has('declaration_Number') && formData.size === 1) {
      alert('No new files to upload.');
      return;
    }
  
    try {
      setIsLoading(true);
      await apiServices.uploadDocument(formData);
      alert('Files submitted successfully!');
      navigate('/documentlist');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit files.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="file-upload-page-outer">
      <div className="file-upload-page">
        <h1 className="page-title">Document upload</h1>
        <form onSubmit={handleSubmit} className="upload-form">
          {/* Declaration Number Section */}
          <div className="declaration-section">
            <label htmlFor="declarationNumber" className="declaration-label">
              Declaration Number
            </label>
            <input
              type="text"
              id="declarationNumber"
              className="declaration-input"
              value={declarationNumber}
              onChange={handleDeclarationNumberChange}
              maxLength={13}
              placeholder="Enter Declaration Number"
            />
            <button
              type="button"
              className="go-button"
              onClick={handleGoClick}
              disabled={declarationNumber.length !== 13}
            >
              Go
            </button>
            {isGoButtonClicked && (
              <a className='upload_searchinfo' onClick={handleSearchInfo}>
                <IoMdInformationCircleOutline/> 
              </a>
            )}
            {showSearchInfo && (
              <div ref={searchInfoRef} className="upload-searchinfo-popup">
                {/* Add the information you want to display here */}
                To upload one file (e.g., If an invoice document contains multiple files, they should be combined into a single invoice file before uploading)
              </div>
            )}
          </div>

          {/* File Upload Section */}
          {isFileUploadEnabled && (
  <div className="file-upload-section">
    {[
      { key: 'declaration', label: 'Declaration' },
      { key: 'invoice', label: 'Invoice' },
      { key: 'packingList', label: 'Packing List' },
      { key: 'awsBol', label: 'AWS/BOL' },
      { key: 'countryOfOrigin', label: 'Certificate Of Origin' },
      { key: 'deliveryOrder', label: 'Delivery Order' },
      { key: 'other', label: 'Others' },
    ].map((item) => (
      <div className="file-upload-item" key={item.key}>
        <label className="file-upload-label">{item.label}</label>
        <div className="file-actions">
          {!files[item.key] ? (
            // If no file is uploaded yet, show the upload button
            <label className="upload-icon">
              <FaUpload />
              <input
                type="file"
                className="hidden-input"
                onChange={(e) => handleFileChange(e, item.key)}
              />
            </label>
          ) : files[item.key]?.alreadyUploaded ? (
            // If file is already uploaded, display file name and status
            <>
              <span className="file-name">{files[item.key].fileName}</span>
              <span className="already-uploaded-message">File already uploaded</span>
            </>
          ) : (
            <>
              <span className="file-name">{files[item.key].name}</span>
              <button
                type="button"
                className="delete-icon"
                onClick={() => handleFileDelete(item.key)}
              >
                🇽
              </button>
            </>
          )}
        </div>
      </div>
    ))}
    <button type="submit" className="submit-button">
      Submit
    </button>
  </div>
)}
        </form>
      </div>
      {/* Display Approved Files */}
      {approvedFiles.length > 0 && (
            <div className="approved-files-section">
              <h3>Approved Files:</h3>
              <ul>
                {approvedFiles.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
            </div>
          )}
        
   
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

export default FileUploadPage;
