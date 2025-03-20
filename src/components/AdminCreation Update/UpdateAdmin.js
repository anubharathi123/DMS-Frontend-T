import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiServices from "../../ApiServices/ApiServices";
import Loader from "react-js-loader";
import "./UpdateAdmin.css";

const UpdateAdmin = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  
  const [selectedadmin, setselectedAdmin] = useState(null);
  const [message, setMessage] = useState("");
  // const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setIsLoading(true);
        console.log("Fetch Admin ID:", id);
        const response = await apiServices.getAdminsbyID(id);
        console.log("API Response:", response.details);

        if (response && response.details) {
          const admin = response.details;

          // Ensure correct indexing and data mapping
          const formattedDate = admin[3]?.created_at
            ? new Date(admin[3].created_at).toISOString().split('T')[0]
            : '';

          const admins = {
            id: admin[1].id,
            username: admin[1].username,
            first_name: admin[1].first_name,
            mobile: admin[3].mobile,
            email: admin[1].email,
            created_at: formattedDate,  // Ensure proper formatting
            company_name: admin[3].organization.company_name,
          };

          setselectedAdmin(admins);
          console.log("Processed Admin Data:", admins);
        } else {
          console.log("No admin data found");
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAdmins();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setselectedAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/AdminList");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setselectedAdmin((prev) => ({ ...prev, [name]: value }));
    // setIsChanged(true); // Mark as changed
  };
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    // if (!isChanged) return; // Prevent update if no changes
  
    setIsLoading(true);
    try {
      const response = await apiServices.updateAdmin(id,selectedadmin);
      console.log("API Response:", response);
      setMessage("Admin details have been updated successfully!");
      setTimeout(() => {
        alert("Admin details have been updated successfully!"); // Show alert
        navigate("/AdminList");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error("Error updating admin:", errorMessage);
      setMessage(`Error: ${errorMessage}`);
      
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admincreation-container">
      <h2 className="admincreation-title">Update Admin</h2>
      {message && (
        <div className={`admincreation-message px-4 py-2 rounded mb-4 ${
          message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`} role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleUpdate}>
        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Username <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={selectedadmin?.username || ""}
            onChange={handleInputChange}
            className="admincreation-input"
            required
            disabled
          />
        </div>

        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Company Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={selectedadmin?.company_name || ""}
            className="admincreation-input"
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Person Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={selectedadmin?.first_name || ""}
            onChange={handleChange}
            className="admincreation-input"
            required
          />
        </div>

        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Mobile <span className="mandatory">*</span>
          </label>
          <input
            type="tel"
            name="mobile"
            value={selectedadmin?.mobile || ""}
            onChange={handleChange}
            className="admincreation-input"
            required
          />
        </div>

        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Mail ID <span className="mandatory">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={selectedadmin?.email || ""}
            onChange={handleChange}
            className="admincreation-input"
            required
          />
        </div>

        {/* Fixed Admin Creation Date Input */}
        <div className="admincreation-form-group">
          <label className="admincreation-label">
            Admin Creation Date <span className="mandatory">*</span>
          </label>
          <input
            type="date"
            name="created_at"
            value={selectedadmin?.created_at || ""}
            onChange={handleChange}
            className="admincreation-input"
            required
            disabled
          />
        </div>

        <div className="admincreation-button-group">
          <button type="submit" className="admincreation-btn-submit" onClick={handleUpdate}>
            Update
          </button>
          <button type="button" className="admincreation-btn-cancel" onClick={handleCancel}>
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

export default UpdateAdmin;
