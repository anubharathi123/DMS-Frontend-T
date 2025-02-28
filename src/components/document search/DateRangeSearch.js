

// import React, { useEffect, useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { FaCalendarAlt, FaDownload } from 'react-icons/fa'; // Import the calendar icon
// import './DateRangeSearch.css';
// import apiservices from '../../ApiServices/ApiServices';

// // Custom input component to include a calendar icon
// const CustomInput = ({ value, onClick }) => {
//   return (
//     <div className="custom-date-input" onClick={onClick}>
//       <input type="text" value={value} readOnly />
//       <FaCalendarAlt className="calendar-icon" />
//     </div>
//   );
// };

// const DateRangeSearch = () => {
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSearch = async () => {
//     if (!startDate || !endDate) return;

//     setIsLoading(true);  // Start loading
//     setError(null);  // Reset error state
//     const startDateFormatted = startDate.toISOString().split('T')[0]; // Format to 'yyyy-MM-dd'
//     const endDateFormatted = endDate.toISOString().split('T')[0]; // Format to 'yyyy-MM-dd'
//   }

//     useEffect(() => {
//     const fetchDate = async () => {
//     try {
     
//       // Call the API to fetch documents based on the date range
//       const response = await apiservices.rangesearch();
//       console.log(response,response.rangesearch)
//       console.log("API Response:", response);
//         const rangesearch = response.rangesearch.map(doc => ({
//           startDate: doc.startDate,
//           endDate: doc.endDate,
//           name: doc.name,
//           modifiedDate: doc.modifiedDate,
//         }))
//         console.log(rangesearch)
        

//       // Set the fetched documents in the state
//       setDocuments(response.data);
//     } catch (err) {
//       setError('Error fetching documents');
//       console.error('API error:', err);
//     } finally {
//       setIsLoading(false);  // Stop loading
//     }
//   };
//   fetchDate();
// }, [startDate, endDate]);

//   const handleDownload = (docId) => {
//     // Mock download logic
//     alert(`Downloading document with ID: ${docId}`);
//   };

//   const handleReset = () => {
//     // Reset all fields
//     setStartDate(null);
//     setEndDate(null);
//     setDocuments([]);
//   };

//   return (
//     <div className="date-range-body">
//       <div className='date-range-search'>
//         <h1 className='date-h1'>Date Range Search</h1>

//         {/* Reset button positioned at the top-right */}
//         <button 
//           className='date-reset-button' 
//           onClick={handleReset} 
//           disabled={!startDate && !endDate}
//         >
//           Reset
//         </button>

//         <div className='start-date'>
//           <label className='date-label'>Start Date: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             dateFormat="yyyy-MM-dd"
//             isClearable={!!startDate}
//             customInput={<CustomInput />}  // Use custom input with calendar icon
//           />
//         </div>
//         <div className='end-date'>
//           <label className='date-label'>End Date: </label>
//           <DatePicker
//             selected={endDate}
//             onChange={date => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             dateFormat="yyyy-MM-dd"
//             isClearable={!!endDate}
//             customInput={<CustomInput />}  // Use custom input with calendar icon
//           />
//         </div>
//         <div className='date-search-button'>
//           <button
//             className='date-search-button'
//             onClick={handleSearch}
//             disabled={!startDate || !endDate || isLoading}
//           >
//             {isLoading ? 'Searching...' : 'Search'}
//           </button>
//         </div>

//         {error && <div className="error-message">{error}</div>}  {/* Show error message if any */}

//         <div className='date-range-documents'>
//           <h2 className='date-h2'>Documents</h2>
//           <ul className='date-ul'>
//             {documents.length === 0 && !isLoading ? (
//               <li>No documents found for the selected date range.</li>
//             ) : (
//               documents.map(doc => (
//                 <li className='date-li' key={doc.id}>
//                   {doc.name} - {new Date(doc.modifiedDate).toDateString()}
//                   <button 
//                     className='date-download-button'
//                     onClick={() => handleDownload(doc.id)}
//                     title="Download" 
//                   >
//                     <FaDownload size={10} /> 
//                   </button>
//                 </li>
//               ))
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DateRangeSearch;








import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaDownload } from 'react-icons/fa'; // Import the calendar icon
import './DateRangeSearch.css';
import apiservices from '../../ApiServices/ApiServices';

