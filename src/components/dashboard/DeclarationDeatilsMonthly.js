import React, { useEffect, useState } from "react";
import {
  Bar,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import "./dashboard.css";
import apiServices from "../../ApiServices/ApiServices";

const defaultMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DeclarationDeatilsMonthly = () => {
  const [yearlyData, setYearlyData] = useState({});
  const [selectedReportYear, setSelectedReportYear] = useState("2025");
  const [modalOpenChart, setmodalOpenChart] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isUploader = localStorage.getItem("role") === "UPLOADER";
  const isReviewer = localStorage.getItem("role") === "REVIEWER";
  const isViewer = localStorage.getItem("role") === "VIEWER";
  const isAdminOrDocumentRole = !(isUploader || isReviewer || isViewer);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiServices.declarationDetailsMonthly();
        setYearlyData(res);
        const years = Object.keys(res);
        if (years.length > 0 && !years.includes(selectedReportYear)) {
          setSelectedReportYear(years[0]);
        }
      } catch (err) {
        console.error("Failed to fetch monthly declaration details:", err);
      }
    };

    fetchData();
  }, []);

  const uniqueReportYears = Object.keys(yearlyData);

  const transformedData = Object.entries(yearlyData[selectedReportYear] || {}).map(
    ([month, value]) => ({
      month,
      total_documents: value,
      companies: [], // Optionally populate this if backend provides
    })
  );

  const mergedData = defaultMonths.map((month) => {
    const match = transformedData.find((item) => item.month === month);
    console.log("Merged Data", match);
    return match || { month, total_documents: 0, companies: [] };
  });

  const chartStyles = {
    borderRadius: "20px",
    background: "#ffffff",
    padding: "20px",
    width: "100%",
    maxWidth: "400px",
    height: "300px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  };

  return (
    <>
      <div
        className={isAdminOrDocumentRole ? "dinu" : "chart"}
        style={{
          ...chartStyles,
          marginRight: isAdminOrDocumentRole ? "10px" : "0",
          marginLeft: isAdminOrDocumentRole ? "0" : "40px",
          marginTop: isAdminOrDocumentRole ? "0" : "-120px",
          display: isUploader || isReviewer || isViewer ? "none" : "block",
        }}
      >
        {isAdminOrDocumentRole && (
          <>
            <span className="dashboard_text1"><center>Declaration</center></span>
            <div className="dropdown-container">
              <select
                className="dashboard-year-select"
                value={selectedReportYear}
                onChange={(e) => setSelectedReportYear(e.target.value)}
              >
                {uniqueReportYears.map((year, index) => (
                  <option key={index} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={mergedData}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            onClick={(event) => {
              const clickedMonth = event?.activeLabel;
              if (clickedMonth) {
                const clickedData = mergedData.find((d) => d.month === clickedMonth);
                if (clickedData) setmodalOpenChart(clickedData);
              }
            }}
          >
            <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: "bold", fill: "#555" }} />
            <YAxis tick={{ fontSize: 10, fontWeight: "bold", fill: "#555", dx: -4 }} width={50} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const monthData = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "#fff",
                        padding: "10px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        fontSize: "12px",
                      }}
                    >
                      <p><strong>📅 Month:</strong> {monthData.month}</p>
                      <p><strong>📄 Declaration Uploaded:</strong> {monthData.total_documents}</p>
                      {monthData.companies.length > 0 && (
                        <>
                          <strong>Company Breakdown:</strong>
                          {monthData.companies.map((c, i) => (
                            <div key={i} style={{ paddingLeft: "10px", borderBottom: "1px solid #ddd" }}>
                              <p
                                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                                onClick={() => {
                                  setModalData(c);
                                  setIsModalOpen(true);
                                }}
                              >
                                📌 <strong>{c.company}</strong>
                              </p>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: "orange", strokeWidth: 2 }}
            />
            <Bar dataKey="total_documents" barSize={20} fill="#2c2e83" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="total_documents" stroke="#ff7300" strokeWidth={1} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DeclarationDeatilsMonthly;
