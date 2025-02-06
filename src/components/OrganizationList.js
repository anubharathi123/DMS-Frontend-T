import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './OrganizationList.css';
import { MdDeleteOutline } from "react-icons/md";
import { TiEdit } from "react-icons/ti";

const OrganizationList = () => {
    const data = [
        { username: 'AE', name: 'Organization 1', createdDate: '2025-01-05', status: 'Inactive' },
        { username: 'AE', name: 'Organization 2', createdDate: '2025-01-19', status: 'Active' },
        { username: 'AE', name: 'Organization 3', createdDate: '2025-02-01', status: 'Active' },
        { username: 'AE', name: 'Organization 4', createdDate: '2025-02-15', status: 'Inactive' },
        { username: 'AE', name: 'Organization 5', createdDate: '2025-03-01', status: 'Active' },
        { username: 'AE', name: 'Organization 6', createdDate: '2025-03-15', status: 'Inactive' },
        { username: 'AE', name: 'Organization 7', createdDate: '2025-04-01', status: 'Inactive' },
        { username: 'AE', name: 'Organization 8', createdDate: '2025-04-15', status: 'Active' },
        { username: 'AE', name: 'Organization 9', createdDate: '2025-05-01', status: 'Active' },
        { username: 'AE', name: 'Organization 10', createdDate: '2025-05-15', status: 'Inactive' },
    ];

    const [startDate, setStartDate] = useState(null);
    const [filteredData, setFilteredData] = useState(data);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [usernameFilter, setUsernameFilter] = useState('');
    const [orgNameFilter, setOrgNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const handleDateChange = (date) => {
        setStartDate(date);
        setShowDatePicker(false);

        if (date) {
            const selectedDate = date.toISOString().split('T')[0];
            const filtered = data.filter((org) => org.createdDate === selectedDate);
            setFilteredData(filtered);
            setCurrentPage(1);
        } else {
            setFilteredData(data);
            setCurrentPage(1);
        }
    };

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
        setFilteredData(updatedData);
    };

    const handleEdit = (org) => {
        navigate('/profile-management');
    };

    const handleSearch = () => {
        const filtered = data.filter((org) => {
            return (
                (org.username.toLowerCase().includes(usernameFilter.toLowerCase())) &&
                (org.name.toLowerCase().includes(orgNameFilter.toLowerCase())) &&
                (org.status.toLowerCase().includes(statusFilter.toLowerCase()))
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };
    
    return (
        <div className="organization-container">
            <h1 className="organization-h1">Organization List</h1>

            {/* Search Row */}
            <div className="organization-search-row">
                <input
                    className="organization-search-input"
                    type="text"
                    placeholder="Search"
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                    onKeyUp={handleSearch}
                />
                <select
                    className="organization-search-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    onBlur={handleSearch}
                >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <label className="organization_rows_label mr-2">Rows per Page:</label>
          <select value={rowsPerPage} onChange={handleRowsPerPage} className="organization_rows_select py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
                
                </div>
                {/* <div className="organization_rows flex items-center">
          
        </div> */}

            <table className="organization-table">
                <thead>
                    <tr className="organization-table-header">
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
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((org, index) => (
                            <tr key={index} className="organization-table-row">
                                <td className="organization-table-td">{org.username}</td>
                                <td className="organization-table-td">{org.name}</td>
                                <td className="organization-table-td">{org.createdDate}</td>
                                <td className="organization-table-td">{org.status}</td>
                                <td className="organization-table-td">
                                    <button
                                        className="organization-edit"
                                        onClick={() => handleEdit(org)}
                                    >
                                        <TiEdit />
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
                            <td colSpan="5" className="organization-table-td">
                                No organizations found for the selected criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="prev-next-container">
                <div className="pageno">
                    Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
                </div>
                <div className="prev-next-buttons">
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
        </div>
    );
};

export default OrganizationList;
