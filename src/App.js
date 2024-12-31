import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import AsideBar_Header from "./pages/Asidebar_Header";
import UploadDocument from "./components/upload document/UploadDocument";
import VerifyDoc from "./components/verify Document/verifydoc";
import CompanyCreation from "./components/company creation/CompanyCreation";
import DocumentList from "./components/document list/DocumentList";
import Login from "./components/login/Login";
import ChangePassword from "./components/changepassword/ChangePassword";
import Dashboard from "./components/dashboard/dashboard";
import AuditLog from "./components/audit log/audit_log";
import CreateUser from "./components/create user/CreateUser";
import ResetPassword from "./components/resetpassword/ResetPassword";
import EmployeeCreation from "./components/employee creation/EmployeeCreation";
import Fileupload from "./components/fileuploadtestpage/file upload"

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

  const shouldDisplayAsideBar = !["/login","/Login", "/login/","/resetpassword", "/ResetPassword", "/changepassword"].includes(location.pathname);

  return (
    <div className="app">
      {/* Static AsideBar with Logout functionality */}
      {shouldDisplayAsideBar && <AsideBar_Header onLogout={handleLogout} />}

      {/* Main Content */}
      <Routes>
        {/* Route for Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Fileupload />} />
        {/* Reset Password (Unrestricted Access) */}
        <Route path="/resetpassword" element={<ResetPassword />} />

        {/* Change Password (Token Only) */}
        <Route
          path="/changepassword"
          element={
            <TokenRoute>
              <ChangePassword />
            </TokenRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DocumentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/UploadDocument"
          element={
            <PrivateRoute>
              <UploadDocument />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/logout"
          element={
            handleLogout()
          }
        /> */}
        <Route
          path="/EmployeeCreation"
          element={
            <PrivateRoute>
              <EmployeeCreation />
            </PrivateRoute>
          }
        />
        <Route
          path="/verifydoc"
          element={
            <PrivateRoute>
              <VerifyDoc />
            </PrivateRoute>
          }
        />
        <Route
          path="/CompanyCreation"
          element={
            <PrivateRoute>
              <CompanyCreation />
            </PrivateRoute>
          }
        />
        <Route
          path="/DocumentList"
          element={
            <PrivateRoute>
              <DocumentList />
            </PrivateRoute>
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
          path="/AuditLog"
          element={
            <PrivateRoute>
              <AuditLog />
            </PrivateRoute>
          }
        />
        <Route
          path="/CreateUser"
          element={
            <PrivateRoute>
              <CreateUser />
            </PrivateRoute>
          }
        />

        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
