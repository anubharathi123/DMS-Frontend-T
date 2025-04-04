import React, { useState, useEffect } from "react";
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
// import { MdArrowDropUp, MdArrowDropDown  } from "react-icons/md";

const CompanyTable = ({
  companyData,
  setCompanyData,
  isLoading,
  searchTerm,
  handleOpenModalData,
  openModalData,
  closeModalData,
  searchTermAdmin,
  setSearchTermAdmin,
  isSearchFocused,
  setIsSearchFocused,
  tableforadmin,
}) => {
  const role = localStorage.getItem("role");

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

if (role === "UPLOADER") {

}


  const filteredData = companyData.filter((company) =>
    company.org_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.uploaded_files_size_mb
    ?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
//both sorting and row limit are working...
  const renderAdminView = () => {
    const filteredUsers = companyData?.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchTermAdmin.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTermAdmin.toLowerCase())
    ) || [];

    return (
      <>
        <div className="search-container" style={{ textAlign: "right", marginBottom: "10px" }}>
         
        
         
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
    
        </div>

        <div className="dashboard-btngrp" style={{ margin: "25px 0 -10px", position: "relative" }}>
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
                <div>
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
        </div>
      </>
    );
  };

  const renderPOView = () => {
    return isLoading ? (
      <p>Loading...</p>
    ) : filteredData.length > 0 ? (
      <>
      <input
        type="text"
        min="0"
        max="100"
        value={rowLimit}
        className="dashboard_num-input"
        style={{ left: "475px", bottom: "265px", position: "absolute", zIndex: 999 }}
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
            {company.doc_count} Docs
          </div>
          <div>
            <FaFolderOpen style={{ marginRight: "5px" }} />
            {company.doc_size}
          </div>
          <div>
            <FaUsers style={{ marginRight: "5px" }} />
            {company.emp} Users
          </div>
          </div>
        </div>
        ))}
      </>
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
          <h3>📅 Organization: {openModalData.org_name}</h3>
          <p><strong>👤 Username:</strong> {openModalData.username}</p>
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
