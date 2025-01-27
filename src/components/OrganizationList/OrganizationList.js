import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './OrganizationList.css';
import { MdDeleteOutline } from "react-icons/md";
import { TiEdit } from "react-icons/ti";

const OrganizationList = () => {
    const data = [
        { username: 'org1user', name: 'Organization 1', createdDate: '2025-01-05', status: 'Inactive' },
        { username: 'org2user', name: 'Organization 2', createdDate: '2025-01-19', status: 'Active' },
        { username: 'org3user', name: 'Organization 3', createdDate: '2025-02-01', status: 'Active' },
        { username: 'org4user', name: 'Organization 4', createdDate: '2025-02-15', status: 'Inactive' },
        { username: 'org5user', name: 'Organization 5', createdDate: '2025-03-01', status: 'Active' },
        { username: 'org6user', name: 'Organization 6', createdDate: '2025-03-15', status: 'Inactive' },
        { username: 'org7user', name: 'Organization 7', createdDate: '2025-04-01', status: 'Inactive' },
        { username: 'org8user', name: 'Organization 8', createdDate: '2025-04-15', status: 'Active' },
        { username: 'org9user', name: 'Organization 9', createdDate: '2025-05-01', status: 'Active' },
        { username: 'org10user', name: 'Organization 10', createdDate: '2025-05-15', status: 'Inactive' },
    ];

    const [startDate, setStartDate] = useState(null);
    const [filteredData, setFilteredData] = useState(data);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [usernameFilter, setUsernameFilter] = useState('');
    const [orgNameFilter, setOrgNameFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const itemsPerPage = 5;
    const navigate = useNavigate();  // Initialize useNavigate

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
        // When the edit icon is clicked, navigate to ProfileManagementPage
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

    return (
        <div className="organization-container">
            <h1 className="organization-h1">Organization List</h1>

            {/* Search Box */}
            <div className="organization-search-container">
                <input
                    type="text"
                    placeholder="Search by Username"
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                    onKeyUp={handleSearch}
                />
                <input
                    type="text"
                    placeholder="Search by Organization Name"
                    value={orgNameFilter}
                    onChange={(e) => setOrgNameFilter(e.target.value)}
                    onKeyUp={handleSearch}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    onBlur={handleSearch}
                >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <table className="organization-table">
                <thead>
                    <tr className="organization-table-header">
                        <th className="organization-table-th">UserName</th>
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
                        <th className="organization-table-th">Active / Inactive</th>
                        <th className="organization-table-th">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((org, index) => (
                            <tr key={index} className="organization-table-row">
                                <td className="organization-table-td">{org.name}</td>
                                <td className="organization-table-td">{org.username}</td>
                                <td className="organization-table-td">{org.createdDate}</td>
                                <td className="organization-table-td">{org.status}</td>
                                <td className="organization-table-td">
                                    <button
                                        className="organization-edit"
                                        onClick={() => handleEdit(org)}  // Trigger the edit functionality
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
