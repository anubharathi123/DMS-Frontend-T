import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import AsideBar_Header from "./pages/Asidebar_Header";
import NotificationPage from "./components/NotificationDropdown/NotificationDropdown";
import VerifyDoc from "./components/verify Document/verifydoc";
import CompanyCreation from "./components/company creation/CompanyCreation";
import DocumentList from "./components/document list/DocumentList";
import Login from "./components/login/Login";
import ChangePassword from "./components/changepassword/ChangePassword";
import Dashboard from "./components/dashboard/dashboard";
import AuditLog from "./components/audit log/audit_log";
import CreateUser from "./components/create user/CreateUser";
import ResetPassword from "./components/resetpassword/ResetPassword";
import Fileupload from "./components/File Upload/file upload"
import Profile from "./components/Profile/Profile";
import ProfileManagementPage from "./components/ProfileManagementPage/ProfileManagementPage";
import OrganizationList from "./components/OrganizationList/OrganizationList";
import Login1 from "./components/login1/login1";
import Forgot_Pwd1 from "./components/forgot1/forgot_pwd1";
import ChangePassword1 from "./components/changepassword1/changepassword1";
// import OrganizationList from "./components/OrganizationList/OrganizationList";

// import 'bootstrap/dist/css/bootstrap.min.css';

import "./App.css";

// Function to check authentication status
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const accessStatus = localStorage.getItem("access_status") === "true";
  return token && accessStatus;
};

// Function to check token only (for Change Password)
const hasToken = () => {
  return localStorage.getItem("token");
};

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Token-only Route Wrapper (for Change Password)
const TokenRoute = ({ children }) => {
  return hasToken() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle logout logic
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("access_status");
    navigate("/login"); // Redirect to login page after logout
  };

  const shouldDisplayAsideBar = !["/","/ResetPassword1","/Login1","/login","/resetPassword","/Login", "/login/","/resetpassword", "/ResetPassword", "/ChangePassword", "/changepassword", "/ChangePassword1"].includes(location.pathname);

  return (
    <div className="app">
      {/* Static AsideBar with Logout functionality */}
      {shouldDisplayAsideBar && <AsideBar_Header onLogout={handleLogout} />}

      {/* Main Content */}
      <Routes>
        {/* Route for Login */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/login" element={<Login1 />} />

        {/* <Route path="/resetpassword" element={<ResetPassword />} /> */}
        <Route path="/resetpassword" element={<Forgot_Pwd1 />} />
        <Route path="/" element={<OrganizationList />} />
        <Route path="/profile-management" element={<ProfileManagementPage />} />
        {/* Change Password (Token Only) */}
        {/* <Route
          path="/ChangePassword"
          element={
              <ChangePassword />
          }
        /> */}

        <Route
          path="/ChangePassword1"
          element={ 
      
            <ChangePassword1 />
           }
        />

        {/* Protected Routes */}
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Fileupload />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile name="Rita Correia"
				age="32"
				city="London"
				followers="80K"
				likes="803K"
				photos="1.4K" />
            </PrivateRoute>
          }
        />
        <Route
          path="/verifydocument"
          element={
            
              <VerifyDoc />
          }
        />
        <Route
          path="/companycreation"
          element={
           <PrivateRoute>
              <CompanyCreation />
            </PrivateRoute>
          }
        />

        <Route
          path="/organizationlist"
          element={
            
              <OrganizationList />
        
          }
        />

        <Route
          path="/documentlist"
          element={
         
              <DocumentList />
    
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/auditlog"
          element={
            <PrivateRoute>
              <AuditLog />
            </PrivateRoute>
          }
        />
        <Route
          path="/createuser"
          element={
            <PrivateRoute>
              <CreateUser />
            </PrivateRoute>
          }
        />
         <Route
          path="/notificationdropdown"
          element={
            <PrivateRoute>
              <NotificationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/OrganizationList"
          element={
            <PrivateRoute>
              <OrganizationList />
            </PrivateRoute>
          }
        />

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<Login1 />} />
      </Routes>
    </div>
  );
}

export default App;
