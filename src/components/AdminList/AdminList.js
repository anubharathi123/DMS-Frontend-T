import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import apiServices from '../../ApiServices/ApiServices'; // Adjust the import path for apiServices
import './AdminList.css';
import Loader from "react-js-loader";
import { IoMdInformationCircleOutline } from "react-icons/io";
import refreshIcon from '../../assets/images/refresh-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPencil, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';


const AdminList = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMessage, setActionMessage] = useState('');
  const calendarRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchInfo, setShowSearchInfo] = useState(false);
  const [refresh, setRefresh] = useState(false); // Track when to refresh data
  const navigate = useNavigate();
  
  const searchInfoRef = useRef(null); // Reference for search info popup
  
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
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        const response = await apiServices.getAdmins(); // Adjust based on API
        console.log(response)
        const admins = response.product_admins.map(admin => ({
          id: admin.id,
          username: admin.auth_user.username,
          name: admin.auth_user.first_name,
          email: admin.auth_user.email,
          createdAt: admin.created_at,
          status: admin.is_frozen,
          OrgId: admin.organization.id,
          role: admin.role.name,
          delete: admin.is_delete,
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log(admins)
        const filterdata = admins.filter(item => !item.delete)
        setData(filterdata);
        setFilteredData(filterdata);
  
        if (admins.length === 0) {
          setActionMessage('No admins available.');
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
        setActionMessage('Error fetching admins. Please try again later.');
      } finally {
        setIsLoading(false); // End loading
      }
    };
    fetchAdmins();
  }, [refresh]); // <-- Refresh the list when refresh changes

  // This is the main filtering function that will handle all filter types
  
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    setCurrentPage((prevPage) => Math.min(prevPage, totalPages));
  }, [filteredData, rowsPerPage]);
  
  // const handleCreateAdmin = () => {
  //   navigate('/AdminCreation');
  // }

  const handleFreeze = async (id,orgId, status) => {
    try {
        const confirmMsg = status ? "Resume" : "Freeze";
        if (!window.confirm(`Are you sure you want to ${confirmMsg} this organization?`)) return;
        setIsLoading(true);

        const response = status ? await apiServices.resumeEmployee(orgId,id) : await apiServices.freezeEmployee(orgId,id);

        if (response && !response.error) {
            // Refetch the organization list after successful update
            const response = await apiServices.getAdmins(); // Adjust based on API
        console.log(response)
        const admins = response.product_admins.map(admin => ({
          id: admin.id,
          username: admin.auth_user.username,
          name: admin.auth_user.first_name,
          email: admin.auth_user.email,
          createdAt: admin.created_at,
          status: admin.is_frozen,
          OrgId: admin.organization.id,
          role: admin.role.name,
          delete: admin.is_delete,
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log(admins)
        const filterdata = admins.filter(item => !item.delete)
        setData(filterdata);
        setFilteredData(filterdata);
        }
    } catch (error) {
        console.error("Error freezing organization:", error);
    } finally {
        setIsLoading(false);
    }
};

  const filteredData1 = filteredData.filter((item) => {
    if (filter === '') {
      return item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return item.username === filter && (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) 
      );
    }
  });


   useEffect(() => {
      const filteredAdmins = data.filter((item) => {
        if (filterDate) {
          const itemDate = new Date(item.createdAt);
          const selectedDate = new Date(filterDate);
          return itemDate.toLocaleDateString() === selectedDate.toLocaleDateString();
        }
        return true;
      });
  
      setFilteredData(filteredAdmins);
    }, [filterDate, data]);

  const handleResetFilter = () => {
    setSearchTerm('');
    setStatusFilter('');
    setFilterDate(null);
    setIsCalendarOpen(false);
    setCurrentPage(1);
  };

  const handleEditAdmin = (id) => {
    navigate(`/updateadmin/${id}`);
  };

  const handleDeleteAdmin = async (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete admin "${id}"?`);

    if (confirmDelete) {
      try {
        setIsLoading(true);

        // Call the API to delete the admin
        const response = await apiServices.deleteAdmin(id);

        console.log("Delete API Response:", response); // Log full response

        // Verify response structure
        if (response.message) {
          console.log("Admin deleted successfully, updating state...");

          // Update the state to remove the deleted admin
          setData((prevData) => {
            console.log("Previous Data:", prevData);
            return prevData.filter(item => item.id !== id);
          });

          // Set success message
          // setActionMessage(`Admin "${id}" deleted successfully.`);
        } else {
          // Handle API failure
          console.error("Failed to delete admin:", response?.data?.message);
          setActionMessage(response?.data?.message || "Failed to delete admin.");
        }
      } catch (error) {
        // Handle any errors
        console.error("Error deleting admin:", error);
        setActionMessage("Error deleting admin. Please try again.");
      } finally {
        // Reset loading state
        setIsLoading(false);
      }
    }
  };

  // const handleDeleteList = async () => {
  //   navigate('/DeletedAdminList');
  // }

  const handleDropdownChange = (value) => {
    if (value === "New Admin") {
      navigate(`/AdminCreation`);
    } else if (value === "Deleted List") {
      navigate(`/DeletedAdminList`);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.max(1, Math.ceil(filteredData1.length / rowsPerPage));

  const paginatedData = filteredData1.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  return (
    <div className="adminlist_container">
      <h1 className="adminlist_header">Admin Details</h1>
      <select className="organization-select" onChange={(e) => handleDropdownChange(e.target.value)}>
      <option value="">Select</option>
     <option value="New Admin">New Admin</option>
     <option value="Deleted List">Deleted List</option>
   </select>
      {/* <div>
      <button className='admin_createbtn' onClick={handleCreateAdmin} > + New Admin</button>
      <button className='admin_createbtn' onClick={handleDeleteList} > Deleted Admin List</button> 
      </div> */}
      {actionMessage && <div className="adminlist_action_message">{actionMessage}</div>}
      <div className="adminlist_controls">
        <div className="adminlist_search">
          <Search className="adminlist_search_icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            className="adminlist_search_input"
          />
          <button className='adminlist_searchinfo' onClick={handleSearchInfo}>
              <IoMdInformationCircleOutline/> 
          </button>
          {showSearchInfo && (
            <div ref={searchInfoRef} className="adminlist-searchinfo-popup">
              Date filter format should be like this: yyyy-mm-dd
            </div>
          )}
        </div>
        <div className="adminlist_filter">
          <label className="adminlist_filter_label">Filter by Role:</label>
          <select value={filter} onChange={handleFilter} className="adminlist_filter_select">
            <option value="">All</option>
            <option value="PRODUCT_ADMIN">PRODUCT_ADMIN</option>
            {/* <option value="SuperAdmin">SuperAdmin</option> */}
          </select>
        </div>

        <div className="adminlist_rows">
          <label className="adminlist_rows_label">Rows per Page:</label>
          <select value={rowsPerPage} onChange={handleRowsPerPage} className="adminlist_rows_select">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
      <table className="adminlist_table">
        <thead className="adminlist_thead">
          <tr>
            <th className="adminlist_th">Username</th>
            <th className="adminlist_th">Name</th>
            <th className="adminlist_th">Email</th>
            <th className="adminlist_th">Created Date
              <button
                className="admin-list-calendarbtn"
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
            <th className="adminlist_th">Role</th>
            <th className="adminlist_th">Status</th>
            <th className="adminlist_th">Actions</th>
          </tr>
        </thead>
        <tbody className="adminlist_tbody">
        {paginatedData.map((item, index) => (
          <tr
            key={index}
            className="adminlist_row">
            <td className="documenttable_td px-6 py-4 ">{item.username}</td>
            <td className="documenttable_td px-6 py-4 ">{item.name}</td>
            <td className="documenttable_td px-6 py-4 ">{item.email.split('/').pop().substring(0, 20) + '...'}</td>
            <td className="documenttable_td px-6 py-4 ">{new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            <td className="documenttable_td px-6 py-4 ">{item.role.charAt(0).toUpperCase() + item.role.slice(1).toLowerCase()}</td>
            <td className="documenttable_td px-6 py-4 ">
              
  {item.status ? "Inactive" : "Active"}
</td>
            <td className='documenttable_td px-6 py-4'>
              <button className='adminlist-editbtn' onClick={() => handleEditAdmin(item.id)}> <FontAwesomeIcon icon={faPencil} /></button>
              <button 
              onClick={() => handleFreeze(item.id, item.OrgId, item.status)} 
              disabled={isLoading}
              className='organization-freeze'>
              {item.status ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} /> }
            </button>
              <button className='adminlist-deletebtn' onClick={() => handleDeleteAdmin(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="adminlist_pagination">
        <div className="adminlist_pageinfo">
          <p className="adminlist_pageinfo_text">Page {currentPage} of {totalPages}</p>
        </div>
        {/* Reset Filter Button */}
      {(searchTerm || statusFilter || filterDate) && (
        <button className="adminlist-reset-filter-btn" onClick={handleResetFilter} 
          disabled={!searchTerm && !statusFilter && !filterDate}>
          Reset Filter 
          <img className='refresh-icon' src={refreshIcon} alt="Reset"/>
        </button>
      )}
        <div className="adminlist_paging">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="adminlist_prev_button"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="adminlist_next_button"
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

export default AdminList;