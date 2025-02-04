import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../../ApiServices/ApiServices"; // Adjust the path as needed
import Loader from "react-js-loader";
import "./AdminCreation.css";

const AdminCreation = () => {
  const [formData, setFormData] = useState({
    username: "",
    companyname: localStorage.getItem("company_name") || "VDart", 
    name: "",
    mobile: "",
    email: "",
    created_at: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiServices.registerAdmin(formData);
      setMessage("Admin registered successfully!");
      navigate("/Dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.error;
      console.error("Error registering admin:", errorMessage);
      setMessage(`Error: ${errorMessage}`);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      name: "",
      mobile: "",
      email: "",
      created_at: "",
    });
  };

  return (
    <div className="admincreation-container">
      <h2 className="admincreation-title">Admin Creation</h2>
      {message && (
        <div className="admincreation-message bg-red-100 text-red-800 px-4 py-2 rounded mb-4" role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Username <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="admincreation-input"
            required
          />
        </div>

        {/* Company Name */}
        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Company Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="companyname"
            value={formData.companyname}
            onChange={handleChange}
            className="admincreation-input"
            required
            readOnly
          />
        </div>

        {/* Person Name */}
        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Person Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="admincreation-input"
            required
          />
        </div>

        {/* Mobile */}
        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Mobile <span className="mandatory">*</span>
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="admincreation-input"
            required
          />
        </div>

        {/* Email */}
        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Mail ID <span className="mandatory">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="admincreation-input"
            required
          />
        </div>

        {/* Admin Creation Date */}
        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Admin Creation Date <span className="mandatory">*</span>
          </label>
          <input
            type="date"
            name="created_at"
            value={formData.created_at}
            onChange={handleChange}
            className="admincreation-input"
            required
          />
        </div>

        {/* Button Group */}
        <div className="admincreation-button-group">
          <button type="button" className="admincreation-btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="admincreation-btn-submit">
            Create
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="admincreation-loading-popup">
          <div className="admincreation-loading-popup-content">
            <Loader type="box-up" bgColor={"#000b58"} color={"#000b58"} size={100} />
            <p>Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreation;
