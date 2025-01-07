import React, { useState } from 'react';
import './EmployeeCreation.css';  // Importing the combined CSS for this component

const EmployeeCreation = () => {
  const [employee, setEmployee] = useState({
    userName: '',
    companyName: '',
    personName: '',
    mobile: '',
    email: '',
    role: '',
    status: 'Active', // New status condition added
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Employee Data:', employee);
    alert('Employee created successfully!');
    // Reset form
    setEmployee({
      userName: '',
      companyName: '',
      personName: '',
      mobile: '',
      email: '',
      role: '',
      status: 'Active', // Resetting new condition
    });
  };

  return (
    <div className="emp-creation-container">
      <div className="emp-inner-container">
        <h2 className="emp-creation-title">Create Employee</h2>
        <form onSubmit={handleSubmit} className="emp-creation-form">
          {/* User Name */}
          <div className="emp-creation-form-group">
            <label htmlFor="userName" className="emp-creation-label">
              User Name <span className="emp-creation-mandatory">*</span>
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={employee.userName}
              onChange={handleChange}
              className="emp-creation-input"
              required
            />
          </div>

          {/* Company Name */}
          <div className="emp-creation-form-group">
            <label htmlFor="companyName" className="emp-creation-label">
              Company Name <span className="emp-creation-mandatory">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={employee.companyName}
              onChange={handleChange}
              className="emp-creation-input"
              required
            />
          </div>

          {/* Person Name */}
          <div className="emp-creation-form-group">
            <label htmlFor="personName" className="emp-creation-label">
              Person Name <span className="emp-creation-mandatory">*</span>
            </label>
            <input
              type="text"
              id="personName"
              name="personName"
              value={employee.personName}
              onChange={handleChange}
              className="emp-creation-input"
              required
            />
          </div>

          {/* Mobile */}
          <div className="emp-creation-form-group">
            <label htmlFor="mobile" className="emp-creation-label">
              Mobile <span className="emp-creation-mandatory">*</span>
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={employee.mobile}
              onChange={handleChange}
              className="emp-creation-input"
              required
            />
          </div>

          {/* Email */}
          <div className="emp-creation-form-group">
            <label htmlFor="email" className="emp-creation-label">
              Mail ID <span className="emp-creation-mandatory">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              className="emp-creation-input"
              required
            />
          </div>

          {/* Role */}
          <div className="emp-creation-form-group">
            <label htmlFor="role" className="emp-creation-label">
              Role <span className="emp-creation-mandatory">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={employee.role}
              onChange={handleChange}
              className="emp-creation-input"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Compiler">Compiler</option>
              <option value="Reviewer">Reviewer</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div className="emp-creation-form-group emp-creation-form-group-btn">
            <button type="submit" className="emp-creation-submit-button">
              Create 
            </button>
            <button
              type="button"
              className="emp-creation-cancel-button"
              onClick={() => {
                // Handle the cancel action, such as clearing the form or redirecting
                setEmployee({
                  userName: '',
                  companyName: '',
                  personName: '',
                  mobile: '',
                  email: '',
                  role: '',
                  status: 'Active', // Resetting new condition
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreation;
