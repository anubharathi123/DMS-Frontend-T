import React, { useState, useRef, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import './FileUploadPage.css';
import Loader from "react-js-loader";
import { useNavigate } from 'react-router-dom';
import apiServices from '../../ApiServices/ApiServices';
import { IoMdInformationCircleOutline } from "react-icons/io";

const FileUploadPage = () => {
  const dateInfoRef = useRef(null);
  const searchInfoRef = useRef(null);

  const [hasExistingUploads, setHasExistingUploads] = useState(false);
  const [declarationNumber, setDeclarationNumber] = useState('');
  const [declarationDate, setDeclarationDate] = useState('');
  const [originalDeclarationDate, setOriginalDeclarationDate] = useState('');
  const [existingDeclarationDate, setExistingDeclarationDate] = useState('');
  const [isDeclarationDateReadOnly, setIsDeclarationDateReadOnly] = useState(false);
  const [isDateEdited, setIsDateEdited] = useState(false);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isFileUploadEnabled, setIsFileUploadEnabled] = useState(false);
  const [approvedFiles, setApprovedFiles] = useState([]);
  const [files, setFiles] = useState({
    declaration: null,
    invoice: null,
    packingList: null,
    awsBol: null,
    countryOfOrigin: null,
    deliveryOrder: null,
    other: null,
  });

  const [showSearchInfo, setShowSearchInfo] = useState(false);
  const [showDateInfo, setShowDateInfo] = useState(false);
  const [isGoButtonClicked, setIsGoButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

const handleDeclarationDateChange = (e) => {
  const newDate = e.target.value;
  setDeclarationDate(newDate);

  if (originalDeclarationDate && newDate !== originalDeclarationDate) {
    setIsDateEdited(true);
    setIsSubmitDisabled(false);
  } else {
    setIsDateEdited(false);
    const hasNewFiles = Object.keys(files).some(
      key => files[key] && !files[key].alreadyUploaded
    );
    setIsSubmitDisabled(!hasNewFiles);
  }
};

// ✅ FIX: Define it here
const hasNewFilesToUpload = Object.keys(files).some(
  key => files[key] && !files[key].alreadyUploaded
);

// 🟢 Use it here
const shouldShowSubmit = hasNewFilesToUpload || isDateEdited;



  const handleDateInfo = () => {
    setShowDateInfo(!showDateInfo);
  };

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

  useEffect(() => {
    const hasNewFile = Object.keys(files).some(
      (key) => files[key] && !files[key].alreadyUploaded
    );

    setIsSubmitDisabled(!hasNewFile);
  }, [files]);

  const handleDeclarationNumberChange = (e) => {
    setDeclarationNumber(e.target.value);
  };

  const handleGoClick = async () => {
    if (declarationNumber.length === 13) {
      try {
        setIsLoading(true);

        // Fetch declaration date
        const declarationResponse = await apiServices.getDeclarationByNumber(declarationNumber);

        if (declarationResponse?.date) {
          const formattedDate = new Date(declarationResponse.date).toISOString().split('T')[0];
          setDeclarationDate(formattedDate);
          setOriginalDeclarationDate(formattedDate);
          setIsDeclarationDateReadOnly(false);
        }

        // Check for existing uploaded documents
        const response = await apiServices.checkdeclarationdoc(declarationNumber);
        const updatedDocuments = {
          declaration: null,
          invoice: null,
          packingList: null,
          awsBol: null,
          countryOfOrigin: null,
          deliveryOrder: null,
          other: null,
        };

        let firstUploadDate = null;

        if (response && typeof response === 'object') {
          Object.keys(response).forEach((key) => {
            const document = response[key];
            if (document?.document_type?.name) {
              const docTypeName = document.document_type.name.toLowerCase();
              const mappings = {
                'declaration': 'declaration',
                'invoice': 'invoice',
                'packinglist': 'packingList',
                'awsbol': 'awsBol',
                'countryoforigin': 'countryOfOrigin',
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

                if (!firstUploadDate && document.created_at) {
                  firstUploadDate = document.created_at;
                }

                if (status === 'approved') {
                  setApprovedFiles((prevApprovedFiles) => [
                    ...prevApprovedFiles,
                    fileName
                  ]);
                }
              }
            }
          });
        }

        setFiles(updatedDocuments);
        setIsFileUploadEnabled(true);
        setIsGoButtonClicked(true);
      } catch (error) {
        console.error('Unexpected error (non-breaking):', error);
        setIsFileUploadEnabled(true);
        setIsGoButtonClicked(true);
        setDeclarationDate('');
        setIsDeclarationDateReadOnly(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Declaration number must be 13 digits long.');
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];

    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB.");
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'text/plain', 'text/csv', 'application/vnd.ms-excel'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const isAllowedType = allowedTypes.includes(file.type) ||
        ['pdf', 'txt', 'csv'].includes(fileExtension);

      if (!isAllowedType) {
        alert("Only PDF, TXT, and CSV files are allowed.");
        return;
      }

      // Check if the file is already uploaded
      const isFileAlreadyUploaded = Object.values(files).some(existingFile =>
        existingFile && existingFile.name === file.name
      );

      if (isFileAlreadyUploaded) {
        alert("This file has already been uploaded.");
        return;
      }

      setFiles((prevFiles) => ({ ...prevFiles, [type]: file }));
    }
  };

  const handleFileDelete = (type) => {
    setFiles((prevFiles) => ({ ...prevFiles, [type]: null }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('declaration_Number', declarationNumber);

  // Append only new files (excluding already uploaded ones and 'other')
  const hasFilesToUpload = Object.keys(files).some(
    key => key !== 'other' && files[key] && !files[key].alreadyUploaded
  );

  if (hasFilesToUpload) {
    Object.keys(files).forEach((key) => {
      if (key !== 'other' && files[key] && !files[key].alreadyUploaded) {
        formData.append(key, files[key]);
      }
    });
  }

  try {
    setIsLoading(true);

    // Step 1: Upload metadata
    const metadata = {
      declaration_number: declarationNumber,
      declaration_date: declarationDate,
    };

    const declarationMetaResponse = await apiServices.uploadDeclarationMeta(metadata);

    if (!declarationMetaResponse || declarationMetaResponse.error) {
      alert('Failed to create declaration metadata.');
      return;
    }

    // Step 2: Upload files only if there are files
    if (hasFilesToUpload) {
      const response = await apiServices.uploadDocument(formData);
      const isSuccessByMessage = response?.message?.toLowerCase().includes('success');

      if (response?.success || isSuccessByMessage) {
        alert('Documents submitted successfully!');
        navigate('/documentlist');
      } else {
        throw new Error(response?.message || 'Failed to submit files');
      }
    } else {
      // No files to upload, but metadata was submitted
      alert('Declaration submitted successfully without any documents!');
      navigate('/documentlist');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Failed to submit. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const handleCancelUpload = () => {
    navigate('/DocumentList');
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGoClick();
                }
              }}
              maxLength={13}
              placeholder="Enter Declaration Number"
            />
            <button
              type="button"
              className="go-button"
              onClick={handleGoClick}
              disabled={declarationNumber.length !== 13}
              style={{ display: isGoButtonClicked ? 'none' : 'inline-block' }}
            >
              Go
            </button>

            {isGoButtonClicked && (
              <a className='upload_searchinfo' onClick={handleSearchInfo}>
                <IoMdInformationCircleOutline />
              </a>
            )}

            {showSearchInfo && (
              <div ref={searchInfoRef} className="upload-searchinfo-popup">
                To upload one file (e.g., If an invoice document contains multiple files, they should be combined into a single invoice file before uploading)
              </div>
            )}
          </div>

          {isFileUploadEnabled && (
            <div className="declaration-date-section" style={{ position: 'relative' }}>
              <label htmlFor="declarationDate" className="declaration-date-label">
                Declaration Date
              </label>
              <input
                type="date"
                id="declarationDate"
                className="declaration-date-input"
                value={declarationDate}
                onChange={handleDeclarationDateChange}
              />
              <a className='date_info_icon' onClick={handleDateInfo} style={{ marginLeft: '8px', cursor: 'pointer' }}>
                <IoMdInformationCircleOutline />
              </a>
              {showDateInfo && (
                <div ref={dateInfoRef} className="date-info-popup" style={{
                  position: 'absolute',
                  top: '30px',
                  left: '0',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  padding: '10px',
                  zIndex: 1000,
                  width: '250px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  borderRadius: '4px',
                }}>
                  Please enter the date corresponding to the declaration number you entered.
                </div>
              )}
            </div>
          )}

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
                      <label className="upload-icon">
                        <FaUpload />
                        <input
                          type="file"
                          className="hidden-input"
                          onChange={(e) => handleFileChange(e, item.key)}
                          accept=".pdf,.txt,.csv,application/pdf,text/plain,text/csv"
                        />
                      </label>
                    ) : files[item.key]?.alreadyUploaded ? (
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
            <div className='upload-buttons'>
              {shouldShowSubmit && (
                <button type="submit" className="submit-button" disabled={isSubmitDisabled}>
                  Submit
                </button>
              )}
              <button type="button" className="cancel-button" onClick={handleCancelUpload}>
                Cancel
              </button>
            </div>

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
            <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'} size={100} />
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;