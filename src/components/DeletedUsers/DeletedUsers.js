import React, { useState, useEffect, useRef } from "react";
import { Search, Users } from "lucide-react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Loader from "react-js-loader";
import apiServices from "../../ApiServices/ApiServices"; // Adjust path if needed
import "./DeletedUsers.css";
import refreshIcon from '../../assets/images/refresh-icon.png';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


// export function FontAwesomeIcon(props: FontAwesomeIconProps): JSX.Element


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
        id: user.id,
        empId: user.auth_user.id,
        username: user.auth_user.first_name || "N/A",
        // company_name: user.organization.company_name,
        email: user.auth_user.email,
        createdAt: user.created_at,
        role: user.role.name,
        status: user.is_frozen,
        delete: user.is_delete,
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const filteredUsers = users.filter(item => item.delete === true);
      console.log(filteredUsers, "filteredUsers")
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
      if (filterDate) {
        const itemDate = new Date(item.createdAt);
        const selectedDate = new Date(filterDate);
        return itemDate.toLocaleDateString() === selectedDate.toLocaleDateString();
      }
      return true;
    });
    setFilteredData(filterUsers);
  }, [filterDate, data]);

  const paginatedData = filteredData1.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  console.log(paginatedData, "paginatedData")

  const handleDropdownChange = (value) => {
    if (value === "User List") {
      navigate('/user-list');
    } else if (value === "Add User") {
      navigate('/createuser')
    }
  };

  // const handleNavigate = () => {
  //   navigate('/user-list');  };

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

    const handleRestore = async (id) => {
            if (!window.confirm("Are you sure you want to restore this user?")) {
            }
            try {
              console.log(id, "id")
                setIsLoading(true);
    
                // Call API to delete the organization
                const response = await apiServices.RestoreUserdelete(id);
                console.log(response, response.success, response.message)
                fetchDetails(); // Refresh the list after deletion
                
                // Ensure API returns success
    
            } catch (error) {
                console.error("Error deleting organization:", error);
                alert("An error occurred while deleting.");
            } finally {
                setIsLoading(false);
            }
        };


        const handleCreateUser = () => {
          navigate(`/createuser`);
        }

  return (
    <div className="userlist-container">
      <h1 className="userlist-header">User Deleted Details</h1>
      <div style={{ width: "fitContent", marginLeft: "auto" }}>
      <button className="user_createbtn" onClick={handleCreateUser}>
        + New User
      </button>

      <button className="admin_createbtn" onClick={() =>fetchDetails()}  style={{ marginLeft: 0 }}>
            <span>Refresh</span>
      </button>
      <select className="organization-select" onChange={(e) => handleDropdownChange(e.target.value)}>
        <option value="">Select an Option </option>
        <option value="User List">User List</option>
        {/* <option value="Add User">Add User</option> */}
      </select>
      </div>
      {/* <button className='organization-backbtn' onClick={handleNavigate} >Back</button> */}
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
              <button className="user-list-calendarbtn" onClick={handleCalendarToggle}>
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
                  />
                </div>
              )}
            </th>
            <th className="userlist_th">Role</th>
            <th className="adminlist_th">Restore</th>

          </tr>
        </thead>
        <tbody className="userlist_tbody">

          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={index} className="userlist_row">
                <td className="userlist_td">{item.username}</td>
                <td className="userlist_td">{item.email}</td>
                <td className="userlist_td">
                  {new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </td>
                <td className="userlist_td">
                  {item.role}
                </td>
                <td className="userlist_td">
                  {/* <i class="fa-solid fa-repeat"></i> */}
                  <button
                    className="organization-delete"
                    onClick={() => handleRestore(item.id)}>
                    <FontAwesomeIcon icon={faRepeat} />
                  </button>
                  <span style={{ color: 'black' }}></span>
                </td>
              </tr>

            ))
          ) : (
            <tr>
              <td colSpan="4" className="userlist_td">No deleted users found.....</td>
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
            <img className='refresh-icon' src={refreshIcon} />
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
