/* eslint-disable no-const-assign */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Search } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import apiServices from '../../ApiServices/ApiServices';
import './OrganizationList.css';
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Loader from "react-js-loader";
import { IoMdInformationCircleOutline } from "react-icons/io";
import File1 from "../../assets/Country of Origin.pdf";



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
    const itemsPerPage = 5;
    const navigate = useNavigate();
     const [showSearchInfo, setShowSearchInfo] = useState(false);
const calendarRef = useRef(null);
     const searchInfoRef = useRef(null); // Reference for search info popup

     const handleEdit = (username) => {
        navigate(`/ProfileManagement/${username}`);
    };

     const handleSearchInfo = () => {
        setShowSearchInfo(!showSearchInfo);
      };

      useEffect (() => {
        const fetchOrganization = async () => {
            try {
                setIsLoading(true)
                const response = await apiServices.getOrganizations();
                console.log(response,response.organization)
                console.log("API Response:", response);
                
                 const organization = response.organization.map(org => ({
                    username:org.auth_user.username,
                    org_name:org.company_name,
                    msa_doc: org.contract_doc,
                    created_date:org.created_at,
                    status:org.is_frozen,
                })) 
                console.log(organization)
                setData(organization);

                console.log("API Response:", response);
console.log("First Organization's contract_doc:", response.organization[0].contract_doc);

                if(organization.length === 0){
                    setActionMessage("No Organizations are found in the list..")
                }
                

            }catch(error) {
                console.error(error);

            }finally {
                setIsLoading(false)
            }
        };

        fetchOrganization();
      }, []);
    
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

    

    const filteredData = data.filter(org =>
        (!searchTerm ||
            org.username.toLowerCase().includes(searchTerm) ||
            org.name.toUpperCase().includes(searchTerm)) &&
        (!statusFilter || org.status.toLowerCase() === statusFilter.toLowerCase()) &&
        (!startDate || org.createdDate === startDate.toISOString().split('T')[0])
    );
    const handleCalendarToggle = () => setIsCalendarOpen((prev) => !prev);
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
                        <th className="organization-table-th">Status</th>
                        <th className="organization-table-th">Actions</th>
                    </tr>
                </thead>
                
                <tbody className='organization-tbody' style={{ maxHeight: rowsPerPage > 5 ? '200px' : 'auto' }}>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((org, index) => (
                           
                            <tr key={index} className="organization-table-row">
                                <td className="organization-table-td">{org.username}</td>
                                <td className="organization-table-td">
  {org.org_name.length > 20 ? org.org_name.substring(0, 20) + "..." : org.org_name}
</td>
                                <td className="organization-table-td">
                                    {org.msa_doc ? (
                                        <a href={File1} target='_blank' rel='noopener noreferrer'>
                                        {org.msa_doc.split('/').pop().substring(0, 20) + '...'}
                                        </a>
                                    ) : (
                                    "Null"  
                                    )}
                                    </td>
                                <td className="organization-table-td">{new Date(org.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="organization-table-td">
  {org.status ? "Inactive" : "Active"}
</td>
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
