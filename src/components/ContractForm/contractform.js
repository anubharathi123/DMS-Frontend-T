import React, { useState, useRef, useEffect } from 'react';

import SignatureCanvas from 'react-signature-canvas';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation
import './contractform.css';
import authService from '../../ApiServices/ApiServices';
import { useNavigate } from 'react-router-dom';



const CompanyContractForm = () => {
  const [signature, setSignature] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [mode, setMode] = useState('draw'); // 'draw', 'type', 'upload'
  const [typedSignature, setTypedSignature] = useState('');
  const [showFontList, setShowFontList] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [uploadedImage, setUploadedImage] = useState(null);
  const sigCanvas = useRef();
  const [contractDocuments, setContractDocuments] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [contractTitle, setContractTitle] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [dateOfAgreement, setDateOfAgreement] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState(null); // For error handling
  const navigate = useNavigate();
  

  const buttonStyle = {
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const fontStyles = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'];

  const isFormComplete = () => {
    return (
      companyName.trim() !== '' &&
      contractTitle.trim() !== '' &&
      companyAddress.trim() !== '' &&
      dateOfAgreement.trim() !== '' &&
      signature
    );
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setSignature(null);
    setUploadedImage(null);
    setTypedSignature('');
  };

  const handleSave = () => {
    if (mode === 'draw') {
      const signatureData = sigCanvas.current.toDataURL();
      setSignature(signatureData);
    } else if (mode === 'type') {
      setSignature(typedSignature);
    }
    setShowPopup(false); // Close popup after saving
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setSignature(reader.result); // Save uploaded signature directly
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details_data = await authService.details();
        console.log(details_data)
        
        if (details_data.type === "Organization") {
          const name = details_data.details[5].first_name;
          // localStorage.setItem("name", name);
          const Company_name = details_data.details[1].company_name;
          const empId  = details_data.details[1].id
          setId(empId)
          setCompanyName(Company_name);
          // localStorage.setItem("company_name", Company_name);
          // const fetchedRole = details_data.details[3].name;

          // if (fetchedRole === "ADMIN") {
          //   localStorage.setItem("role", fetchedRole);
          //   setRole(fetchedRole);
          // }
          // if (fetchedRole === "Organization Admin") {
          //   localStorage.setItem("role", "ADMIN");
          //   setRole("ADMIN");
          // }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, []);


  // const handleSubmit1 = async (e) => {
  //   e.preventDefault(); 
    
  //   if (!contractDocuments) {
  //     setError("Please upload the Master Services Agreement (MSA) before proceeding.");
  //     setTimeout(() => setError(null), 3000);
  //     return;
  //   }
  
  //   const formData = new FormData();
  
  //   // Append company details
  //   // Object.keys(company).forEach((key) => {
  //   //   if (company[key]) {
  //   //     formData.append(key, company[key]);
  //   //   }
  //   // });
  
  //   // Append file
  //   if (contractDocuments) {
  //     const contractFile = new File([contractDocuments], `${companyName}_contract.pdf`, { type: 'application/pdf' });
  //     formData.append('contractDocuments', contractFile);
  //   }
  
  //   // console.log("FormData entries:");
  //   // for (let [key, value] of formData.entries()) {
  //   //   console.log(`${key}: ${value}`);
  //   // }
  
  //   // setIsLoading(true);
  
  //   try {
  //     const response = await authService.updateOrganization(id, formData);
  //     console.log("Update Response:", response);
  //     alert("Company Details have been updated successfully!");
  //     setTimeout(() => {
  //       navigate('/OrganizationList');
  //     }, 500); 
  
  //   } catch (error) {
  //     setError(error.message || "Something went wrong.");
  //     setTimeout(() => setError(null), 3000);
  //   } finally {
  //     // setIsLoading(false);
  //   }
  // };
  

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validation
    if (!companyName || !contractTitle || !companyAddress || !dateOfAgreement || !termsAgreed || !signature) {
      alert('Please complete all required fields and add a signature.');
      return;
    }

    // Collect all form data
    const formData = {
      companyName,
      contractTitle,
      companyAddress,
      dateOfAgreement,
      termsAgreed,
      signature,
    };

    // Simulate sending form data to a server (use your API endpoint here)
    console.log('Form Data:', formData);
    alert('Form successfully submitted!');

    // Reset the form after submission
    setCompanyName('');
    setContractTitle('');
    setCompanyAddress('');
    setTermsAgreed(false);
    setDateOfAgreement('');
    setSignature(null);
  };

  // Get current date for the top-right corner
  const currentDate = new Date().toLocaleDateString();

  // Track if input is provided in any of the modes
  const isSaveEnabled =
    (mode === 'draw' && sigCanvas.current && sigCanvas.current.isEmpty() === false) ||
    (mode === 'type' && typedSignature.trim() !== '') ||
    (mode === 'upload' && uploadedImage);

    const generatePDF = async () => {
        const doc = new jsPDF();
    
        // Set title
        doc.setFont('Arial', 'bold');
        doc.text('Company Contract Agreement', 60, 20);
    
        // Set current date at the top-right
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Date: ${currentDate}`, 160, 20);
    
        // Define a function to add formatted content
        const addFormattedText = (title, content, yPosition , xPosition) => {
            doc.setFont('Arial', 'bold');
            doc.setFontSize(12)
            doc.text(title, 10, yPosition);
            doc.setFont('Arial', '', 10);
            let splitText = doc.splitTextToSize(content, 180);
            doc.text(splitText, 10, yPosition + 6);
            return yPosition + (splitText.length * 7) + 4; // Adjust for line spacing
        };
    
        // Add Terms and Conditions Content
        let yPosition = 30;
         yPosition = addFormattedText("Terms and Conditions", "", yPosition);
        yPosition = addFormattedText("Introduction:", "The DMS provides an online platform for storing, managing, and sharing documents. The Service is intended for use by individuals, organizations, and businesses seeking an efficient way to manage documents electronically.", yPosition);
        
        yPosition = addFormattedText("User Responsibilities:", "- Ensure accuracy and completeness of data submitted.\n- Do not upload or distribute unlawful, defamatory, or inappropriate content.\n- Maintain the confidentiality of your account credentials and take responsibility for all activities under your account.\n- Ensure that all users of the system under your account comply with these Terms and Conditions.", yPosition);
        
        yPosition = addFormattedText("Privacy and Data Protection:", "We collect personal information for registration and usage purposes. We use secure storage methods to protect your data but cannot guarantee absolute security.", yPosition-5);
        
        yPosition = addFormattedText("Subscription and Payment:", "Some features of the DMS are available on a subscription basis. You agree to pay the applicable fees based on your subscription plan. Fees are non-refundable. If you fail to make payments, we reserve the right to suspend or terminate your account.", yPosition);
        
        yPosition = addFormattedText("Termination:", "We reserve the right to suspend or terminate your account in case of violations of the Terms. You can terminate your account at any time by providing a written notice to our support team.", yPosition);
        
        yPosition = addFormattedText("Governing Law:", "These Terms are governed by the laws of [Your Country/State]. Any disputes will be subject to the jurisdiction of the courts located in [Your Jurisdiction].", yPosition);
        
        yPosition = addFormattedText("Indemnification:", "You agree to indemnify, defend, and hold harmless DMS, its affiliates, and its employees from any claims, damages, liabilities, and expenses arising out of your use of the Service, or any violation of these Terms.", yPosition);
        
        yPosition = addFormattedText("Limitation of Liability:", "In no event shall DMS be liable for any indirect, incidental, special, or consequential damages arising out of your use or inability to use the Service, even if we have been advised of the possibility of such damages.", yPosition);
    
        // Contract Details Section
        yPosition += 10;
         doc.setFont('Arial', 'bold');
        doc.text("Contract Details:", 10, yPosition);
        doc.setFont('Arial', '', 10);
        yPosition += 6;
        doc.text(`Company Name: ${companyName}`, 10, yPosition+3);
        yPosition += 6;
        doc.text(`Authority Name: ${contractTitle}`, 10, yPosition+5);
        yPosition += 6;
        doc.text(`Place: ${companyAddress}`, 10, yPosition+7);
        yPosition += 6;
        doc.text(`Date of Agreement: ${dateOfAgreement}`, 140, yPosition-20);
    
        // Signature Section
        yPosition += 10;
        doc.setFont('Arial', 'bold', 22);
        doc.text("Signature:", 140, yPosition-20);
        if (mode === 'upload' && uploadedImage) {
            doc.addImage(uploadedImage, 'JPEG', 10, yPosition + 5, 50, 25);
        } else if (mode === 'type' && typedSignature) {
            doc.setFont('Arial', 'italic', 14);
            doc.text(typedSignature, 15, yPosition + 10);
        } else if (mode === 'draw' && signature) {
            doc.addImage(signature, 'PNG', 140, yPosition - 15, 50, 25);
        }
    
      // Save the PDF to a Blob
      const pdfBlob = doc.output('blob');
    
      // Create a File object directly from the Blob
      const contractFile = new File([pdfBlob], `${companyName}_contract.pdf`, { type: 'application/pdf' });
    
      // Call handleSubmit1 with the file instead of relying on state
      await handleSubmit1({ preventDefault: () => {} }, contractFile);
    
      // Save and navigate
      doc.save('contract.pdf');
      localStorage.setItem('msi','true')
      navigate('/sign-up');
    };
    
    // Fix handleSubmit1 to accept contractFile as a parameter
    const handleSubmit1 = async (e, contractFile) => {
      e.preventDefault();
    
      if (!contractFile) {
        setError("Please upload the Master Services Agreement (MSA) before proceeding.");
        setTimeout(() => setError(null), 3000);
        return;
      }
    
      const formData = new FormData();
    
      // Append file directly
      formData.append('contractDocuments', contractFile);
    
      try {
        const response = await authService.updateOrganization1(id, formData);
        console.log("Update Response:", response);
        alert("Company Details have been updated successfully!");
        setTimeout(() => {
          localStorage.setItem('msi','true')
          navigate('/profile');
        }, 500);
      } catch (error) {
        setError(error.message || "Something went wrong.");
        setTimeout(() => setError(null), 3000);
      }
    };
    
    
  return (
    <div className="contract-form">
      <div className="date-display">
        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Date: {currentDate}</p>
        <div style={{ borderBottom: '2px solid #ccc', marginTop: '4px' }}></div>
      </div>

      <h2 style={{ textAlign: 'center' }}>Company Contract Agreement</h2>

      {/* Terms and Conditions Section moved below the contract heading */}
      <div className="terms-content" style={{ textAlign: 'left', marginTop: '30px' }}>
        <h3>Terms and Conditions</h3>
        <h4>Introduction</h4>
        <p>
          The DMS provides an online platform for storing, managing, and sharing documents. The Service is intended for use by individuals, organizations, and businesses seeking an efficient way to manage documents electronically.
        </p>
        <h4>User Responsibilities</h4>
        <ul>
          <li>Ensure accuracy and completeness of data submitted.</li>
          <li>Do not upload or distribute unlawful, defamatory, or inappropriate content.</li>
          <li>Maintain the confidentiality of your account credentials and take responsibility for all activities under your account.</li>
          <li>Ensure that all users of the system under your account comply with these Terms and Conditions.</li>
        </ul>

        <h4>Privacy and Data Protection</h4>
        <p>
          We collect personal information for registration and usage purposes. We use secure storage methods to protect your data but cannot guarantee absolute security.
        </p>

        <h4>Subscription and Payment</h4>
        <p>
          Some features of the DMS are available on a subscription basis. You agree to pay the applicable fees based on your subscription plan. Fees are non-refundable. If you fail to make payments, we reserve the right to suspend or terminate your account.
        </p>

        <h4>Termination</h4>
        <p>
          We reserve the right to suspend or terminate your account in case of violations of the Terms. You can terminate your account at any time by providing a written notice to our support team.
        </p>

        <h4>Governing Law</h4>
        <p>
          These Terms are governed by the laws of [Your Country/State]. Any disputes will be subject to the jurisdiction of the courts located in [Your Jurisdiction].
        </p>
        
        <h4>Indemnification</h4>
        <p>
          You agree to indemnify, defend, and hold harmless DMS, its affiliates, and its employees from any claims, damages, liabilities, and expenses arising out of your use of the Service, or any violation of these Terms.
        </p>

        <h4>Limitation of Liability</h4>
        <p>
          In no event shall DMS be liable for any indirect, incidental, special, or consequential damages arising out of your use or inability to use the Service, even if we have been advised of the possibility of such damages.
        </p>

        <h4>Service Availability</h4>
        <p>
          DMS does not guarantee that the Service will be available at all times or without interruption. We will make reasonable efforts to ensure availability, but we cannot be held liable for any downtime or service interruptions.
        </p>

        <h4>Changes to Terms</h4>
        <p>
          We reserve the right to modify or update these Terms at any time. We will notify you of any material changes via email or notification on the platform. Continued use of the Service after such changes constitutes acceptance of the updated Terms.
        </p>

        <h4>Ownership and Intellectual Property</h4>
        <p>
          All intellectual property rights related to the Service and its content, including but not limited to copyrights, trademarks, and logos, are owned by DMS or its licensors. You are granted a limited, non-transferable license to use the Service.
        </p>

        <h4>Dispute Resolution</h4>
        <p>
          Any disputes arising from these Terms shall first be resolved through informal negotiations. If the dispute cannot be resolved through negotiations, it shall be settled through binding arbitration in [Location].
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="contract-section" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="left-column" style={{ flex: '0 1 48%' }}>
            <label htmlFor="company-name" style={{ textAlign: 'left' }}>Company Name:</label>
            <input
              type="text"
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              style={{ width: '100%' }}
            />

            <label htmlFor="contract-title" style={{ textAlign: 'left' }}>Authority Name:</label>
            <input
              type="text"
              id="contract-title"
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              required
              style={{ width: '100%' }}
            />

            <label htmlFor="place" style={{ textAlign: 'left' }}>Place:</label>
            <textarea
              id="place"
              rows="4"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div className="right-column" style={{ flex: '0 1 48%' }}>
            <label htmlFor="date-of-agreement" style={{ textAlign: 'left' }}>Date of Agreement:</label>
            <input
              type="date"
              id="date-of-agreement"
              value={dateOfAgreement}
              onChange={(e) => setDateOfAgreement(e.target.value)}
              required
              style={{ width: '100%' }}
            />

<div className="signature-box" onClick={() => setShowPopup(true)}>
              {signature ? (
                mode === 'upload' && uploadedImage ? (
                  <img src={uploadedImage} alt="Uploaded Signature" style={{ width: '200px', height: '60px' }} />
                ) : (
                  mode === 'type' ? (
                    <p style={{ fontFamily: selectedFont, fontSize: '18px', textAlign: 'center' }}>{signature}</p>
                  ) : (
                    <img src={signature} alt="Drawn Signature" style={{ width: '200px', height: '60px' }} />
                  )
                )
              ) : (
                <p style={{ textAlign: 'center', color: 'blue' }}>Click here to Sign</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="button" onClick={generatePDF} style={buttonStyle} disabled={!isFormComplete()}>Save and Download PDF</button>
        </div>
      </form>

      {/* Signature Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div
            style={{
              padding: '25px',
              background: '#fff',
              boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              width: '360px',
              marginTop: '15px',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#333',
              }}
            >
              ×
            </button>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <button
                onClick={() => setMode('draw')}
                style={{
                  ...buttonStyle,
                  background: mode === 'draw' ? '#0056b3' : '#d9e2f3',
                  color: mode === 'draw' ? 'white' : '#333',
                }}
              >
                Draw
              </button>
              <button
                onClick={() => setMode('type')}
                style={{
                  ...buttonStyle,
                  background: mode === 'type' ? '#0056b3' : '#d9e2f3',
                  color: mode === 'type' ? 'white' : '#333',
                }}
              >
                Type
              </button>
              <button
                onClick={() => setMode('upload')}
                style={{
                  ...buttonStyle,
                  background: mode === 'upload' ? '#0056b3' : '#d9e2f3',
                  color: mode === 'upload' ? 'white' : '#333',
                }}
              >
                Upload
              </button>
            </div>

            {mode === 'draw' && (
              <SignatureCanvas
                ref={sigCanvas}
                penColor="#333"
                canvasProps={{
                  style: { border: '1px solid #ccc', width: '100%', height: '100px', borderRadius: '5px', background: 'white' },
                }}
                onEnd={() => {
                  const signatureData = sigCanvas.current.toDataURL();
                  setSignature(signatureData);
                }}
              />
            )}

            {mode === 'type' && (
              <div>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  onFocus={() => setShowFontList(true)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    fontFamily: selectedFont,
                    background: 'white',
                    fontSize: '18px',
                    textAlign: 'center',
                  }}
                  placeholder="Type your signature"
                />
                {showFontList && (
                  <div
                    style={{
                      marginTop: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      background: 'white',
                      maxHeight: '150px',
                      overflowY: 'auto',
                      padding: '5px',
                    }}
                  >
                    {fontStyles.map((font) => (
                      <div
                        key={font}
                        style={{
                          padding: '6px',
                          cursor: 'pointer',
                          fontFamily: font,
                          fontSize: '20px',
                        }}
                        onClick={() => {
                          setSelectedFont(font);
                          setShowFontList(false);
                        }}
                      >
                        {typedSignature || 'Sample Text'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {mode === 'upload' && (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  background: '#eef2fa',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              >
                <label
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    backgroundColor: '#4d79ff',
                    color: 'white',
                    cursor: 'pointer',
                    borderRadius: '5px',
                  }}
                >
                  Upload Signature
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button onClick={clearSignature} style={{ ...buttonStyle, color: 'red' }}>Clear</button>
              <button onClick={handleSave} style={{ ...buttonStyle, backgroundColor: isSaveEnabled ? '#0056b3' : '#ddd', color: 'white' }} disabled={!isSaveEnabled}>
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyContractForm;