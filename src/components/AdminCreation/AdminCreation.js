import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../../ApiServices/ApiServices"; // Adjust the path if necessary
import Loader from "react-js-loader";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "./AdminCreation.css";

const AdminCreation = () => {
  const [formData, setFormData] = useState({
    username: "",
    companyname: localStorage.getItem("company_name") || "",
    name: "",
    mobile: "",
    email: "",
    role:"Product Admin"
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    if (typeof e === "string") {
      // This means it's coming from PhoneInput
      setFormData((prevData) => ({
        ...prevData,
        mobile: e,  // Update mobile correctly
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiServices.register(formData);
      console.log("API Response:", response);
      setMessage("Admin registered successfully!");
      setTimeout(() => {
        navigate("/AdminList");  
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
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
    });
  };

  return (
    <div className="admincreation-container">
      <h2 className="admincreation-title">Admin Creation</h2>
      {message && (
        <div className={`admincreation-message px-4 py-2 rounded mb-4 ${
          message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}
        role="alert">
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
            className="admincreation-input"
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
          <div className="custom-phone-input">
          <PhoneInput
            type="tel"
            name="mobile"
            country={'ae'}
            value={formData.mobile}
            onChange={(value) => setFormData((prevData) => ({ 
              ...prevData, 
              mobile: value || "" // Ensure it updates under "mobile"
            }))}
            maxLength="16"
            className="admincreation-input"
            required
          />
          </div>
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

        {/* Button Group */}
        <div className="admincreation-button-group">
          <button type="submit" className="admincreation-btn-submit">
            Create
          </button>
          <button type="button" className="admincreation-btn-cancel"  onClick={handleCancel}>
            Cancel
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
