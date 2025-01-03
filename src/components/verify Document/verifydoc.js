import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./verifydoc.css";
import DropDownArrow from "../../assets/images/dropdown-arrow.png";
import DescSort from "../../assets/images/desc-sort.png";

const App = () => {
  const [documents] = useState([
    {
      declarationNumber: "1234567890123",
      FileName: "IN-345",
      updatedDate: "2024-12-15",
      documentType: "Invoice",
      actions: "",
      downloadUrl: "/hello.pdf",
    },
    {
      declarationNumber: "9876543210123",
      FileName: "DE-446",
      updatedDate: "2024-12-10",
      documentType: "Declaration",
      actions: "",
      downloadUrl: "/downloads/sample2.docx",
    },
    {
      declarationNumber: "1112233445566",
      FileName: "PL-12",
      updatedDate: "2024-12-08",
      documentType: "Packing List",
      actions: "",
      downloadUrl: "/downloads/sample3.xlsx",
    },
    {
      declarationNumber: "2233445566778",
      FileName: "DO-22",
      updatedDate: "2024-09-10",
      documentType: "Delivery Order",
      actions: "",
      downloadUrl: "/downloads/sample4.pdf",
    },

    {
      declarationNumber: "5678901234567",
      FileName: "IN-90",
      updatedDate: "2025-01-02",
      documentType: "Invoice",
      actions: "",
      downloadUrl: "/downloads/sample5.pdf",
    },

    {
      declarationNumber: "3456789033445",
      FileName: "AWS-23",
      updatedDate: "2024-11-12",
      documentType: "AWS/BOL",
      actions: "",
      downloadUrl: "/downloads/sample6.pdf",
    },
  ]);

  const PDFViewer = ({ url }) => (
    <iframe
      src={url}
      style={{ width: "100%", height: "500px" }}
      title="PDF Viewer"
    ></iframe>
  );

  

  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [filterDocType, setFilterDocType] = useState("All");
  const [isDocTypeDropdownOpen, setIsDocTypeDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [declarationInput, setDeclarationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isAscSort, setIsAscSort] = useState(false);

  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...documents];

    // Filter by Document Type
    if (filterDocType !== "All") {
      filtered = filtered.filter((doc) => doc.documentType === filterDocType);
    }

    // Filter by Updated Date
    if (filterDate) {
      const formattedDate = filterDate.toISOString().split("T")[0];
      filtered = filtered.filter((doc) => doc.updatedDate === formattedDate);
    }

    // Filter by Declaration Number
    if (declarationInput) {
      filtered = filtered.filter((doc) =>
        doc.declarationNumber.includes(declarationInput)
      );
    }

    setFilteredDocuments(filtered);
  };
