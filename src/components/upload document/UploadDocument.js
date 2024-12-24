import React, { useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import './UploadDocument.css';

const UploadDocument = () => {
  const [files, setFiles] = useState({
    declaration: null,
    invoice: null,
    packingList: null,
    awsBOL: null,
    countryOfOrigin: null,
    deliveryOrder: null,
    others: null,
  });

  const [uploadedFilesStatus, setUploadedFilesStatus] = useState({
    declaration: false,
    invoice: false,
    packingList: false,
    awsBOL: false,
    countryOfOrigin: false,
    deliveryOrder: false,
    others: false,
  });

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [type]: selectedFile,
      }));

      // Mark this file type as uploaded
      setUploadedFilesStatus((prevState) => ({
        ...prevState,
        [type]: true,
      }));
    }
  };

  const handleCancelUpload = (type) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [type]: null,
    }));

    setUploadedFilesStatus((prevState) => ({
      ...prevState,
      [type]: false,
    }));
  };

  const handleUpload = () => {
    console.log("Uploaded Files:");

    for (const [type, file] of Object.entries(files)) {
      if (file) {
        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)}:`, file.name);
      }
    }
  };

  return (
    <div className="upload-document-container">
      <h3 className="upload-h3">Upload Document</h3>

      {/* Declaration Number Section */}
      <div className="declaration-number-container">
        <p className="declaration-number"><b>Declaration Number </b></p>
        <input 
          type="text" 
          value={1234} 
          readOnly 
          className="declaration-number-input" 
        />
        <span className="arrow-icon">→</span>
      </div>

      <div className="document-type-container">
        <h4>Document Type</h4>
        <div className="checkbox-section">
          <table className="checkbox-table">
            <tbody>
              {[
                'declaration',
                'invoice',
                'packingList',
                'awsBOL',
                'countryOfOrigin',
                'deliveryOrder',
                'others',
              ].map((docType) => (
                <tr className="checkbox-item" key={docType}>
                  <td className="checkbox-label">
                    <label>
                      <input 
                        type="checkbox" 
                        className="checkbox" 
                        disabled={uploadedFilesStatus[docType]} 
                        checked={uploadedFilesStatus[docType]} 
                        readOnly
                      />
                      {docType.charAt(0).toUpperCase() + docType.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                  </td>
                  <td className="file-upload">
                    <label htmlFor={`${docType}-file`}>
                      <AiOutlineUpload size={20} />
                    </label>
                    <input
                      type="file"
                      id={`${docType}-file`}
                      onChange={(e) => handleFileChange(e, docType)}
                      disabled={uploadedFilesStatus[docType]} 
                    />
                  </td>
                  <td>
                    {uploadedFilesStatus[docType] && (
                      <button
                        className="cancel-upload-button"
                        onClick={() => handleCancelUpload(docType)}
                      >
                        ⛔
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="upload-btn-container">
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadDocument;
