import React, { useState } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import './FileUploadPage.css';

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

  const handleGoClick = async () => {
    if (declarationNumber.length === 13) {
      // Uncomment this section to integrate the API
      /*
      try {
        const response = await fetch('https://your-api-endpoint.com/check-declaration', {
          method: 'POST',
          body: JSON.stringify({ declaration_Number: declarationNumber }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to check declaration number.');
        }

        const data = await response.json();

        // Update the state for already uploaded files
        setFiles((prevFiles) => {
  const updatedFiles = { ...prevFiles };
  Object.keys(updatedFiles).forEach((key) => {
    updatedFiles[key] = mockResponse.files[key] || null;
  });
  return updatedFiles;
});


        setIsFileUploadEnabled(true);
        alert('Declaration number validated successfully.');

      } catch (error) {
        console.error('Error:', error);
        alert('Error validating declaration number. Please try again.');
      }
      */
      
      // Mock behavior for now
      const mockResponse = {
        files: {
          declaration: null,
          invoice: { name: 'invoice_sample.pdf', alreadyUploaded: true },
          packingList: null,
          awsBol: { name: 'awsBol_sample.pdf', alreadyUploaded: true },
          countryOfOrigin: null,
          deliveryOrder: null,
        },
      };
      

      // Update the state for mock uploaded files
      setFiles((prevFiles) => {
        const updatedFiles = { ...prevFiles };
        Object.keys(updatedFiles).forEach((key) => {
          updatedFiles[key] = mockResponse.files[key] || null;
        });
        return updatedFiles;
      });

      setIsFileUploadEnabled(true);
      alert('Mock: Declaration number validated successfully.');
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Prepare the payload with only newly uploaded files
    const payload = {
      declaration_Number: declarationNumber,
      files: {},
    };
  
    // Iterate over the files and add only the newly uploaded ones to the payload
    Object.keys(files).forEach((key) => {
      if (files[key] && !files[key].alreadyUploaded) {
        payload.files[key] = files[key];
      }
    });
  
    console.log('Payload to be sent:', payload);
  
    // Uncomment this section to send the payload to the API
    /*
    fetch('https://your-api-endpoint.com/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data);
        alert('Files submitted successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to submit files.');
      });
    */
  
    alert('Files submitted successfully! (Currently mock implementation)');
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
            className="filedeclaration-input"
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
                      {!files[item.key].alreadyUploaded && (
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
    </div>
  );
};

export default FileUploadPage;
