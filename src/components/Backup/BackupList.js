import React, { useState, useEffect } from "react";
import apiServices, {API_URL1} from "../../ApiServices/ApiServices"; // Import API services
import "./BackupList.css"; // Link CSS file
// import { endianness } from "os";
import { Search } from 'lucide-react';


const BackupList = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [backupType, setBackupType] = useState(""); // "manual" or "auto"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [backupList, setBackupList] = useState([]);
  const role = localStorage.getItem('role')
  const [filteredBackupList, setFilteredBackupList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  // ✅ Fetch Backup List from API
  useEffect(() => {
    fetchBackupList();
  }, []);

  // const fetchBackupList = async () => {
  //   try {
  //     const response = await apiServices.backuplist();
  //     console.log(response)
  //     setBackupList(response?.backups || []);
  //   } catch (error) {
  //     console.error("Error fetching backup list:", error);
  //   }
  // };

  useEffect(() => {
    const filtered = backupList.filter((backup) =>
      backup.backup_file.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBackupList(filtered);
  }, [searchQuery, backupList]);

  const fetchBackupList = async () => {
    setLoading(true);
    try {
      const response = await apiServices.backuplist();
      setBackupList(response?.backups.sort((a, b) => new Date(b.end_datetime) - new Date(a.end_datetime)) || []);
      setFilteredBackupList(response?.backups || []);
    } catch (error) {
      console.error("Error fetching backup list:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open & Close Popup
  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  // ✅ Handle Backup Selection
  const handleBackupSelection = (type) => setBackupType(type);

  // ✅ Create Backup (Auto/Manual)
  const createBackup = async () => {
    try {
      if (backupType === "manual") {
        if (!startDate || !endDate) {
          alert("Please select both start and end dates for manual backup.");
          return;
        }
        if (new Date(startDate) > new Date(endDate)) {
          alert("Start date cannot be later than end date.");
          return;
        }
        // const data = {
        //     "start_date" :startDate,
        //     "end_date":endDate
        // }

        // Manual Backup Call
        const response = await apiServices.rangesearch({
            params: {
                start_date: startDate, 
                end_date: endDate
            },
            responseType: 'blob'  // Ensures the response is a file
        });
        console.log("Response status:", response.status);

        if (response.status === 404) {
            alert("No files found for the selected date range.");
            return;
        }

        // ✅ Check for a valid ZIP file
        if (!response || response.size === 0) {
            throw new Error("Received an empty or invalid file.");
        }

        // ✅ Download the ZIP file
        const blob = new Blob([response], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `documents_${startDate}_${endDate}.zip`);
        document.body.appendChild(link);
        link.click();

        // ✅ Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        console.log("Download successful.");
    
        alert("Manual backup created successfully.");
      } else {
        // Auto Backup Call
        await apiServices.autobackup();
        alert("Auto backup created successfully.");
      }

      fetchBackupList(); // Refresh backup list
      closePopup();
    } catch (error) {
      console.error("Backup creation failed:", error);

      if (error.response) {
          // Server responded with an error
          alert(`Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
          // No response received
          alert("Error: No response received from the server.");
      } else {
          // Other errors (e.g., invalid data, processing issues)
          alert(`Backup failed: ${error.message}`);
      }
  }
  };

  const downloadBackup = async (backupId, backupFileName) => {
    try {
        console.log("Downloading backup:", backupId);
        console.log("url",API_URL1)
        
        // ✅ Fetch backup file as Blob
        const response = await apiServices.backupdownload(backupId);

        if (!response) {
            throw new Error("Backup file is missing or invalid.");
        }
        const fileUrl = `${API_URL1}${response.backup_file}`;

        console.log(response);

        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", backupFileName || "backup_file");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      

        console.log("Download successful:", response.backup_file);
    } catch (error) {
        console.error("Download error:", error);
        alert(error.message || "Error downloading backup. Please try again.");
    }
};


//   const downloadBackup = async (backupId, backupFileName) => {
//     try {
//         console.log("Downloading backup:", backupId);
        
//         // ✅ Fetch backup file as Blob
//         const response = await apiServices.backupdownload(backupId, { responseType: "blob" });

//         if (!response) {
//             throw new Error("Backup file is missing or invalid.");
//         }

//         console.log(response);

//         fileName = response.backup_file
//         console.log(url)



//         // // ✅ Check if the response is a valid ZIP file
//         // if (response.size === 0) {
//         //     throw new Error("Received an empty ZIP file.");
//         // }

//         // // ✅ Create a Blob from response data
//         // const blob = new Blob([response], { type: "application/zip" });

//         // console.log("Blob:", blob);

//         // // ✅ Generate Object URL for download
//         // const url = window.URL.createObjectURL(blob);
//         // console.log("Download URL:", url);

//         // const link = document.createElement("a");
//         // link.href = url;

//         // // ✅ Use the correct filename
//         // const fileName = backupFileName || `backup_${backupId}.zip`;
//         // link.setAttribute("download", fileName);

//         // document.body.appendChild(link);
//         // link.click();

//         // // ✅ Cleanup
//         // window.URL.revokeObjectURL(url);
//         // document.body.removeChild(link);

//         console.log("Download successful:", fileName);
//     } catch (error) {
//         console.error("Download error:", error);
//         alert(error.message || "Error downloading backup. Please try again.");
//     }
// };

const handleSearch = (e) => {
  setSearchQuery(e.target.value);
};

  

return (
  <div className="backuplist_container">
    {/* Header */}
    <div className="backuplist_header">Backup List</div>
    

    {/* Backup Button */}
    <button className="backup_createbtn" onClick={openPopup}>
      Create Backup
    </button>
    <div className="documenttable_search flex items-left" style={{justifyContent:'left'}}>
              <Search className="documenttable_search_icon" />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search"
                className="documenttable_search_input py-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 w-full"
              />
            </div>
    {/* Loader */}
    {loading && <div className="backuplist_loader">Loading backups...</div>}

    {/* Backup List Table */}
    {!loading && (
      <table className="backuplist_table">
        <thead className="backuplist_thead">
          <tr>
            <th className="backuplist_th">Backup Name</th>
            {["PRODUCT_OWNER", "PRODUCT_ADMIN"].includes(role) && (
              <th className="backuplist_th">Organization</th>
            )}
            <th className="backuplist_th">Date</th>
            <th className="backuplist_th">Actions</th>
          </tr>
        </thead>
        <tbody className="backuplist_tbody">
          {filteredBackupList.length > 0 ? (
            filteredBackupList.map((backup) => (
              <tr key={backup.backup_id} className="backuplist_row">
                <td className="backuplist_td">
                  {backup.backup_file.split("/").pop()}
                </td>
                {["PRODUCT_OWNER", "PRODUCT_ADMIN"].includes(role) && (
                  <td className="backuplist_td">{backup.organization}</td>
                )}
                <td className="backuplist_td">{backup.end_datetime.split("T")[0]}</td>
                <td className="backuplist_td">
                  <button
                    className="backuplist_downloadbtn"
                    onClick={() => downloadBackup(backup.backup_id)}
                  >
                    ⬇ Download
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="backuplist_td">
                No backups found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}

    {/* Popup for Backup Selection */}
    {showPopup && (
      <div className="backuplist_popup_overlay">
        <div className="backuplist_popup">
          <h2>Select Backup Type</h2>

          <div className="backuplist_popup_options">
            {/* Auto Backup Option */}
            <div className="backuplist_popup_option">
              <input
                type="radio"
                id="autoBackup"
                name="backupType"
                value="auto"
                checked={backupType === "auto"}
                onChange={() => handleBackupSelection("auto")}
              />
              <label htmlFor="autoBackup">Automatic Backup</label>
            </div>

            {/* Manual Backup Option */}
            <div className="backuplist_popup_option">
              <input
                type="radio"
                id="manualBackup"
                name="backupType"
                value="manual"
                checked={backupType === "manual"}
                onChange={() => handleBackupSelection("manual")}
              />
              <label htmlFor="manualBackup">
                Manual Backup (Select Start & End Date)
              </label>
            </div>

            {/* Date Pickers for Manual Backup */}
            {backupType === "manual" && (
              <div className="backuplist_date_inputs">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label>End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Popup Buttons */}
          <div className="backuplist_popup_buttons">
            <button className="backuplist_popup_close" onClick={closePopup}>
              Cancel
            </button>
            <button
              className="backuplist_popup_confirm"
              onClick={createBackup}
              disabled={!backupType}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};


export default BackupList;
