import React, { useEffect, useRef } from "react";
import MonthlyDocumentChart from "./MonthlyDocumentChart";

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
  dashboardData,
}) => {
  const role = localStorage.getItem("role");
  const isAdminOrDocumentRole = [
    "ADMIN",
    "UPLOADER",
    "APPROVER",
    "REVIEWER",
    "VIEWER",
  ].includes(role);

  const modalRef = useRef(null);

  useEffect(() => {
    if (!selectedCompany && companyData.length > 0) {
      setSelectedCompany(companyData[0]?.org_name || "");
    }
  }, [companyData, selectedCompany, setSelectedCompany]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setmodalOpenChart(null);
      }
    };

    if (modalOpenChart) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpenChart, setmodalOpenChart]);

  useEffect(() => {
    if (modalOpenChart && modalOpenChart.companies.length > 0) {
      setchartcomapny(modalOpenChart.companies[0]);
    }
  }, [modalOpenChart, setchartcomapny]);

  const filteredGroupedData = groupedData.filter(
    (entry) => !selectedReportYear || entry.year === selectedReportYear
  );

  return (
    
    <div className="chart">
      
      <style
        dangerouslySetInnerHTML={{
          __html: `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
      }

      .modal {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 24px;
        width: 90%;
        max-width: 420px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        text-align: center;
        animation: fadeIn 0.3s ease-in-out;
        max-height: 90vh;
        overflow-y: auto;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .modal-content h3,
      .modal-content h4 {
        margin-bottom: 12px;
        font-size: 18px;
        color: #333;
      }

      .modal-content select {
        width: 80%;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 14px;
        margin: 10px auto 15px auto;
        display: block;
      }

      .company-card {
        background-color: #f4f7fa;
        padding: 20px 24px;
        border-radius: 8px;
        text-align: left;
        font-size: 14px;
        color: #333;
        border: 1px solid #ddd;
        margin-top: 15px;
        max-width: 380px;
        margin-left: auto;
        margin-right: auto;
      }

      .company-card p {
        margin: 8px 0;
      }

      .close-button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-top: 20px;
        transition: background-color 0.3s;
      }

      .close-button:hover {
        background-color: #0056b3;
      }

      .slicer {
        display: flex;
        justify-content: flex-start;
        gap: 30px;
        margin-bottom: 30px;
      }

      .dropdown-container {
        width: 140px;
        cursor: pointer;
      }

      .dropdown-container select {
        width: 100%;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 14px;
        cursor: pointer;
      }

      .dashboard-text {
        font-size: 24px;
        font-weight: bold;
        margin-top: 30px;
        text-align: center;
      }
    `,
        }}
      />
      
      <div className="slicer">
        <div className="dropdown-container">
          <select
            className="dashboard-year-select"
            value={selectedReportYear}
            onChange={(e) => setSelectedReportYear(e.target.value)}
          >
            <option value="" disabled>
              Select Year
            </option>
            {uniqueReportYears.length > 0 ? (
              uniqueReportYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))
            ) : (
              <option value="">No Years Available</option>
            )}
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

      <div className="chart">
        <MonthlyDocumentChart
          groupedData={
            isAdminOrDocumentRole || !selectedCompany
              ? filteredGroupedData
              : filteredGroupedData.filter((entry) =>
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
          selectedReportYear={selectedReportYear}
          setSelectedReportYear={setSelectedReportYear}
          uniqueReportYears={uniqueReportYears}
        />
      </div>

      {/* 🟢 Trend Analysis moved BELOW chart */}
      

      {modalOpenChart && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <div className="modal-content">
              <h3>
                📅 <strong>Month:</strong> {modalOpenChart.month}
              </h3>

              <h4>
                🏢 <strong>Select Company:</strong>
              </h4>
              <select
                onChange={(e) => {
                  const selected = modalOpenChart.companies.find(
                    (c) => c.company === e.target.value
                  );
                  setchartcomapny(selected);
                }}
                value={chartcomapny?.company || ""}
              >
                {modalOpenChart.companies.map((company) => (
                  <option key={company.company} value={company.company}>
                    {company.company}
                  </option>
                ))}
              </select>

              {chartcomapny && (
                <div className="company-card">
                  <p>
                    <strong>📑 Total Documents:</strong>{" "}
                    {chartcomapny?.document_count}
                  </p>
                  <p>
                    <strong>🏚 Company:</strong> {chartcomapny?.company}
                  </p>
                  <p>
                    <strong>📁 Total File Size:</strong>{" "}
                    {chartcomapny?.file_size}
                  </p>
                </div>
              )}

              <button
                className="close-button"
                onClick={() => setmodalOpenChart(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>No company data available</p>
            <button className="close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
        
      )}<h3 className="dashboard-text">Trend Analysis</h3>
    </div>
  );
};

export default FileSizeTrendsChart;
