/* eslint-disable no-const-assign */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Search } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import apiServices from '../../ApiServices/ApiServices';
import './OrganizationDList.css';
import Loader from "react-js-loader";
import { IoMdInformationCircleOutline } from "react-icons/io";
import refreshIcon from '../../assets/images/refresh-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';


const OrganizationList = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [filterDate, setFilterDate] = useState(null);
    const [actionMessage, setActionMessage] = useState('');
    const [filter, setFilter] = useState('');
    // const [organization, setOrganization] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [orgData, setOrgData] = useState(data); // Main data state

    const [showPopup, setShowPopup] = useState(false);


    const itemsPerPage = 5;
    const navigate = useNavigate();
    const [showSearchInfo, setShowSearchInfo] = useState(false);
    const calendarRef = useRef(null);
    const searchInfoRef = useRef(null); // Reference for search info popup
    const role = localStorage.getItem('role');
    const url = "http://localhost:8000"

    const handleEdit = (id) => {
        navigate(`/CompanyUpdate/${id}`);
    };

    const handleSearchInfo = () => {
        setShowSearchInfo(!showSearchInfo);
    };

    const fetchOrganization = async () => {
        try {
            setIsLoading(true);
            const response = await apiServices.getOrganizations();
            console.log(response)
            const organization = response.approved_organizations.map(org => ({
                id: org.id,
                username: org.auth_user.username,
                org_name: org.company_name,
                msa_doc: org.contract_doc,
                created_date: org.created_at,
                status: org.is_frozen,
                delete: org.is_delete,
            }));
            console.log(organization)
            const filterdata = organization.filter(org => org.delete === true)
                .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
            setData(filterdata);

            if (organization.length === 0) {
                setActionMessage("No Organizations are found in the list.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {


        fetchOrganization();
    }, [navigate]); // Triggers when returning from navigation


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


    const handleCreateOrganization = () => {
        navigate(`/CompanyCreation`);
    }

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



    const filteredData = data.filter(org => {
        const matchesSearch = searchTerm
            ? org.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.org_name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        const matchesStatus = statusFilter
            ? (statusFilter === "Active" ? org.status === false : org.status === true)
            : true;

        const matchesDate = filterDate
            ? new Date(org.created_date).toDateString() === new Date(filterDate).toDateString()
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
        if (value === "Organization List") {
            navigate('/OrganizationList');
        } else if (value === "Create Organization") {
            navigate(`/CompanyCreation`);
            // } else if (value === "Registered List") {
            //     navigate(`/OrganizationPending`);
        } else if (value === "MSI Approval") {
            navigate(`/MsiPending`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this organization?")) {
        }
        try {
            setIsLoading(true);

            // Call API to delete the organization
            const response = await apiServices.permanentOrganizationdelete(id);
            console.log(response, response.success, response.message)
            // Ensure API returns success
            fetchOrganization()

        } catch (error) {
            console.error("Error deleting organization:", error);
            alert("An error occurred while deleting.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (id) => {
        if (!window.confirm("Are you sure you want to restore this organization?")) {
        }
        try {
            setIsLoading(true);

            // Call API to delete the organization
            const response = await apiServices.RestoreOrganizationdelete(id);
            console.log(response, response.success, response.message)
            // Ensure API returns success
            fetchOrganization()

        } catch (error) {
            console.error("Error deleting organization:", error);
            alert("An error occurred while deleting.");
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const togglePopup = () => setShowPopup(!showPopup);


    return (
        <div className="organization-main">
            <h1 className="organization-header">Organization Deleted Details</h1>
            <div style={{ display: 'flex', justifyContent: 'cneter', alignItems: 'center', gap: '10px', width: "content-fit", marginLeft: "auto" }}>

                <button className="organization_createbtn" onClick={() => navigate('/CompanyCreation')}>
                    <span class="plus-icon">+</span>
                    <span>Create New</span>
                </button>
                <button className="organization_createbtn" onClick={() => fetchOrganization()}>
                    <span>Refresh</span>
                </button>
                <select className="organization-select" onChange={(e) => handleDropdownChange(e.target.value)}>
                    <option value="">Select an Option </option>
                    <option value="Organization List">Organization List</option>
                    {/* <option value="Create Organization">Create Organization</option> */}
                    {/* <option value="Registered List">Registered List</option> */}
                    <option value="MSI Approval">MSI Approval</option>

                </select>
            </div>
            {/* <button className='organization-backbtn' onClick={handleNavigate} >Back</button> */}
            {/* {(role === "PRODUCT_OWNER" || "PRODUCT_ADMIN") && (
  <button className='org_createbtn' onClick={handleCreateOrganization} > + New Organization</button> 
  
)} */}
            <div className='organization-container_controls'>
                <div className='organization-search'>
                    <Search className='org_search-icon'></Search>
                    <input type="search"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search"
                        className="organization-search-input" />
                    <button className='organization_searchinfo' onClick={handleSearchInfo}>
                        <IoMdInformationCircleOutline />
                    </button>
                    {showSearchInfo && (
                        <div ref={searchInfoRef} className="organization-searchinfo-popup">
                            Date filter format should be like this: yyyy-mm-dd
                        </div>
                    )}
                </div>
                {/* <div className="organization-filter">
                    <label className="organization_filter-label">Filter by Status:</label>
                    <select value={statusFilter} onChange={handleStatusFilter}className="organization-filter-select">
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select> 
                </div> */}
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
                        <th className="organization-table-th">MSA Doc</th>
                        <th className="organization-table-th">
                            Created Date
                            <button
                                onClick={handleCalendarToggle}
                                className="organization-calendarbtn"
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
                            )}
                        </th>
                        {/* <th className="organization-table-th">Status</th> */}
                        <th className="organization-table-th">Actions</th>
                        <th className="organization-table-th">Restore</th>
                    </tr>
                </thead>

                <tbody className='organization-tbody' style={{ maxHeight: rowsPerPage > 5 ? '200px' : 'auto' }}>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((org, index) => (


                            <tr key={index} className="organization-table-row">
                                <td className="organization-table-td">{org.username}</td>
                                <td className="organization-table-td" onClick={togglePopup} style={{ cursor: 'pointer', position: 'relative' }}>
                                    {org.org_name.length > 20 ? org.org_name.substring(0, 20) + "..." : org.org_name}

                                    {showPopup && (
                                        <div className="popup" style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            background: 'white',
                                            border: '1px solid #ccc',
                                            padding: '8px',
                                            zIndex: 10,
                                            boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {org.org_name}
                                        </div>
                                    )}
                                </td>
                                <td className="organization-table-td">
                                    {org.msa_doc ? (
                                        <a href={(url + org.msa_doc)}
                                            title={org.msa_doc.split('/').pop()}
                                            target='_blank' rel='noopener noreferrer'>
                                            {org.msa_doc.split('/').pop().substring(0, 30) + '...'}
                                        </a>

                                    ) : (
                                        "Null"
                                    )}
                                </td>
                                <td className="organization-table-td">{new Date(org.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                {/* <td className="organization-table-td">
  {org.status ? "Inactive" : "Active"}
</td> */}
                                <td className="organization-table-td">

                                    <button
                                        className="organization-delete"
                                        onClick={() => handleDelete(org.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    {/* <span style={{color:'black'}}>Permanent Delete</span> */}
                                </td>
                                <td className="organization-table-td">
                                    {/* <i class="fa-solid fa-repeat"></i> */}
                                    <button
                                        className="organization-delete"
                                        onClick={() => handleRestore(org.id)}>
                                        <FontAwesomeIcon icon={faRepeat} />
                                    </button>
                                    <span style={{ color: 'black' }}></span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="organization-table-td">
                                No deleted organizations found!!!!!
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>

            <div className="organization_pagination">
                <div className="organization_pageinfo">
                    Page {currentPage} of {totalPages || 1}
                </div>
                {/* Reset Filter Button */}
                {(searchTerm || statusFilter || filterDate) && (
                    <button className="reset-filter-btn" onClick={handleResetFilter}
                        disabled={!searchTerm && !statusFilter && !filterDate}>
                        Reset Filter
                        <img className='refresh-icon' src={refreshIcon} />
                    </button>
                )}

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
