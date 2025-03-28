import React from "react";
import {
  FaUser,
  FaUsers,
  FaFileAlt,
  FaFolderOpen,
  FaBuilding,
} from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import "./dashboard.css";

const CompanyTable = ({
  companyData,
  isLoading,
  rowLimit,
  searchTerm,
  handleOpenModalData,
  openModalData,
  closeModalData,
  isAdminOrDocumentRole,
  searchTermAdmin,
  setSearchTermAdmin,
  isSearchFocused,
  setIsSearchFocused,
  tableforadmin,
}) => {
  
  const filteredData = companyData.filter(
    (company) =>
      company.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

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
      {isAdminOrDocumentRole ? (
        <>
          <div
            className="search-container"
            style={{ marginBottom: "10px", textAlign: "right" }}
          >
            {!isSearchFocused && !searchTermAdmin ? (
              <FaSearch
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#555",
                }}
                onClick={() => setIsSearchFocused(true)}
              />
            ) : (
              <input
                type="text"
                placeholder="Search..."
                value={searchTermAdmin}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={(e) => {
                  if (!searchTermAdmin && !e.relatedTarget) {
                    setIsSearchFocused(false);
                  }
                }}
                onChange={(e) => setSearchTermAdmin(e.target.value)}
                style={{
                  border: "none",
                  borderBottom: "2px solid #555",
                  outline: "none",
                  fontSize: "14px",
                  width: isSearchFocused ? "180px" : "60px",
                  transition: "width 0.3s ease-in-out",
                }}
              />
            )}
          </div>

          <div>
            {tableforadmin?.users &&
            tableforadmin.users.filter((user) =>
              user.username.toLowerCase().includes(searchTermAdmin.toLowerCase())
            ).length > 0 ? (
              tableforadmin.users
                .filter((user) =>
                  user.username.toLowerCase().includes(searchTermAdmin.toLowerCase())
                )
                .map((user, index) => (
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
                        <FaUser style={{ marginRight: "5px", display: "inline" }} />
                        {user.role}
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
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FaFileAlt style={{ marginRight: "5px" }} />
                        {user.uploaded_files_count + user.approved_files_count} Docs
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FaFolderOpen style={{ marginRight: "5px" }} />
                        {(
                          (user.uploaded_files_size_mb + user.approved_files_size_mb) *
                          1024
                        ).toFixed(2)} KB
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FaUsers style={{ marginRight: "5px" }} />
                        1 User
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p style={{ color: "red", textAlign: "center" }}>No data found</p>
            )}
          </div>
        </>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : filteredData.length > 0 ? (
        <div>
          {filteredData
            .slice(0, rowLimit === "" ? filteredData.length : rowLimit)
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
                    <FaUser style={{ marginRight: "5px", display: "inline" }} />
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaFileAlt style={{ marginRight: "5px" }} />
                    {company.doc_count} Docs
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaFolderOpen style={{ marginRight: "5px" }} />
                    {company.doc_size}
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaUsers style={{ marginRight: "5px" }} />
                    {company.emp} Users
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p style={{ color: "red", textAlign: "center" }}>No data found</p>
      )}

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
          <p>
            <strong>👤 Username:</strong> {openModalData.username}
          </p>
          <p>
            <strong>📑 Total Documents:</strong> {openModalData.doc_count}
          </p>
          <p>
            <strong>📁 Total File Size:</strong> {openModalData.doc_size}
          </p>
          <p>
            <strong>👥 Employees:</strong> {openModalData.emp}
          </p>
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