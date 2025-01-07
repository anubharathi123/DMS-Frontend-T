import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./verifydoc.css";
import DropDownArrow from "../../assets/images/dropdown-arrow.png";
import DescSort from "../../assets/images/desc-sort.png";

const VerifyDoc = () => {
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(0);
  const [documents] = useState([
    { declarationNumber: "1234567890123", FileName: "IN-345", updatedDate: "2024-12-15", documentType: "Invoice", downloadUrl: "./hello.pdf" },
    { declarationNumber: "9876543210123", FileName: "DE-446", updatedDate: "2024-12-10", documentType: "Declaration", downloadUrl: "/downloads/sample2.xlsx" },
    { declarationNumber: "1112233445566", FileName: "PL-12", updatedDate: "2024-12-08", documentType: "Packing List", downloadUrl: "/downloads/sample3.xlsx" },
    { declarationNumber: "2233445566778", FileName: "DO-22", updatedDate: "2024-09-10", documentType: "Delivery Order", downloadUrl: "/downloads/sample4.pdf" },
    { declarationNumber: "5678901234567", FileName: "IN-90", updatedDate: "2025-01-02", documentType: "Invoice", downloadUrl: "/downloads/sample5.pdf" },
    { declarationNumber: "3456789033445", FileName: "AWS-23", updatedDate: "2024-11-12", documentType: "AWS/BOL", downloadUrl: "/downloads/sample6.pdf" },
    { declarationNumber: "8766902314267", FileName: "PL-35", updatedDate: "2024-10-11", documentType: "Packing List", downloadUrl: "/downloads/sample7.docx" },
    { declarationNumber: "9187654321249", FileName: "DE-96", updatedDate: "2024-06-02", documentType: "Declaration", downloadUrl: "/downloads/sample8.xlsx" },
    { declarationNumber: "9182736456748", FileName: "IN-55", updatedDate: "2024-02-09", documentType: "Invoice", downloadUrl: "/downloads/sample9.xlsx" },
    { declarationNumber: "8766564491237", FileName: "AWS-40", updatedDate: "2024-10-20", documentType: "AWS/BOL", downloadUrl: "/downloads/sample10.pdf" },
    { declarationNumber: "6789012345678", FileName: "DO-90", updatedDate: "2024-08-23", documentType: "Delivery Order", downloadUrl: "/downloads/sample11.pdf" },
    { declarationNumber: "8292351783291", FileName: "DE-23", updatedDate: "2024-07-14", documentType: "Declaration", downloadUrl: "/downloads/sample12.pdf" },
  ]);

  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [filterDocType, setFilterDocType] = useState("All");
  const [isDocTypeDropdownOpen, setIsDocTypeDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [declarationInput, setDeclarationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [isAscSort, setIsAscSort] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  const applyFilters = () => {
    let filtered = [...documents];
    if (filterDocType !== "All") {
      filtered = filtered.filter((doc) => doc.documentType === filterDocType);
    }
    if (filterDate) {
      const formattedDate = filterDate.toISOString().split("T")[0];
      filtered = filtered.filter((doc) => doc.updatedDate === formattedDate);
    }
    if (declarationInput) {
      filtered = filtered.filter((doc) =>
        doc.declarationNumber.includes(declarationInput)
      );
    }
    setCurrentPage(0);
    setFilteredDocuments(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filterDate, declarationInput, filterDocType]);

  const handlePageChange = (direction) => {
    const totalItems = filteredDocuments.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    let newPage = currentPage;

    if (direction === "next" && currentPage < totalPages - 1) {
      newPage += 1;
    } else if (direction === "prev" && currentPage > 0) {
      newPage -= 1;
    }

    setCurrentPage(newPage);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d{0,13}$/.test(inputValue)) {
      setDeclarationInput(inputValue);

      if (inputValue.length === 13) {
        const matchingSuggestions = documents
          .filter((doc) => doc.declarationNumber.startsWith(inputValue))
          .map((doc) => doc.declarationNumber);

        setSuggestions(matchingSuggestions);
      } else {
        setSuggestions([]);
      }

      if (inputValue.length === 13) {
        applyFilters();
      } else {
        setFilteredDocuments(documents);
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
    setIsDocTypeDropdownOpen(false);
  };

  const toggleDocTypeDropdown = () => {
    setIsDocTypeDropdownOpen((prev) => !prev);
    setIsCalendarOpen(false);
  };

  const handleAction = (actionType) => {
    if (selectedDocument) {
      alert(`${actionType} action performed for: ${selectedDocument.FileName}`);
      removeSelectedDocument(); // Remove the selected document from the table
    }
  };

  const removeSelectedDocument = () => {
    if (selectedDocument) {
      const updatedDocuments = documents.filter(
        (doc) => doc.declarationNumber !== selectedDocument.declarationNumber
      );
      const updatedFilteredDocuments = filteredDocuments.filter(
        (doc) => doc.declarationNumber !== selectedDocument.declarationNumber
      );
  
      setSelectedDocument(updatedDocuments); // Update the original documents
      setFilteredDocuments(updatedFilteredDocuments); // Update the filtered documents
      setSelectedDocument(null); // Reset selected document
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
        setIsDocTypeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="verify-container">
      <h2 className="verify-h2">Verify Document</h2>

      <div className="verify-declaration-number">
        <label className="verify-declaration_no">
          <b>Declaration Number: </b>
        </label>
        <input id="declarationNumber" type="text" className="verify-declaration-no" value={declarationInput}
          onChange={handleInputChange}
          placeholder="Enter 13-digit DecNum"
        />

        <button className="verify-approvebtn1" onClick={() => handleAction("Approve")} style={{ marginRight: "10px" }}>
          Approve
        </button>
        <button className="verify-rejectbtn1" onClick={() => handleAction("Reject")}>
          Reject
        </button>
        <button className="verifydoc-reset-btn" onClick={resetFilters}>
          Reset Filters
        </button>
        {suggestions.length > 0 && (
          <ul className="verify-suggestion-box">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => selectSuggestion(suggestion)} className="verify-suggestion-item">
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="verify-form-section">
        <table className="verify-document-table">
          <thead>
            <tr>
              <th>
                Declaration Number
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
                    <DatePicker selected={filterDate} onChange={(date) => { setFilterDate(date); setIsCalendarOpen(false);
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
            {filteredDocuments
              .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
              .map((doc, index) => (
                <tr key={index}>
                  <td>{doc.declarationNumber}</td>
                  <td>
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="verify-file-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedDocument(doc);
                      }}
                    >
                      {doc.FileName || "View Document"}
                    </a>
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
      <button
        className="verifydoc_prev-button"
        onClick={() => handlePageChange("prev")}
        disabled={currentPage === 0}
      >
        Previous
      </button>
      <button className="verifydoc_next-button" onClick={() => handlePageChange("next")} 
            disabled={(currentPage + 1) * ITEMS_PER_PAGE >= filteredDocuments.length}>
          Next
        </button>
    </div>
  );
};

export default VerifyDoc;
       
