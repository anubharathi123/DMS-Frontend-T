import React, { useState } from "react";

const ProgressBarChart = ({
  totalSize,
  client,
  isUploader,
  isReviewer,
  isViewer,
  isAdminOrDocumentRole,
}) => {
  const [showDetails, setShowDetails] = useState(false); // 👈 state to toggle details

  const max = isUploader ? 10 : 504;
  const used = isUploader ? 10 : isAdminOrDocumentRole ? client : totalSize;

  const roundedUsed = used > max ? max : used.toFixed(2);
  const percentage = Math.min((used / max) * 100, 100).toFixed(2);
  const fullLabel = `${roundedUsed} MB`;

  const toggleDetails = () => {
    setShowDetails(!showDetails); // 👈 toggle the visibility
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "14px 16px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        minWidth: isAdminOrDocumentRole ? "400px" : "390px",
        position: "relative",
      }}
    >
      <h3
        title="Click to view storage details"
        onClick={toggleDetails} // 👈 now shows details instead of alert
        style={{
          marginBottom: "8px",
          fontSize: "15px",
          fontWeight: "700",
          color: "#007bff",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        Storage Usage
      </h3>

      {showDetails && (
        <div
          style={{
            background: "#f9f9f9",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#333",
            textAlign: "center",
          }}
        >
          <p><strong>Max Size:</strong> {max} MB</p>
          <p><strong>Used:</strong> {roundedUsed} MB</p>
          <p><strong>Usage %:</strong> {percentage}%</p>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            minWidth: "44px",
            height: "48px",
            borderRadius: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "13px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            cursor: "default",
          }}
        >
          {fullLabel}
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#e0e0e0",
            borderRadius: "20px",
            height: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: "linear-gradient(to right, #007bff, #00d4ff)",
              borderRadius: "20px",
              transition: "width 0.4s ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBarChart;
