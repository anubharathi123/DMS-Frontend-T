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
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
          role: admin.role.name,
          delete: admin.is_delete,
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log(admins)
        const filterdata = admins.filter(item => item.delete === true);
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