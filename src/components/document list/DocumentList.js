import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DocumentList.css";
import DownArrow from "../../assets/images/down-arrow.png";

const DocumentList = () => {
  const documents = [
    {
      declarationNumber: "1234567890123",
      fileName: "File1.pdf",
      fileUrl: "https://example.com/files/File1.pdf",
      updatedDate: "2024-12-01",
      docType: "Invoice",
      status: "Pending",
    },
    {
      declarationNumber: "9876543210987",
      fileName: "File2.pdf",
      fileUrl: "https://example.com/files/File2.pdf",
      updatedDate: "2024-11-20",
      docType: "Packing List",
      status: "Rejected",
    },
    {
      declarationNumber: "1122334455667",
      fileName: "File3.pdf",
      fileUrl: "https://example.com/files/File3.pdf",
      updatedDate: "2024-10-15",
      docType: "Declaration",
      status: "Approved",
    },
    {
      declarationNumber: "2233445566778",
      fileName: "File4.pdf",
      fileUrl: "https://example.com/files/File4.pdf",
      updatedDate: "2024-09-10",
      docType: "Delivery Order",
      status: "Pending",
    },
  ];

  const [filterDate, setFilterDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDocTypeDropdownVisible, setDocTypeDropdownVisible] = useState(false);
  const [isStatusDropdownVisible, setIsStatusDropdownVisible] = useState(false);
  const [declarationInput, setDeclarationInput] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [filterDocType, setFilterDocType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [suggestions, setSuggestions] = useState([]);

  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);
  const docTypeDropdownRef = useRef(null);
  const containerRef = useRef(null);
  const statusDropdownRef = useRef(null);

  const applyFilters = () => {
    let filtered = [...documents];

    if (filterDate) {
      const selectedDate = filterDate.toISOString().split("T")[0];
      filtered = filtered.filter((doc) => doc.updatedDate === selectedDate);
    }

    if (declarationInput) {
      filtered = filtered.filter((doc) =>
        doc.declarationNumber.includes(declarationInput)
      );
    }

    if (filterDocType !== "All") {
      filtered = filtered.filter((doc) => doc.docType === filterDocType);
    }

    if (filterStatus !== "All") {
      filtered = filtered.filter((doc) => doc.status === filterStatus);
    }

    setFilteredDocuments(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filterDate, declarationInput, filterDocType, filterStatus]);

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
  
    // Allow only numeric input and restrict length to 13 digits
    if (!/^\d*$/.test(inputValue)) return; // Prevent non-numeric input
    if (inputValue.length > 13) inputValue = inputValue.slice(0, 13);
  
    setDeclarationInput(inputValue);
  
    // Filter documents only if input length is exactly 13
    if (inputValue.length === 13) {
      const matchingSuggestions = documents
        .filter((doc) => doc.declarationNumber.startsWith(inputValue))
        .map((doc) => doc.declarationNumber);
  
      setSuggestions(matchingSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  

  const handleCalendarToggle = () => {
    setIsCalendarOpen((prev) => {
      if (!prev) setDocTypeDropdownVisible(false); // Close dropdown when calendar opens
      return !prev;
    });
  };

  const handleDropdownToggle = (type) => {
    if (type === "docType") {
      setDocTypeDropdownVisible((prev) => !prev);
      setIsCalendarOpen(false);
      setIsStatusDropdownVisible(false);
    } else if (type === "status") {
      setIsStatusDropdownVisible((prev) => !prev);
      setDocTypeDropdownVisible(false);
      setIsCalendarOpen(false);
    }
  };
  

  const handleClickOutside = (event) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target) &&
      calendarRef.current &&
      !calendarRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsCalendarOpen(true);
      setDocTypeDropdownVisible(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetFilters = () => {
    setFilterDate(null);
    setDeclarationInput("");
    setFilterDocType("All");
    setFilterStatus("All");
    setFilteredDocuments(documents);
  };

  const docTypes = [
    "All",
    "Declaration",
    "Invoice",
    "Packing List",
    "Delivery Order",
  ];

  const status = [
    "Pending",
    "Approved",
    "Rejected",
  ];

  return (
    <div className="document-list-container">
      <h2 className="document-list-title">Document List</h2>

      {/* Declaration Number Section */}
      <div
        className="document-list-declaration-section"
        style={{ textAlign: "right", marginBottom: "10px" }}
      >
        <label className="document-list-declaration-label">
          <b>Declaration Number:</b>
        </label>
        <input
          type="text"
          className="document-list-declaration-input"
          placeholder="Enter 13-digit DecNum"
          value={declarationInput}
          onChange={handleInputChange}
        />
      </div>

      {/* Reset Filters Button */}
      <div style={{ marginBottom: "5px", textAlign: "right" }}>
        <button
          className="document-list-reset-button"
          onClick={resetFilters}
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#5fc3d7",
            cursor: "pointer",
            marginLeft: "690px",
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Table Section */}
      <table className="document-list-table">
        <thead>
          <tr>
            <th>Declaration Number</th>
            <th>File Name</th>
            <th>
              Updated Date
              <button
                className="document-list-calendarbtn"
                onClick={handleCalendarToggle}
              >
                📅
              </button>
              {isCalendarOpen && (
                <div
                  style={{ position: "absolute", zIndex: 1000 }}
                  ref={calendarRef}
                >
                  <DatePicker
                    selected={filterDate}
                    onChange={(date) => {
                      setFilterDate(date);
                      setIsCalendarOpen(false);
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
    onClick={() => handleDropdownToggle("docType")}
  />
  {isDocTypeDropdownVisible && (
    <div ref={docTypeDropdownRef} className="document-dropdown-list">
      {docTypes.map((doctype) => (
        <div
          key={doctype}
          className="document-list-dropdown-item"
          onClick={() => {
            setFilterDocType(doctype);
            setDocTypeDropdownVisible(false);
          }}
        >
          {doctype}
        </div>
      ))}
    </div>
  )}
</th>
            <th>
              Status
              <img
                src={DownArrow}
                alt="Dropdown"
                className="status-list-dropdown-icon"
                onClick={() => handleDropdownToggle("status")}
              />
              {isStatusDropdownVisible && (
                <div ref={statusDropdownRef} className="status-dropdown-list">
                  {status.map((status) => (
                    <div
                      key={status}
                      className="status-list-dropdown-item"
                      onClick={() => {
                        setFilterStatus(status);
                        setIsStatusDropdownVisible(false);
                      }}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((row, index) => (
            <tr key={index}>
              <td>{row.declarationNumber}</td>
              <td>
                <a
                  href={row.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
