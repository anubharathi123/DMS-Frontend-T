import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AsideBar.css';
import Logo from '../../assets/images/company_logo.png';
import Dropdown from '../../assets/images/dropdown.png';
import Dropup from '../../assets/images/dropup.webp';

const AsideBar = () => {
  // Retrieve the user's role from localStorage (simulated here)
  localStorage.setItem("role", "Client Admin"); // This should be set based on the logged-in user
  const role = localStorage.getItem('role'); // Assuming role is stored in localStorage

  // State to track which dropdown is open (both main and inner dropdowns)
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Toggle function for both main and inner dropdowns
  const toggleDropdown = (dropdownName, isInner = false) => {
    setOpenDropdowns(prevState => {
      const newState = { ...prevState };
      if (isInner) {
        newState[dropdownName] = !prevState[dropdownName];
      } else {
        // Close inner dropdown when main dropdown is toggled
        newState[dropdownName] = !prevState[dropdownName];
        // Close all inner dropdowns when the main dropdown is closed
        Object.keys(prevState).forEach(key => {
          if (key !== dropdownName) newState[key] = false;
        });
      }
      return newState;
    });
  };

  // Render dropdown icon based on whether it's open or not
  const renderDropdownIcon = (dropdownName) => {
    return openDropdowns[dropdownName] ? (
      <img src={Dropup} alt="Drop Up" style={{ width: '25px', height: '25px', filter: 'hue-rotate(90deg)' }} />
    ) : (
      <img src={Dropdown} alt="Drop Down" style={{ width: '25px', height: '25px', filter: 'hue-rotate(90deg)' }} />
    );
  };

  return (
    <aside className="aside-bar">
      <div className="logo">
        <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer">
          <img
            src={Logo}
            alt="Company Logo"
            style={{
              width: '100px',
              marginTop: '-50px',
              height: 'auto',
              filter: 'drop-shadow(2px 1px 0 rgb(255, 255, 255)) drop-shadow(-1px -1px 0 rgb(255, 255, 255)) drop-shadow(1px 1px 1px rgb(255, 255, 255))',
            }}
          />
        </a>
      </div>
      <nav style={{ marginBottom: '14px' }}>
        <ul>
          {/* Profile Dropdown */}
          {(role === 'Product Owner' || role === 'Client Admin' || role === 'Compiler' || role === 'Approver' || role === 'Viewer') && (
            <li className={`dropdown ${openDropdowns.profile ? 'open' : ''}`}>
              <NavLink onClick={() => toggleDropdown('profile')} to="Profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p className='profiletab'>Profile</p>
                {renderDropdownIcon('profile')}
              </NavLink>
              {openDropdowns.profile && (
                <ul className="dropdown-menu">
                  <li>
                    <NavLink style={{ marginLeft: "13px", width: "170px" }} to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Profile Management
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Dashboard Dropdown */}
          {(role === 'Product Owner' || role === 'Client Admin') && (
            <li className={`dropdown ${openDropdowns.dashboard ? 'open' : ''}`}>
              <NavLink onClick={() => toggleDropdown('dashboard')} to="Dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p style={{ marginLeft: "15px" }}>Dashboard</p>
                {renderDropdownIcon('dashboard')}
              </NavLink>
              {openDropdowns.dashboard && (
                <ul className="dropdown-menu">
                  <li>
                    <NavLink style={{ marginLeft: "18px", width: "170px" }} to="/audit-log" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Audit Log
                    </NavLink>
                  </li>
                  <li>
                    <NavLink style={{ marginLeft: "18px" }} onClick={() => toggleDropdown('document', true)} to="#" className={({ isActive }) => ''}>
                      Document {renderDropdownIcon('document')}
                    </NavLink>
                    {openDropdowns.document && (
                      <ul className="dropdown-menu">
                        <li>
                          <NavLink style={{ marginLeft: "18px", width: "170px" }} to="/document-creation" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Document Creation
                          </NavLink>
                        </li>
                        <li>
                          <NavLink onClick={() => toggleDropdown('DocumentList')} style={{ marginLeft: "18px", width: "170px" }} to="DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Document List
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>

                  <li className={`dropdown ${openDropdowns.announcement ? 'open' : ''}`}>
                    <NavLink style={{ marginLeft: "18px" }} onClick={() => toggleDropdown('announcement', true)} to="#" className={({ isActive }) => ''}>
                      Announcement {renderDropdownIcon('announcement')}
                    </NavLink>
                    {openDropdowns.announcement && (
                      <ul className="dropdown-menu">
                        <li>
                          <NavLink style={{ marginLeft: "18px", width: "190px" }} to="/announcement-creation" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Announcement Creation
                          </NavLink>
                        </li>
                        <li>
                          <NavLink style={{ marginLeft: "18px", width: "180px" }} to="/announcement-list" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Announcement List
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Create Admin Dropdown */}
          {(role === 'Product Owner') && (
            <li className={`dropdown ${openDropdowns['create-admin'] ? 'open' : ''}`}>
              <NavLink onClick={() => toggleDropdown('create-admin')} to="create admin" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p style={{ marginLeft: "15px" }}>Create Admin</p>
                {renderDropdownIcon('create-admin')}
              </NavLink>
              {openDropdowns['create-admin'] && (
                <ul className="dropdown-menu">
                  <li>
                    <NavLink style={{ marginLeft: "20px", width: "160px" }} to="/admin-list" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Admin List
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Organization Dropdown */}
          {(role === 'Product Owner' || role === '#') && (
            <li className={`dropdown ${openDropdowns.CompanyCreation ? 'open' : ''}`}>
              <NavLink
                onClick={() => toggleDropdown('CompanyCreation')}
                to="CompanyCreation"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <p style={{ marginLeft: '15px' }}>Organization</p>
                {renderDropdownIcon('CompanyCreation')}
              </NavLink>
              {openDropdowns.CompanyCreation && (
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      style={{ marginLeft: '20px', width: '160px' }}
                      to="/organization-list"
                      className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                      Organization List
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Document Upload Dropdown */}
          {(role === 'Compiler' || role === '#') && (
            <li className={`dropdown ${openDropdowns['UploadDocument'] ? 'open' : ''}`}>
              <NavLink onClick={() => toggleDropdown('UploadDocument')} to="UploadDocument" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p style={{ marginLeft: "15px" }}>Document upload</p>
                {renderDropdownIcon('UploadDocument')}
              </NavLink>
              {openDropdowns['UploadDocument'] && (
                <ul className="dropdown-menu">
                  <li className={`dropdown ${openDropdowns['DocumentList'] ? 'open' : ''}`}>
                    <NavLink onClick={() => toggleDropdown('DocumentList')} style={{ marginLeft: "20px", width: "160px" }} to="DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Document List
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Other Menu Items */}
          {(role === '#' || role === 'Client Admin') && (
            <li>
              <NavLink to="/EmployeeCreation" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p style={{ marginLeft: "15px" }}>Create User</p>
              </NavLink>
            </li>
          )}
          {(role === 'Viewer' || role === 'Client Admin') && (
            <li className={`dropdown ${openDropdowns['DocumentList'] ? 'open' : ''}`}>
              <NavLink onClick={() => toggleDropdown('DocumentList')} to="DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p style={{ marginLeft: "15px" }}>Document View</p>
              </NavLink>
            </li>
          )}
          {(role === 'Approver' || role === '#') && (
            <li className={`dropdown ${openDropdowns.VerifyDoc ? 'open' : ''}`}>
              <NavLink
                onClick={() => toggleDropdown('VerifyDoc')}
                to="/VerifyDoc"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <p style={{ marginLeft: "15px" }}>Verify Document</p>
                {renderDropdownIcon('VerifyDoc')}
              </NavLink>
              {openDropdowns.VerifyDoc && (
                <ul className="dropdown-menu">
                  <li className={`dropdown ${openDropdowns['DocumentList'] ? 'open' : ''}`}>
                    <NavLink
                      onClick={() => toggleDropdown('DocumentList')}
                      style={{ marginLeft: "20px", width: "160px" }}
                      to="DocumentList"
                      className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                      Document List
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Settings - Moved to the last */}
          {(role === 'Product Owner' || role === 'Client Admin') && (
            <li>
              <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p style={{ marginLeft: "15px" }}>Settings</p>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default AsideBar;