useEffect(() => {
    applyFilters();
  }, [filterDate, declarationInput, filterDocType]);

  // Handle input changes
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
  
    // Limit input to digits and maximum length of 13
    if (/^\d{0,13}$/.test(inputValue)) {
      setDeclarationInput(inputValue);
  
      // Filter only if the input is exactly 13 digits
      if (inputValue.length === 13) {
        const matchingSuggestions = documents
          .filter((doc) => doc.declarationNumber.startsWith(inputValue))
          .map((doc) => doc.declarationNumber);
  
        setSuggestions(matchingSuggestions);
      } else {
        setSuggestions([]);
      }
  
      // Apply filters only for valid 13-digit input
      if (inputValue.length === 13) {
        applyFilters();
      } else {
        setFilteredDocuments(documents); // Reset the filter if not 13 digits
      }
    }
  };

  const handleAscSort = () => {
    const sortedDocuments = [...filteredDocuments].sort((a, b) =>
      a.declarationNumber.localeCompare(b.declarationNumber)
    );
    setFilteredDocuments(sortedDocuments);
    setIsAscSort(true); // Set to true to indicate ascending sort is active
  };

  const handleDescSort = () => {
    const sortedDocuments = [...filteredDocuments].sort((a, b) =>
      b.declarationNumber.localeCompare(a.declarationNumber)
    );
    setFilteredDocuments(sortedDocuments);
    setIsAscSort(false); // Set to false to indicate descending sort is active
  };


  const handlePopupAction = (action) => {
    if (currentDocument) {
      setFilteredDocuments((prev) =>
        prev.filter((doc) => doc.declarationNumber !== currentDocument.declarationNumber)
      );
    }
    setPopupVisible(false);
    setCurrentDocument(null);
  };
  
  const resetFilters = () => {
    setFilterDate(null);
    setDeclarationInput("");
    setFilterDocType("All");
    setFilteredDocuments(documents);
  };

  const selectSuggestion = (suggestion) => {
    setDeclarationInput(suggestion);
    setSuggestions([]);
    applyFilters();
  };

  const handleDocTypeChange = (type) => {
    setFilterDocType(type);
    setIsDocTypeDropdownOpen(false);
    applyFilters();
  };

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
    setIsDocTypeDropdownOpen(false); // Close dropdown when calendar opens
  };

  const toggleDocTypeDropdown = () => {
    setIsDocTypeDropdownOpen((prev) => !prev);
    setIsCalendarOpen(false); // Close calendar when dropdown opens
  };

  const handleAction = (actionType) => {
    const updatedDocuments = filteredDocuments.map((doc, index) =>
      selectedRows.includes(index) ? { ...doc, actions: actionType } : doc
    );

    const remainingDocuments = updatedDocuments.filter(
      (doc) => doc.actions !== "Approved" && doc.actions !== "Rejected"
    );

    setFilteredDocuments(remainingDocuments);
    setSelectedRows([]);
  };

  const handleFileClick = (downloadUrl) => {
    window.open(downloadUrl, "_blank");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        containerRef.current.contains(event.target)
      ) {
        if (
          calendarRef.current &&
          !calendarRef.current.contains(event.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsCalendarOpen(false);
          setIsDocTypeDropdownOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="verify-container">
      <h2 className="verify-h2" >Verify Document</h2>

      {/* Declaration Number Search */}
      <div className="verify-declaration-number">
        <label className="verify-declaration_no">
          <b>Declaration Number: </b>
        </label>
        <input
          id="declarationNumber"
          type="text"
          className="verify-declaration-no"
          value={declarationInput}
          onChange={handleInputChange}
          placeholder="Enter 13-digit DecNum"
        />

        
        <button
          className="verify-approvebtn1"
          onClick={() => handleAction("Approved")}
          style={{ marginRight: "10px" }}
        >
          Approve
        </button>
        <button className="verify-rejectbtn1" onClick={() => handleAction("Rejected")}>
          Reject
        </button>
        <button className="verifydoc-reset-btn" onClick={resetFilters}>Reset Filters</button>

        {/* Suggestion Box */}
        {suggestions.length > 0 && (
          <ul className="verify-suggestion-box">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                className="verify-suggestion-item"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Document Table */}
      <div className="verify-form-section">
        <table className="verify-document-table">
          <thead>
            <tr>
              <th>Declaration Number
              <button className="verifydoc_desc-sort" onClick={handleDescSort}>
              <img src={DescSort} alt="DescSort" className="verifydoc_desc-sortimg" />
              </button>
              <button className="verifydoc_asc-sort" onClick={handleAscSort}>
              <img src={DescSort} alt="AscSort" className="verifydoc_asc-sortimg" />
              </button>
              </th>
              <th>File Name</th>
              <th>
                Updated Date
                <button className="verify-calendarbtn" onClick={toggleCalendar}>
                  📅
                </button>
                {isCalendarOpen && (
                  <div ref={calendarRef} style={{ zIndex: 1000 }}>
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
                Document Type
                <button
                  className="verify-show-doc-type-btn"
                  onClick={toggleDocTypeDropdown}
                >
                  <img
                    src={DropDownArrow}
                    alt="dropdown-arrow"
                    className="verify-dropdown-arrow"
                  />
                </button>
                {isDocTypeDropdownOpen && (
                  <div ref={dropdownRef} className="verifydoc-dropdown-list">
                    <ul className="verify-doc-list">
                      <li
                        onClick={() => handleDocTypeChange("All")}
                        className="verify-allbtn"
                      >
                        All
                      </li>
                      <li
                        onClick={() => handleDocTypeChange("Declaration")}
                        className="verify-declaration"
                      >
                        Declaration
                      </li>
                      <li
                        onClick={() => handleDocTypeChange("Invoice")}
                        className="verify-invoice"
                      >
                        Invoice
                      </li>
                      <li
                        onClick={() => handleDocTypeChange("Packing List")}
                        className="verify-packing-list"
                      >
                        Packing List
                      </li>
                    </ul>
                  </div>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, index) => (
              <tr key={index}>
                <td>{doc.declarationNumber}</td>
                <td>
                <span
                    onClick={() => handleFileClick(doc.downloadUrl, doc)}
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                  >
                    {doc.FileName || "View Document"}
                  </span>
                </td>
                <td>{doc.updatedDate}</td>
                <td>{doc.documentType}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() =>
                      setSelectedRows((prev) =>
                        prev.includes(index)
                          ? prev.filter((i) => i !== index)
                          : [...prev, index]
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default App;
