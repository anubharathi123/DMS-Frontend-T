import React, { useState } from "react";
import {
  AreaChart,
  Area,
  Bar,
  CartesianGrid,
  Line,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import "./dashboard.css";

const MonthlyDocumentChart = ({  groupedData,
  setModalData,
  setIsModalOpen,
  setmodalOpenChart,
  isAdminOrDocumentRole,
  selectedReportYear,
  setSelectedReportYear,
  uniqueReportYears,
  dashboardData  }) => {
    // const [selectedReportYear, setSelectedReportYear] = useState('');
    const [hovered, setHovered] = useState(false);
  const isUploader = localStorage.getItem("role") === "UPLOADER";
  const isReviewer = localStorage.getItem("role") === "REVIEWER";
  const isViewer = localStorage.getItem("role") === "VIEWER";


  const defaultData = [
    { month: "Jan", document_count: 0 },
    { month: "Feb", document_count: 0 },
    { month: "Mar", document_count: 0 },
    { month: "Apr", document_count: 0 },
    { month: "May", document_count: 0 },
    { month: "Jun", document_count: 0 },
    { month: "Jul", document_count: 0 },
    { month: "Aug", document_count: 0 },
    { month: "Sep", document_count: 0 },
    { month: "Oct", document_count: 0 },
    { month: "Nov", document_count: 0 },
    { month: "Dec", document_count: 0 },
  ];



  const mergedData = defaultData.map((monthObj) => {
    const found = groupedData.find((d) => d.month === monthObj.month);
    return found
      ? { ...monthObj, ...found }
      : { ...monthObj, total_documents: 0, companies: [] };
  });
  
  return (
    <>
      {isAdminOrDocumentRole ? (
        <div
          className="dinu"
          style={{
            borderRadius: "20px",
            // marginTop: "-10px",
            background: "#ffffff",
            padding: "20px",
            marginRight:"10px",
            display:isUploader?"none": isReviewer? "none": isViewer?"none":"block",
            position: "relative",
            // right: "5%",
            width: "100%",
             maxWidth: "400px",
            height: "300px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
           }}
        >
          <span className="dashboard_text1"><center>Trend Analysis</center></span>
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

<ResponsiveContainer width="100%" style={{ marginTop: "20px" }} height={300}>
  <ComposedChart
    data={dashboardData}
    margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
    onClick={(event) => {
      const clickedMonth = event?.activeLabel;
      if (clickedMonth) {
        const clickedData = dashboardData.find((d) => d.month === clickedMonth);
        if (clickedData) setmodalOpenChart(clickedData);
      }
    }}
  >
    <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: "bold", fill: "#555" }} />
    <YAxis
      dataKey="fileSizeMB"
      domain={[
        (dataMin) => Math.floor(Math.min(dataMin, 0)),
        (dataMax) => Math.ceil(dataMax + dataMax * 0.1),
      ]}
      tick={{ fontSize: 10, fontWeight: "bold", fill: "#555", dx: -4 }}
      tickFormatter={(val) => `${val.toFixed(2)} MB`}
      width={50}
    />
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
              <p><strong>📄 Documents Uploaded:</strong> {monthData.docCount}</p>
            </div>
          );
        }
        return null;
      }}
      cursor={{ stroke: "orange", strokeWidth: 2 }}
    />
    
    {/* ✅ Only show the bar (remove line + legend) */}

     <Bar dataKey="fileSizeMB" barSize={20} fill="#2c2e83" radius={[4, 4, 0, 0]} />
     <Line type="monotone" dataKey="fileSizeMB" stroke="#ff7300" strokeWidth={1} />
  </ComposedChart>
  
</ResponsiveContainer>


        </div>
      ) : (
        // 👇 your original chart (non-admin view)
        <div
          className="chart"
          style={{
            borderRadius: "20px",
            marginTop: "-120px",
            background: "#ffffff",
            // display:"none",
            padding: "20px",
            width: "100%",
            maxWidth: "400px",
            height: "300px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginLeft: "40px",
          }}
        >
          {groupedData.length > 0 ?  (
            <ResponsiveContainer width="100%" style={{ marginTop: "20px" }} height={300}>
              <ComposedChart
          data={mergedData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                onClick={(event) => {
                  const clickedMonth = event?.activeLabel;
                  if (clickedMonth) {
                    const clickedData = groupedData.find((d) => d.month === clickedMonth);
                    if (clickedData) setmodalOpenChart(clickedData);
                  }
                }}
              >
                
                <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: "bold" }} />
                <YAxis tick={{ fontSize: 12, fontWeight: "bold" }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const monthData = payload[0].payload;
                      return (
                        <div style={{
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "8px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                          fontSize: "12px",
                          height: "150px",
                          overflowY: "auto",
                        }}>
                          <p><strong>📅 Month:</strong> {monthData.month}</p>
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
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ stroke: "orange", strokeWidth: 2 }}
                />
  <Bar
    dataKey="total_documents"
    barSize={20}
    fill="#2c2e83"
    radius={[4, 4, 0, 0]}
    activeBar={{ fill: "orange" }} // ✅ Hover color!
  />                <Line type="monotone" dataKey="total_documents" stroke="#ff7300" strokeWidth={1} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="110%" style={{marginLeft:"-30px"}} height={300}>
              <AreaChart data={defaultData}>
                 <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: "bold", fill: "#333" }} />
                <YAxis tick={{ fontSize: 12, fontWeight: "bold", fill: "#333" }} />
                <Tooltip />
                <Area
  type="monotone"
  dataKey="document_count"
  stroke="gray"
  fill={hovered ? "orange" : "lightgray"}
  fillOpacity={0.2}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
/>


              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </>
  );
  
};

export default MonthlyDocumentChart;