import React from "react";
import { HiBuildingOffice2 } from "react-icons/hi2";
import {
  FaBuildingCircleXmark,
  FaBuildingCircleExclamation,
} from "react-icons/fa6";
import { GrDocument, GrDocumentTime, GrDocumentVerified, GrDocumentExcel } from "react-icons/gr";

const CardAnalytics = ({ OrgCount, DashboardStats}) => {
  console.log("OrgCount", OrgCount);
  console.log("DashboardStats", DashboardStats);
  const role = localStorage.getItem("role");
  const isAdminOrDocumentRole = [
    "ADMIN",
    "UPLOADER",
    "APPROVER",
    "REVIEWER",
    "VIEWER",
  ].includes(role);
  const isUploader = role === "UPLOADER";


  // const UploaderStats = ({ stats }) => (
  //   <>
  //     <Item label="Total Documents" value={stats?.document_count || 0} icon={<HiBuildingOffice2 />} />
  //     <Item label="Approved" value={stats?.approved_count || 0} icon={<HiBuildingOffice2 style={{ color: "#aaffaa" }} />} />
  //     <Item label="Pending" value={stats?.pending_count || 0} icon={<FaBuildingCircleExclamation style={{ color: "#ffcc00" }} />} />
  //     <Item label="Rejected" value={stats?.rejected_count || 0} icon={<HiBuildingOffice2 />} />
  //   </>
  // );

  return (
    <div
    className="analytics-card"
    style={{
      background: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
      color: "white",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      width: "100%",
      maxWidth: isUploader ? "290px" : "400px", // ✅ Expand if uploader
      ...(isAdminOrDocumentRole
        ? {
            marginLeft: "0px",
            transform: "translateX(0px)",
            position: "relative",
            bottom: isUploader ? "0px" : "",
            top: isUploader ? "120px" : "0px",
            marginTop: isUploader ? " " : isAdminOrDocumentRole ? "-15px": "",
            left: "4%",
            width: isUploader ? "500px" : "300px", // ✅ Expand for uploader
          }
        : { position: "relative", right: "10px" }),
    }}
  >
  
  
  <h2
  style={{
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "20px",
    marginTop: isAdminOrDocumentRole ? "0px" : "10px", 
    position:"relative"
  }}
>
  {isAdminOrDocumentRole ? "Document Count" : "Company Count"}
</h2>


      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          height: "100px",
        }}
      >
        {role === "ADMIN" || role === "UPLOADER" || role === "REVIEWER" || role === "VIEWER"? (
        role === "ADMIN" ? (
          <>
            <Item label="Total Documents" value={DashboardStats?.document_count || 0} icon={<GrDocument />} />
            <Item label="Approved" value={DashboardStats?.approved_count || 0} icon={<GrDocumentVerified style={{ color: "#aaffaa" }} />} />
            <Item label="Pending" value={DashboardStats?.pending_count || 0} icon={<GrDocumentTime style={{ color: "#ffcc00" }} />} />
            <Item label="Rejected" value={DashboardStats?.rejected_count|| 0} icon={<GrDocumentExcel/>} />
          </>
        ) : (
          <>
            <Item label="Total Documents" value={DashboardStats?.document_count || 0} icon={<GrDocument />} />
            <Item label="Approved" value={DashboardStats?.approved_count || 0} icon={<GrDocumentVerified style={{ color: "#aaffaa" }} />} />
            <Item label="Pending" value={DashboardStats?.pending_count || 0} icon={<GrDocumentTime style={{ color: "#ffcc00" }} />} />
            <Item label="Rejected" value={DashboardStats?.rejected_count || 0} icon={<GrDocumentExcel />} />
          </>
        )
        ) : (
          <>
            <Item label="Total" value={OrgCount?.totalCompanies || 0} icon={<HiBuildingOffice2 />} />
            <Item label="Active" value={OrgCount?.activeCompanies || 0} icon={<HiBuildingOffice2 style={{ color: "#aaffaa" }} />} />
            <Item label="Inactive" value={OrgCount?.inactiveCompanies || 0} icon={<HiBuildingOffice2 style={{ color: "#ffaaaa" }} />} />
            <Item label="Deleted" value={OrgCount?.deleted_org_count || 0} icon={<FaBuildingCircleXmark />} />
          </>
        )}
{/* {role === "UPLOADER" && <UploaderStats stats={DashboardStats} />}  */}
         {/* {(role === "UPLOADER") && (
          <>
          <Item label="Total Documents" value={DashboardStats?.document_count || 0} icon={<HiBuildingOffice2 />} />
          <Item label="Approved" value={DashboardStats?.approved_count || 0} icon={<HiBuildingOffice2 style={{ color: "#aaffaa" }} />} />
          <Item label="Pending" value={DashboardStats?.pending_count || 0} icon={<FaBuildingCircleExclamation style={{ color: "#ffcc00" }} />} />
          <Item label="Rejected" value={DashboardStats?.rejected_count || 0} icon={<HiBuildingOffice2 />} />
        </>
        )} */}
        {/* {role === "UPLOADER" ? (
          <>
            <Item label="Total Documents" value={DashboardStats?.document_count || 0} icon={<HiBuildingOffice2 />} />
            <Item label="Approved" value={DashboardStats?.approved_count || 0} icon={<HiBuildingOffice2 style={{ color: "#aaffaa" }} />} />
            <Item label="Pending" value={DashboardStats?.pending_count || 0} icon={<FaBuildingCircleExclamation style={{ color: "#ffcc00" }} />} />
            <Item label="Rejected" value={DashboardStats?.employee_count || 0} icon={<HiBuildingOffice2 />} />
          </>
        ) : (
          <>
            <Item label="Total" value={OrgCount?.total_organizations || 0} icon={<HiBuildingOffice2 />} />
            <Item label="Active" value={OrgCount?.activeCompanies || 0} icon={<HiBuildingOffice2 style={{ color: "#aaffaa" }} />} />
            <Item label="Inactive" value={OrgCount?.inactiveCompanies || 0} icon={<HiBuildingOffice2 style={{ color: "#ffaaaa" }} />} />
            <Item label="Deleted" value={OrgCount?.deletedCompanies || 0} icon={<FaBuildingCircleXmark />} />
          </>
        )} */}
      </div>
    </div>
  );
};

const Item = ({ label, value, icon }) => (
  <div style={{ flex: "1 1 45%", display: "flex", alignItems: "center", gap: "10px" }}>
    <div style={{ fontSize: "18px" }}>{icon}</div>
    <div>
      <div style={{ fontSize: "14px", fontWeight: "500" }}>{label}</div>
      <div style={{ fontSize: "16px", fontWeight: "bold" }}>{value}</div>
    </div>
  </div>
);

export default CardAnalytics;
