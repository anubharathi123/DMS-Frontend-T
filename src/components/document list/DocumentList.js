import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import apiServices from '../../ApiServices/ApiServices';
import './DocumentList.css';
import Loader from "react-js-loader";
import { IoMdInformationCircleOutline } from "react-icons/io";

const DocumentTable = () => {
  const initialState = {
    documents: [],
    loading: false,
  };

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
  const [showSearchInfo, setShowSearchInfo] = useState(false);

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
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);

        const response = await apiServices.getDocuments();
        const documents = response.map(doc => ({
          declarationNumber: doc.declaration_number,
          file: doc.current_version?.file_path,
          fileName: doc.current_version?.file_path ? doc.current_version.file_path.split('/').pop() : '',
          updatedDate: doc.updated_at,
          documentType: doc.document_type?.name || '',
          status: doc.status || '',
          rejectionReason: doc.rejectionReason,
          fileUrl: doc.fileUrl || '',
          viewed: false,
          version: doc.current_version?.version_number,
        }));

        setData(documents);
        setFilteredData(documents);

        if (documents.length === 0) {
          setActionMessage('No files are available for approval.');
        }
      } catch (error) {
        // console.error('Error fetching documents:', error);
        // setActionMessage('Error fetching documents. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredData1 = filteredData.filter((item) => {
    if (filter === '') {
      return item.declarationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.updatedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return item.status === filter && (
        item.declarationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.updatedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  useEffect(() => {
    const filteredDocuments = data.filter((item) => {
      if (filterDate) {
        const itemDate = new Date(item.updatedDate);
        const selectedDate = new Date(filterDate);
        return itemDate.toLocaleDateString() === selectedDate.toLocaleDateString();
      }
      return true;
    });

    setFilteredData(filteredDocuments);
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
    <div className="documenttable_container">
      <h1 className="documentlist_header">Document List</h1>
      {actionMessage && <div className="documenttable_action_message">{actionMessage}</div>}
      <div className="documenttable_controls flex justify-between mb-4">
        <div className="documenttable_search flex items-center">
          <Search className="documenttable_search_icon w-5 h-5 mr-2" />
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            className="documenttable_search_input py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
          />
          <button className='document_searchinfo' onClick={handleSearchInfo}>
            <IoMdInformationCircleOutline/> 
            </button>
            {showSearchInfo && (
              <div ref={searchInfoRef} className="search-info-popup">
                  Date filter format should be like this: yyyy-mm-dd
              </div>
            )}
        </div>
        <div className="documenttable_filter flex items-center">
          <label className="documenttable_filter_label mr-2">Filter by Status:</label>
          <select value={filter} onChange={handleFilter} className="documenttable_filter_select py-2 pl-10 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Reject</option>
            <option value="APPROVED">Approve</option>
          </select>
        </div>

        <div className="documenttable_rows flex items-center">
          <label className="documenttable_rows_label mr-2">Rows per Page:</label>
          <select value={rowsPerPage} onChange={handleRowsPerPage} className="documenttable_rows_select py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
      <table className="documenttable_table w-full text-sm text-left text-gray-500">
        <thead className="documenttable_thead text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="documenttable_th px-6 py-3">Declaration Number</th>
            <th className="documenttable_th px-6 py-3">File Name</th>
            <th className="documenttable_th px-6 py-3">Updated Date
              <button
                className="document-list-calendarbtn"
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
            <th className="documenttable_th px-6 py-3">Doc Type</th>
            <th className="documenttable_th px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="documenttable_tbody">
          {paginatedData.map((item, index) => (
            <tr key={index} className="documenttable_row bg-white border-b hover:bg-gray-50">
              <td className="documenttable_td px-6 py-4">{item.declarationNumber}</td>
              <td className="documenttable_td px-6 py-4">
  {item.fileName.length > 20 ? item.fileName.substring(0, 20) + "..." : item.fileName}
</td>

              <td className="documenttable_td px-6 py-4">{new Date(item.updatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td className="documenttable_td px-6 py-4">{item.documentType.charAt(0).toUpperCase() + item.documentType.slice(1).toLowerCase()}</td>
              <td className="documenttable_td px-6 py-4">
                <span
                  data-tip={item.rejectionReason} 
                  className={`documenttable_status text-xs font-medium py-1 px-2 rounded 
                    ${item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                    'bg-green-100 text-green-800'}`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                  <div className="tooltip">{item.rejectionReason}</div>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="documenttable_pagination flex justify-between mt-4">
        <div className="documenttable_pageinfo flex items-center">
          <p className="documenttable_pageinfo_text mr-2">Page {currentPage} of {Math.ceil(filteredData1.length / rowsPerPage)}</p>
        </div>
        <div className="documenttable_paging flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="documenttable_paging_button py-2 px-4 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredData1.length / rowsPerPage)}
            className="documenttable_paging_button py-2 px-4 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
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

export default DocumentTable;
