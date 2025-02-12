import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaDownload } from 'react-icons/fa'; // Import the download icon from react-icons
import './DateRangeSearch.css';

const DateRangeSearch = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [documents, setDocuments] = useState([]);

  const handleSearch = () => {
    // Mock data for demonstration
    const mockDocuments = [
      { id: 1, name: 'Document 1', modifiedDate: new Date('2025-01-10') },
      { id: 2, name: 'Document 2', modifiedDate: new Date('2025-01-30') },
      { id: 3, name: 'Document 3', modifiedDate: new Date('2025-02-10') },
    ];

    const filteredDocuments = mockDocuments.filter(doc => {
      const docDate = new Date(doc.modifiedDate);
      return docDate >= startDate && docDate <= endDate;
    });

    setDocuments(filteredDocuments);
  };

  const handleDownload = (docId) => {
    // Mock download logic
    alert(`Downloading document with ID: ${docId}`);
  };

  return (
    <div className="date-range-body">
      <div className='date-range-search'>
        <h1 className='date-h1'>Date Range Search</h1>
        <div className='start-date'>
          <label className='date-label'>Start Date: </label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </div>
        <div className='end-date'>
          <label className='date-label'>End Date: </label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </div>
        <div className='date-search-button'>
          <button
            className='date-search-button'
            onClick={handleSearch}
            disabled={!startDate || !endDate}
          >
            Search
          </button>
        </div>
        <div className='date-range-documents'>
          <h2 className='date-h2'>Documents</h2>
          <ul className='date-ul'>
            {documents.map(doc => (
              <li className='date-li' key={doc.id}>
                {doc.name} - {doc.modifiedDate.toDateString()}
                <button 
                  className='date-download-button'
                  onClick={() => handleDownload(doc.id)}
                  title="Download" 
                >
                  <FaDownload size={10} /> 
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSearch;
