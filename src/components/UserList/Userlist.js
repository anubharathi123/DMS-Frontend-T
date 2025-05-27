import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Loader from "react-js-loader";
import apiServices from "../../ApiServices/ApiServices"; // Adjust path if needed
import "./Userlist.css";
import refreshIcon from '../../assets/images/refresh-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Plus from '../../assets/images/pluslogo.png';
import plus from '../../assets/images/Pluslogo2.png';

const UserList = () => {
  const [data, setData] = useState([]);
  const [actionMessage, setActionMessage] = useState("");
  const [showSearchInfo, setShowSearchInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const calendarRef = useRef(null);
  const searchInfoRef = useRef(null);
  const navigate = useNavigate();

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


    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const response = await apiServices.users();
        console.log(response)
        let users = response.map((user) => ({
          id:user.id,
          orgId: user.organization.id,
          username: user.auth_user.first_name || "N/A",
          // company_name: user.organization.company_name,
          email: user.auth_user.email,
          createdAt: user.created_at,
          role: user.role.name,
          status:user.is_frozen,
          delete:user.is_delete,
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filteredUsers = users.filter(item => !item.delete);
        setData(filteredUsers);
        setFilteredData(filteredUsers);
        if (users.length === 0) {
          setActionMessage("No users available.");
        }
      } catch (error) {
        console.error("Error Fetching users:", error);
        setActionMessage("Error fetching users. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  useEffect(() => {
    
    fetchDetails();
  }, [refresh]);

  const filteredData1 = filteredData.filter((item) => {
    const searchValue = searchTerm.toLowerCase();
    
    const usernameMatch = item.username.toLowerCase().includes(searchValue);
    const emailMatch = item.email.toLowerCase().includes(searchValue);
    const createdAtMatch = item.createdAt ? item.createdAt.toLowerCase().includes(searchValue) : false;
    const roleMatch = item.role.toLowerCase().includes(searchValue);
    const statusMatch = (item.status ? "inactive" : "active").toLowerCase().includes(searchValue);
  
    if (filter === '') {
      return usernameMatch || emailMatch || createdAtMatch || roleMatch || statusMatch;
    } else {
      return item.role === filter && (usernameMatch || emailMatch || createdAtMatch || roleMatch || statusMatch);
    }
  });
  

   useEffect(() => {
    const filterUsers = data.filter((item) => {
      if(filterDate) {
        const itemDate = new Date(item.createdAt);
        const selectedDate = new Date(filterDate);
        return itemDate.toLocaleDateString() === selectedDate.toLocaleDateString();
      }
      return true;
    });
    setFilteredData(filterUsers);
  }, [filterDate, data]);

  const paginatedData = filteredData1.filter(item => !item.delete).slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleCreateUser = () => {
    navigate(`/createuser`);
  }

  const handleDropdownChange = (value) => {
    if (value === "New User") {
      navigate(`/createuser`);
    } else if (value === "Deleted List") {
      navigate(`/DeletedUsers`);
    } 
  };

  const handleEditAdmin = (id) => {
    navigate(`/UpdateUser/${id}`);
  };

  const handleFreeze = async (id,orgId, status) => {
    try {
        const confirmMsg = status ? "Resume" : "Freeze";
        if (!window.confirm(`Are you sure you want to ${confirmMsg} this user?`)) return;
        setIsLoading(true);

        const response = status ? await apiServices.resumeEmployee(orgId,id) : await apiServices.freezeEmployee(orgId,id);

        if (response && !response.error) {
            // Refetch the organization list after successful update
            const response = await apiServices.users();
        console.log(response)
        let users = response.map((user) => ({
          id:user.id,
          orgId: user.organization.id,
          username: user.auth_user.first_name || "N/A",
          // company_name: user.organization.company_name,
          email: user.auth_user.email,
          createdAt: user.created_at,
          role: user.role.name,
          status:user.is_frozen,
          delete:user.is_delete,
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filteredUsers = users.filter(item => !item.delete);
        setData(filteredUsers);
        setFilteredData(filteredUsers);
        if (users.length === 0) {
          setActionMessage("No users available.");
        }
        }
    } catch (error) {
        console.error("Error freezing organization:", error);
    } finally {
        setIsLoading(false);
    }
};

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete user "${id}"?`);

    if (confirmDelete) {
      try {
        setIsLoading(true);
  
        // Call the API to delete the admin
        const response = await apiServices.deleteAdmin(id);
  
        console.log("Delete API Response:", response); // Log full response
  
        // Verify response structure
        if (response.message) {
          console.log("user deleted successfully, updating state...");
  
          // Update the state to remove the deleted admin
          setData((prevData) => {
            console.log("Previous Data:", prevData);
            return prevData.filter(item => item.id !== id);
          });
  
          // Set success message
          // setActionMessage(`Admin "${id}" deleted successfully.`);
        } else {
          // Handle API failure
          console.error("Failed to delete user:", response?.data?.message);
          setActionMessage(response?.data?.message || "Failed to delete user.");
        }
      } catch (error) {
        // Handle any errors
        console.error("Error deleting user:", error);
        setActionMessage("Error deleting user. Please try again.");
      } finally {
        // Reset loading state
        setIsLoading(false);
      }
    }
  };

  const handleResetFilter = (e) => {
    setSearchTerm('');
    setFilter(e.target.value);
    setFilterDate(null);
    setIsCalendarOpen(false);
    setCurrentPage(1);
};
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSearchInfo = () => setShowSearchInfo(!showSearchInfo);
  const handleFilter = (e) => setFilter(e.target.value);
  const handleRowsPerPage = (e) => setRowsPerPage(parseInt(e.target.value));
  const handleCalendarToggle = () => setIsCalendarOpen((prev) => !prev);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleDelete = () => { navigate('/deletedusers') }

  return (
    <div className="userlist-container">
      <h1 className="userlist-header">User Details</h1>
      <div className="userlist-header-actions">
      <button className="user_createbtn" onClick={handleCreateUser}>
        + New User
      </button>
       {/* <button
  className="organization_createbtn"
  onClick={() => navigate(handleCreateUser)}
> */}
  {/* <img
    src={Plus}
    alt="Company Logo"
    style={{
      width: "25px",
      height: "25px",
      right:"95%",
    }}
  /> */}
{/* </button> */}
<button className="admin_createbtn" onClick={() =>fetchDetails()}  style={{ marginLeft: 0 }}>
            <span>Refresh</span>
      </button>
      <select className="organization-select" onChange={(e) => handleDropdownChange(e.target.value)}>
      <option value="">Select an Option </option>
     <option value="Deleted List">Deleted List</option>
   </select>
   </div>
        {actionMessage && <div className="userlist_action_message">{actionMessage}</div>}

        <div className="userlist-controls">
          <div className="userlist-search">
            <Search className="userlist_search_icon" />
            <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search"
          className="userlist_search_input"
            />
            <button className="userlist_searchinfo" onClick={handleSearchInfo}>
          <IoMdInformationCircleOutline />
            </button>
            {showSearchInfo && (
          <div ref={searchInfoRef} className="userlist-searchinfo-popup">
            Date filter format should be: yyyy-mm-dd
          </div>
            )}
          </div>
          
          <div className="userlist-filter">
            <label className="userlist_filter_label">Filter by Role:</label>
            
            <select value={filter} onChange={handleFilter} className="userlist_filter_select">
            <option value="">All</option>,
            {data.map((item, index) => (
            <option value={item.role}>{item.role}</option>
            ))}
            </select>
              
          </div>
        
          <div className="userlist_rows">
            <label className="userlist_rows_label">Rows per Page:</label>
            <select value={rowsPerPage} onChange={handleRowsPerPage} className="userlist_rows_select">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
            </select>
          </div>
        </div>

        <table className="userlist_table">
          <thead className="userlist_thead">
            <tr>
          <th className="userlist_th">Name</th>
          <th className="userlist_th">Email</th>
          <th className="userlist_th">
            Created Date
            
            {isCalendarOpen && (
              <div style={{ position: "absolute", zIndex: 1000 }} ref={calendarRef}>
            <DatePicker
              selected={filterDate}
              onChange={(date) => {
                setFilterDate(date);
                setIsCalendarOpen(false);
              }}
              inline
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
                }
              }}
            />
              </div>
            )}
          </th>
          <th className="userlist_th">Role</th>
          <th className="userlist_th">Status</th>
          <th className="userlist_th">Actions</th>
            </tr>
          </thead>
          <tbody className="userlist_tbody">
            { paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
          <tr key={index} className="userlist_row hover:bg-gray-50">
            <td className="userlist_td">{item.username}</td>
            
            <td className="userlist_td">{item.email}</td>
            <td className="userlist_td">
              {new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </td>
            <td className="userlist_td">{item.role.charAt(0).toUpperCase() + item.role.slice(1).toLowerCase()}</td>
            <td className="userlist_td">{item.status ? "Inactive" : "Active"}</td>
            <td className="userlist_td">
               <button className='adminlist-editbtn' title="Edit" onClick={() => handleEditAdmin(item.id)}> <FontAwesomeIcon icon={faPencil} /></button>
               <button className='adminlist-freezebtn' disabled={isLoading} title="Freeze" onClick={() => handleFreeze(item.id, item.orgId, item.status)}>
            {item.status ? <FontAwesomeIcon icon={faToggleOff}/> : <FontAwesomeIcon icon={faToggleOn}/>}
            </button>
            <button className='adminlist-deletebtn' title="Delete" onClick={() => handleDeleteUser(item.id)}><FontAwesomeIcon icon={faTrash}/></button>
            </td>
          </tr>
              ))
            ):(
              <tr>
                <td colSpan="4" className="organization-table-td">
                  No users found for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="userlist_pagination">
          <div className="userlist_pageinfo">
          <p className="userlist_pageinfo_text">Page {currentPage} of {Math.ceil(filteredData1.length / rowsPerPage)}</p>
          </div>
           {/* Reset Filter Button */}
         {(searchTerm || filter || filterDate) && (
             <button className="reset-filter-btn" onClick={handleResetFilter} 
                        disabled={!searchTerm && !filter && !filterDate}>
                            Reset Filter 
                            <img className='refresh-icon' src={refreshIcon}/>
                            </button>
                            )}
        <div className="userlist_paging">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="userlist_prev_button"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredData1.length / rowsPerPage)}
            className="userlist_next_button"
          >
            Next
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading-popup">
          <Loader type="box-up" bgColor="#000b58" color="#000b58" size={100} />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
