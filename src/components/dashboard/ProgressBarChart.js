import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";

const ProgressBarChart = ({ totalSize, client, isUploader,isReviewer,isViewer, isAdminOrDocumentRole,  }) => {
  // const role = localStorage.getItem("role");
  const max = isUploader ? 10 : 504; // Max for uploader is 10MB
  const used = isUploader ? 10 : isAdminOrDocumentRole ? client : totalSize;

  const roundedUsed = used > max ? max : used.toFixed(2);
  const percentage = Math.min((used / max) * 100, 100).toFixed(2);
  const fullLabel = `${roundedUsed} MB `;

  // if(!isAdminOrDocumentRole) return null; // Only show for admin or document role

  // if (isUploader) {
  //   return (
  //     <Item
  //       label="Declaration Count"
  //       value={fullLabel}
  //       icon={<FontAwesomeIcon icon="fa-solid fa-cloud" />}
  //     />
  //   );
  // }

  return (
    <div
      style={{
        background:isUploader? "#fdffff": "#fff",
        padding:isUploader? "11px 12px 28px":"15px 12px 23px",
        borderRadius: "12px",
        boxShadow:isUploader ? "0 4px 12px rgba(0, 0, 0, 0.1)": "",
        width:isUploader?"120px": isAdminOrDocumentRole ? "10px" : "100%",
        minWidth: isUploader? "" : isAdminOrDocumentRole ? "390px" : "390px",
        marginLeft:isUploader ? "420px" : isAdminOrDocumentRole ? "650px" : "-50px",
        margin: isAdminOrDocumentRole ? "none" : "auto",
        marginTop: isReviewer ? "-340px" : isViewer ? "-330px " : isAdminOrDocumentRole ? "-375px" : "0px",
        bottom: isUploader ? "0px" : isAdminOrDocumentRole ? "50px" : "0px",
        top: isUploader ? "115px" : "0px",
        left: isUploader ? "0px" : "0px",
        paddingBottom: isUploader ? "6px" : "0px",
        paddingTop: isUploader ? "0px" : "0px",
        position: "relative",
      }}
    >
      <h3
        style={{
          // marginBottom: "8px",
          fontSize: "15px",
          fontWeight: "700",
          color: "black",
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
            backgroundColor: "",
            color: "black",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "13px",
            // boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            position: "relative",
            left: isUploader ? "30px" : "0px",
          }}
        >
          {fullLabel}
        </div>
        
{isAdminOrDocumentRole ? (
  isUploader ? (
        <div
          // style={{
            
          //   backgroundColor: "#e0e0e0",
          //   borderRadius: "20px",
          //   height: "10px",
          //   overflow: "hidden",
          
          // }}
        >
          <div
            style={{
              width:isAdminOrDocumentRole ? `${percentage}%` : "" ,
              height: "100%",
              background: isUploader? "": "linear-gradient(to right, #007bff, #00d4ff)",
              borderRadius: "20px",
              transition: "width 0.4s ease-in-out",
            }}
          />
        </div>
) :  (
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
              width:isAdminOrDocumentRole ? `${percentage}%` : "" ,
              height: "100%",
              background: isUploader? "": "linear-gradient(to right, #007bff, #00d4ff)",
              borderRadius: "20px",
              transition: "width 0.4s ease-in-out",
            }}
          />
        </div>
) 
) : (
  ""
)}
       
      </div>
    </div>
  );
};

const Item = ({ label, value, icon }) => (
  <div style={{ 
      flex: "1 1 45%", 
      display: "flex", 
      alignItems: "center", 
      gap: "10px",
      position: "relative",
      left: "55px",
      bottom:"29px"}}>
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>
      <div style={{ fontSize: "14px", fontWeight: "500" }}>{label}</div>
      <div style={{ fontSize: "16px", fontWeight: "bold" }}>{value}</div>
    </div>
  </div>
);

export default ProgressBarChart;
