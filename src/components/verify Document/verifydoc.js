
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Search } from 'lucide-react';
import Loader from "react-js-loader";
import './verifydoc.css';
import apiServices from '../../ApiServices/ApiServices'; // Adjust path if necessary
import { MdCancel } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";


const DocumentApproval = () => {
  const [data, setData] = useState([]);
  const [filterDate, setFilterDate] = useState();
  const [filterDoc, setFilterDoc] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [actionMessage, setActionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');  
  const [isLoading, setIsLoading] = useState(false);  
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDocTypeDropdownVisible, setDocTypeDropdownVisible] = useState(false);
  const [isRejectPopupOpen, setRejectPopupOpen] = useState(false);
  const [rejectionReason, setRejectReason] = useState("");
  const [rejectDocumentId, setRejectDocumentId] = useState(null);
  const [showSearchInfo, setShowSearchInfo] = useState(false);
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

  const host = 'http://localhost:8000';
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await apiServices.getDocuments();
      console.log('Documents:', response);
      const documents = response.documents
        .filter(doc => doc.status?.toLowerCase() === 'pending') // Filter documents with status 'pending'
        .map(doc => ({
          file_id: doc.id,
          declarationNumber: doc.declaration_number,
          file: doc.current_version?.file_path,
          fileName: doc.current_version?.file_path ? doc.current_version.file_path.split('/').pop() : '',  // Extract file name
          updatedDate: doc.updated_at,
          documentType: doc.document_type?.name || '',
          status: doc.status || '',
          fileUrl: doc.fileUrl || '',
          rejectionReason:doc.comments,
          viewed: false,
          version: doc.current_version?.version_number,
        })).sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));

      setData(documents);
      setFilteredData(documents);

      if (documents.length === 0) {
        setActionMessage('No files are available for approval.');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setErrorMessage('Error fetching documents. Please try again later.');
    } finally {
      setIsLoading(false); // End loading
    }
  };
  const handleApproval = async (declarationNumber, newStatus) => {
    setActionMessage('');
    setIsLoading(true);

    try {
      console.log('Approval:', declarationNumber, newStatus);
      if (newStatus === 'Approved') {
        await apiServices.verifyDocument(declarationNumber, {approval_status:'Approved'});
      } else if (newStatus === 'Rejected') {
        await apiServices.verifyDocument(declarationNumber, {approval_status:'Rejected'});
      }

      const updatedData = data.map((item) =>
        item.declarationNumber === declarationNumber
          ? { ...item, status: newStatus }
          : item
      );
      setData(updatedData);
      setFilteredData(updatedData);
      setActionMessage(`Document ${declarationNumber} has been ${newStatus}`);
      setTimeout(() => {
        setActionMessage('');
      }, 3000);
      fetchDocuments();
      
    } catch (error) {
      console.error('Error during approval/rejection:', error);
      setErrorMessage('There was an error processing your request.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen((prev) => {
      if (!prev) setDocTypeDropdownVisible(false); // Close dropdown when calendar opens
      return !prev;
    });
  };

  const handleRejectButtonClick = (documentId) => {
    setRejectPopupOpen(true);
    setRejectDocumentId(documentId);
    
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }
  
    try {
      setIsLoading(true);
      await apiServices.verifyDocument(rejectDocumentId, {
        approval_status: "Rejected",
        comments: rejectionReason,
      });
  
      // Update the status with the rejection reason
      const updatedData = data.map((doc) =>
        doc.file_id === rejectDocumentId
          ? { ...doc, status: "Rejected", rejectionReason: rejectionReason }
          : doc
      );
  
      setData(updatedData);
      setFilteredData(updatedData);
      setRejectPopupOpen(false);
      setRejectReason("");
  
      // Display alert and navigate after submission
      alert("Rejection Reason has been submitted");
      navigate("/Documentlist", { state: { rejectDocumentId, rejectionReason } });
    } catch (error) {
      console.error("Error rejecting document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileOpen = (file) => {
    const a = document.createElement('a');
    a.href = host + file.file;
    a.download = file.file;
    const updatedData = data.map((item) =>
      item.file === file.file
        ? { ...item, viewed: true }
        : item
    );
    setData(updatedData);
    
    window.open(host + file.file, '_blank');  
  };

  const applyFilters = () => {
    let filtered = [...data];
    if (filterDate) {
      const selectedDate = filterDate.toLocaleDateString('en-CA');
      filtered = filtered.filter((doc) => {
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
      <h1 className="verifydocument_header">Document Approval</h1>

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
           <button className='verifydoc_searchinfo' onClick={handleSearchInfo}>
              <IoMdInformationCircleOutline/> 
            </button>
            {showSearchInfo && (
            <div ref={searchInfoRef} className="verifydoc-searchinfo-popup">
                Date filter format should be like this: yyyy-mm-dd
            </div>
            )}
        </div>

        <div className="documenttable_filter flex items-center">
          <label className="documenttable_filter_label mr-2">Document Type:</label>
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
        <div className="documentapproval_message bg-green-100 text-green-800 px-4 py-2 rounded mb-4" role="alert">
          {actionMessage}
        </div>
      )}
      {errorMessage && (
        <div className="documentapproval_message bg-red-100 text-red-800 px-4 py-2 rounded mb-4" role="alert">
          {errorMessage}
        </div>
      )}

      <table className="documenttable_table w-full text-sm text-left text-gray-500">
        <thead className="documentapproval_thead text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="documentapproval_th px-6 py-3">Declaration Number</th>
            <th className="documentapproval_th px-6 py-3">File Name</th>
            <th className="documentapproval_th px-6 py-3">Updated Date
              <button
                className="document-list-calendarbtn"
                onClick={handleCalendarToggle}
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
                  />
                </div>
              )}
            </th>
            <th className="documentapproval_th px-6 py-3">Doc Type</th>
            <th className="documentapproval_th px-6 py-3" style={{textAlignLast:"center"}}>Actions</th>
          </tr>
        </thead>

        <tbody className="documentlist-table overflow-y-auto max-h-80">
          {paginatedData.map((item, index) => (
            <tr key={index} className="documentapproval_row bg-white border-b hover:bg-gray-50">
              <td className="documentapproval_td px-6 py-4">{item.declarationNumber}</td>
              <td className="documentapproval_td documentapproval_td_name px-6 py-4">
  <button
    className={`documentapproval_file_link underline ${item.viewed ? 'text-blue-600' : 'text-gray-800'}`}
    onClick={() => handleFileOpen(item)}
    aria-label={`View ${item.fileName}`}
  >
    {item.fileName.length > 20 ? item.fileName.substring(0, 20) + "..." : item.fileName}
  </button>
  {item.viewed && <span className="text-green-500 text-xs ml-2">(Viewed)</span>}
</td>

              <td className="documentapproval_td px-6 py-4">{new Date(item.updatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td className="documentapproval_td px-6 py-4">{item.documentType}</td>
              <td className="documentapproval_td documentapproval_approvalbtn px-6 py-4">
                <button className="documentapproval_action_button" onClick={() => handleApproval(item.file_id, 'Approved')}>
                  <IoIosCheckmarkCircle />
                </button>
                <button className="documentreject_action_button" onClick={() => handleRejectButtonClick(item.file_id, 'Rejected')}>
                  <MdCancel />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isRejectPopupOpen && (
  <div className="reject-popup">
    <div className="reject-popup-content">
      <h2>Reject Document</h2>
      <textarea
        placeholder="Enter reason for rejection"
        value={rejectionReason}
        onChange={(e) => setRejectReason(e.target.value)}
        className="reject-reason-input"
      />
      <div className="reject-popup-actions">
        <button onClick={handleRejectSubmit} className="reject-popup-submit">Submit</button>
        <button onClick={() => setRejectPopupOpen(false)} className="reject-popup-cancel">Cancel</button>
      </div>
    </div>
  </div>
)}

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

      {isLoading && (
        <div className="loading-popup">
          <div className="loading-popup-content">
            <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'}size={80} />
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentApproval;
