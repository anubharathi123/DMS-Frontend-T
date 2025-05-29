import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import apiServices, { API_URL1 } from '../../ApiServices/ApiServices';
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [selectedReviewer1, setSelectedReviewer1] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
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


const fetchDocuments = async () => {
  try {
    setIsLoading(true);
    console.log("Fetching documents...");
    const response = await apiServices.getDocuments();

    // Use Promise.all to fetch declaration dates for all documents concurrently
    const documentsWithDate = await Promise.all(
      response.documents.map(async (doc) => {
        let declarationDate = null;
        try {
          const declResp = await apiServices.getDeclarationByNumber(doc.declaration_number);
          declarationDate = declResp?.date || null;
        } catch (error) {
          console.warn(`Failed to fetch declaration date for ${doc.declaration_number}`, error);
        }
        
        return {
          docId: doc.id,
          assigned_to: doc.assigned_to?.first_name || null,
          declarationNumber: doc.declaration_number,
          file: doc.current_version?.file_path,
          fileName: doc.current_version?.file_path ? doc.current_version.file_path : '',
          updatedDate: doc.updated_at,
          documentType: doc.document_type?.name || '',
          status: doc.status || '',
          rejectionReason: doc.file_approval_history?.rework_reason?.description || '',
          fileUrl: doc.fileUrl || '',
          viewed: false,
          version: doc.current_version?.version_number,
          declarationDate,  // <-- add declaration date here
        };
      })
    );

    // Sort by updatedDate descending
    const sortedDocuments = documentsWithDate.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));

    setData(sortedDocuments);
    setFilteredData(sortedDocuments);

    if (sortedDocuments.length === 0) {
      setActionMessage('No files are available for approval.');
    }
  } catch (error) {
    // You can handle error if needed
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {


    fetchDocuments();
  }, []);


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
        alert("Assigned User Data Successfully");
        fetchDocuments();
      } catch (error) {
        alert("❌ Error fetching assigned user");
        console.error("❌ Error fetching assigned user:", error);
      }
    };

    fetchAssignedUser(selectedUserId, docId);
  };


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

  const handlePageChange = (pageNumber) => {
    setSelectedRows([]); // Clear selected rows when changing pages

    setCurrentPage(pageNumber);
  };


  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleBulkAssign = async (reviewer) => {
    try {
      console.log(reviewer);
      setIsLoading(true);

      const result = await apiServices.BulkAssign(reviewer);
      console.log(result);
      window.location.reload();
      // fetchDocuments();
      // fetchDocuments();
    } catch (error) {
      console.error("Error during bulk assign:", error);
      alert("Failed to assign reviewer. Please try again.");
    } finally {
      setIsLoading(false);
      // fetchDocuments();
    }
  }

  const handleReviewerSelect = (id) => {
    handleBulkAssign(id);
    setShowModal(false); // close the popup after selection
  };

  // const handleSelectChangee = (e) => {
  //   const reviewerId = e.target.value;
  //   setSelectedReviewer(reviewerId);
  //   handleBulkAssign(reviewerId);
  //   setShowModal(false); // Optional: Close popup after selection
  // };

  const handleSelectChangee = (e) => {
    setSelectedReviewer(e.target.value);
  };

  const handleSelectChangee1 = (e) => {
    setSelectedReviewer1(e.target.value);
  };

  const handleSave = () => {
    if (selectedReviewer) {
      handleBulkAssign(selectedReviewer);
      setShowModal(false); // close modal after saving
    } else {
      alert('Please select a reviewer');
    }
  };


  const handleSave1 = () => {
    if (selectedReviewer1) {
      handleSelectedAssignClick(selectedRows, selectedReviewer1);
      setShowModal1(false); // close modal after saving
      setSelectedRows([]); // Clear selected rows after saving
    } else {
      alert('Please select a reviewer');
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    popup: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      width: '300px',
      textAlign: 'center',
    },
    select: {
      padding: '10px',
      width: '100%',
      marginTop: '10px',
    },
    buttonGroup: {
      marginTop: '15px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    saveBtn: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    closeBtn: {
      padding: '8px 16px',
      backgroundColor: '#f44336',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };



  const handleCheckboxChange = (docId) => {
    // window.alert("Checkbox clicked for document ID: " + docId);
    setSelectedRows((prevSelected) =>
      prevSelected.includes(docId)
        ? prevSelected.filter((id) => id !== docId)
        : [...prevSelected, docId]
    );
    console.log("Selected Rows:", selectedRows);
  };


  const handleSelectedAssignClick = async (selectedRows, selectedReviewer) => {
    const result = await apiServices.SelectedAssign(selectedReviewer, selectedRows)
    console.log(result);
    fetchDocuments();
    // window.location.reload();


  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = paginatedData.map((item) => item.docId);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };



  console.log("paginatedData", paginatedData);
  console.log("reviewers", reviewers);

  return (
    <div className="documenttable_container">
      <h1 className="documentlist_header">Document Details</h1>
      {(role === "ADMIN") && (
        <>
          <div className='doc-backup-left'>
            {selectedRows.length > 0 &&
              <button className='doc-backup' onClick={() => setShowModal1(!showModal1)}>Assign Selected Documents</button>
            }
            <button className='doc-backup' onClick={handleBackupClick}>Backup</button>
            <button onClick={() => setShowModal(!showModal)} className='doc-backup'>
              {showModal ? 'Hide Popup' : 'Assign Reviewer'}
            </button>
          </div>

          <div>
            {showModal1 && (
              <div style={styles.overlay}>
                <div style={styles.popup}>
                  <h3>Total number of Pending Documents</h3>
                  <p>{selectedRows.length}</p>

                  <select
                    value={selectedReviewer1}
                    onChange={handleSelectChangee1}
                    style={styles.select}
                  >
                    <option value="" disabled>
                      -- Choose a reviewer --
                    </option>
                    {reviewers.map((reviewer) => (
                      <option key={reviewer.id} value={reviewer.id}>
                        {reviewer.name}
                      </option>
                    ))}
                  </select>

                  <div style={styles.buttonGroup}>
                    <button onClick={handleSave1} style={styles.saveBtn}>
                      Save
                    </button>
                    <button onClick={() => setShowModal1(false)} style={styles.closeBtn}>
                      Close
                    </button>
                  </div>
                </div>
              </div>

            )}

          </div>

          <div>

            {showModal && (
              <div style={styles.overlay}>
                <div style={styles.popup}>
                  <h3>Total number of Pending Documents</h3>
                  <p>{filteredData1.filter(item => item.status === 'PENDING').length}</p>

                  <select
                    value={selectedReviewer}
                    onChange={handleSelectChangee}
                    style={styles.select}
                  >
                    <option value="" disabled>
                      -- Choose a reviewer --
                    </option>
                    {reviewers.map((reviewer) => (
                      <option key={reviewer.id} value={reviewer.id}>
                        {reviewer.name}
                      </option>
                    ))}
                  </select>

                  <div style={styles.buttonGroup}>
                    <button onClick={handleSave} style={styles.saveBtn}>
                      Save
                    </button>
                    <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
                      Close
                    </button>
                  </div>
                </div>
              </div>

            )}
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
            <IoMdInformationCircleOutline />
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
            {/* {selectedRows.length > 0 &&  */}
            <th className="documenttable_th px-6 py-3" style={{ width: '3%' }}>
              <input
                type="checkbox"
                checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            {/* } */}

            <th className="documenttable_th px-6 py-3">Declaration Number</th>
            <th className="documenttable_th px-6 py-3">Declaration Date</th> 
            <th className="documenttable_th px-6 py-3">File Name</th>
            <th className="documenttable_th px-6 py-3">Updated  Date
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

            {/* {role == "ADMIN" ? */}
            <th className="documenttable_th px-6 py-3">Assign To </th>
            {/* : ""
                } */}

            <th className="documenttable_th px-6 py-3">Status</th>
            <th className="documenttable_th px-6 py-3">Comments</th>
          </tr>
        </thead>
        <tbody className="documenttable_tbody">
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (

              <tr key={index} className="documenttable_row bg-white border-b hover:bg-gray-50">
                <td className="documenttable_td px-6 py-4>" style={{ width: '5%' }}>

                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.docId)}
                    onChange={() => handleCheckboxChange(item.docId)}
                  />
                </td>
                 
                <td className="documenttable_td px-6 py-4">{item.declarationNumber}</td>
                <td className="documenttable_td px-6 py-4">
  {item.declarationDate
    ? new Date(item.declarationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A'}
</td>
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
                {/* {role === "ADMIN" && ( */}
                <td className="documenttable_td px-6 py-4">
                  {role === "ADMIN" ? (
                    <>
                      {/* Case 1: No reviewer assigned */}
                      {!item.assigned_to ? (
                        item.status !== "APPROVED" && item.status !== "REJECTED" ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <select
                              className="documenttable_select"
                              value={assignedUsers[item.docId] || ""}
                              onChange={(e) => handleSelectChange(e, item.docId)}
                            >
                              <option value="" disabled>Select Reviewer</option>
                              {reviewers.map((reviewer) => (
                                <option key={reviewer.id} value={reviewer.id}>
                                  {reviewer.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span style={{ alignItems: "center" }}>---</span>
                        )
                      ) : (
                        <>
                          {/* Case 2: Reviewer is assigned */}
                          {item.status === "APPROVED" || item.status === "REJECTED" ? (
                            <span>{item.assigned_to}</span>
                            // <span>
                            //   {
                            //     reviewers.find(
                            //       (r) =>
                            //         r.id ===
                            //         (assignedUsers[item.docId] || item.assigned_to)
                            //     )?.name || 'Unknown'
                            //   }
                            // </span>
                          ) : (
                            // <span>{item.assigned_to}</span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <select
                                className="documenttable_select"
                                value={assignedUsers[item.docId] || item.assigned_to}
                                onChange={(e) => handleSelectChange(e, item.docId)}
                              >
                                <option value="" disabled>Select Reviewer</option>

                                {/* Show currently assigned reviewer as the first option */}
                                {item.assigned_to && (
                                  <option value={item.assigned_to}>
                                    {item.assigned_to} (currently assigned)
                                  </option>
                                )}

                                {reviewers
                                  .filter((reviewer) => item.assigned_to !== reviewer.name)
                                  .map((reviewer) => (
                                    <option key={reviewer.id} value={reviewer.id}>
                                      {reviewer.name}
                                    </option>
                                  ))}
                              </select>
                            </div>


                          )}
                        </>
                      )}

                    </>
                  ) : (
                    <>{item?.assigned_to}</>
                  )}
                </td>

                {/* )} */}
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
      <span
        className="tooltip-trigger"
        title={item.rejectionReason}
      >
        {item.rejectionReason.length > 20 
          ? item.rejectionReason.substring(0, 20) + '...' 
          : item.rejectionReason}
      </span>
    </div>
  ) : (
    <span>----</span>
  )}
</td>

              </tr>
            ))
          ) : (
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
            <img className='refresh-icon' src={refreshIcon} />
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