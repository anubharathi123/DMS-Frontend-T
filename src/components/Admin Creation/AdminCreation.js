import React, { useState, useEffect } from "react";
import "./AdminCreation.css";

const AdminCreation = () => {
  // Initialize default company name in localStorage if not already set
  useEffect(() => {
    if (!localStorage.getItem(" Company_name")) {
      localStorage.setItem("Company_name", "VDart");
    }
  }, []);

  // Form state management
  const [formData, setFormData] = useState({
    userId: "",
    Company_name: localStorage.getItem("Company_name") || "VDart", // Default from localStorage
    personName: "",
    mobile: "",
    accessCreationDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Details saved successfully!");
  };

  const handleCancel = () => {
    setFormData({
      userId: "",
      companyName: localStorage.getItem("Company_name") || "VDart", // Reset to default
      personName: "",
      mobile: "",
      accessCreationDate: "",
    });
    alert("Form reset.");
  };

  return (
    <div className="admin-creation-container">
      <h2 className="admin-creation-title">Admin Creation</h2>
      <form onSubmit={handleSubmit}>
        {/* User ID */}
        <div className="admin-creation-form-group">
          <label className="admin-creation-label">
            User ID <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="admin-creation-input"
            required
          />
        </div>

        {/* Company Name */}
        <div className="admin-creation-form-group">
          <label className="admin-creation-label">
            Company Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="Company_name"
            value={formData.Company_name}
            className="admin-creation-input"
          />
        </div>

        {/* Person Name */}
        <div className="admin-creation-form-group">
          <label className="admin-creation-label">
            Person Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            className="admin-creation-input"
            required
          />
        </div>

        {/* Mobile */}
        <div className="admin-creation-form-group">
          <label className="admin-creation-label">
            Mobile <span className="mandatory">*</span>
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="admin-creation-input"
            required
          />
        </div>

        {/* Access Creation Date */}
        <div className="admin-creation-form-group">
          <label className="admin-creation-label">
            Access Creation Date <span className="mandatory">*</span>
          </label>
          <input
            type="date"
            name="accessCreationDate"
            value={formData.accessCreationDate}
            onChange={handleChange}
            className="admin-creation-input"
            required
          />
        </div>

        {/* Save and Cancel Buttons */}
        <div className="admin-creation-button-group">
          <button type="submit" className="admin-creation-btn-submit">
            Save
          </button>
          <button
            type="button"
            className="admin-creation-btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreation;
