import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DocumentList.css";
import DownArrow from "../../assets/images/down-arrow.png";
import DescSort from "../../assets/images/desc-sort.png";

const DocumentList = () => {
   const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(0);
  const documents = [
    { declarationNumber: "1234567890123",fileName: "File1.pdf",fileUrl: "https://example.com/files/File1.pdf",updatedDate: "2024-12-01",docType: "Invoice",status: "Pending",},
    { declarationNumber: "9876543210987",fileName: "File2.pdf",fileUrl: "https://example.com/files/File2.pdf",updatedDate: "2024-11-20",docType: "Packing List",status: "Rejected",},
    { declarationNumber: "4125364850617",fileName: "File3.pdf",fileUrl: "https://example.com/files/File3.pdf",updatedDate: "2024-10-15",docType: "Declaration",status: "Approved",},
    { declarationNumber: "2233445566778",fileName: "File4.pdf",fileUrl: "https://example.com/files/File4.pdf",updatedDate: "2024-09-10",docType: "Delivery Order",status: "Pending", },
    { declarationNumber: "5678901234567",fileName: "File5.pdf",fileUrl: "https://example.com/files/File5.pdf",updatedDate: "2025-01-02",docType: "Invoice",status: "Approved", },
    { declarationNumber: "3456789033445",fileName: "File6.pdf",fileUrl: "https://example.com/files/File6.pdf",updatedDate: "2024-11-12",docType: "AWS/BOL",status: "Rejected", },
    { declarationNumber: "2345678901234",fileName: "File7.pdf",fileUrl: "https://example.com/files/File7.pdf",updatedDate: "2024-06-11",docType: "Declaration",status: "Pending",},
    { declarationNumber: "9134572189021",fileName: "File8.pdf",fileUrl: "https://example.com/files/File8.pdf",updatedDate: "2024-08-10",docType: "Packing List",status: "Rejected",},
    { declarationNumber: "8134976321728",fileName: "File9.pdf",fileUrl: "https://example.com/files/File9.pdf",updatedDate: "2024-09-05",docType: "Delivery Order",status: "Approved",},
    { declarationNumber: "9899765546112",fileName: "File10.pdf",fileUrl: "https://example.com/files/File10.pdf",updatedDate: "2024-10-06",docType: "Invoice",status: "Pending", },
    { declarationNumber: "5676432890126",fileName: "File11.pdf",fileUrl: "https://example.com/files/File11.pdf",updatedDate: "2024-11-14",docType: "AWS/BOL",status: "Approved", },
    { declarationNumber: "7689076512412",fileName: "File12.pdf",fileUrl: "https://example.com/files/File12.pdf",updatedDate: "2024-07-09",docType: "Declaration",status: "Rejected", },
  ];

  const [filterDate, setFilterDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDocTypeDropdownVisible, setDocTypeDropdownVisible] = useState(false);
  const [isStatusDropdownVisible, setIsStatusDropdownVisible] = useState(false);
  const [declarationInput, setDeclarationInput] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [filterDocType, setFilterDocType] = useState("All");
  const [currentDocument, setCurrentDocument] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [suggestions, setSuggestions] = useState([]);
  const [isAscSort, setIsAscSort] = useState(false);

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
    setCurrentPage(0);
    setFilteredDocuments(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filterDate, declarationInput, filterDocType, filterStatus]);

  const handlePageChange = (direction) => {
    const totalItems = filteredDocuments.length; // Use filtered documents for pagination
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
    let newPage = currentPage;
  
    if (direction === "next" && currentPage < totalPages - 1) {
      newPage += 1;
    } else if (direction === "prev" && currentPage > 0) {
      newPage -= 1;
    }
  
    setCurrentPage(newPage);
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
    "AWS/BOL",
    "Country Of Origin",
  ];

  const status = [
    "All",
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
            <th>Declaration Number
              <button className="document-list_desc-sort" onClick={handleDescSort}>
              <img src={DescSort} alt="DescSort" className="doc-list_desc-sortimg" />
              </button>
              <button className="document-list_asc-sort" onClick={handleAscSort}>
              <img src={DescSort} alt="AscSort" className="doc-list_asc-sortimg" />
              </button>
            </th>
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
          {filteredDocuments
          .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
          .map((row, index) => (
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
              <td><span className={`dl-documenttable_status text-xs font-medium dl-py-1 dl-px-2 rounded 
                    ${row.status === 'Pending' ? 'dl-bg-yellow-100 dl-text-yellow-800' : 
                      row.status === 'Rejected' ? 'dl-bg-red-100 dl-text-red-800' : 
                      'dl-bg-green-100 dl-text-green-800'}`}>{row.status} </span></td>
        </tr>
        ))}
        </tbody>
      </table>
      <button className="document-list_prev-button" onClick={() => handlePageChange("prev")} disabled={currentPage === 0}>Previous</button>
      <button className="document-list_next-button" onClick={() => handlePageChange("next")} 
            disabled={(currentPage + 1) * ITEMS_PER_PAGE >= filteredDocuments.length}>Next</button>
    </div>
  );
};

export default DocumentList;
