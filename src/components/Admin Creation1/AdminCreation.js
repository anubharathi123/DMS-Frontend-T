import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, MenuItem, Box, Button, CircularProgress } from "@mui/material";
import apiServices from "../../ApiServices/ApiServices"; // Adjust the path as necessary
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
    created_at: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      username: `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}`,
      companyname: localStorage.getItem("company_name"),
      name: `${formData.firstName} ${formData.lastName}`,
      mobile: `${formData.countryCode} ${formData.contactNumber}`,
      email: formData.email,
      created_at: formData.created_at,
      role: "Product Admin",
    };

    try {
      await apiServices.register(payload);
      setMessage("Admin created successfully!");
      setTimeout(() => navigate("/AdminList"), 2000);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/AdminList");
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Creation</h2>
      {message && <div className="message" role="alert">{message}</div>}
      <form onSubmit={handleSubmit}>
        <Box display="flex" gap={2}>
          <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required fullWidth variant="outlined" size="small" />
          <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required fullWidth variant="outlined" size="small" />
        </Box>

        <TextField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required fullWidth variant="outlined" margin="normal" size="small" />

        <TextField label="Company Name" name="CompanyName" value={localStorage.getItem("company_name") || "VDart"} InputProps={{ readOnly: true }} fullWidth variant="outlined" margin="normal" size="small" />

        <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required fullWidth variant="outlined" margin="normal" size="small" />

        <TextField label="Country" name="Country" value={formData.Country} onChange={handleChange} required fullWidth variant="outlined" margin="normal" size="small" sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
          <TextField select label="Country Code" name="countryCode" value={formData.countryCode} onChange={handleChange} variant="outlined" sx={{ width: "120px" }} size="small">
            <MenuItem value="+1">+1 </MenuItem>
            <MenuItem value="+91">+91 </MenuItem>
            <MenuItem value="+44">+44 </MenuItem>
          </TextField>
          <TextField label="Contact Number" type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required fullWidth variant="outlined" size="small" />
        </Box>

        <TextField label="Admin Creation Date" type="date" name="created_at" value={formData.created_at} onChange={handleChange} required fullWidth variant="outlined" margin="normal" InputLabelProps={{ shrink: true }} size="small" />

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Create"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default AdminCreation;
