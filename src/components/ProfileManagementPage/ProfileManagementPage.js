import React, { useState } from 'react';
import './ProfileManagementPage.css';
import { BiMobile } from 'react-icons/bi';

const ProfileManagementPage = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    UserName: '',
    PersonName: '',
    MailID: '',
    Mobile: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="col-xl-7 mx-auto">
      {/* Profile Picture */}
      <div className="card shadow border-0 mt-4 mb-10">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div>
              <div className="d-flex align-items-center">
                <a href="#" className="avatar avatar-lg bg-warning rounded-circle text-white">
                  <img
                    alt="Profile"
                    src="https://images.unsplash.com/photo-1579463148228-138296ac3b98?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
                  />
                </a>
                <div className="ms-4">
                  <span className="h4 d-block mb-0">Julianne Moore</span>
                  <a href="#" className="text-sm font-semibold text-muted">View Profile</a>
                </div>
              </div>
            </div>
            <div className="ms-auto">
              <button type="button" className="btn btn-sm btn-neutral">Upload</button>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Information Form */}
     
      <form className="mb-6" onSubmit={handleSubmit}>
        <div className="row mb-5">
          <div className="col-md-6">
            <label className="form-label" htmlFor="firstName">Username</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="lastName">Person Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row g-5">
          <div className="col-md-6">
            <label className="form-label" htmlFor="email">Mail ID</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="phoneNumber">Mobile</label>
            <input
              type="tel"
              className="form-control"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        <div className="text-end">
          <button type="button" className="btn btn-sm btn-neutral me-2">Cancel</button>
          <button type="submit" className="btn btn-sm btn-primary">Save</button>
        </div>
        </div>
      </form>
      <hr className="my-10" />
      {/* Individual Switch Cards */}
      <div className="row g-6">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h5 className="mb-2">Public profile</h5>
              <p className="text-sm text-muted mb-6">
                Making your profile public means that anyone on the network will be able to find you.
              </p>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="publicProfile"
                  checked={formData.publicProfile}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h5 className="mb-2">Show my email</h5>
              <p className="text-sm text-muted mb-6">
                Showing your email address means that anyone on the network will be able to find you.
              </p>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showEmail"
                  checked={formData.showEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card shadow border-0">
            <div className="card-body d-flex align-items-center">
              <div>
                <h5 className="text-danger mb-2">Deactivate account</h5>
                <p className="text-sm text-muted">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <div className="ms-auto">
                <button type="button" className="btn btn-sm btn-danger">Deactivate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagementPage;
