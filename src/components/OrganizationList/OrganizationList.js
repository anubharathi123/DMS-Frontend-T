/* eslint-disable no-const-assign */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Search } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import apiServices,{API_URL1} from '../../ApiServices/ApiServices';
import './OrganizationList.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import Loader from "react-js-loader";
import { IoMdInformationCircleOutline } from "react-icons/io";
import refreshIcon from '../../assets/images/refresh-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Plus from '../../assets/images/pluslogo.png';
import plus from '../../assets/images/Pluslogo2.png'
const OrganizationList = () => {
     const [deleteSuccess, setDeleteSuccess] = useState(false);
    const confirmDelete = async () => {
    try {
        setIsLoading(true);
        const response = await apiServices.deleteOrganization(orgToDelete);
        console.log(response, response.success, response.message);
        if (response) {
            setData(prevData => prevData.filter(org => org.id !== orgToDelete));
            setDeleteSuccess(true); // Show success message
            setTimeout(() => setDeleteSuccess(false), 3000); // Hide after 3 seconds
        }
    } catch (error) {
        console.error("Error deleting organization:", error);
    } finally {
        setIsLoading(false);
        setShowDeleteDialog(false);
        setOrgToDelete(null);
    }
};
    
    // Add new state at the beginning of the component:
const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);

const searchInputRef = useRef(null);
const suggestionsRef = useRef(null);

// Update the handleSearch function:
const handleSearch = (e) => {
    const value = e.target.value;
    
    setSearchTerm(value);

    if (value.length > 0) {
        const filteredSuggestions = data.filter(org =>
            org.username.toLowerCase().includes(value.toLowerCase()) ||
            org.org_name.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 10); // Limit suggestions count

        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
    } else {
        setSuggestions([]);
        setShowSuggestions(false);
        // No need to filter data here - filteredData will handle empty searchTerm
    }
};

const handleSuggestionClick = (org) => {
    setSearchTerm(org.username);
    setShowSuggestions(false);
    setCurrentPage(1);
};

