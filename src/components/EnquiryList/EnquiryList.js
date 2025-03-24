/* eslint-disable no-const-assign */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Search } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import apiServices,{API_URL1} from '../../ApiServices/ApiServices';
import './EnquiryList.css';
import Loader from "react-js-loader";
import { IoMdInformationCircleOutline } from "react-icons/io";
import refreshIcon from '../../assets/images/refresh-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const EnquiryList = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [filterDate, setFilterDate] = useState(null);
    const [actionMessage, setActionMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // To store selected file URL
    // const [enquiry, setenquiry] = useState([])
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

    const fetchenquiry = async () => {
        try {
            setIsLoading(true);
            const response = await apiServices.getEnquirydata();
            console.log("enquiry Data:", response);
            const enquiry = response.map(enq => ({
                id: enq.id,
                name: enq.name,
                email: enq.email,
                mobile:enq.mobile,
                country: enq.country,
                company_name: enq.company_name,
                designation: enq.designation,
                team_size:enq.team_size,
                comments:enq.comments,
                // approve: enq.is_approved,
            }));
            const filterdata = enquiry.filter(enq => !enq.delete)
            // .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
            setData(filterdata);
            // console.log("enquiry Data:", enquiry);

            if (enquiry.length === 0) {
                setActionMessage("No enquirys are found in the list.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

      useEffect(() => {
       

        fetchenquiry();
    }, [navigate]); // Triggers when returning from navigation
    

    // const handleFreeze = async (id, status) => {
    //     try {
    //         const confirmMsg = status ? "Resume" : "Freeze";
    //         if (!window.confirm(`Are you sure you want to ${confirmMsg} this enquiry?`)) return;
    //         setIsLoading(true);
    //         const response = status ? await apiServices.resumeenquiry(id) : await apiServices.freezeenquiry(id);
    //         if (response.error) {
    //             setData(prevData => prevData.map(enq => enq.id === id ? { ...enq, status: !status } : enq));
    //         }
    //     } catch (error) {
    //         console.error("Error freezing enquiry:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const handleFreeze = async (id, status) => {
    //     try {
    //         const confirmMsg = status ? "Resume" : "Freeze";
    //         if (!window.confirm(`Are you sure you want to ${confirmMsg} this enquiry?`)) return;
    //         setIsLoading(true);
    
    //         const response = status ? await apiServices.resumeenquiry(id) : await apiServices.freezeenquiry(id);
    
    //         if (response) {
    //             // Refetch the enquiry list after successful update
    //             // const updatedResponse = await apiServices.getenquirys();
    //             // const updatedenquiry = updatedResponse.enquiry.map(enq => ({
    //             //     id: enq.id,
    //             //     username: enq.auth_user.username,
    //             //     enq_name: enq.company_name,
    //             //     msa_doc: enq.contract_doc,
    //             //     created_date: enq.created_at,
    //             //     status: enq.is_frozen,
    //             //     delete: enq.is_delete,
    //             // })).filter(enq => !enq.delete);
    //             // setData(updatedenquiry);
    //             fetchenquiry()
    //         }
    //     } catch (error) {
    //         console.error("Error freezing enquiry:", error);
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
      
      

    const filteredData = data.filter(enq => {
        const matchesSearch = searchTerm
            ? enq.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              enq.enq_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              new Date(enq.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            : true;
    
        const matchesStatus = statusFilter
            ? (statusFilter === "Active" ? enq.status === false : enq.status === true)
            : true;
    
        const matchesDate = filterDate
            ? new Date(enq.created_date).toDateString() === new Date(filterDate).toDateString()
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
        if (value === "Create enquiry") {
          navigate(`/CompanyCreation`);
        } else if (value === "Deleted List") {
          navigate(`/enquiryDeleteList`);
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
    

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this enquiry?")) {
            return;
        }
        try {
            setIsLoading(true);
    
            // Call API to delete the enquiry
            const response = await apiServices.deleteenquiry(id);
            console.log(response,response.success,response.message)
            if (response) { // Ensure API returns success
                setData(prevData => prevData.filter(enq => enq.id !== id));
            }
        } catch (error) {
            console.error("Error deleting enquiry:", error);
            alert("An error occurred while deleting.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.filter(enq => !enq.delete).slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="enquiry-main">
            <h1 className="enquiry-header">Enquiry Details</h1>
           
{(role === "PRODUCT_OWNER" || "PRODUCT_ADMIN") && (
     <select className="enquiry-select" onChange={(e) => handleDropdownChange(e.target.value)}>
        <option value="">Select an Option </option>
     <option value="Create enquiry">Create enquiry</option>
     <option value="Deleted List">Deleted List</option>
   </select>

//   <div>
//     <button className='enq_createbtn1' onClick={handleCreateenquiry} > + Create enquiry</button>

//     <button className='enq_createbtn1' onClick={handledeleteenquiry} > Deleted List</button>
//     <button className='enq_createbtn1' onClick={handlePendingenquiry}> Pending List</button> 
//   </div>
)}

            <div className='enquiry-container_controls'>
                <div className='enquiry-search'>
                    <Search className='enq_search-icon'></Search>
                    <input type="text" 
                        value={searchTerm}
                         onChange={handleSearch}
                            placeholder="Search" 
                            className="enquiry-search-input"/>
                            <button className='enquiry_searchinfo' onClick={handleSearchInfo}>
                                        <IoMdInformationCircleOutline/> 
                                        </button>
                                        {showSearchInfo && (
                                          <div ref={searchInfoRef} className="enquiry-searchinfo-popup">
                                              Date filter format should be like this: yyyy-mm-dd
                                          </div>
                                        )}
                </div>
                <div className="enquiry-filter">
                    <label className="enquiry_filter-label">Filter by Status:</label>
                    <select value={statusFilter} onChange={handleStatusFilter}className="enquiry-filter-select">
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select> 
                </div>
                <div className='enquiry_row'>
                    <label className="enquiry_row_label">Rows per Page:</label>
                    <select value={rowsPerPage} onChange={handleRowsPerPage} className="enquiry_row_select">
                         <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                
            </div>
            
            <table className="enquiry-table">
                <thead className='enquiry-thead'>
                    <tr>
                        <th className="enquiry-table-th">Name</th>
                        <th className="enquiry-table-th">Email</th>
                        <th className="enquiry-table-th">Mobile</th>
                        <th className="enquiry-table-th">
                            Country
                            {/* <button
                                onClick={handleCalendarToggle}
                                className="enquiry-calendarbtn"
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
                                )} */}
                        </th> 
                        <th className="enquiry-table-th">Company Name</th>
                        <th className="enquiry-table-th">Designation</th>
                        <th className="enquiry-table-th">Team Size</th>
                        <th className="enquiry-table-th">Comments</th>

                    </tr>
                </thead>
                
                <tbody className='enquiry-tbody' style={{ maxHeight: rowsPerPage > 5 ? '200px' : 'auto' }}>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((enq, index) => (
                            
                           
                            <tr key={index} className="enquiry-table-row">
                                <td className="enquiry-table-td">{enq.name}</td>
                                <td className="enquiry-table-td">{enq.email}</td>
                                <td className="enquiry-table-td">{enq.mobile}</td>
                                <td className="enquiry-table-td">{enq.country}</td>
                                <td className='enquiry-table-td'>{enq.company_name}</td>
                                <td className="enquiry-table-td">{enq.designation}</td>
                                <td className="enquiry-table-td">
                                    {/* <button className='enquiry-edit' onClick={() => handleEdit(enq.id)}>
                                    <FontAwesomeIcon icon={faPencil} />
                                    </button>
                                    <button 
                                        onClick={() => handleFreeze(enq.id, enq.status)} 
                                        disabled={isLoading}
                                        className='enquiry-freeze'>
                                        {enq.status ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} /> }
                                    </button>
                                    <button
                                        className="enquiry-delete"
                                        onClick={() => handleDelete(enq.id)}
                                      
                                    >
                                        <FontAwesomeIcon icon={faTrash} />

                                    </button> */}
                                    {enq.team_size}
                                </td>
                                <td className="enquiry-table-td"
                                    title={enq.comments}
                                >{enq.comments.split('/').pop().substring(0, 20) + '...'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="enquiry-table-td">
                                No enquirys found for the selected date.
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
            
            <div className="enquiry_pagination">
                <div className="enquiry_pageinfo">
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
                <div className="enquiry_paging">
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


export default EnquiryList;
