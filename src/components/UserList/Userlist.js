import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import Loader from "react-js-loader";
import apiServices from "../../ApiServices/ApiServices"; // Adjust path if needed
import "./Userlist.css";

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
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const response = await apiServices.users();
        console.log(response)
        const users = response.map((user) => ({
          username: user.auth_user.username || "N/A",
          company_name: user.organization.company_name,
          email: user.auth_user.email,
          createdAt: user.created_at,
          role: user.role.name,
        }));
        setData(users);
        setFilteredData(users);
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
    fetchDetails();
  }, [refresh]);

  const filteredData1 = (filteredData || []).filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.username.toLowerCase().includes(searchTermLower) ||
      item.name.toLowerCase().includes(searchTermLower) ||
      item.email.toLowerCase().includes(searchTermLower) ||
      item.createdAt.toLowerCase().includes(searchTermLower) ||
      item.role.toLowerCase().includes(searchTermLower);

    return filter ? item.role === filter && matchesSearch : matchesSearch;
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

  const paginatedData = filteredData1.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleCreateUser = () => {
    navigate(`/createuser`);
  }


  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSearchInfo = () => setShowSearchInfo(!showSearchInfo);
  const handleFilter = (e) => setFilter(e.target.value);
  const handleRowsPerPage = (e) => setRowsPerPage(parseInt(e.target.value));
  const handleCalendarToggle = () => setIsCalendarOpen((prev) => !prev);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="userlist-container">
      <h1 className="userlist-header">User List</h1>
      <button className='user_createbtn' onClick={handleCreateUser} > + New User</button> 
      {actionMessage && <div className="userlist_action_message">{actionMessage}</div>}

      <div className="userlist-controls">
        <div className="userlist-search">
          <Search className="userlist_search_icon" />
          <input
            type="search"
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
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
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
            <th className="userlist_th">Username</th>
            <th className="userlist_th">Organization Name</th>
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
          </tr>
        </thead>
        <tbody className="userlist_tbody">
          {paginatedData.map((item, index) => (
            <tr key={index} className="userlist_row">
              <td className="userlist_td">{item.username}</td>
              <td className="userlist_td">{item.company_name}</td>
              <td className="userlist_td">{item.email}</td>
              <td className="userlist_td">
                {new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </td>
              <td className="userlist_td">{item.role.charAt(0).toUpperCase() + item.role.slice(1).toLowerCase()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="userlist_pagination">
        <div className="userlist_pageinfo">
            <p className="userlist_pageinfo_text">Page {currentPage} of {Math.ceil(filteredData1.length / rowsPerPage)}</p>
        </div>
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
