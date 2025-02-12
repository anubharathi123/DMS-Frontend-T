import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiServices from "../../ApiServices/ApiServices"; // Adjust the path as necessary
import Loader from "react-js-loader";
import "./AdminCreation.css";

const AdminCreation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNumber: "",
    countryCode: "+1",
    created_at: "", // Added date field
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare the payload for the API
    const payload = {
      username: `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}`,
      companyname: localStorage.getItem("company_name") || "VDart",
      name: `${formData.firstName} ${formData.lastName}`,
      mobile: `${formData.countryCode} ${formData.contactNumber}`,
      email: formData.email,
      created_at: formData.created_at,
      role: "Product Admin",
    };

    try {
      const response = await apiServices.register(payload);
      console.log("API Response:", response);
      setMessage("Admin created successfully!");
      setTimeout(() => {
        navigate("/AdminList");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error("Error creating admin:", errorMessage);
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
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      contactNumber: "",
      countryCode: "+1",
      created_at: "",
    });
    navigate("/AdminList"); // Navigate immediately on cancel
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Creation</h2>
      {message && (
        <div className="message" role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          {/* Last Name */}
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group wide-input">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Company Name */}
        <div className="form-group wide-input">
          <label>Company Name</label>
          <input
            type="text"
            name="CompanyName"
            value={localStorage.getItem("company_name") || "VDart"}
            readOnly
          />
        </div>

        {/* Address */}
        <div className="form-group wide-input">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Country */}
        <div className="form-group wide-input">
          <label>Country</label>
          <input
            type="text"
            name="Country"
            value={formData.Country}
            onChange={handleChange}
            required
          />
        </div>

        {/* Country Code and Contact */}
        <div className="form-row">
          {/* Country Code */}
          <div className="form-group country">
            <label>Country Code</label>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
            >
              <option value="+1">+1 (USA)</option>
              <option value="+91">+91 (India)</option>
              <option value="+44">+44 (UK)</option>
            </select>
          </div>
          {/* Contact Number */}
          <div className="form-group contact">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Admin Creation Date */}
        <div className="form-group wide-input">
          <label>Admin Creation Date</label>
          <input
            type="date"
            name="created_at"
            value={formData.created_at}
            onChange={handleChange}
            required
          />
        </div>

        {/* Button Group */}
        <div className="form-button-group">
        <button
            type="submit"
            className="save-btn1"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
          
        </div>
      </form>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <Loader type="box-up" bgColor="#000b58" color="#000b58" size={100} />
        </div>
      )}
    </div>
  );
};

export default AdminCreation;