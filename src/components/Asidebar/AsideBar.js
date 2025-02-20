import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  User, LayoutDashboard, Building2, UserPlus, ListOrdered,FileCheck2, FileText, Settings,Upload,ChartNoAxesCombined
} from "lucide-react"; // Importing icons
import "./AsideBar.css";
import Logo from "../../assets/images/company_logo.png";
import authService from "../../ApiServices/ApiServices";

const AsideBar = () => {
  const [role, setRole] = useState("ADMIN");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details_data = await authService.details();
        console.log(details_data)
        localStorage.setItem(
          "email",
          details_data.details[1].email || details_data.details[5].email
        );

        if (details_data.type === "User") {
          const name = details_data.details[1].first_name;
          localStorage.setItem("name", name);
          const company_name = details_data.details[7].company_name;
          console.log("company name : ",company_name);
          localStorage.setItem("company_name", company_name);
          
          const fetchedRole = details_data.details[5].name;
          localStorage.setItem("role", fetchedRole);
          setRole(fetchedRole);
        }

        if (details_data.type === "Organization") {
          const name = details_data.details[5].first_name;
          localStorage.setItem("name", name);
          const Company_name = details_data.details[1].company_name;
          localStorage.setItem("Company_name", Company_name);
          const fetchedRole = details_data.details[3].name;

          if (fetchedRole === "ADMIN") {
            localStorage.setItem("role", fetchedRole);
            setRole(fetchedRole);
          }
          if (fetchedRole === "Organization Admin") {
            localStorage.setItem("role", "ADMIN");
            setRole("ADMIN");
          }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <aside className="aside-bar">
      <div className="logo">
        <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer">
          <img
            src={Logo}
            alt="Company Logo"
            style={{
              width: "100px",
              marginTop: "-30px",
              marginBottom: "30px",
              height: "auto",
            }}
          />
        </a>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <nav style={{ marginBottom: "14px" }}>
          <ul>
            {(role === "VIEWER" || role === "PRODUCT_OWNER" || role === "ADMIN" || role === "UPLOADER" || role === "REVIEWER") && (
              <li>
                <NavLink to="/Profile" className={({ isActive }) => (isActive ? "active" : "")}>
                  <User className="aside-icon" size={20} />
                  <p className="asidebar_p_tag">Profile</p>
                </NavLink>
              </li>
            )}

            {(role === "VIEWER" || role === "PRODUCT_OWNER" || role === "ADMIN" || role === "UPLOADER" || role === "REVIEWER") && (
              <li>
                <NavLink to="/Dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                  <ChartNoAxesCombined className="aside-icon" size={20} />
                  <p className="asidebar_p_tag">Dashboard</p>
                </NavLink>
              </li>
            )}

            {(role === "PRODUCT_OWNER") && (
              <li>
                <NavLink to="/OrganizationList" className={({ isActive }) => (isActive ? "active" : "")}>
                  <Building2 className="aside-icon" size={20} />
                  <p className="asidebar_p_tag">Organization</p>
                </NavLink>
              </li>
            )}

{(role === "ADMIN") && (
              <li>
                <NavLink to="/user-list" className={({ isActive }) => (isActive ? "active" : "")}>
                  <Building2 className="aside-icon" size={20} />
                  <p className="asidebar_p_tag">User</p>
                </NavLink>
              </li>
            )}

            {role === "PRODUCT_OWNER" && (
              <li>
                <NavLink to="/AdminList" className={({ isActive }) => (isActive ? "active" : "")}>
                  <UserPlus className="aside-icon" size={20} />
                  <p className="asidebar_p_tag">Admin</p>
                </NavLink>
              </li>
            )}

            {/*{role === "PRODUCT_OWNER" && (
              <li>
                <NavLink to="/AdminList" className={({ isActive }) => (isActive ? "active" : "")}>
                  <ListOrdered className="aside-icon" size={20} />
                  <p className="asidebar_p_tag">Admin List</p>
                </NavLink>
              </li>
            )}*/}

{role === "REVIEWER" && (
              <li>
                <NavLink to="/verifydocument" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FileCheck2 className="aside-icon" size={20} />
                  <p className="asidebar_p_tag">Validate</p>
                </NavLink>
              </li>
            )}
            {role === "UPLOADER" && (
              <li>
                <NavLink to="/upload" className={({ isActive }) => (isActive ? "active" : "")}>
                  <Upload className="aside-icon" size={20} />
                  <p className="asidebar_p_tag">Upload Document</p>
                </NavLink>
              </li>
            )}

            {(role === "VIEWER" || role === "ADMIN"  || role === "UPLOADER" || role === "REVIEWER") && (
              <li>
                <NavLink to="/DocumentList" className={({ isActive }) => (isActive ? "active" : "")}>
                  <FileText className="aside-icon" size={20} />
                  <p className="asidebar_p_tag">Document List</p>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Settings - Pushed to Bottom */}
      {/*<div className="bottom-links">
        {(role === "PRODUCT_OWNER" || role === "ADMIN") && (
          <li>
            <NavLink to="/error 404" className={({ isActive }) => (isActive ? "active" : "")}>
             <div className="settings1"> <Settings className="aside-icon" size={20} />
             <p className="asidebar_p_tag" id="set">Settings</p>
              
              </div>
            </NavLink>
          </li>
        )}
      </div> */}
    </aside>
  );
};

export default AsideBar;
