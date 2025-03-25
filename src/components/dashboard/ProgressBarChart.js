import React from "react";

const ProgressBarChart = ({ totalSize, client, isAdminOrDocumentRole }) => {
  const max = 504; // Reference in MB
  const used = isAdminOrDocumentRole ? client : totalSize;
  const percentage = Math.min((used / max) * 100, 100);
  const roundedUsed = `${used.toFixed(2)}`;
  const fullLabel = `${used.toFixed(2)} MB / 1 GB`;

  return (
    <div
      style={{
        background: "#fff",
        padding: "14px 16px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: isAdminOrDocumentRole ? "10px" : "100%",
        minWidth: isAdminOrDocumentRole ? "390px" : "390px",
        marginLeft: isAdminOrDocumentRole ? "600px" : "-50px",
         margin: isAdminOrDocumentRole ? "none" : "auto",
        marginTop: isAdminOrDocumentRole ? "-310px" : "4px",
        position: isAdminOrDocumentRole ? "absolute" : "relative",
      }}
    >
      {/* Title */}
      <h3
        style={{
          marginBottom: "8px",
          fontSize: "15px",
          fontWeight: "700",
          color: "#007bff",
          textAlign: "center",
        }}
      >
        Storage Usage
      </h3>

      {/* Usage info */}
      <p
        style={{
          fontWeight: "bold",
          fontSize: "13.5px",
          marginBottom: "10px",
          color: "#000",
          textAlign: "left",
        }}
      >
        {isAdminOrDocumentRole ? `Used: ${fullLabel}` : `Total: ${fullLabel}`}
      </p>

      {/* Progress Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Blue usage box */}
        <div
          style={{
            minWidth: "44px",
            height: "48px",
            borderRadius: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            padding:"2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "13px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          {roundedUsed}MB
        </div>

        {/* Bar */}
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
              width: `${percentage}rem`,
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
