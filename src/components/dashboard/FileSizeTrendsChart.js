import React, { useEffect } from "react";
import MonthlyDocumentChart from "./MonthlyDocumentChart"; // Ensure this path is correct

const FileSizeTrendsChart = ({
  selectedReportYear,
  setSelectedReportYear,
  uniqueReportYears,
  selectedCompany,
  setSelectedCompany,
  companyData,
  modalOpenChart,
  setmodalOpenChart,
  chartcomapny,
  setchartcomapny,
  groupedData,
  setModalData,
  setIsModalOpen,
  isModalOpen,
  closeModal,
  // isAdminOrDocumentRole, // ✅ Add this
  dashboardData          // ✅ And this
}) => {

  const role = localStorage.getItem("role");
  const isAdminOrDocumentRole = [
    "ADMIN",
    "UPLOADER",
    "APPROVER",
    "REVIEWER",
    "VIEWER",
  ].includes(role);
  const isUploader = role === "UPLOADER";


  useEffect(() => {
    if (!selectedCompany && companyData.length > 0) {
      setSelectedCompany("DLF");
    }
  }, [companyData]);
  
  return (
    <div className="chart">
      <h3 className="dashboard_text">
        Trend Analysis
       </h3>
      <center>
        <div className="slicer">
          <div className="dropdown-container">
            <select
              className="dashboard-year-select"
              value={selectedReportYear}
              onChange={(e) => setSelectedReportYear(e.target.value)}
            >
              {uniqueReportYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-container">
          <select
  className="company-dropdown"
  value={selectedCompany}
  onChange={(e) => setSelectedCompany(e.target.value)}
>
  {companyData.map((company, index) => (
    <option key={index} value={company.org_name}>
      {company.org_name}
    </option>
  ))}
</select>

          </div>
        </div>

        
        {modalOpenChart && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              minWidth: "320px",
              zIndex: 1000,
            }}>
            <h3 style={{ marginBottom: "10px" }}>
              📅 <strong>Month:</strong> {modalOpenChart.month}
            </h3>

            <p>
              <strong>📑 Total Documents:</strong>{" "}
              {chartcomapny
                ? chartcomapny.document_count
                : modalOpenChart.total_documents}
            </p>
            <p>
              <strong>🏚 Company:</strong>{" "}
              {chartcomapny
                ? chartcomapny.company
                : modalOpenChart.companies[0]?.company}
            </p>
            <p>
              <strong>📁 Total File Size:</strong>{" "}
              {chartcomapny
                ? chartcomapny.file_size
                : modalOpenChart.total_file_size}
            </p>

            {modalOpenChart.companies.length > 1 && (
              <>
                <h4 style={{ marginTop: "15px" }}>
                  🏢 <strong>Select Company:</strong>
                </h4>
                <select
                  onChange={(e) => {
                    const selectedIndex = e.target.selectedIndex;
                    const selected = modalOpenChart.companies[selectedIndex];
                    const found = modalOpenChart.companies.find(
                      (c) => c.company === selected.company
                    );
                    setchartcomapny(found);
                  }}
                  value={chartcomapny?.company || ""}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                >
                  {modalOpenChart.companies.map((company) => (
                    <option key={company.company}>{company.company}</option>
                  ))}
                </select>
              </>
            )}

            <button
              onClick={() => setmodalOpenChart(null)}
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
      </center>

      <div className="chart">
      <MonthlyDocumentChart
  groupedData={
    isAdminOrDocumentRole || !selectedCompany
      ? groupedData
      : groupedData.filter((entry) =>
          entry.companies?.some(
            (company) => company.company === selectedCompany
          )
        )
  }
  setModalData={setModalData}
  setIsModalOpen={setIsModalOpen}
  setmodalOpenChart={setmodalOpenChart}
  isAdminOrDocumentRole={isAdminOrDocumentRole}
  dashboardData={dashboardData}
/>

      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            width: "350px",
          }}
        >
          <p>No company data available</p>
          <button
            onClick={closeModal}
            style={{
              marginTop: "10px",
              cursor: "pointer",
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              width: "100%",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default FileSizeTrendsChart;
