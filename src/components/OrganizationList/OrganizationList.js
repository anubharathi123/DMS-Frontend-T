import React, { useState, useRef, useEffect } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Search } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import './OrganizationList.css';
import { CiTextAlignLeft } from 'react-icons/ci';
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Loader from "react-js-loader";
import { IoMdInformationCircleOutline } from "react-icons/io";



const OrganizationList = () => {
    const data = [
        { username:'AE-7783', name: 'HCL', createdDate: '2025-01-05', status: 'Inactive' },
        { username:'AE-7323', name: 'Infosys', createdDate: '2025-01-19', status: 'Active' },
        { username:'AE-7361', name: 'TCS', createdDate: '2025-02-01', status: 'Active' },
        { username:'AE-5020', name: 'Product_Declaration_11Uv', createdDate: '2025-02-15', status: 'Inactive' },
        { username:'AE-0145', name: 'IBM', createdDate: '2025-03-01', status: 'Active' },
        { username:'AE-5648', name: 'Adobe', createdDate: '2025-03-15', status: 'Inactive' },
        { username:'AE-0547', name: 'Vdart', createdDate: '2025-04-01', status: 'Inactive' },
        { username:'AE-8606', name: 'DeLL', createdDate: '2025-04-15', status: 'Active' },
        { username:'AE-1241', name: 'Microsoft', createdDate: '2025-05-01', status: 'Active' },
        { username:'AE-1211', name: 'Wipro', createdDate: '2025-05-15', status: 'Inactive' },
        { username:'AE-6711', name: 'Thoughtworks', createdDate: '2025-01-05', status: 'Inactive' },
        { username:'AE-2937', name: 'Zoho', createdDate: '2025-01-19', status: 'Active' },
        { username:'AE-3745', name: 'Accenture', createdDate: '2025-02-01', status: 'Active' },
        { username:'AE-5471', name: 'Hp', createdDate: '2025-02-15', status: 'Inactive' },
        { username:'AE-3568', name: 'Lenovo', createdDate: '2025-03-01', status: 'Active' },
        { username:'AE-4265', name: 'Asus', createdDate: '2025-03-15', status: 'Inactive' },
        { username:'AE-1876', name: 'Qualcomm', createdDate: '2025-04-01', status: 'Inactive' },
        { username:'AE-0870', name: 'Phonepe', createdDate: '2025-04-15', status: 'Active' },
        { username:'AE-2822', name: 'Google', createdDate: '2025-05-01', status: 'Active' },
        { username:'AE-9425', name: 'Paytm', createdDate: '2025-05-15', status: 'Inactive' },
    ];

    const [startDate, setStartDate] = useState(null);
   
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [filter, setFilter] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
      const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 5;
    const navigate = useNavigate();
     const [showSearchInfo, setShowSearchInfo] = useState(false);

     const searchInfoRef = useRef(null); // Reference for search info popup

     const handleEdit = (username) => {
        navigate(`/ProfileManagement/${username}`);
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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
      };

      const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value));
      };

    const handleDateChange = (date) => {
        setStartDate(date);
        setShowDatePicker(false);

        if (date) {
            const selectedDate = date.toISOString().split('T')[0];
            const filtered = data.filter((org) => org.createdDate === selectedDate);
            setFilter(filtered);
            setCurrentPage(1);
        } else {
            setFilter(data);
            setCurrentPage(1);
        }
    };

    const filteredData = data.filter(org =>
        (!searchTerm ||
            org.username.toLowerCase().includes(searchTerm) ||
            org.name.toUpperCase().includes(searchTerm)) &&
        (!statusFilter || org.status.toLowerCase() === statusFilter.toLowerCase()) &&
        (!startDate || org.createdDate === startDate.toISOString().split('T')[0])
    );
    const toggleDatePicker = () => {
        setShowDatePicker((prev) => !prev);
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleDelete = (indexToDelete) => {
        const updatedData = filteredData.filter((_, index) => index !== indexToDelete);
        setFilter(updatedData);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="organization-main">
            <h1 className="organization-header">Organization List</h1>
            <div className='organization-container_controls'>
                <div className='organization-search'>
                    <Search className='org_search-icon'></Search>
                    <input type="search" 
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
                        <th className="organization-table-th">
                            Created Date
                            <button
                                onClick={toggleDatePicker}
                                className="organization-calendarbtn"
                            >
                                📅
                            </button>
                            {showDatePicker && (
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    inline
                                />
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
                                <td className="organization-table-td">{org.name}</td>
                                <td className="organization-table-td">{org.createdDate}</td>
                                <td className="organization-table-td">{org.status}</td>
                                <td className="organization-table-td">
                                    <button className='organization-edit' onClick={() => handleEdit(org.username)}>
                                    <FaEdit />
                                    </button>
                                    
                                    <button
                                        className="organization-delete"
                                        onClick={() => handleDelete((currentPage - 1) * itemsPerPage + index)}
                                    >
                                        <MdDeleteOutline />

                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="organization-table-td">
                                No organizations found for the selected date.
                            </td>
                        </tr>
                    )}
                </tbody>
                
            </table>
            
            <div className="organization_pagination">
                <div className="organization_pageinfo">
                    Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
                </div>
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
