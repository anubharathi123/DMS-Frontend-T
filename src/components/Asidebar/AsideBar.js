import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  User, Building2, UserPlus, FileCheck2, FileText, Upload, 
  ChartNoAxesCombined, FileQuestion, Menu, ChevronDown, ChevronRight 
} from "lucide-react";
import "./AsideBar.css";
import Logo from "../../assets/images/Logo.png";
import authService from "../../ApiServices/ApiServices";

const ROLES = {
  ADMIN: "ADMIN",
  PRODUCT_ADMIN: "PRODUCT_ADMIN",
  VIEWER: "VIEWER",
  PRODUCT_OWNER: "PRODUCT_OWNER",
  UPLOADER: "UPLOADER",
  REVIEWER: "REVIEWER"
};

// OrganizationDropdown component
const OrganizationDropdown = ({ isOpen }) => {
  const navigate = useNavigate();
  
  return (
    <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
      <ul>
        <li>
          <NavLink to="/OrganizationList" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="dropdown-icon"></span> Organization List
          </NavLink>
        </li>
        <li>
          <NavLink to="/CompanyCreation" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="dropdown-icon">
              </span> Create Organization
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/OrganizationDeleteList" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => navigate('/OrganizationDeleteList', { state: { statusFilter: 'deleted' } })}
          >
            <span className="dropdown-icon"></span> Deleted List
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/MsiPending" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => navigate('/MsiPending', { state: { statusFilter: 'msi-approval' } })}
          >
            <span className="dropdown-icon"></span> Pending Approval
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

// AdminDropdown component
const AdminDropdown = ({ isOpen }) => {
  const navigate = useNavigate();
  
  return (
    <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
      <ul>
        <li>
          <NavLink to="/AdminList" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="dropdown-icon"></span> Main Admin
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminCreation" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="dropdown-icon"></span> New Admin
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/DeletedAdminList" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => navigate('/DeletedAdminList', { state: { statusFilter: 'delete' } })}
          >
            <span className="dropdown-icon"></span> Deleted list
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

// UserDropdown component
const UserDropdown = ({ isOpen }) => {
  return (
    <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
      <ul>
        <li>
          <NavLink to="/user-list" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="dropdown-icon"></span> Main User
          </NavLink>
        </li>
        <li>
          <NavLink to="/createuser" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="dropdown-icon"></span> New User
          </NavLink>
        </li>
        <li>
          <NavLink to="/deletedusers" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="dropdown-icon"></span> Deleted User
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

// DocumentDropdown component
const DocumentDropdown = ({ isOpen }) => {
  return (
    <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
      <ul>
        <li>
          <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="dropdown-icon"></span> All Documents
          </NavLink>
        </li>
       
      </ul>
    </div>
  );
};

const AsideBar = () => {
  const [role, setRole] = useState(ROLES.VIEWER);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    org: false,
    admin: false,
    user: false,
    docs: false
  });
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const navigate = useNavigate();
    const toggleDropdown = (dropdown) => {
  if (dropdown === "org") {
    // Navigate to New Organization page
    navigate("/OrganizationList");
  } else if (dropdown === "admin") {
    // Navigate to Main Admin page
    navigate("/AdminList");
  } else if (dropdown === "user") {
    // Navigate to Main User page
    navigate("/user-list");
  } else if (dropdown === "docs") {
    // Navigate to All Documents page
    navigate("/DocumentList");
  }
  setDropdowns(prev => ({
    ...prev,
    [dropdown]: !prev[dropdown]
  }));
};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details_data = await authService.details();
        localStorage.setItem(
          "email",
          details_data.details[1]?.email || details_data.details[5]?.email
        );

        if (details_data.type === "User") {
          const name = details_data.details[1]?.first_name;
          localStorage.setItem("name", name);
          const company_name = details_data.details[7]?.company_name;
          localStorage.setItem("company_name", company_name);

          const fetchedRole = details_data.details[5]?.name || ROLES.VIEWER;
          localStorage.setItem("role", fetchedRole);
          setRole(fetchedRole);
        }

        if (details_data.type === "Organization") {
          const name = details_data.details[5]?.first_name;
          localStorage.setItem("name", name);
          const Company_name = details_data.details[1]?.company_name;
          localStorage.setItem("company_name", Company_name);
          const fetchedRole = details_data.details[3]?.name;

          if (fetchedRole === "ADMIN") {
            localStorage.setItem("role", fetchedRole);
            setRole(fetchedRole);
          }
          if (fetchedRole === "Organization Admin") {
            localStorage.setItem("role", ROLES.ADMIN);
            setRole(ROLES.ADMIN);
          }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, []);

  const hasDashboardAccess = [
    ROLES.PRODUCT_ADMIN, 
    ROLES.VIEWER, 
    ROLES.PRODUCT_OWNER, 
    ROLES.ADMIN, 
    ROLES.UPLOADER, 
    ROLES.REVIEWER
  ].includes(role);

  const hasOrgAccess = [ROLES.PRODUCT_ADMIN, ROLES.PRODUCT_OWNER].includes(role);
  const hasUserAccess = role === ROLES.ADMIN;
  const hasAdminAccess = role === ROLES.PRODUCT_OWNER;
  const hasDocsAccess = [ROLES.VIEWER, ROLES.ADMIN, ROLES.UPLOADER, ROLES.REVIEWER].includes(role);

  return (
    <>
      {!sidebarOpen && (
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu color="white" size={28} />
        </button>
      )}

      <aside ref={sidebarRef} className={`aside-bar ${sidebarOpen ? 'open' : 'closed'}`}>
  <div className="sidebar-header">
    <img src={Logo} alt="Company Logo" className="logo-img" />
    <button className="close-btn" onClick={toggleSidebar}>🡐</button>
  </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {hasDashboardAccess && (
              <>
                <li className="nav-item">
                  <NavLink to="/Profile" className={({ isActive }) => (isActive ? "active" : "")}>
                    <User className="nav-icon" size={18} />
                    <span className="nav-text">Profile</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/Dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                    <ChartNoAxesCombined className="nav-icon" size={18} />
                    <span className="nav-text">Dashboard</span>
                  </NavLink>
                </li>
              </>
            )}

            {hasOrgAccess && (
              <li className="nav-item dropdown">
                <div 
                  className="dropdown-header" 
                  onClick={() => toggleDropdown("org")}
                >
                  <Building2 className="nav-icon" size={18} />
                  <span className="nav-text">Organization</span>
                  {dropdowns.org ? (
                    <ChevronDown className="dropdown-arrow" size={16} />
                  ) : (
                    <ChevronRight className="dropdown-arrow" size={16} />
                  )}
                </div>
                <OrganizationDropdown isOpen={dropdowns.org} />
              </li>
            )}

            {hasUserAccess && (
              <li className="nav-item dropdown">
                <div 
                  className="dropdown-header" 
                  onClick={() => toggleDropdown("user")}
                >
                  <Building2 className="nav-icon" size={18} />
                  <span className="nav-text">User</span>
                  {dropdowns.user ? (
                    <ChevronDown className="dropdown-arrow" size={16} />
                  ) : (
                    <ChevronRight className="dropdown-arrow" size={16} />
                  )}
                </div>
                <UserDropdown isOpen={dropdowns.user} />
              </li>
            )}

            {hasAdminAccess && (
              <li className="nav-item dropdown">
                <div 
                  className="dropdown-header" 
                  onClick={() => toggleDropdown("admin")}
                >
                  <UserPlus className="nav-icon" size={18} />
                  <span className="nav-text">Admin</span>
                  {dropdowns.admin ? (
                    <ChevronDown className="dropdown-arrow" size={16} />
                  ) : (
                    <ChevronRight className="dropdown-arrow" size={16} />
                  )}
                </div>
                <AdminDropdown isOpen={dropdowns.admin} />
              </li>
            )}

            {role === ROLES.PRODUCT_OWNER && (
              <li className="nav-item">
                <NavLink to="/enquirylist" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FileQuestion className="nav-icon" size={18} />
                  <span className="nav-text">Enquiry</span>
                </NavLink>
              </li>
            )}

            {role === ROLES.REVIEWER && (
              <li className="nav-item">
                <NavLink to="/verifydocument" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FileCheck2 className="nav-icon" size={18} />
                  <span className="nav-text">Validate</span>
                </NavLink>
              </li>
            )}

            {role === ROLES.UPLOADER && (
              <li className="nav-item">
                <NavLink to="/upload" className={({ isActive }) => (isActive ? "active" : "")}>
                  <Upload className="nav-icon" size={18} />
                  <span className="nav-text">Upload Document</span>
                </NavLink>
              </li>
            )}

            {hasDocsAccess && (
              <li className="nav-item dropdown">
                <div 
                  className="dropdown-header" 
                  onClick={() => toggleDropdown("docs")}
                >
                  <FileText className="nav-icon" size={18} />
                  <span className="nav-text">Documents</span>
                  {dropdowns.docs ? (
                    <ChevronDown className="dropdown-arrow" size={16} />
                  ) : (
                    <ChevronRight className="dropdown-arrow" size={16} />
                  )}
                </div>
                <DocumentDropdown isOpen={dropdowns.docs} />
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AsideBar;