// Add useEffect to close suggestions when clicking outside:
useEffect(() => {
    const handleClickOutside = (event) => {
        if (
            suggestionsRef.current &&
            !suggestionsRef.current.contains(event.target) &&
            searchInputRef.current &&
            !searchInputRef.current.contains(event.target)
        ) {
            setShowSuggestions(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);
// Add new state for delete confirmation dialog at the top of the component
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [orgToDelete, setOrgToDelete] = useState(null);

// Update the handleDelete function
const handleDelete = async (id) => {
    setOrgToDelete(id);
    setShowDeleteDialog(true);
};
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [filterDate, setFilterDate] = useState(null);
    const [actionMessage, setActionMessage] = useState('');
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

    const fetchOrganization = async () => {
        try {
            setIsLoading(true);
            const response = await apiServices.getOrganizations();
            console.log("Organization Data:", response);
            const organization = response.approved_organizations.map(org => ({
                id: org.id,
                username: org.auth_user.username,
                org_name: org.company_name,
                msa_doc: org.contract_doc,
                msi:org.is_msi,
                // mobile:org.mobile,
                created_date: org.created_at,
                status: org.is_frozen,
                delete: org.is_delete,
                approve: org.is_approved,
            }));
            const filterdata = organization.filter(org => !org.delete)
            .filter(org => org.approve === true).filter(org => org.msi === true)
            .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
            setData(filterdata);
            console.log(filterdata, "organization-filter data");
            // console.log("Organization Data:", organization);

            if (organization.length === 0) {
                setActionMessage("No Organizations are found in the list.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

      useEffect(() => {
       

        fetchOrganization();
    }, [navigate]); // Triggers when returning from navigation
    

    const handleFreeze = async (id, status) => {
        try {
            const confirmMsg = status ? "Resume" : "Freeze";
            if (!window.confirm(`Are you sure you want to ${confirmMsg} this organization?`)) return;
            setIsLoading(true);
    
            const response = status ? await apiServices.resumeOrganization(id) : await apiServices.freezeOrganization(id);
    
            if (response) {
                // Refetch the organization list after successful update
                // const updatedResponse = await apiServices.getOrganizations();
                // const updatedOrganization = updatedResponse.organization.map(org => ({
                //     id: org.id,
                //     username: org.auth_user.username,
                //     org_name: org.company_name,
                //     msa_doc: org.contract_doc,
                //     created_date: org.created_at,
                //     status: org.is_frozen,
                //     delete: org.is_delete,
                // })).filter(org => !org.delete);
                // setData(updatedOrganization);
                fetchOrganization()
            }
        } catch (error) {
            console.error("Error freezing organization:", error);
        } finally {
            setIsLoading(false);
        }
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
    
        const matchesDate = filterDate
            ? new Date(org.created_date).toDateString() === new Date(filterDate).toDateString()
            : true;
    
        return matchesSearch && matchesStatus && matchesDate;
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

    const handleDropdownChange = (value) => {
        if (value === "Create Organization") {
          navigate(`/CompanyCreation`);
        } else if (value === "Deleted List") {
          navigate(`/OrganizationDeleteList`);
        }else if (value === "MSI Approval") {
          navigate(`/MsiPending`);
        }
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
    

    
    
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.filter((org) => !org.is_delete).slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="organization-main">
            <h1 className="organization-header">Organization Details</h1>
           
        {(role === "PRODUCT_OWNER" || "PRODUCT_ADMIN") && (
    
        <div className="userlist-header-actions">
      <button className="organization_createbtn" onClick={() => navigate('/CompanyCreation')}>
        <span class="plus-icon">+</span>
        <span>Create New</span>
      </button>
      <button className="organization_createbtn" onClick={() =>fetchOrganization()}>
        <span>Refresh</span>
      </button>
      <select className="organization-select" onChange={(e) => handleDropdownChange(e.target.value)}>
      <option value="">Select an Option </option>
     <option value="Deleted List">Deleted List</option>
     <option value="MSI Approval">MSI Approval</option>
   </select>
   </div>

        )}

            <div className='organization-container_controls'>
                 <div className='organization-search' style={{ position: 'relative' }}>
    <Search className='org_search-icon'></Search>
    <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by username or organization name"
        className="organization-search-input"
        ref={searchInputRef}
        autoComplete="off"
        onFocus={() => {
            if (searchTerm && suggestions.length > 0) setShowSuggestions(true);
        }}
    />
    {showSuggestions && (
        <ul
            className="suggestions-dropdown"
            ref={suggestionsRef}
            style={{
                position: 'absolute',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginTop: '2px',
                width: '100%',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000,
                listStyleType: 'none',
                paddingLeft: 0,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
        >
            {suggestions.length > 0 ? (
                suggestions.map((org) => (
                    <li
                        key={org.id}
                        style={{ 
                            padding: '8px', 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                        onClick={() => handleSuggestionClick(org)}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <span>
                            <strong>{org.username}</strong>
                            <div style={{ color: '#666', fontSize: '0.9em' }}>
                                {org.org_name}
                            </div>
                        </span>
                        <span style={{ color: '#999', fontSize: '0.8em' }}>
                            {new Date(org.created_date).toLocaleDateString()}
                        </span>
                    </li>
                ))
            ) : (
                <li style={{ 
                    padding: '8px', 
                    color: '#666',
                    fontStyle: 'italic'
                }}>
                    No matches found
                </li>
            )}
        </ul>
    )}
    <button className='organization_searchinfo' onClick={handleSearchInfo}>
        <IoMdInformationCircleOutline />
    </button>
    {showSearchInfo && (
        <div ref={searchInfoRef} className="organization-searchinfo-popup">
            Search by username, organization name, or date (yyyy-mm-dd)
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
                        <th className="organization-table-th">Status</th>
                        <th className="organization-table-th">Actions</th>
                    </tr>
                </thead>
                
                <tbody className='organization-tbody' style={{ maxHeight: rowsPerPage > 5 ? '200px' : 'auto' }}>
  {paginatedData.length > 0 ? (
    paginatedData.map((org, index) => (
      <tr key={index} className="organization-table-row">
        <td className="organization-table-td">{org.username}</td>
        <td className="organization-table-td" title={org.org_name}>
          {org.org_name.length > 20 ? org.org_name.substring(0, 20) + "..." : org.org_name}
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
        <td className="organization-table-td">
          {org.status ? "Inactive" : "Active"}
        </td>
        <td className="organization-table-td">
          <button className='organization-edit' onClick={() => handleEdit(org.id)}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button 
            onClick={() => handleFreeze(org.id, org.status)} 
            disabled={isLoading}
            className='organization-freeze'>
            {org.status ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} />}
          </button>
          <Dialog
    open={showDeleteDialog}
    onClose={() => setShowDeleteDialog(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    PaperProps={{
        style: {
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
    }}
    BackdropProps={{
        style: {
            backgroundColor: 'rgba(0,0,0,0.1)' // This makes the backdrop transparent
        }
    }}
>
    <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
        <IoMdInformationCircleOutline style={{ marginRight: 8 }} />
        <Typography variant="h6">Confirm Delete</Typography>
    </DialogTitle>
    <DialogContent>
        <Typography>Are you sure you want to delete this organization?</Typography>
    </DialogContent>
    <DialogActions>
        <Button 
            onClick={() => setShowDeleteDialog(false)} 
            color="primary"
            variant="outlined"
        >
            No
        </Button>
        <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
            disabled={isLoading}
        >
            {isLoading ? "Deleting..." : "Yes"}
        </Button>
    </DialogActions>
</Dialog>
{deleteSuccess && (
    <div className="success-message">
        Organization deleted successfully!
    </div>
)}
          <button
            className="organization-delete"
            onClick={() => handleDelete(org.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="organization-table-td" style={{ textAlign: 'center' }}>
        No results found.
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
