import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import apiServices from '../../ApiServices/ApiServices';
import './DocumentList.css';
import Loader from "react-js-loader";
import { IoMdInformationCircleOutline } from "react-icons/io";
import refreshIcon from '../../assets/images/refresh-icon.png';


const DocumentTable = () => {
  const initialState = {
    documents: [],
    loading: false,
  };

  const role = localStorage.getItem('role');
  const [documents, setDocuments] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMessage, setActionMessage] = useState('');
  const calendarRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchInfo, setShowSearchInfo] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredBackupData, setFilteredBackupData] = useState([]);
  const [userRole, setUserRole] = useState(null); // Store user role
  const searchInfoRef = useRef(null); // Reference for search info popup
  const url = "http://localhost:8000"
  const mappings = {
    'declaration': 'Declaration',
    'invoice': 'Invoice',
    'packinglist': 'Packing List',
    'awsbol': 'AWS/BOL',
    'countryoforigin': 'Certificate of Origin',
    'deliveryorder': 'Delivery Order',
    'other': 'Others',
  };
  const handleSearchInfo = () => {
    setShowSearchInfo(!showSearchInfo);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInfoRef.current && !searchInfoRef.current.contains(event.target)) {
        setShowSearchInfo(false);
      }
    };

    if (showSearchInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchInfo]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);

        const response = await apiServices.getDocuments();
        console.log(response)
        const documents = response.documents.map(doc => ({
          declarationNumber: doc.declaration_number,
          file: doc.current_version?.file_path,
          fileName: doc.current_version?.file_path ? doc.current_version.file_path.split('/').pop() : '',
          updatedDate: doc.updated_at,
          documentType: doc.document_type?.name || '',
          status: doc.status || '',
          rejectionReason: doc.file_approval_history?.rework_reason?.description || '',
          fileUrl: doc.fileUrl || '',
          viewed: false,
          version: doc.current_version?.version_number,
        })).sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));

        setData(documents);
        setFilteredData(documents);

        if (documents.length === 0) {
          setActionMessage('No files are available for approval.');
        }
      } catch (error) {
        // console.error('Error fetching documents:', error);
        // setActionMessage('Error fetching documents. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredData1 = filteredData.filter((item) => {
    if (filter === '') {
      return item.declarationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.updatedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return item.status === filter && (
        item.declarationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.updatedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  useEffect(() => {
    const filteredDocuments = data.filter((item) => {
      if (filterDate) {
        const itemDate = new Date(item.updatedDate);
        const selectedDate = new Date(filterDate);
        return itemDate.toLocaleDateString() === selectedDate.toLocaleDateString();
      }
      return true;
    });

    setFilteredData(filteredDocuments);
  }, [filterDate, data]);

  const paginatedData = filteredData1.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleBackupClick = () => {
    setIsBackupOpen(true);
  };

  const handleResetFilter = (e) => {
    setSearchTerm('');
    setFilter(e.target.value);
    setFilterDate(null);
    setIsCalendarOpen(false);
    setCurrentPage(1);
};

  const handleCloseBackup = () => {
    setIsBackupOpen(false);
  };

  // const handleRejection = async (declarationNumber,status) => {
  //   try {
  //     console.log('Rejection:', declarationNumber, status);
      
  //   }
  // }

  const handleDateChange = () => {
    if (startDate && endDate) {
      const filteredDocs = data.filter(doc => {
        const docDate = new Date(doc.updatedDate);
        return docDate >= startDate && docDate <= endDate;
      });
      setFilteredBackupData(filteredDocs);
    }
  };

  useEffect(() => {
    handleDateChange();
  }, [startDate, endDate]);

  

  const handleDownload = async () => {
    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    console.log("Selected Dates:", startDate, endDate);
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // ✅ Validate Dates
    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
        alert("Invalid date format. Please select valid dates.");
        return;
    }
    if (parsedStartDate > parsedEndDate) {
        alert("Start date cannot be greater than the end date.");
        return;
    }

    try {
        // ✅ Fetch ZIP file from API
        const response = await apiServices.rangesearch({
            params: {
                start_date: startDate, 
                end_date: endDate
            },
            responseType: 'blob'  // Ensures the response is a file
        });

        console.log("Response status:", response.status);

        if (response.status === 404) {
            alert("No files found for the selected date range.");
            return;
        }

        // ✅ Check for a valid ZIP file
        if (!response || response.size === 0) {
            throw new Error("Received an empty or invalid file.");
        }

        // ✅ Download the ZIP file
        const blob = new Blob([response], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `documents_${startDate}_${endDate}.zip`);
        document.body.appendChild(link);
        link.click();

        // ✅ Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        console.log("Download successful.");
    } catch (error) {
        console.error("Download error:", error);
        alert(error.message || "Error downloading files. Please try again.");
    }
};



  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(prev => !prev);
  };

  const handleRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
  };

  const handleDownloadFile = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const filedownload = async (file) => {
    try {
      const response = await apiServices.media1({ file });
  
      if (!response || response.status !== 200) {
        throw new Error("Failed to download file");
      }
  
      // Convert response to Blob
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
  
      // Create a download link
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.split('/').pop()); // Extracts the file name
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download the file. Please try again.");
    }
  };

  return (
    <div className="documenttable_container">
      <h1 className="documentlist_header">Document Details</h1>
      {(role === "ADMIN") && (
  <button className='doc-backup' onClick={handleBackupClick}>Backup</button> 
)}
 
      {isBackupOpen && (
        <>
        <div className="backup-overlay" onClick={handleCloseBackup}/>
        <div className="backup-popup">
          <div className="backup-popup-content">
            <h2 className='backup-popup-h2'>Backup Documents</h2>
            <label className='popup-content-label'>Start Date:</label>
            {/* <input type='date' className="popup-content-input" selected={startDate} onChange={(date) => setStartDate(date)} /> */}
            <input
  type="date"
  className="popup-content-input"
  value={startDate} 
  onChange={(e) => setStartDate(e.target.value)} 
/>
            <label className='popup-content-label'>End Date:</label>
            {/* <input type='date' className="popup-content-input" selected={endDate} onChange={(date) => setEndDate(date)} /> */}
            <input
  type="date"
  className="popup-content-input"
  value={endDate} 
  onChange={(e) => setEndDate(e.target.value)} 
/>
            {/* <h3 className='backup-popup-h3'>Documents Included:</h3> */}
            <div className='backup-documentlist'>
            {/* <ul className="backup-documentlist-ul">  */}
            {/* {filteredBackupData.length > 0 ? (
              filteredBackupData.map((doc, index) => (
                <li className="backup-documentlist-li" key={index}>{doc.fileName} ({new Date(doc.updatedDate).toLocaleDateString()})</li>
              ))
            ) : (
              <li>No documents found for selected dates.</li>
            )
            } */}
            {/* </ul> */}
            </div>
            <div className='backup-actions'>
            <button className="document-downloadbtn" onClick={handleDownload}>Download</button>
            <button className="backup-closebtn" onClick={handleCloseBackup}>Close</button>
            </div>
          </div>
        </div>
        </>
      )}
      {actionMessage && <div className="documenttable_action_message">{actionMessage}</div>}
      <div className="documenttable_controls flex justify-between mb-4">
        <div className="documenttable_search flex items-center">
          <Search className="documenttable_search_icon" />
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            className="documenttable_search_input py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
          />
          <button className='document_searchinfo' onClick={handleSearchInfo}>
            <IoMdInformationCircleOutline/> 
            </button>
            {showSearchInfo && (
              <div ref={searchInfoRef} className="search-info-popup">
                  Date filter format should be like this: yyyy-mm-dd
              </div>
            )}
        </div>
        <div className="documenttable_filter flex items-center">
          <label className="documenttable_filter_label mr-2">Filter by Status:</label>
          <select value={filter} onChange={handleFilter} className="documenttable_filter_select py-2 pl-10 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Reject</option>
            <option value="APPROVED">Approve</option>
          </select>
        </div>

        <div className="documenttable_rows flex items-center">
          <label className="documenttable_rows_label mr-2">Rows per Page:</label>
          <select value={rowsPerPage} onChange={handleRowsPerPage} className="documenttable_rows_select py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
      <table className="documenttable_table w-full text-sm text-left text-gray-500">
        <thead className="documenttable_thead text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="documenttable_th px-6 py-3">Declaration Number</th>
            <th className="documenttable_th px-6 py-3">File Name</th>
            <th className="documenttable_th px-6 py-3">Updated Date
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
            <th className="documenttable_th px-6 py-3">Doc Type</th>
            <th className="documenttable_th px-6 py-3">Status</th>
            <th className="documenttable_th px-6 py-3">Comments</th>
          </tr>
        </thead>
        <tbody className="documenttable_tbody">
          {paginatedData.map((item, index) => (
            <tr key={index} className="documenttable_row bg-white border-b hover:bg-gray-50">
              
              <td className="documenttable_td px-6 py-4">{item.declarationNumber}</td>
              <td className="documenttable_td px-6 py-4">
              <a
              title={item.fileName.split('/').pop()}
  onClick={() => handleDownloadFile(`${url}/${item.fileName}`, item.fileName.split('/').pop())}
  style={{ cursor: "pointer", textDecoration: "underline" }}
>
  {item.fileName.split('/').pop().substring(0, 20) + '...'}
</a>
              </td>

              <td className="documenttable_td px-6 py-4">{new Date(item.updatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              
              <td className="documenttable_td px-6 py-4">{mappings[item.documentType.toLowerCase()] || item.documentType}</td>
              <td className="documenttable_td px-6 py-4">
                <span
                  data-tip={item.rejectionReason} 
                  className={`documenttable_status text-xs font-medium py-1 px-2 rounded 
                    ${item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                    'bg-green-100 text-green-800'}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                 
                </span>
              </td>
              <td className="documenttable_td px-6 py-4">
              {item.status === "REJECTED" && (
                        <span>{item.rejectionReason.split('/').pop().substring(0, 20) + '...'}</span>
                      )}
                {item.status == "APPROVED" && (
                        <span> NULL</span>
                      )}
                {item.status == "PENDING" && (
                        <span> NULL</span>
                      )}
                     
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="documenttable_pagination flex justify-between mt-4">
        <div className="documenttable_pageinfo flex items-center">
          <p className="documenttable_pageinfo_text mr-2">Page {currentPage} of {Math.ceil(filteredData1.length / rowsPerPage)}</p>
        </div>
        {/* Reset Filter Button */}
              {(searchTerm || filter || filterDate) && (
                     <button className="reset-filter-btn" onClick={handleResetFilter} 
                                disabled={!searchTerm && !filter && !filterDate}>
                                    Reset Filter 
                                    <img className='refresh-icon' src={refreshIcon}/>
                                    </button>
                                    )}
        <div className="documenttable_paging flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="documenttable_paging_button py-2 px-4 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredData1.length / rowsPerPage)}
            className="documenttable_paging_button py-2 px-4 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Next
          </button>
        </div>
        
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

export default DocumentTable;