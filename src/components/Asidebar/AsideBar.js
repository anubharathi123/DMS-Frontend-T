import React, { useState, useEffect  } from 'react';
import { NavLink } from 'react-router-dom';
import './AsideBar.css';
import Logo from '../../assets/images/company_logo.png';
import Dropdown from '../../assets/images/dropdown.png';
import authService from '../../ApiServices/ApiServices';
import Dropup from '../../assets/images/dropup.webp';

const AsideBar = () => {
  const [role, setRole] = useState('ADMIN')

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details_data = await authService.details();
        console.log('details_data:', details_data);
        // const fetchedName = details_data.details[5].name;
        // const fetchedRole = details_data.details[5].name;
        // localStorage.setItem('name', details_data.details[1].first_name);
        localStorage.setItem('email', (details_data.details[1].email || details_data.details[5].email));
        // console.log('fetchedName:', fetchedName);
        // console.log(fetchedRole)

        // setName(fetchedName);
        // setRole(fetchedRole);
        // localStorage.setItem('role', fetchedRole);
        // localStorage.setItem('Company_name', details_data.details[7].company_name);
        if (details_data.type === "User") {
          console.log('user')
          const name = details_data.details[1].first_name 
          console.log(name)
          localStorage.setItem('name', name);
          const fetchedRole = details_data.details[5].name
          console.log(fetchedRole)
          localStorage.setItem('role', fetchedRole);
          setRole(fetchedRole);
        }
        // eslint-disable-next-line no-cond-assign
        if (details_data.type === "Organization") {
          console.log('Org')
          const name = details_data.details[5].first_name
          console.log(name)
          localStorage.setItem('name', name);
          const fetchedRole = details_data.details[3].name
          localStorage.setItem('Company_name', name);
          // console.log(fetchedRole)
          if (fetchedRole === 'ADMIN'){
            localStorage.setItem('role', fetchedRole);
            setRole(fetchedRole);
          }
          if (fetchedRole === 'Organization Admin'){
            localStorage.setItem('role', 'ADMIN');
            setRole('ADMIN');
          }
          // localStorage.setItem('role', role);
          
          // console.log("role : ",fetchedRole)
        }
    
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, []);

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
              marginTop: '-30px',
              marginBottom: '30px',
              height: 'auto',
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
        <p className="profiletab asidebar_p_tag">Profile</p>
      </NavLink>
      {role !== 'UPLOADER' && role !== 'REVIEWER' && role !== 'VIEWER' &&  (
      <button onClick={() => toggleDropdown('profile')} className="dropdown-toggle1">
        {renderDropdownIcon('profile')}
      </button>
      )}
      
      {openDropdowns.profile && (
        <ul className="dropdown-menu1">
          {role !== 'UPLOADER' && (
          <li>
            <NavLink to="/profilemanagement" className={({ isActive }) => (isActive ? 'active' : '')}>
            <p className="asidebar_p_tag">Profile Management</p>
            </NavLink>
          </li>
          )}
        </ul>
      )}
    </li>
  )}

  {/* Dashboard Dropdown */}
 {/* Dashboard Dropdown */}
{(role === 'PRODUCT_OWNER' || role === 'ADMIN' || role === 'UPLOADER' || role === 'REVIEWER' || role === 'VIEWER') && (
  <li className={`dropdown ${openDropdowns.dashboard ? 'open' : ''}`}>
    <NavLink to="/Dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
      <p className="asidebar_p_tag">Dashboard</p>
    </NavLink>

    {/* Only show toggle button if role allows submenu items */}
    {(role === 'PRODUCT_OWNER' || role === 'ADMIN') && (
      <button onClick={() => toggleDropdown('dashboard')} className="dropdown-toggle1">
        {renderDropdownIcon('dashboard')}
      </button>
    )}

    {openDropdowns.dashboard && (role === 'PRODUCT_OWNER' || role === 'ADMIN') && (
      <ul className="dropdown-menu1">
        <li>
          <NavLink to="/audit-log" className={({ isActive }) => (isActive ? 'active' : '')}>
            <p className="asidebar_p_tag">Audit Log</p>
          </NavLink>
        </li>

          <li>
            <NavLink to="/Document" className={({ isActive }) => (isActive ? 'active' : '')}>
              <p className="asidebar_p_tag">Document</p>
            </NavLink>
            <button onClick={() => toggleDropdown('document', true)} className="dropdown-toggle1">
              {renderDropdownIcon('document')}
            </button>
            {openDropdowns.document && (role == 'PRODUCT_OWNER'|| role === 'ADMIN') && (
              <ul className="dropdown-menu1">
                <li>
                  <NavLink to="/DocumentCreation" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <p className="asidebar_p_tag">Document Creation</p>
                  </NavLink>
                </li>
                {(role !=='ADMIN'||role == 'PRODUCT_OWNER') && (
                <><li>
                            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                              <p className="asidebar_p_tag">Contract Document</p>
                            </NavLink>
                          </li><li>
                              <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
                                <p className="asidebar_p_tag">Document List</p>
                              </NavLink>
                            </li></>
                )}
                {(role !== 'PRODUCT_OWNER'||role == 'ADMIN') && (
                <li>
                  <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <p className="asidebar_p_tag">Document View </p>
                  </NavLink>
                </li>
                )}
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/Announcement" className={({ isActive }) => (isActive ? 'active' : '')}>
              <p className="asidebar_p_tag">Announcement</p>
            </NavLink>
            <button onClick={() => toggleDropdown('announcement', true)} className="dropdown-toggle1">
              {renderDropdownIcon('announcement')}
            </button>
            {openDropdowns.announcement && (
              <ul className="dropdown-menu1">
                <li>
                  <NavLink to="/announcement-creation" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <p className="asidebar_p_tag" style={{'height':'30px'}}>Announcement Creation</p>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/announcement-list" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <p className="asidebar_p_tag">Announcement List</p>
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
      <NavLink to="/AdminCreation" className={({ isActive }) => (isActive ? 'active' : '')}>
        <p className="asidebar_p_tag">Create Admin</p>
      </NavLink>
      <button onClick={() => toggleDropdown('create-admin')} className="dropdown-toggle1">
        {renderDropdownIcon('create-admin')}
      </button>
      {openDropdowns['create-admin'] && (
        <ul className="dropdown-menu1">
          <li>
            <NavLink to="/AdminList" className={({ isActive }) => (isActive ? 'active' : '')}>
            <p className="asidebar_p_tag">Admin List</p>
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
        <p className="asidebar_p_tag">Organization</p>
      </NavLink>
      <button onClick={() => toggleDropdown('organization')} className="dropdown-toggle1">
        {renderDropdownIcon('organization')}
      </button>
      {openDropdowns['organization'] && (
        <ul className="dropdown-menu1">
          <li>
            <NavLink to="/OrganizationList" className={({ isActive }) => (isActive ? 'active' : '')}>
            <p className="asidebar_p_tag">Organization List</p>
            </NavLink>
          </li>
        </ul>
      )}
    </li>
  )}

  {/* Document Upload Dropdown */}
  {(role === 'UPLOADER' || role === '#') && (
    <li className={`dropdown ${openDropdowns['UploadDocument'] ? 'open' : ''}`}>
      <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
        <p className="asidebar_p_tag">Document Upload</p>
      </NavLink>
      <button onClick={() => toggleDropdown('uploaddocument')} className="dropdown-toggle1">
        {renderDropdownIcon('uploaddocument')}
      </button>
      {openDropdowns.uploaddocument && (
        <ul className="dropdown-menu1">
          <li>
            <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
            <p className="asidebar_p_tag">Document List</p>
            </NavLink>
          </li>
        </ul>
      )}
    </li>
  )}

  {/* Create User */}
  {(role === '#' || role === 'ADMIN') && (
    <li>
      <NavLink to="/createuser" className={({ isActive }) => (isActive ? 'active' : '')}>
        <p className="asidebar_p_tag">Create User</p>
      </NavLink>
    </li>
  )}

  {/* Document View */}
  {(role === 'VIEWER' || role === 'ADMIN') && (
    
    <li>
      <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
        <p className="asidebar_p_tag">Document List</p>
      </NavLink>
    </li>
  )}

  {/* Verify Document */}
  {(role === 'REVIEWER' || role === '#') && (
    <li className={`dropdown ${openDropdowns['verifydocument'] ? 'open' : ''}`}>
    <NavLink to="/verifydocument" className={({ isActive }) => (isActive ? 'active' : '')}>
      <p className="asidebar_p_tag">Verify Document</p>
    </NavLink>
    <button onClick={() => toggleDropdown('verifydocument')} className="dropdown-toggle1">
      {renderDropdownIcon('verifydocument')}
    </button>
    {openDropdowns['verifydocument'] && (
      <ul className="dropdown-menu1">
        <li>
          <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? 'active' : '')}>
          <p className="asidebar_p_tag">Document List</p>
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
        <p className="asidebar_p_tag" >Settings</p>
      </NavLink>
    </li>
  )}
</ul>

      </nav>
    </aside>
  );
};

export default AsideBar;