import React, { useState } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import './FileUploadPage.css';
import Loader from "react-js-loader";
import { useNavigate } from 'react-router-dom';
import apiServices from '../../ApiServices/ApiServices';

const FileUploadPage = () => {
  const [declarationNumber, setDeclarationNumber] = useState('');
  const [isFileUploadEnabled, setIsFileUploadEnabled] = useState(false);
  const [files, setFiles] = useState({
    declaration: null,
    invoice: null,
    packingList: null,
    awsBol: null,
    countryOfOrigin: null,
    deliveryOrder: null,
  });

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
            deliveryOrder: null
          };
          setFiles(updatedDocuments);
          Object.keys(response).forEach((key) => {
            const document = response[key];
            // console.log('document:', document);
            
            if (document && document.document_type && document.document_type.name) {
              const docTypeName = document.document_type.name.toLowerCase();
  
              let mappedKey = null;
              switch (docTypeName) {
                case 'declaration':
                  mappedKey = 'declaration';
                  break;
                case 'invoice':
                  mappedKey = 'invoice';
                  break;
                case 'packing list':
                  mappedKey = 'packingList';
                  break;
                case 'aws/bol':
                  mappedKey = 'awsBol';
                  break;
                case 'country of origin':
                  mappedKey = 'countryOfOrigin';
                  break;
                case 'delivery order':
                  mappedKey = 'deliveryOrder';
                  break;
                default:
                  break;
              }
  
              if (mappedKey) {
                const filePath = document.current_version?.file_path || '';
                // console.log('filePath:', filePath);
                const fileName = filePath.split('/').pop(); // Extract the file name
                // console.log('fileName:', fileName);
                
                updatedDocuments[mappedKey] = {
                  fileName:fileName, // Add fileName to the document object
                  alreadyUploaded: true
                };
              }
            }
            // console.log('updatedDocuments:', updatedDocuments);
          });
  
          setFiles(updatedDocuments);
          setIsFileUploadEnabled(true);
          alert('Declaration number validated successfully.');
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error validating declaration number. Please try again.');
      }
      finally {
        setIsLoading(false); // End loading
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
  
    // Prepare the payload with only newly uploaded files
    const formData = new FormData();
    formData.append('declaration_Number', declarationNumber);
  
    // Add only the newly uploaded files to FormData
    Object.keys(files).forEach((key) => {
      if (files[key] && !files[key].alreadyUploaded) {
        formData.append(key, files[key]); // Append the file to FormData
      }
    });
  
    console.log('Payload to be sent:', formData);
  
    if (formData.has('declaration_Number') && formData.size === 1) {
      // If no files to upload, exit early
      alert('No new files to upload.');
      return;
    }
  
    try {
    setIsLoading(true);
      const response = await apiServices.uploadDocument(formData); // Send the FormData directly
      // const data = await response.json(); // Handling the response properly
      // console.log('API response:', data);
      alert('Files submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit files.');
    }
    finally {
      setIsLoading(false); // End loading
    }
  };
  


return (
  <div className="file-upload-page-outer">
    <div className="file-upload-page">
      <h1 className="page-title">File Upload Portal</h1>
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
        </div>

        {/* File Upload Section */}
        {isFileUploadEnabled && (
          <div className="file-upload-section">
            {[
              { key: 'declaration', label: 'Declaration' },
              { key: 'invoice', label: 'Invoice' },
              { key: 'packingList', label: 'Packing List' },
              { key: 'awsBol', label: 'AWS/BOL' },
              { key: 'countryOfOrigin', label: 'Country Of Origin' },
              { key: 'deliveryOrder', label: 'Delivery Order' },
            ].map((item) => (
              <div className="file-upload-item" key={item.key}>
              <label className="file-upload-label">{item.label}</label>
              <div className="file-actions">
                {!files[item.key] ? (
                  // If no file is selected, show upload button
                  <label className="upload-icon">
                    <FaUpload />
                    <input
                      type="file"
                      className="hidden-input"
                      onChange={(e) => handleFileChange(e, item.key)}
                    />
                  </label>
                ) : (
                  <>
                   <span className="file-name">{files[item.key].name}</span>
                    {/* If file is selected, display the file name */}
                    <span className="file-name-exist">{files[item.key]?.fileName}</span>
                    {/* Only show delete icon if the file is not already uploaded */}
                    {!files[item.key]?.alreadyUploaded && (
                      <button
                        type="button"
                        className="delete-icon"
                        onClick={() => handleFileDelete(item.key)}
                      >
                        🇽
                      </button>
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
            <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'}size={100} />
            <p>Loading...</p>
          </div>
        </div>
      )}
  </div>
);

};

export default FileUploadPage;
