import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaUsers,
  FaFileAlt,
  FaFolderOpen,
  FaBuilding,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import "./dashboard.css";
import apiServices from "../../ApiServices/ApiServices";
import { PiFilesBold } from "react-icons/pi";

// import { MdArrowDropUp, MdArrowDropDown  } from "react-icons/md";

const CompanyTable = ({
  companyData,
  setCompanyData,
  isLoading,
  searchTerm,
  handleOpenModalData,
  openModalData,
  closeModalData,
  setcloseModalData,
  searchTermAdmin,
  setSearchTermAdmin,
  isSearchFocused,
  setIsSearchFocused,
  tableforadmin,
  organizationId,
  orgSummary,

}) => {
  const role = localStorage.getItem("role");
  console.log(organizationId)
  const closeModalDataref = useRef();
  // const [openModalData, setOpenModalData] = useState(false);
  const DeclarationData = async () => {
    try {
      const data = await apiServices.details();
      console.log(data, "data");

      if (data?.details[1]?.id) {
        const organizationId1 = data.details[1].id;

        const response = await apiServices.organizationIdDetails(organizationId1);
        console.log(response, "response");

        // if (response.status === 200) {
          setDummyData(response.summary.sub);
        // } else {
        //   console.error("Error fetching data:", response.status);
        }
      // }
       else {
        console.error("Invalid data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isAdminOrDocumentRole) {
      DeclarationData();
    }
  }, [role]);
  // Dummy data for demonstration purposes
const [dummyData,setDummyData] = useState([]);


  const [selectedOption, setSelectedOption] = useState('company'); // State for selection (either 'company' or 'dummy')

  const isAdminOrUploader = ["ADMIN", "UPLOADER"].includes(role);
  const isAdminOrDocumentRole = [
    "ADMIN",
    "UPLOADER",
    "APPROVER",
    "REVIEWER",
    "VIEWER",
  ].includes(role);

  const [rowLimit, setRowLimit] = useState(15);

  const handleRowLimitChange = (e) => {
    const value = e.target.value.trim();
    const parsed = parseInt(value, 10);
    setRowLimit(!isNaN(parsed) && parsed > 0 ? parsed : 1);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    // Adjust default selection dynamically if role changes
    if (role !== "ADMIN") {
      setSelectedOption("declaration");
    }
  }, [role]);




  useEffect(() => {
    if (tableforadmin?.users?.length && companyData.length === 0) {
      setCompanyData(tableforadmin.users);
      setRowLimit(tableforadmin.users.length);
    }
  }, [tableforadmin?.users]);


  // For admin-related roles (ADMIN, UPLOADER, etc.)
  // For admin-related roles (ADMIN, UPLOADER, etc.)
  const adminSortAscending = () => {
    if (tableforadmin?.users) {
      const sortedUsers = [...tableforadmin.users].sort((a, b) =>
        (a.uploaded_files_size_mb || 0) + (a.approved_files_size_mb || 0) -
        (b.uploaded_files_size_mb || 0) - (b.approved_files_size_mb || 0)
      );
      setCompanyData(sortedUsers);
    }
  };

  const adminSortDescending = () => {
    if (tableforadmin?.users) {
      const sortedUsers = [...tableforadmin.users].sort((a, b) =>
        (b.uploaded_files_size_mb || 0) + (b.approved_files_size_mb || 0) -
        (a.uploaded_files_size_mb || 0) - (a.approved_files_size_mb || 0)
      );
      setCompanyData(sortedUsers);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (closeModalData && closeModalDataref.current && !closeModalDataref.current.contains(event.target)) {
        setcloseModalData(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModalData, setcloseModalData]);


  // For normal roles (PRODUCT OWNER, etc.)
  const normalSortAscending = () => {
    const sorted = [...companyData].sort(
      (a, b) => (a.uploaded_files_size_mb || 0) - (b.uploaded_files_size_mb || 0)
    );
    setCompanyData(sorted);
  };

  const normalSortDescending = () => {
    const sorted = [...companyData].sort(
      (a, b) => (b.uploaded_files_size_mb || 0) - (a.uploaded_files_size_mb || 0)
    );
    setCompanyData(sorted);
  };

  if (role === "UPLOADER" )  {

  }

  
  const filteredData = (companyData || []).filter((company) =>
    (company.org_name?.toLowerCase() || "").includes(searchTerm?.toLowerCase() || "") ||
    (company.username?.toLowerCase() || "").includes(searchTerm?.toLowerCase() || "") ||
    (company.role?.toLowerCase() || "").includes(searchTerm?.toLowerCase() || "") ||
    (company.uploaded_files_size_mb?.toString().toLowerCase() || "").includes(searchTerm?.toLowerCase() || "")
  );

  console.log(filteredData, "filteredData");
  //both sorting and row limit are working...
  const renderAdminView = () => {
    const filteredUsers = (companyData || []).filter(
      (user) =>
        (user.username?.toLowerCase() || "").includes(searchTermAdmin?.toLowerCase() || "") ||
        (user.role?.toLowerCase() || "").includes(searchTermAdmin?.toLowerCase() || "")
    );
  
    // return your JSX here
  

    return (
      <>
     
        <div style={{ 
          marginBottom: "10px", 
          display: "flex", 
          alignItems: "center", 
          gap: "20px"}}>
             {role=="ADMIN" ?
          <label style={{ display: "flex", alignItems: "center", fontSize: "14px", fontWeight: "500" }}>
            <input
              type="radio"
              value="company"
              checked={selectedOption === 'company'}
              onChange={handleOptionChange}
              style={{ marginRight: "8px" }}
            />
            Users
          </label>
          :""
            }
          <label style={{ display: "flex", alignItems: "center", fontSize: "14px", fontWeight: "500" }}>
            <input
              type="radio"
              value="declaration"
              checked={selectedOption === 'declaration'}
              onChange={handleOptionChange}
              style={{ marginRight: "8px" }}
            />
            Declaration Data
          </label>
        </div>



        {selectedOption == "company" ? (
          <>
            {/* <div className="search-container" style={{ textAlign: "right", marginBottom: "10px" }}> */}

{/* 

              <input
                type="text"
                placeholder="Search for users"
                value={searchTermAdmin}


                onChange={(e) => setSearchTermAdmin(e.target.value)}
                style={{
                  border: "none",
                  // borderBottom: "2px solid #555",
                  outline: "none",
                  fontSize: "14px",
                  width: "180px",
                  transition: "width 0.3s ease-in-out",
                }}
              />

            </div> */}
 {role=="ADMIN" ?
            <div className="dashboard-btngrp" style={{ margin: "0px 0 -10px", position: "relative", bottom: "30px" }}>
              {isAdminOrDocumentRole ? (
                <>
                  <button className="dashboard-top" onClick={adminSortAscending}>
                    <FaArrowUp />
                  </button>
                  <button className="dashboard-bottom" onClick={adminSortDescending}>
                    <FaArrowDown />
                  </button>
                </>
              ) : (
                <>
                  <button className="dashboard-top" onClick={normalSortAscending}>
                    <FaArrowUp />
                  </button>
                  <button className="dashboard-bottom" onClick={normalSortDescending}>
                    <FaArrowDown />
                  </button>
                </>
              )}

              <input
                type="text"
                min="0"
                max="100"
                value={rowLimit}
                className="dashboard_num-input"
                onChange={handleRowLimitChange}
              />
            </div>
            :""
          }
           {role=="ADMIN" ?
            <div>
              {filteredUsers.length > 0 ? (
                filteredUsers.slice(0, rowLimit).map((user, index) => (

                  <div
                    key={index}
                    className="company-card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{borderBottom:"none"}}>
                      <div style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                        <FaBuilding style={{ marginRight: "6px", fontSize: "13px", color: "#333" }} />
                        <span className="ellipsis-text">{user.username}</span>
                      </div>
                      <div style={{ fontSize: "10px", color: "#777", marginTop: "2px" }}>
                        <FaUser style={{ marginRight: "5px" }} />
                        {user.role}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "11px", color: "#555" }}>
                      <div><FaFileAlt style={{ marginRight: "5px" }} />{user.uploaded_files_count + user.approved_files_count} Docs</div>
                      <div><FaFolderOpen style={{ marginRight: "5px" }} />{((user.uploaded_files_size_mb + user.approved_files_size_mb) * 1024).toFixed(2)} KB</div>
                      <div><FaUsers style={{ marginRight: "5px" }} />1 User</div>
                    </div>
                  </div>

                ))
              ) : (
                <p style={{ color: "red", textAlign: "center" }}>No data found</p>
              )}
            </div>:""
            } </>) : (<div>
              {dummyData.length > 0 ? (
                dummyData.map((data, index) => (

                  <div
                    key={index}
                    className="company-card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                        <FaBuilding style={{ marginRight: "6px", fontSize: "13px", color: "#333" }} />
                        <span className="ellipsis-text">{data.declaration_number} </span>
                      </div>
                      <div style={{ fontSize: "10px", color: "#777", marginTop: "2px" }}>
                        <PiFilesBold style={{ marginRight: "5px" }} />
                        Size : {data.file_size}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "11px", color: "#555" }}>
                      <div><FaFileAlt style={{ marginRight: "5px" }} />{data.file_count} Total Files</div>
                      <div><FaFolderOpen style={{ marginRight: "5px" }} />{data.status_count.approved} Approved</div>
                      <div><FaUsers style={{ marginRight: "5px" }} />{data.status_count.pending} Pending</div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "red", textAlign: "center" }}>No data found</p>
              )}
            </div>)}

      </>
    );
  };

  const renderPOView = () => {
    return isLoading ? (
      <p>Loading...</p>
    ) : filteredData.length > 0 ? (

      <div className="parent-relative">
      <div className="input-absolute">
        <input
          type="text"
          min="0"
          max="100"
          value={rowLimit}
          className="dashboard_num-input"
          style={{  bottom:isAdminOrDocumentRole? "205px":"265px", position: "absolute", zIndex: 999 }}
          onChange={(e) => {
            const value = e.target.value.trim();
            const parsed = parseInt(value, 10);
            setRowLimit(!isNaN(parsed) && parsed >= 0 ? parsed : 1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" || e.key === "Delete") {
              setRowLimit("");
            }
          }}
        />
        </div>
        {/* {selectedOption == "dummy" ?  : } */}

        {filteredData
          .slice(0, rowLimit === 0 ? filteredData.length : rowLimit)
          .map((company, index) => (
            <div
              key={index}
              onClick={() => handleOpenModalData(company)}
              className="company-card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                marginBottom: "10px",
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                  <FaBuilding style={{ marginRight: "6px", fontSize: "13px", color: "#333" }} />
                  <span className="ellipsis-text">{company.org_name}</span>
                </div>
                <div style={{ fontSize: "10px", color: "#777", marginTop: "2px" }}>
                  <FaUser style={{ marginRight: "5px" }} />
                  {company.username}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  fontSize: "11px",
                  color: "#555",
                }}
              >
                <div>
                  <FaFileAlt style={{ marginRight: "5px" }} />
                  {company.uploaded_files_count} Docs
                </div>
                <div>
                  <FaFolderOpen style={{ marginRight: "5px" }} />
                  {company.uploaded_files_size_mb}
                </div>
                <div>
                  <FaUsers style={{ marginRight: "5px" }} />
                  {company.emp} Users
                </div>
              </div>
            </div>
          ))}
      </div>
    ) : (
      <p style={{ color: "red", textAlign: "center" }}>No data found</p>
    );
  };


  return (
    <div
      style={{
        maxHeight: "200px",
        overflowY: "auto",
        padding: "2px",
        borderRadius: "10px",
        marginTop: isAdminOrDocumentRole ? "10px" : "-30px",
      }}
      onClick={(e) => {
        if (isSearchFocused && !e.target.closest(".search-container")) {
          setIsSearchFocused(false);
        }
      }}
    >
      {isAdminOrUploader ? renderAdminView() : renderPOView()}

      {openModalData && (
        <div
        
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
            minWidth: "320px",
            zIndex: 1000,
          }}
        >
          <h3>{openModalData.org_name}</h3>
          <p><strong>👤 Username:</strong> {openModalData.username}</p>
          {console.log(orgSummary, "orgSummary")}
          <p><strong>📑 Total Declarations:</strong>{orgSummary?.dec_count ?? 0}</p>
          <p><strong>📑 Total Documents:</strong> {openModalData.doc_count}</p>
          <p><strong>📁 Total File Size:</strong> {openModalData.doc_size}</p>
          <p><strong>👥 Employees:</strong> {openModalData.emp}</p>
          <button
            onClick={closeModalData}
            style={{
              marginTop: "10px",
              cursor: "pointer",
              padding: "5px 10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
