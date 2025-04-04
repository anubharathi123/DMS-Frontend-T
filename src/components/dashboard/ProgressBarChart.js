import React from "react";

const ProgressBarChart = ({ totalSize, client, isUploader, isAdminOrDocumentRole }) => {
  const role = localStorage.getItem("role");
  const max = isUploader ? 10 : 504; // Max for uploader is 10MB
  const used = isUploader ? 10 : isAdminOrDocumentRole ? client : totalSize;

  const roundedUsed = `${used.toFixed(2)}`;
  const fullLabel = `${roundedUsed} MB`;

  return (
    <div
      style={{
        background: "#fff",
        padding: "14px 16px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: isAdminOrDocumentRole ? "10px" : "100%",
        minWidth: isAdminOrDocumentRole ? "390px" : "390px",
        marginLeft: isUploader ? "500px" : isAdminOrDocumentRole ? "650px" : "-50px",
        margin: isAdminOrDocumentRole ? "none" : "auto",
        marginTop: isUploader ? "-350px" : isAdminOrDocumentRole ? "-375px" : "4px",
        position: isAdminOrDocumentRole ? "absolute" : "relative",
      }}
    >
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
              // width: `${percentage}%`,
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
