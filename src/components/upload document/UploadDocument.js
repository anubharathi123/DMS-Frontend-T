import React, { useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import './UploadDocument.css';

const UploadDocument = () => {
  const [declarationNumber, setDeclarationNumber] = useState('');
  const [files, setFiles] = useState({
    declaration: [],
    invoice: [],
    packingList: [],
    awsBOL: [],
    countryOfOrigin: [],
    deliveryOrder: [],
    others: [],
  });

  const [uploaded, setUploaded] = useState({
    declaration: false,
    invoice: false,
    packingList: false,
    awsBOL: false,
    countryOfOrigin: false,
    deliveryOrder: false,
    others: false,
  });

  const [disabled, setDisabled] = useState({
    declaration: false,
    invoice: false,
    packingList: false,
    awsBOL: false,
    countryOfOrigin: false,
    deliveryOrder: false,
    others: false,
  });

  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) => {
        const updatedFiles = {
          ...prevFiles,
          [type]: [...prevFiles[type], ...selectedFiles],
        };

        setUploaded((prevUploaded) => ({
          ...prevUploaded,
          [type]: updatedFiles[type].length > 0,
        }));
        setDisabled((prevDisabled) => ({
          ...prevDisabled,
          [type]: true,
        }));

        return updatedFiles;
      });

      // Simulate an upload process (execute function after upload)
      setTimeout(() => {
        console.log(`File(s) uploaded for ${type}:`, selectedFiles.map((file) => file.name));
      }, 1000); // Simulated delay

      e.target.value = ''; // Clear input for re-uploading
    }
  };

  const handleCancelUpload = (type) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [type]: [],
    }));

    setUploaded((prevUploaded) => ({
      ...prevUploaded,
      [type]: false,
    }));

    setDisabled((prevDisabled) => ({
      ...prevDisabled,
      [type]: false,
    }));
  };

  const handleUpload = () => {
    console.log('Uploaded Files:');
    for (const [type, fileList] of Object.entries(files)) {
      if (fileList.length > 0) {
        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)}:`);
        fileList.forEach((file, index) => console.log(`  ${index + 1}. ${file.name}`));
      }
    }
  };

  const handleDeclarationChange = (e) => {
    const value = e.target.value;

    // Allow only digits and restrict length to 13
    if (/^\d*$/.test(value) && value.length <= 13) {
      setDeclarationNumber(value);
    }
  };

  const handleSearch = () => {
    if (declarationNumber.length < 13) {
      alert('Declaration number must contain exactly 13 digits.');
    } else {
      console.log('Declaration Number:', declarationNumber);
    }
  };

  const documentTypes = [
    { key: 'declaration', label: 'Declaration' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'packingList', label: 'Packing List' },
    { key: 'awsBOL', label: 'AWS/BOL' },
    { key: 'countryOfOrigin', label: 'Country of Origin' },
    { key: 'deliveryOrder', label: 'Delivery Order' },
    { key: 'others', label: 'Others' },
  ];

  return (
    <div className="upload-document-container">
      <h2 className="upload-h2">Upload Document</h2>

      <div className="upload-declaration-number-container">
        <p className="upload-declaration-number">
          <b>Declaration Number </b>
        </p>
        <input
          type="text"
          value={declarationNumber}
          onChange={handleDeclarationChange}
          placeholder="Enter 13-digit DecNum"
          className="upload-declaration-number-input"
        />
        <button onClick={handleSearch} className="search-button" style={{ background: 'none', border: 'none' }}>
          <span className="upload-arrow-icon">➜</span>
        </button>
      </div>

      <div className="upload-document-type-container">
        
        <div className="upload-checkbox-section">
          <table>
            <tbody>
              {documentTypes.map(({ key, label }) => (
                <tr className="upload-checkbox-item" key={key}>
                  <td>
                    <label className={uploaded[key] ? 'grayed-out' : ''}>{label}</label>
                  </td>
                  <td className="file-upload">
                    {!uploaded[key] && (
                      <label htmlFor={`${key}-file`} style={{ opacity: disabled[key] ? 0.5 : 1 }}>
                        <AiOutlineUpload size={20} />
                      </label>
                    )}
                    <input
                      type="file"
                      id={`${key}-file`}
                      onChange={(e) => handleFileChange(e, key)}
                      disabled={disabled[key]}
                      style={{ display: 'none' }}
                    />
                  </td>
                  <td>
                    {uploaded[key] && (
                      <div className="uploaded-file-info">
                        <span>{files[key][0]?.name}</span>
                        <button
                          className="cancel-upload-button"
                          onClick={() => handleCancelUpload(key)}
                        >
                          ⛔
                        </button>
                      </div>
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
