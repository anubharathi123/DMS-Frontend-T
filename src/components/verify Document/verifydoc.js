import React, { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { AlignCenter, Search } from 'lucide-react';
import './verifydoc.css';
import apiServices from '../../ApiServices/ApiServices'; // Adjust path if necessary

const DocumentApproval = () => {
  const [data, setData] = useState([]);
  const [filterDate, setFilterDate] = useState();
  const [filterDoc, setFilterDoc] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [actionMessage, setActionMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDocTypeDropdownVisible, setDocTypeDropdownVisible] = useState(false);
  const host = 'http://localhost:8000';
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await apiServices.getDocuments();
        console.log('Documents:', response);
        const documents = response.map(doc => ({
          declarationNumber: doc.declaration_number,
          file : doc.current_version?.file_path,
          fileName: doc.current_version?.file_path ? doc.current_version.file_path.split('/').pop() : '',  // Extract file name
          updatedDate: doc.updated_at,
          documentType: doc.document_type?.name || '',
          status: doc.status || '',
          fileUrl: doc.fileUrl || '',
          viewed: false,
          version:doc.current_version?.version_number,
        }));

        setData(documents);
        setFilteredData(documents);

        if (documents.length === 0) {
          setActionMessage('No files are available for approval.');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        setActionMessage('Error fetching documents. Please try again later.');
      }
    };

    fetchDocuments();
  }, []);


  const handleApproval = async (declarationNumber, newStatus) => {
    setActionMessage('');
    try {
      if (newStatus === 'Approved') {
        await apiServices.approveDocument(declarationNumber);
      } else if (newStatus === 'Rejected') {
        await apiServices.rejectDocument(declarationNumber);
      }

      const updatedData = data.map((item) =>
        item.declarationNumber === declarationNumber
          ? { ...item, status: newStatus }
          : item
      );
      setData(updatedData);
      setFilteredData(updatedData);
      setActionMessage(`Document ${declarationNumber} has been ${newStatus}`);
    } catch (error) {
      console.error('Error during approval/rejection:', error);
      setActionMessage('There was an error processing your request.');
      setTimeout(() => {
        setActionMessage('There was an error processing your request.');
        setActionMessage('');
        // setLoading(false);
      }, 3000);
 
      setActionMessage('There was an error processing your request.');
    }
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen((prev) => {
      if (!prev) setDocTypeDropdownVisible(false); // Close dropdown when calendar opens
      return !prev;
    });
  };

  const handleFileOpen = (file) => {
    if (file.file.toLowerCase().endsWith('.pdf')) {
      const updatedData = data.map((item) =>
        item.file === file.file
          ? { ...item, viewed: true }
          : item
      );
      setData(updatedData);
      setSelectedFile(file);
    } else {
      const a = document.createElement('a');
      console.log(a)
      a.href = host+file.file;
      console.log(file.file);
      a.download = file.file;
      console.log(a)
      const updatedData = data.map((item) =>
        item.file === file.file
          ? { ...item, viewed: true }
          : item
      );
      setData(updatedData);
      a.click();
    }
  };

  
  const applyFilters = () => {
    let filtered = [...data];
    console.log('Filter Date:', filterDate);
    if (filterDate) {
        // Format the filterDate to a local date string in 'YYYY-MM-DD' format
        const selectedDate = filterDate.toLocaleDateString('en-CA'); // 'en-CA' gives 'YYYY-MM-DD' format

        filtered = filtered.filter((doc) => {
            // Parse the updatedDate to a local date string
            const docDate = new Date(doc.updatedDate).toLocaleDateString('en-CA');
            return docDate === selectedDate;
        });
    }
    if (filterDoc) {
      filtered = filtered.filter((doc) => doc.documentType === filterDoc);
    }

    setCurrentPage(1);
    setFilteredData(filtered);
};


  useEffect(() => {
      applyFilters();
    }, [filterDate, filterDoc]);

    const handleDocumentTypeChange = (e) => {
      setFilterDoc(e.target.value);
    };
  
    const uniqueDocumentTypes = [...new Set(data.map(doc => doc.documentType))];
  

  useEffect(() => {
    const results = data.filter(item =>
      (
        (item.declarationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.updatedDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.documentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.status?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filter === '' || item.status === filter)
      )
    );
    setFilteredData(results);
  }, [data, searchTerm, filter]);
  

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="documentapproval_container">
      <h1 className="documentapproval_header">Document Approval</h1>

      <div className="documenttable_controls flex justify-between mb-4">
        
        <div className="documenttable_search flex items-center">
          <Search className="documenttable_search_icon w-5 h-5 mr-2" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="documenttable_search_input py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
          />
        </div>
        {/* <div className="documenttable_filter flex items-center">
          <label className="documenttable_filter_label mr-2">Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="documenttable_filter_select py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div> */}

