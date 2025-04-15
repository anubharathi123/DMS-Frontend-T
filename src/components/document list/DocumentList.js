import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import apiServices, {API_URL1} from '../../ApiServices/ApiServices';
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
  const [selectedFile, setSelectedFile] = useState(null); // To store selected file URL
  const [filteredBackupData, setFilteredBackupData] = useState([]);
  const [assignedUserInfo, setAssignedUserInfo] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [reviewers, setReviewers] = useState([]);       // list of reviewers
  const [isEditing, setIsEditing] = useState(true); // allow edit initially if status is PENDING
  const [userRole, setUserRole] = useState(null); // Store user role
  const searchInfoRef = useRef(null); // Reference for search info popup
  const url = API_URL1
  const navigate = useNavigate();
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
        // Function to handle clicks outside the calendar
        const handleClickOutside = (event) => {
          if (calendarRef.current && !calendarRef.current.contains(event.target)) {
            setIsCalendarOpen(false);
          }
        };
    
        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);
    
        // Clean up event listener on component unmount
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);

        const response = await apiServices.getDocuments();
        console.log(response)
        const documents = response.documents.map(doc => ({
          
          docId:doc.id, 
          assigned_to: doc.assigned_to?.username || null,
          declarationNumber: doc.declaration_number,
          file: doc.current_version?.file_path,
          fileName: doc.current_version?.file_path ? doc.current_version.file_path: '',
          updatedDate: doc.updated_at,
          documentType: doc.document_type?.name || '',
          status: doc.status || '',
          rejectionReason: doc.file_approval_history?.rework_reason?.description || '',
          fileUrl: doc.fileUrl || '',
          viewed: false,
          version: doc.current_version?.version_number,
        })).sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
        // if(documents.status === "PENDING"){
        //   console.log("Pending Doc ID", documents.id)
        // }

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

  const fetchAssignedUser = async (id) => {
    try {
      const assignedUserData = await apiServices.assignedUser(id);
      const userid = assignedUserData?.id;
      console.log("✅ Assigned User Data:", assignedUserData?.id);
      
      // If you want to pass this data somewhere:
      // setAssignedUserData(assignedUserData);
    } catch (error) {
      console.error("❌ Error fetching assigned user:", error);
    }
  };
  

  // useEffect(() => {
  //   if (assignedUser) {
  //     fetchAssignedUser(assignedUser);
  //   }
  // }, [assignedUser]);
  

  useEffect(() => {
    const fetchReviewer = async () => {
      try {
        setIsLoading(true);
        const data = await apiServices.reviewerlist();
        console.log("Reviewer List:", data);
        console.log("✅ Organization ID:", data.organization_id);
        console.log("✅ Organization Name:", data.organization_name);

        const reviewers = data.reviewer_list;

        if (Array.isArray(reviewers) && reviewers.length > 0) {
          reviewers.forEach((reviewer, index) => {
            // console.log(`🔹 Reviewer ${index + 1}:`);
            // console.log("  ID:", reviewer.id);
            // console.log("  Name:", reviewer.auth_user.first_name);
            // console.log("  Username:", reviewer.auth_user.username);
            // console.log("  Email:", reviewer.auth_user.email);
            // console.log("  Mobile:", reviewer.mobile);
            // console.log("  Role:", reviewer.role?.name);
          });

          // Pass the reviewers data to a state or function for further use
          setReviewers(reviewers.map(reviewer => ({
            id: reviewer.id,
            name: reviewer.auth_user.first_name,
            username: reviewer.auth_user.username,
            email: reviewer.auth_user.email,
            mobile: reviewer.mobile,
            role: reviewer.role?.name,
          })));
        } else {
          console.log("ℹ️ No reviewers found.");
        }

      } catch (error) {
        console.error("❌ Error fetching reviewer list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewer();
  }, []);
  
  
  
  
  // Call the function here, not inside itself

  
  
  // Call the function (once)
  
  const filteredData1 = filteredData.filter((item) => {
    if (filter === '') {
      return item.declarationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.updatedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return item.status === filter && (
        item.declarationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.updatedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleSelectChange = (e, docId) => {
    const selectedUserId = e.target.value;
  
    setAssignedUsers((prev) => ({
      ...prev,
      [docId]: selectedUserId,
    }));
  
    console.log("🧑 Selected Reviewer ID:", selectedUserId);
    console.log("📄 Document ID:", docId);
  
    const fetchAssignedUser = async (userId, documentId) => {
      try {
        const assignedUserData = await apiServices.assignedUser(userId, documentId);
        console.log("✅ Assigned User Data:", assignedUserData);
        setAssignedUserInfo(assignedUserData.map(assignedUser => ({
          assigned_to: assignedUser.assigned_to,
          docID:assignedUser.document_id,
          message: assignedUser.message,
        }))); // Set state to display in UI
      } catch (error) {
        console.error("❌ Error fetching assigned user:", error);
      }
    };
  
    fetchAssignedUser(selectedUserId, docId);
  };

  
  

  // useEffect (() => {
  //   if (assignedUserData) {
  //     fetchAssignedUser(assignedUserData);
  //   }
  // }, [assignedUserData]);
  
  

  // const handleEditClick = () => {
  //   setIsEditing(true); // re-enable editing
  // };

  const handleBackupClick = () => {
    navigate('/backup');
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

  const handleOpenFile = (msa_doc) => {
    if (msa_doc) {
        setSelectedFile(`${url}${msa_doc}`);
    } else {
        alert("No file available.");
    }
};

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

        console.log("Response:", response);

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
        console.log(blob)
        const url = window.URL.createObjectURL(blob);
        console.log(url)

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

const handleClosePopup = () => {
  setSelectedFile(null);
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
      const response = await apiServices.media({ file });
  
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
            <th className="documenttable_th px-6 py-3">Assign To</th>
            <th className="documenttable_th px-6 py-3">Status</th>
            <th className="documenttable_th px-6 py-3">Comments</th>
          </tr>
        </thead>
        <tbody className="documenttable_tbody">
          { paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
            <tr key={index} className="documenttable_row bg-white border-b hover:bg-gray-50">
              
              <td className="documenttable_td px-6 py-4">{item.declarationNumber}</td>
              <td className="documenttable_td px-6 py-4">
              {item.fileName ? (
                                    <button
                                        title={item.fileName}
                                        className="file-button"
                                        onClick={() => handleOpenFile(item.fileName)}
                                    >
                                        {item.fileName.split('/').pop().substring(0, 20) + '...'}
                                    </button>
                                ) : (
                                    "Null"
                                )}
              {/* <a
                      title={item.fileName.split('/').pop()}
                      onClick={() => handleDownloadFile(`${url}/${item.fileName}`, item.fileName.split('/').pop())}
                      style={{ cursor: "pointer", textDecoration: "underline" }}>
                {item.fileName.split('/').pop().substring(0, 20) + '...'}
              </a> */}
                      </td>

              <td className="documenttable_td px-6 py-4">{new Date(item.updatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              
              <td className="documenttable_td px-6 py-4">{mappings[item.documentType.toLowerCase()] || item.documentType}</td>
              <td className="documenttable_td px-6 py-4">
              {item.status === "PENDING" ? (
  isEditing ? (
    <select
      className="documenttable_select"
      value={assignedUsers[item.docId] || ""}
      onChange={(e) => handleSelectChange(e, item.docId)}
    >
      {reviewers.map((reviewer) => (
        <option key={reviewer.id} value={reviewer.id}>
          {reviewer.name}
        </option>
      ))}
    </select>
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>
        {assignedUsers[item.docId]
          ? reviewers.find((r) => r.id === assignedUsers[item.docId])?.name || 'Unknown'
          : 'Not assigned'}
      </span>
    </div>
  )
) : (
  // "Assigned:Reviewer"
 <>{item?.assigned_to}</>
)}
              </td>
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
              {item.status === "REJECTED" ? (
    <div className="tooltip-container">
      <span className="tooltip-trigger">{item.rejectionReason.split('/').pop().substring(0,20)+'.......'}</span>
      <div className="tooltip-content">{item.rejectionReason}</div>
    </div>
  ) : (
    <span>----</span>
  )}
                     
              </td>
            </tr>
            ))
          ):(
            <tr>
              <td colSpan="4" className="organization-table-td">
                  No documents found...
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="documenttable_pagination flex justify-between mt-4">
        <div className="documenttable_pageinfo flex items-center">
          <p className="documenttable_pageinfo_text mr-2">Page {currentPage} of {Math.ceil(filteredData1.length / rowsPerPage)}</p>
        </div>

        {selectedFile && (
    <div className="popup-overlay">
        <div className="popup-content">
            <button className="popup-close" onClick={handleClosePopup}>✖</button>
            <iframe 
                src={selectedFile} 
                title="Document Viewer" 
                className="popup-iframe"
                style={{ width: "100%", height: "500px" }} 
            />
        
              <button className='file-download' >
                Download
            </button>
        </div>
    </div>
)}

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