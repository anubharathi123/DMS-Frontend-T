import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import './SignatureComponent.css';

const SignatureComponent = () => {
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [mode, setMode] = useState("draw");
    const [typedSignature, setTypedSignature] = useState("");
    const [showFontList, setShowFontList] = useState(false);
    const [selectedFont, setSelectedFont] = useState("Arial");
    const [uploadedImage, setUploadedImage] = useState(null);

    const sigCanvas = useRef(null);

    const buttonStyle = {
        margin: "5px",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
      };

      const fontStyles = ["Arial", "Courier", "Times New Roman", "Verdana"];

      const handleSave = () => {
        console.log("Signature saved!");
        // Add logic to save the signature
      };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          setUploadedImage(URL.createObjectURL(file));
        }
      };
    
      const clearSignature = () => {
        sigCanvas.current.clear();
      };

    return (
        <div>
          {showSignaturePad && (
            <div
              style={{
                padding: "15px",
                background: "#fff",
                boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                width: "360px",
                marginTop: "15px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <button onClick={() => setMode("draw")} style={{ ...buttonStyle, background: mode === "draw" ? "#0056b3" : "#d9e2f3", color: mode === "draw" ? "white" : "#333" }}>Draw</button>
                <button onClick={() => setMode("type")} style={{ ...buttonStyle, background: mode === "type" ? "#0056b3" : "#d9e2f3", color: mode === "type" ? "white" : "#333" }}>Type</button>
                <button onClick={() => setMode("upload")} style={{ ...buttonStyle, background: mode === "upload" ? "#0056b3" : "#d9e2f3", color: mode === "upload" ? "white" : "#333" }}>Upload</button>
              </div>
              {mode === "draw" && (
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="#333"
                  canvasProps={{
                    style: { border: "1px solid #ccc", width: "100%", height: "100px", borderRadius: "5px", background: "white" },
                  }}
                />
              )}
              {mode === "type" && (
                <div>
                  <input
                    type="text"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    onFocus={() => setShowFontList(true)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontFamily: selectedFont,
                      background: "white",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                    placeholder="Type your signature"
                  />
                  {showFontList && (
                    <div style={{ marginTop: "8px", border: "1px solid #ccc", borderRadius: "5px", background: "white", maxHeight: "150px", overflowY: "auto", padding: "5px" }}>
                      {fontStyles.map((font) => (
                        <div key={font} style={{ padding: "6px", cursor: "pointer", fontFamily: font, fontSize: "20px" }} onClick={() => { setSelectedFont(font); setShowFontList(false); }}>
                          {typedSignature || "Sample Text"}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {mode === "upload" && (
                <div style={{ padding: "16px", textAlign: "center", background: "#eef2fa", borderRadius: "8px", border: "1px solid #ccc" }}>
                  <label style={{ 
                    padding: "8px 12px", 
                    border: "1px solid black", 
                    background: "#007bff", 
                    color: "white", 
                    borderRadius: "5px", 
                    cursor: "pointer", 
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}>
                    Upload Signature
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  </label>
                  {uploadedImage && (
                    <img src={uploadedImage} alt="Uploaded Signature" 
                      style={{ marginTop: "10px", width: "100%", height: "auto", borderRadius: "6px" }} />
                  )}
                </div>
              )}
              <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between" }}>
                <button onClick={clearSignature} style={buttonStyle}>Clear</button>
                <button onClick={handleSave} style={buttonStyle}>Save & Close</button>
              </div>
            </div>
          )}
        </div>
      
  );
};
export default SignatureComponent;