import React, { useState, useRef, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';
import './FileUploadPage.css';
import Loader from 'react-js-loader';
import { useNavigate } from 'react-router-dom';
import apiServices from '../../ApiServices/ApiServices';
import { IoMdInformationCircleOutline } from 'react-icons/io';

export const FileUploadPage = () => {
  const [declarationNumber, setDeclarationNumber] = useState('');
  const [isFileUploadEnabled, setIsFileUploadEnabled] = useState(false);
  const [files, setFiles] = useState({});
  const [showSearchInfo, setShowSearchInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoButtonClicked, setIsGoButtonClicked] = useState(false);
  const searchInfoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInfoRef.current && !searchInfoRef.current.contains(event.target)) {
        setShowSearchInfo(false);
      }
    };

    if (showSearchInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchInfo]);

  const handleSearchInfo = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowSearchInfo(!showSearchInfo);
  };

  const handleDeclarationNumberChange = (e) => {
    setDeclarationNumber(e.target.value);
    setIsGoButtonClicked(false); // Reset the go button click state when the declaration number changes
  };

  const handleGoClick = async () => {
    if (declarationNumber.length === 13) {
      try {
        setIsLoading(true);
        const response = await apiServices.checkdeclarationdoc(declarationNumber);
        if (response) {
          const updatedDocuments = {};
          Object.keys(response).forEach((key) => {
            const document = response[key];
            if (document?.document_type?.name) {
              const docTypeName = document.document_type.name.toLowerCase();
              updatedDocuments[docTypeName] = {
                fileName: document.current_version?.file_path?.split('/').pop(),
                alreadyUploaded: true,
                status: document.status, // The status of the document (approved, rejected, etc.)
              };
            }
          });
  
          setFiles(updatedDocuments);
          setIsFileUploadEnabled(true);
          setIsGoButtonClicked(true);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Prevent alert when declaration number is changed and Enter is pressed again
      if (!isGoButtonClicked) {
        setIsGoButtonClicked(true);
      }
    }
  };

  const handleFileChange = (e, type) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles((prevFiles) => ({
        ...prevFiles,
        [type]: file, // Store File object directly
      }));
    }
  };

  const handleFileDelete = (type) => {
    setFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      delete newFiles[type];
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFileUploadEnabled) return;

    const formData = new FormData();
    formData.append('declaration_Number', declarationNumber);
    let hasNewFiles = false;

    Object.entries(files).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
        hasNewFiles = true;
      }
    });

    if (!hasNewFiles) {
      alert('No new files to upload.');
      return;
    }

    try {
      setIsLoading(true);
      await apiServices.uploadDocument(formData);
      alert('Files submitted successfully!');

      // Reset state after submission
      setFiles({});
      setIsFileUploadEnabled(false);

      // Navigate after upload
      navigate('/documentlist', { state: { uploadedFiles: files } });
    } catch (error) {
      console.error('Error:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="file-upload-page-outer">
      <div className="file-upload-page">
        <h1 className="page-title">File Upload Portal</h1>
        <form onSubmit={handleSubmit} className="upload-form">
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
              onKeyDown={(e) => e.key === 'Enter' && handleGoClick()}
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
              <button type="button" className="upload_searchinfo" onClick={handleSearchInfo}>
                <IoMdInformationCircleOutline />
              </button>
            )}
            {showSearchInfo && (
              <div ref={searchInfoRef} className="upload-searchinfo-popup">
                {/* Add the information you want to display here */}
                To upload one file (e.g., If an invoice document contains multiple files, they should be combined into a single invoice file before uploading)
              </div>
            )}
          </div>
  
          {isFileUploadEnabled && (
            <div className="file-upload-section">
              {[
                { key: 'Declaration', label: 'Declaration' },
                { key: 'Invoice', label: 'Invoice' },
                { key: 'Packing list', label: 'Packing List' },
                { key: 'Aws/bol', label: 'AWS/BOL' },
                { key: 'Country of origin', label: 'Certificate Of Origin' },
                { key: 'Delivery order', label: 'Delivery Order' },
                { key: 'others', label: 'Others' },
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
                          disabled={files[item.key]?.alreadyUploaded && files[item.key]?.status === item.status}
                        />
                      </label>
                    ) : (
                      <>
                        {files[item.key]?.status === item.status ? (
                          <>
                            <span className="file-name">
                              {files[item.key].name || files[item.key].fileName}
                            </span>
                          </>
                        ) : files[item.key]?.status === item.status ? (
                          <>
                            <span className="file-name">
                              {files[item.key].name || files[item.key].fileName} (Rejected)
                            </span>
                            <button
                              type="button"
                              className="delete-icon"
                              onClick={() => handleFileDelete(item.key)}
                            >
                              x
                            </button>
                            {/* Display the upload button if rejected */}
                            <label className="upload-icon">
                              <FaUpload />
                              <input
                                type="file"
                                className="hidden-input"
                                onChange={(e) => handleFileChange(e, item.key)}
                              />
                            </label>
                          </>
                        ) : (
                          <>
                            <span className="file-name">
                              {files[item.key].name || files[item.key].fileName}
                            </span>
                            <button
                              type="button"
                              className="delete-icon"
                              onClick={() => handleFileDelete(item.key)}
                            >
                              x
                            </button>
                          </>
                        )}
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
