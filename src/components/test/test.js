import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './test.css';

interface Document {
  declarationNumber: string;
  fileName: string;
  updatedDate: string;
  docType: string;
  status: string;
}

const tempData: Document[] = [
    { declarationNumber: '1234567890123', fileName: 'File1.pdf', updatedDate: '2024-12-01', docType: 'Invoice', status: 'Pending' },
    { declarationNumber: '9876543210987', fileName: 'File2.pdf', updatedDate: '2024-11-20', docType: 'Packing List', status: 'Reject' },
    { declarationNumber: '1122334455667', fileName: 'File3.pdf', updatedDate: '2024-10-15', docType: 'Declaration', status: 'Approve' },
    { declarationNumber: '1234567890123', fileName: 'File1.pdf', updatedDate: '2024-12-01', docType: 'Invoice', status: 'Pending' },
    { declarationNumber: '9876543210987', fileName: 'File2.pdf', updatedDate: '2024-11-20', docType: 'Packing List', status: 'Reject' },
    { declarationNumber: '1122334455667', fileName: 'File3.pdf', updatedDate: '2024-10-15', docType: 'Declaration', status: 'Approve' },
    { declarationNumber: '1234567890123', fileName: 'File1.pdf', updatedDate: '2024-12-01', docType: 'Invoice', status: 'Pending' },
    { declarationNumber: '9876543210987', fileName: 'File2.pdf', updatedDate: '2024-11-20', docType: 'Packing List', status: 'Reject' },
    { declarationNumber: '1122334455667', fileName: 'File3.pdf', updatedDate: '2024-10-15', docType: 'Declaration', status: 'Approve' },
    { declarationNumber: '1234567890123', fileName: 'File1.pdf', updatedDate: '2024-12-01', docType: 'Invoice', status: 'Pending' },
    { declarationNumber: '9876543210987', fileName: 'File2.pdf', updatedDate: '2024-11-20', docType: 'Packing List', status: 'Reject' },
    { declarationNumber: '1122334455667', fileName: 'File3.pdf', updatedDate: '2024-10-15', docType: 'Declaration', status: 'Approve' },
    { declarationNumber: '1234567890123', fileName: 'File1.pdf', updatedDate: '2024-12-01', docType: 'Invoice', status: 'Pending' },
    { declarationNumber: '9876543210987', fileName: 'File2.pdf', updatedDate: '2024-11-20', docType: 'Packing List', status: 'Reject' },
    { declarationNumber: '1122334455667', fileName: 'File3.pdf', updatedDate: '2024-10-15', docType: 'Declaration', status: 'Approve' },
    { declarationNumber: '1234567890123', fileName: 'File1.pdf', updatedDate: '2024-12-01', docType: 'Invoice', status: 'Pending' },
    { declarationNumber: '9876543210987', fileName: 'File2.pdf', updatedDate: '2024-11-20', docType: 'Packing List', status: 'Reject' },
    { declarationNumber: '1122334455667', fileName: 'File3.pdf', updatedDate: '2024-10-15', docType: 'Declaration', status: 'Approve' },
  ];

const DocumentTable = () => {
  const [data, setData] = useState(tempData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((item) => {
    if (filter === '') {
      return item.declarationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.updatedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.docType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return item.status === filter && (
        item.declarationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.updatedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.docType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const handleRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="documenttable_container">
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
        </div>
        <div className="documenttable_filter flex items-center">
          <label className="documenttable_filter_label mr-2">Filter by Status:</label>
          <select value={filter} onChange={handleFilter} className="documenttable_filter_select py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600">
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Reject">Reject</option>
            <option value="Approve">Approve</option>
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
            <th className="documenttable_th px-6 py-3">Updated Date</th>
            <th className="documenttable_th px-6 py-3">Doc Type</th>
            <th className="documenttable_th px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index} className="documenttable_row bg-white border-b hover:bg-gray-50">
              <td className="documenttable_td px-6 py-4">{item.declarationNumber}</td>
              <td className="documenttable_td px-6 py-4">{item.fileName}</td>
              <td className="documenttable_td px-6 py-4">{item.updatedDate}</td>
              <td className="documenttable_td px-6 py-4">{item.docType}</td>
              <td className="documenttable_td px-6 py-4">
  <span
    className={`documenttable_status text-xs font-medium py-1 px-2 rounded 
      ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
      item.status === 'Reject' ? 'bg-red-100 text-red-800' : 
      'bg-green-100 text-green-800'}`}
  >
    {item.status}
  </span>
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
    </div>
  );
};

export default DocumentTable;