<div className="documenttable_filter flex items-center">
          <label className="documenttable_filter_label mr-2">Filter by Document Type:</label>
          <select value={filterDoc} onChange={handleDocumentTypeChange} className="documenttable_filter_select py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="">All</option>
            {uniqueDocumentTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="documenttable_rows flex items-center">
          <label className="documenttable_rows_label mr-2">Rows per Page:</label>
          <select value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))} className="documenttable_rows_select py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
      {actionMessage && (
        <div className="documentapproval_message bg-red-100 text-red-800 px-4 py-2 rounded mb-4" role="alert">
          {actionMessage}
        </div>
      )}
      {/* {filteredData.length === 0 ? (
        <div className="documentapproval_no_data text-center text-gray-500 py-4">
          No files are available for approval.
        </div>
      ) : ( */}
        <>
          <table className="documentapproval_table w-full text-sm text-left text-gray-500">
            <thead className="documentapproval_thead text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="documentapproval_th px-6 py-3">Declaration Number</th>
                <th className="documentapproval_th px-6 py-3">File Name</th>
                {/* <th className="documentapproval_th px-6 py-3">Version</th> */}
                <th className="documentapproval_th px-6 py-3">Updated Date
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
                <th className="documentapproval_th px-6 py-3">Doc Type</th>
                {/* <th className="documentapproval_th px-6 py-3">Status</th> */}
                <th className="documentapproval_th px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="documentapproval_row bg-white border-b hover:bg-gray-50">
                  <td className="documentapproval_td px-6 py-4" style={{textAlignLast:"left", position: "relative", left: '20px'}}>{item.declarationNumber}</td>
                  <td className="documentapproval_td documentapproval_td_name px-6 py-4">
                    <button
                      className={`documentapproval_file_link underline ${item.viewed ? 'text-blue-600' : 'text-gray-800'}`}
                      onClick={() => handleFileOpen(item)}
                      aria-label={`View ${item.fileName}`}
                    >
                      {item.fileName}
                    </button>
                    {item.viewed && <span className="text-green-500 text-xs ml-2">(Viewed)</span>}
                  </td>
                  {/* <td className="documentapproval_td px-6 py-4" style={{textAlignLast: 'center'}}>{item.version}.0</td> */}
                  <td className="documentapproval_td px-6 py-4">{new Date(item.updatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  <td className="documentapproval_td px-6 py-4">{item.documentType}</td>
                  {/* <td className="documentapproval_td px-6 py-4">
                    <span className={`documentapproval_status_badge px-2 py-1 rounded text-sm ${item.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : item.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td> */}
                  <td className="documentapproval_td documentapproval_approvalbtn px-6 py-4">
                    <button className="documentapproval_action_button bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleApproval(item.declarationNumber, 'Approved')}>Approve</button>
                    <button className="documentapproval_action_button bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleApproval(item.declarationNumber, 'Rejected')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="documenttable_pagination flex justify-between mt-4">
        <div className="documenttable_pageinfo flex items-center">
          <p className="documenttable_pageinfo_text mr-2">Page {currentPage} of {Math.ceil(filteredData.length / rowsPerPage)}</p>
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
            disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
            className="documenttable_paging_button py-2 px-4 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Next
          </button>
        </div>
      </div>
        </>
      {/* ) */}
      {/* } */}
    </div>
  );
};

export default DocumentApproval;