// Custom input component to include a calendar icon
const CustomInput = ({ value, onClick }) => {
  return (
    <div className="custom-date-input" onClick={onClick}>
      <input type="text" value={value} readOnly />
      <FaCalendarAlt className="calendar-icon" />
    </div>
  );
};

const DateRangeSearch = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);  // Track if search was performed
  const [showError, setShowError] = useState(false); // Track if error message is already shown

  const handleSearch = async () => {
    if (!startDate || !endDate) return;

    setIsLoading(true);  // Start loading
    setError(null);  // Reset error state
    setSearched(true);  // Mark search as performed

    const startDateFormatted = startDate.toISOString().split('T')[0]; // Format to 'yyyy-MM-dd'
    const endDateFormatted = endDate.toISOString().split('T')[0]; // Format to 'yyyy-MM-dd'

    try {
      // Call the API to fetch documents based on the date range
      const response = await apiservices.rangesearch({
        startDate: startDateFormatted,
        endDate: endDateFormatted
      });
      console.log(response, response.rangesearch);
      console.log("API Response:", response);

      // Map the API response to the documents state
      const rangesearch = response.rangesearch.map(doc => ({
        startDate: doc.startDate,
        endDate: doc.endDate,
        name: doc.name,
        modifiedDate: doc.modifiedDate,
      }));

      // Set the fetched documents in the state
      setDocuments(rangesearch);
      setShowError(false); // No error, hide the error message
    } catch (err) {
      setError('Error fetching documents');
      console.error('API error:', err);
      setShowError(true); // Show error message only once
    } finally {
      setIsLoading(false);  // Stop loading
    }
  };

  useEffect(() => {
    if (searched && documents.length === 0 && !isLoading) {
      setError("No documents found for the selected date range.");
      setShowError(true); // Show the "no documents found" message once
    }
  }, [documents, searched, isLoading]);  // Run effect when documents or search status changes

  const handleDownload = (docId) => {
    // Mock download logic
    alert(`Downloading document with ID: ${docId}`);
  };

  const handleReset = () => {
    // Reset all fields and states
    setStartDate(null);
    setEndDate(null);
    setDocuments([]);
    setSearched(false);  // Reset searched status
    setShowError(false); // Reset error message visibility
  };

  return (
    <div className="date-range-body">
      <div className='date-range-search'>
        <h1 className='date-h1'>Date Range Search</h1>

        {/* Reset button positioned at the top-right */}
        <button 
          className='date-reset-button' 
          onClick={handleReset} 
          disabled={!startDate && !endDate}
        >
          Reset
        </button>

        <div className='start-date'>
          <label className='date-label'>Start Date: </label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            isClearable={!!startDate}
            customInput={<CustomInput />}  // Use custom input with calendar icon
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
            isClearable={!!endDate}
            customInput={<CustomInput />}  // Use custom input with calendar icon
          />
        </div>
        <div className='date-search-button'>
          <button
            className='date-search-button'
            onClick={handleSearch}
            disabled={!startDate || !endDate || isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Show error message once */}
        {showError && error && <div className="error-message">{error}</div>}

        <div className='date-range-documents'>
          <h2 className='date-h2'>Documents</h2>
          <ul className='date-ul'>
            {documents.length === 0 && !isLoading && searched && !showError ? (
              <li>No documents found for the selected date range.</li>
            ) : (
              documents.map(doc => (
                <li className='date-li' key={doc.id}>
                  {doc.name} - {new Date(doc.modifiedDate).toDateString()}
                  <button 
                    className='date-download-button'
                    onClick={() => handleDownload(doc.id)}
                    title="Download" 
                  >
                    <FaDownload size={10} /> 
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSearch;
