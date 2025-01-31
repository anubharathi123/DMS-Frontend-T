import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import apiServices from '../../ApiServices/ApiServices'; // Adjust the import path for apiServices
import './AdminList.css';
import Loader from "react-js-loader";

const AdminList = () => {
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

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);

        const response = await apiServices.getAdmins(); // Adjust based on API
        const admins = response.map(admin => ({
          adminId: admin.id,
          name: admin.name,
          email: admin.email,
          createdAt: admin.created_at,
          role: admin.role,
        }));

        setData(admins);
        setFilteredData(admins);

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
  }, []);

  const filteredData1 = filteredData.filter((item) => {
    if (filter === '') {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return item.role === filter && (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  useEffect(() => {
    // Filter admins based on the selected filter date
    const filteredAdmins = data.filter((item) => {
      if (filterDate) {
        const itemDate = new Date(item.createdAt);
        const selectedDate = new Date(filterDate);
        // Only show items that match the selected date
        return itemDate.toLocaleDateString() === selectedDate.toLocaleDateString();
      }
      return true; // If no filter date, show all items
    });

    setFilteredData(filteredAdmins);
  }, [filterDate, data]);

  const paginatedData = filteredData1.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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

  return (
    <div className="adminlist_container">
      <h1 className="adminlist_header">Admin List</h1>
      {actionMessage && <div className="adminlist_action_message">{actionMessage}</div>}
      <div className="adminlist_controls flex justify-between mb-4">
        <div className="adminlist_search flex items-center">
          <Search className="adminlist_search_icon w-5 h-5 mr-2" />
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            className="adminlist_search_input py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
          />
        </div>
        <div className="adminlist_filter flex items-center">
          <label className="adminlist_filter_label mr-2">Filter by Role:</label>
          <select value={filter} onChange={handleFilter} className="adminlist_filter_select py-2 pl-10 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="">All</option>
            <option value="Admin">Admin</option>
            <option value="SuperAdmin">SuperAdmin</option>
          </select>
        </div>

        <div className="adminlist_rows flex items-center">
          <label className="adminlist_rows_label mr-2">Rows per Page:</label>
          <select value={rowsPerPage} onChange={handleRowsPerPage} className="adminlist_rows_select py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
      <table className="adminlist_table w-full text-sm text-left text-gray-500">
        <thead className="adminlist_thead text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="adminlist_th px-6 py-3">Admin ID</th>
            <th className="adminlist_th px-6 py-3">Name</th>
            <th className="adminlist_th px-6 py-3">Email</th>
            <th className="adminlist_th px-6 py-3">Created Date
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
            <th className="adminlist_th px-6 py-3">Role</th>
          </tr>
        </thead>
        <tbody className="adminlist_tbody">
          {paginatedData.map((item, index) => (
            <tr key={index} className="adminlist_row bg-white border-b hover:bg-gray-50">
              <td className="adminlist_td px-6 py-4">{item.adminId}</td>
              <td className="adminlist_td px-6 py-4">{item.name}</td>
              <td className="adminlist_td px-6 py-4">{item.email}</td>
              <td className="adminlist_td px-6 py-4">{new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td className="adminlist_td px-6 py-4">{item.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="adminlist_pagination flex justify-between mt-4">
        <div className="adminlist_pageinfo flex items-center">
          <p className="adminlist_pageinfo_text mr-2">Page {currentPage} of {Math.ceil(filteredData1.length / rowsPerPage)}</p>
        </div>
        <div className="adminlist_paging flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="adminlist_paging_button py-2 px-4 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredData1.length / rowsPerPage)}
            className="adminlist_paging_button py-2 px-4 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
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
