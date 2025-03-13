/* eslint-disable no-const-assign */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Search } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import apiServices,{API_URL1} from '../../ApiServices/ApiServices';
import './OrganizationPending.css';
import Loader from "react-js-loader";
import { IoMdInformationCircleOutline } from "react-icons/io";
import refreshIcon from '../../assets/images/refresh-icon.png';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";



const OrganizationList = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [filterDate, setFilterDate] = useState(null);
    const [actionMessage, setActionMessage] = useState('');
    const [filterdata1, setfilterdata1] = useState([]);
    // const [errorMessage, setErrorMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // To store selected file URL
    // const [organization, setOrganization] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
      const [isLoading, setIsLoading] = useState(false);
      
    const itemsPerPage = 5;
    const navigate = useNavigate();
     const [showSearchInfo, setShowSearchInfo] = useState(false);
const calendarRef = useRef(null);
     const searchInfoRef = useRef(null); // Reference for search info popup
     const role = localStorage.getItem('role');
     const url = API_URL1

     const handleEdit = (id) => {
        navigate(`/CompanyUpdate/${id}`);
    };

    const handleOpenFile = (msa_doc) => {
        if (msa_doc) {
            setSelectedFile(`${url}${msa_doc}`);
        } else {
            alert("No file available.");
        }
    };

    // Function to close the popup
    const handleClosePopup = () => {
        setSelectedFile(null);
    };

     const handleSearchInfo = () => {
        setShowSearchInfo(!showSearchInfo);
      };

      useEffect(() => {
        const fetchOrganization = async () => {
            try {
                setIsLoading(true);
                const response = await apiServices.pendingOrganizations();
                console.log(response)
                const organization = response.pending_organizations.map(org => ({
                    id: org.id,
                    username: org.auth_user.username,
                    org_name: org.company_name,
                    msa_doc: org.contract_doc,
                    created_date: org.created_at,
                    email: org.auth_user.email,
                    delete: org.is_delete,
                    approve:org.is_approve,
                }));
                const filterdata = organization.filter(org => !org.approve)

                setData(filterdata);
    
                if (organization.length === 0) {
                    setActionMessage("No Organizations are found in the list.");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchOrganization();
    }, [navigate]); // Triggers when returning from navigation
    

    // const handleFreeze = async (id, status) => {
    //     try {
    //         const confirmMsg = status ? "Resume" : "Freeze";
    //         if (!window.confirm(`Are you sure you want to ${confirmMsg} this organization?`)) return;
    //         setIsLoading(true);
    //         const response = status ? await apiServices.resumeOrganization(id) : await apiServices.freezeOrganization(id);
    //         if (response.error) {
    //             setData(prevData => prevData.map(org => org.id === id ? { ...org, status: !status } : org));
    //         }
    //     } catch (error) {
    //         console.error("Error freezing organization:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const handleFreeze = async (id, status) => {
    //     try {
    //         const confirmMsg = status ? "Resume" : "Freeze";
    //         if (!window.confirm(`Are you sure you want to ${confirmMsg} this organization?`)) return;
    //         setIsLoading(true);
    
    //         const response = status ? await apiServices.resumeOrganization(id) : await apiServices.freezeOrganization(id);
    
    //         if (response && !response.error) {
    //             // Refetch the organization list after successful update
    //             const updatedResponse = await apiServices.getOrganizations();
    //             const updatedOrganization = updatedResponse.organization.map(org => ({
    //                 id: org.id,
    //                 username: org.auth_user.username,
    //                 org_name: org.company_name,
    //                 msa_doc: org.contract_doc,
    //                 created_date: org.created_at,
    //                 email: org.auth_user.email,
    //                 delete: org.is_delete,
    //             })).filter(org => !org.delete);
    //             setData(updatedOrganization);
    //         }
    //     } catch (error) {
    //         console.error("Error freezing organization:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    
    
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

    const handleSearch = (e) => {
        console.log("Search Term:", e.target.value);
        setSearchTerm(e.target.value);
      };

      const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value));
      };
      
      

      const filteredData = data.filter(org => {
        const matchesSearch = searchTerm
            ? org.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              org.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              new Date(org.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            : true;
    
        const matchesStatus = statusFilter
            ? (statusFilter === "Active" ? org.status === false : org.status === true)
            : true;
    
        // const matchesDate = filterDate
        //     ? new Date(org.created_date).toDateString() === new Date(filterDate).toDateString()
        //     : true;
    
        return matchesSearch && matchesStatus ;
    });
    
   
    
    const handleCalendarToggle = () => setIsCalendarOpen((prev) => !prev);
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleResetFilter = () => {
        setSearchTerm('');
        setStatusFilter('');
        setFilterDate(null);
        setIsCalendarOpen(false);
        setCurrentPage(1);
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

  const handleApprove = async (id, newStatus) => {
    setActionMessage('');
    setIsLoading(true);
  
    try {
      console.log('Approval:', id, newStatus);
      await apiServices.approveOrganization(id, { approval_status: newStatus });
  
      // Remove the approved/rejected organization from the current list
      const updatedData = data.filter((org) => org.id !== id);
      setData(updatedData);
      setActionMessage(`Organization ${id} has been ${newStatus}`);
      setTimeout(() => {
        setActionMessage('');
      }, 3000);
  
    } catch (error) {
      console.error('Error during approval/rejection:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDropdownChange = (value) => {
    if (value === "Organization List") {
      navigate('/OrganizationList');
    }
  };

      const handleReject = async (id) => {
        //   if (!rejectionReason.trim()) {
        //     alert("Please enter a reason for rejection.");
        //     return;
        //   }
        
          try {
            setIsLoading(true);
            await apiServices.rejectOrganization(id, {
              approval_status: "Rejected",
            });
            console.log('Rejected:', id);
        
            // Update the status with the rejection reason
            const updatedData = data.map((org) =>
              org.id === id
                ? { ...org, status: "Rejected"}
                : org
            );
        
            setData(updatedData);
            // setFilteredData(updatedData);
            // setRejectPopupOpen(false);
            // setRejectReason("");
        
            // // Display alert and navigate after submission
            // alert("Rejection Reason has been submitted");
            // navigate("/Documentlist", { state: { id } });
          } catch (error) {
            console.error("Error rejecting Organization:", error);
          } finally {
            setIsLoading(false);
          }
        };
    
    

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this organization?")) {
            return;
        }
    
        try {
            setIsLoading(true);
    
            // Call API to delete the organization
            const response = await apiServices.deleteOrganization(id);
            console.log(response,response.success,response.message)
            if (response.error) { // Ensure API returns success
                setData(prevData => prevData.filter(org => org.id !== id));
            }
        } catch (error) {
            console.error("Error deleting organization:", error);
            alert("An error occurred while deleting.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.filter(org => !org.delete).slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleNavigate = () => {
        navigate('/OrganizationList');  };
    

    return (
        <div className="organization-main">
            <h1 className="organization-header">Organization Pending for Approval</h1>
            <select className="organization-select" onChange={(e) => handleDropdownChange(e.target.value)}>
        <option value="">Select an option</option>
     <option value="Organization List">Organization List</option>
     </select>
            {/* <button className='organization-backbtn' onClick={handleNavigate} >Back</button> */}
            <div className='organization-container_controls'>
                <div className='organization-search'>
                    <Search className='org_search-icon'></Search>
                    <input type="text" 
                        value={searchTerm}
                         onChange={handleSearch}
                            placeholder="Search" 
                            className="organization-search-input"/>
                            <button className='organization_searchinfo' onClick={handleSearchInfo}>
                                        <IoMdInformationCircleOutline/> 
                                        </button>
                                        {showSearchInfo && (
                                          <div ref={searchInfoRef} className="organization-searchinfo-popup">
                                              Date filter format should be like this: yyyy-mm-dd
                                          </div>
                                        )}
                </div>
                <div className="organization-filter">
                    <label className="organization_filter-label">Filter by Status:</label>
                    <select value={statusFilter} onChange={handleStatusFilter}className="organization-filter-select">
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select> 
                </div>
                <div className='organization_row'>
                    <label className="organization_row_label">Rows per Page:</label>
                    <select value={rowsPerPage} onChange={handleRowsPerPage} className="organization_row_select">
                         <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>
 
            
            <table className="organization-table">
                <thead className='organization-thead'>
                    <tr>
                        <th className="organization-table-th">Username</th>
                        <th className="organization-table-th">Organization Name</th>
                        <th className="organization-table-th">MSA Doc</th>
                        <th className="organization-table-th">
                            Created Date
                            <button
                                onClick={handleCalendarToggle}
                                className="organization-calendarbtn"
                            >
                                📅
                            </button>
                                {isCalendarOpen && (
                                <div style={{ position: "absolute", zIndex: 1000 }} ref={calendarRef}>
                                <DatePicker
                                        selected={filterDate}
                                        onChange={(date) => {
                                            setFilterDate(date);
                                            setIsCalendarOpen(false);
                                        }}
                                        inline
                                        dateFormat="yyyy-MM-dd" 
                                        />
                                        </div>
                                )}
                        </th>
                        <th className="organization-table-th">Mail ID</th>
                        <th className="organization-table-th">Actions</th>
                    </tr>
                </thead>
                
                <tbody className='organization-tbody' style={{ maxHeight: rowsPerPage > 5 ? '200px' : 'auto' }}>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((org, index) => (
                            
                           
                            <tr key={index} className="organization-table-row">
                                <td className="organization-table-td">{org.username}</td>
                                <td className="organization-table-td"
                                title={org.org_name}>
  {org.org_name.length > 10 ? org.org_name.substring(0, 10) + "..." : org.org_name}
</td>
                                <td className="organization-table-td">
                                {org.msa_doc ? (
                                    <button
                                        title={org.msa_doc}
                                        className="file-button"
                                        onClick={() => handleOpenFile(org.msa_doc)}
                                    >
                                        {org.msa_doc.split('/').pop().substring(0, 20) + '...'}
                                    </button>
                                ) : (
                                    "Null"
                                )}
                              
                                    </td>
                                <td className="organization-table-td">{new Date(org.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="organization-table-td">{org.email}</td>
                                <td className="organization-table-td">
                                    <button className='organization-approve' onClick={() => handleApprove(org.id, 'Approved')}>
                                    <IoIosCheckmarkCircle />
                                    </button>
                                    <button className='organization-reject' onClick={() => handleReject(org.id, 'Rejected')}>
                                    <MdCancel />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="organization-table-td">
                                No registered organizations found!!!
                            </td>
                        </tr>
                    )}
                </tbody>
                
            </table>
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
            
            <div className="organization_pagination">
                <div className="organization_pageinfo">
                Page {currentPage} of {totalPages || 1}
                </div>
                 {/* Reset Filter Button */}
             {(searchTerm || statusFilter || filterDate) && (
             <button className="reset-filter-btn" onClick={handleResetFilter} 
                        disabled={!searchTerm && !statusFilter && !filterDate}>
                            Reset Filter 
                            <img className='refresh-icon' src={refreshIcon}/>
                            </button>
                            )}
                <div className="organization_paging">
                    <button
                        className="prev-button"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="next-button"
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
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


export default OrganizationList;
