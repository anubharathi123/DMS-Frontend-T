import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AsideBar.css';
import Logo from '../../assets/images/company_logo.png';
import Dropdown from '../../assets/images/dropdown.png';
import Dropup from '../../assets/images/dropup.webp';

const AsideBar = () => {
  // Retrieve the user's role from localStorage (simulated here)

  localStorage.setItem("role", "PRODUCT_OWNER"); // This should be set based on the logged-in user
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
      <img src={Dropup} alt="Drop Up" style={{ width: '25px', height: '25px', filter: 'invert(1)' }} />
    ) : (
      <img src={Dropdown} alt="Drop Down" style={{ width: '25px', height: '25px', filter: 'invert(1)'}} />
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
          {(role === 'PRODUCT_OWNER' || role === 'ADMIN' || role === 'UPLOADER' || role === 'REVIEWER' || role === 'VIEWER') && (
            <li className={`dropdown ${openDropdowns.profile ? 'open' : ''}`}>
              <NavLink to="/Profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p className="profiletab">Profile</p>
              </NavLink>
              <button onClick={() => toggleDropdown('profile')} className="dropdown-toggle">
                {renderDropdownIcon('profile')}
              </button>
              
              {openDropdowns.profile && (
                <ul className="dropdown-menu">
                  {/* {(role === 'Product Owner' || role === 'Client Admin') && ( */}
                  <li>
                    <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Profile Management
                    </NavLink>
                  </li>
                  )} 

                </ul>
              )}
            </li>
          )}

          {/* Dashboard Dropdown */}
          {(role === 'PRODUCT_OWNER' || role === 'ADMIN') && (
            <li className={`dropdown ${openDropdowns.dashboard ? 'open' : ''}`}>
              
              <NavLink to="/Dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p style={{ marginLeft: '0px' }}>Dashboard</p>
              </NavLink>
              <button onClick={() => toggleDropdown('dashboard')} className="dropdown-toggle">
                {renderDropdownIcon('dashboard')}
              </button>
              {openDropdowns.dashboard && (
                  
                <ul className="dropdown-menu1">
                  <li>
                    <NavLink to="/audit-log" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Audit Log
                    </NavLink>
                  </li>
                  
                  <li>
                    <NavLink to="/Document" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Document 
                    </NavLink>
                    <button onClick={() => toggleDropdown('document',true)} className="dropdown-toggle">
                {renderDropdownIcon('document')}
                </button>
                  
                    {openDropdowns.document && (
                      <ul className="dropdown-menu1">
                        <li>
                          <NavLink to="/document-creation" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Document Creation
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Document List
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <NavLink to="/Announcement" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Announcement 
                    </NavLink>
                    <button onClick={() => toggleDropdown('announcement',true)} className="dropdown-toggle">
                {renderDropdownIcon('announcement')}
                </button>

                    {openDropdowns.announcement && (
                      <ul className="dropdown-menu1">
                        <li>
                          <NavLink to="/announcement-creation" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Announcement Creation
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="/announcement-list" className={({ isActive }) => (isActive ? 'active' : '')}>
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
          {role === 'PRODUCT_OWNER' && (

            <li className={`dropdown ${openDropdowns['create-admin'] ? 'open' : ''}`}>
              <NavLink to="EmployeeCreation"className={({ isActive }) => (isActive ? 'active' : '')}>
                <p>Create Admin</p>
              </NavLink>
              <button onClick={() => toggleDropdown('create-admin')} className="dropdown-toggle">
                {renderDropdownIcon('create-admin')}
              </button>
              {openDropdowns['create-admin'] && (
                <ul className="dropdown-menu1">
                  <li>
                    <NavLink to="/admin-list" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Admin List
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Organization Dropdown */}
          {(role === 'PRODUCT_OWNER' || role === '#') && (

            <li className={`dropdown ${openDropdowns['organization'] ? 'open' : ''}`}>
              <NavLink to="/CompanyCreation" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p>Organization</p>
              </NavLink>
              <button onClick={() => toggleDropdown('organization')} className="dropdown-toggle">
                {renderDropdownIcon('organization')}
              </button>
              {openDropdowns['organization'] && (
                <ul className="dropdown-menu1">
                  <li>
                    <NavLink to="/organization-list" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Organization List
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Document Upload Dropdown */}
          {(role === 'UPLOADER' || role === '#') && (

            <li className={`dropdown ${openDropdowns['UploadDocument'] ? 'open' : ''}`}>
              <NavLink to="/uploaddocument" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p>Document Upload</p>
              </NavLink>
              <button onClick={() => toggleDropdown('uploaddocument')} className="dropdown-toggle">
              {renderDropdownIcon('uploaddocument')}
              </button>
              {openDropdowns.uploaddocument && (
                <ul className="dropdown-menu1">
                  <li>
                    <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Document List
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Create User */}
          {(role === '#' || role === 'ADMIN') && (
            <li>
              <NavLink to="/EmployeeCreation" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p >Create User</p>
              </NavLink>
            </li>
          )}

          {/* Document View */}
          {(role === 'VIEWER' || role === 'ADMIN') && (
            <li>
              <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p >Document View</p>
              </NavLink>
            </li>
          )}

          {/* Verify Document */}
          {(role === 'REVIEWER' || role === '#') && (

            <li className={`dropdown ${openDropdowns['verifydocument'] ? 'open' : ''}`}>
              <NavLink to="/verifydocument" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p>Verify Document</p>
              </NavLink>
              {openDropdowns.VerifyDoc && (
                <ul className="dropdown-menu1">
                  <li>
                    <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
                      Document List
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Settings */}
          {(role === 'PRODUCT_OWNER' || role === 'ADMIN') && (
            <li>
              <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
                <p style={{ marginLeft: '0px' }}>Settings</p>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default AsideBar;
