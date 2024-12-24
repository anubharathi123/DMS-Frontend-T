import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './DocumentList.css';
import DownArrow from '../../assets/images/down-arrow.png';

const DocumentList = () => {
  // Define the documents array first
  const documents = [
    { declarationNumber: '1234567890123', fileName: 'File1.pdf', fileUrl: 'https://example.com/files/File1.pdf', updatedDate: '2024-12-01', docType: 'Invoice', status: 'Pending' },
    { declarationNumber: '9876543210987', fileName: 'File2.pdf', fileUrl: 'https://example.com/files/File2.pdf', updatedDate: '2024-11-20', docType: 'Packing List', status: 'Reject' },
    { declarationNumber: '1122334455667', fileName: 'File3.pdf', fileUrl: 'https://example.com/files/File3.pdf', updatedDate: '2024-10-15', docType: 'Declaration', status: 'Approve' },
    { declarationNumber: '2233445566778', fileName: 'File4.pdf', fileUrl: 'https://example.com/files/File4.pdf', updatedDate: '2024-09-10', docType: 'Delivery Order', status: 'Canceled' }
  ];

  // States
  const [selectedDate, setSelectedDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDocTypeDropdownVisible, setDocTypeDropdownVisible] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState("");
  const [filteredDeclarations, setFilteredDeclarations] = useState([]);
  const [showFilteredDeclarations, setShowFilteredDeclarations] = useState(false);
  const [selectedFilteredIndex, setSelectedFilteredIndex] = useState(-1);
  const [hasSelectedDeclaration, setHasSelectedDeclaration] = useState(false);
  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [declarationInput, setDeclarationInput] = useState("");
  const [filterDocType, setFilterDocType] = useState("All");

  // Toggle Calendar
  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);

  // Apply Filters
  const applyFilters = () => {
    let filtered = [...documents];
    if (filterDocType !== "All") {
      filtered = filtered.filter((doc) => doc.docType === filterDocType);
    }

    if (filterDate) {
      const formattedDate = filterDate.toISOString().split("T")[0];
      filtered = filtered.filter((doc) => doc.updatedDate === formattedDate);
    }

    if (declarationInput) {
      filtered = filtered.filter((doc) => doc.declarationNumber.includes(declarationInput));
    }

    setFilteredDocuments(filtered);
  };

  // More handlers here...

  const docTypes = [
    'Declaration',
    'Invoice',
    'Packing List',
    'AWS/BOL',
    'Country Of Origin',
    'Delivery Order',
    'Others'
  ];

  return (
    <div className="document-list-container">
      <h2 className="title">Document List</h2>

      {/* Declaration Number Section */}
      <div className="declaration-section" style={{ textAlign: 'right', marginBottom: '10px' }}>
        <label className="declaration-label"><b>Declaration Number:</b></label>
        <input
          type="text"
          className="declaration-input"
          placeholder="Enter 13-digit Dec num"
          value={selectedDeclaration}
          onChange={(event) => setSelectedDeclaration(event.target.value)}
        />
      </div>

      {/* Table Section */}
      <table className="document-table">
        <thead>
          <tr>
            <th>Declaration Number</th>
            <th>File Name</th>
            <th>
              Updated Date
              <button className="calendarbtn" onClick={toggleCalendar}>📅</button>
              {isCalendarOpen && (
                <div style={{ position: "absolute", zIndex: 1000 }}>
                  <DatePicker
                    selected={filterDate}
                    onChange={(date) => {
                      setFilterDate(date);
                      setIsCalendarOpen(false);
                      applyFilters();
                    }}
                    inline
                  />
                </div>
              )}
            </th>
            <th>
              Doc Type
              <img
                src={DownArrow}
                alt="Dropdown"
                className="document-list-dropdown-icon"
                onClick={() => setDocTypeDropdownVisible(!isDocTypeDropdownVisible)}
              />
              {isDocTypeDropdownVisible && (
                <div className="document-dropdown-list">
                  {docTypes.map((docType) => (
                    <div key={docType} className="dropdown-item" onClick={() => setFilterDocType(docType)}>
                      {docType}
                    </div>
                  ))}
                </div>
              )}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((row, index) => (
            <tr key={index}>
              <td>{row.declarationNumber}</td>
              <td>
                <a href={row.fileUrl} target="_blank" rel="noopener noreferrer">
                  {row.fileName}
                </a>
              </td>
              <td>{row.updatedDate}</td>
              <td>{row.docType}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList;
