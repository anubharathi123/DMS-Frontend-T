import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderTree } from '@fortawesome/free-solid-svg-icons';


const DeclarationCount = ({ orgSummary, isAdminOrDocumentRole }) => {
    return (
        <div>
            <h2 style={{ 
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
                width: "100%",
                height: "100px",
                display:isAdminOrDocumentRole?"none":"block",
                padding: "20px",
                fontSize: "15px",
                color: "#007bff",
                position: "relative",
                right: "70px",
                bottom: "70px",
                }}>
                Declaration Count
            </h2>
            <span className="declaration-count"
                style={{
                    position: "relative",
                    bottom: "180px",
                    left: "10px",
                    display:isAdminOrDocumentRole?"none":"block",
                }}
            ><FontAwesomeIcon icon={faFolderTree} /></span>
            <p className="count"
                style={{
                    position: "relative",
                    bottom: "223px",
                    left: "40px",
                    fontSize: "20px",
                    display:isAdminOrDocumentRole?"none":"block",
                    fontWeight: "bold",
                    color: "#007bff",
                }}
            
            ><strong>{orgSummary?.dec_count ?? 0}</strong></p>
           
        </div>
    );
}
export default DeclarationCount;