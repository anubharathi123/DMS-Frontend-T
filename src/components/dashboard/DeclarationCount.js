import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderTree } from '@fortawesome/free-solid-svg-icons';
import { AlignJustify } from "lucide-react";


const DeclarationCount = ({ orgSummary, isAdminOrDocumentRole, isUploader }) => {
    return (
        <div className="declaration-count-card"
         style={{
            background: isUploader? "#fdffff" : "#fff",
            borderRadius: "10px",
            padding:"45px 12px 60px",
            // paddingBottom: "16px",
            position: "relative",
            display: "flex" ,
            bottom: "33%",
            left: "",
            right: "49%",
            boxShadow: isUploader ? "0 4px 15px rgba(0,0,0,0.2) " : "0 4px 15px rgba(0,0,0,0.2)",
            // background: isUploader ? "#fdffff" : "",
            
            
        }}>
            {/* <h2 className="declaration-count-title"
            style={{ 
                // background: isUploader? "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)" : "#fff",
                // borderRadius: "12px",
                // boxShadow: isUploader? "" :"0 4px 12px rgba(0, 0, 0, 0.1)", 
                width: "100%",
                // height: "100px",
                // // display:isAdminOrDocumentRole?"none":isUploader?"flex" :"",
                // padding: "10px",
                fontSize: "15px",
                flexWrap: "nowrap",
                // color: "black",
                position: "relative",
                fontWeight: "none",
                left: "15px",
                bottom: "20px",
                }}>
                Declaration Count
            </h2> */}
            <div className="declaration-count-container"
                style={{
                    display:"flex",
                    flexWrap:"nowrap",
                    position: "relative",
                    flex: "1 1 45%",
                    AlignJustify: "space-evenly",
                    gap: "8px",
                    alignItems: "baseline",
                    top:"20px",
                    right: "55px",

                }}
            >
            {/* <span className="declaration-count-icon"
                style={{
                    // position: "relative",
                    // bottom: "280px",
                    // left: "10px",
                    // display:isAdminOrDocumentRole?"none":"",
                }}
            ><FontAwesomeIcon icon={faFolderTree} /></span>
            <p className="count"
                style={{
                    // position: "relative",
                    // bottom: "323px",
                    // left: "40px",
                    fontSize: "20px",
                    // display:isAdminOrDocumentRole?"none":"",
                    fontWeight: "bold",
                    color: "black",
                }}
            
            ><strong>{orgSummary?.dec_count ?? 0}</strong></p> */}
                            <Item label="Declaration Count" value={orgSummary?.dec_count || 0} icon={<FontAwesomeIcon icon={faFolderTree} />} />
            </div>
           
        </div>
    );
}
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
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>{label}</div>
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>{value}</div>
      </div>
    </div>
  );
export default DeclarationCount;