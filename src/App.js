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
import AdminList from "./components/AdminList/AdminList";
import { ProfileImageProvider } from "./context/ProfileImageContext"; 
// import Header from "./components/Header";
import AdminCreation from "./components/AdminCreation/AdminCreation";
import { StyledEngineProvider } from '@mui/material/styles';
import Login2 from "./login2/SignInSide";
import LandingPage from "./landing Page/MarketingPage";
// import Dash from './dashboard/routes/sections'
// import { HomePage } from './dashboard/routes/sections';
import UserList from './components/UserList/Userlist';
import AdminCreation1 from "./components/Admin Creation1/AdminCreation";
import OrganizationCreation from './components/Organization creation/CompanyCreation'
import NotFoundView from "./error 404/pages/page-not-found";
import DateRangeSearch from "./components/document search/DateRangeSearch";
import ProfileCard from "./components/profile final/Profile";
import ClientPage from "./components/clientpage/clientpage";
import CompanyUpdate from "./components/Organization update/CompanyUpdate"; 
// import AdminCreation Update from "./components/AdminCreation Update";
// import OrganizationList from "./components/OrganizationList/OrganizationList";

// import 'bootstrap/dist/css/bootstrap.min.css';

import "./App.css";
import styles from './index.css';
import { IdCard } from "lucide-react";
import UpdateAdmin from "./components/AdminCreation Update/UpdateAdmin";
import UpdateUser from "./components/UpdateUser/UpdateUser";


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
    <ProfileImageProvider>
      <Router>
        <AppContent />
      </Router>
    </ProfileImageProvider>
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
      <StyledEngineProvider injectFirst>
      {/* Main Content */}
      <Routes>
        {/* Route for Login */}
        {/* <Route path="/login" element={<Login />} /> */}
        
        <Route path="/login" element={<Login2 />} />
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/dash" element={<HomePage />} /> */}
        <Route path="/NotFoundView" element={<NotFoundView />} />

            
        {/* <Route path="/login" element={<Login2 />} /> */}
        {/* <Route path="/" element={<Login1 />} /> */}

        {/* <Route path="/resetpassword" element={<ResetPassword />} /> */}
        <Route path="/resetpassword" element={<Forgot_Pwd1 />} />
        <Route path="/OrganizationList" element={<OrganizationList />} />
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
          path="/profilemanagement"
          element={
            <PrivateRoute>
              <ProfileManagementPage />
              </PrivateRoute> 
            //  </PrivateRoute> 

          }
        />
        <Route
          path="/Clientpage"
          element={
            // <PrivateRoute>
              <ClientPage />
            //  </PrivateRoute> 
          }
        />

        <Route
          path="/profile"
          element={
            // <PrivateRoute>
        //       <Profile name="Rita Correia"
				// age="32"
				// city="London"
				// followers="80K"
				// likes="803K"
				// photos="1.4K" />
        <ProfileCard />
            // </PrivateRoute>
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
          //  <PrivateRoute>
              <CompanyCreation />
            // </PrivateRoute>
          }
        />

        <Route
          path="/companyupdate/:id"
          element={
           <PrivateRoute>
              <CompanyUpdate />
           </PrivateRoute>
          }
        />

        <Route
          path="/organizationlist"
          element={
            // <PrivateRoute>
              <OrganizationList />
            // {/* </PrivateRoute> */}
          }
        />

        <Route
          path="/documentlist"
          element={
            // <PrivateRoute>
              <DocumentList />
            // </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            // <PrivateRoute>
              <Dashboard />
            // </PrivateRoute>
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
          path="/UpdateUser/:id"
          element={
            <PrivateRoute>
              <UpdateUser />
             </PrivateRoute>
          }
        />

          <Route
            path="/user-list"
            element={
              <PrivateRoute>
              <UserList/>
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
          path="/admincreation"
          element={
            <PrivateRoute>
              <AdminCreation />
           </PrivateRoute>
          }
        />

        <Route
          path="/updateadmin/:id"
          element={
            <PrivateRoute>
              <UpdateAdmin />
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

       <Route
          path="/AdminList"
          element={
             <PrivateRoute>
              <AdminList/>
            </PrivateRoute> 

          }
        />


<Route
  path="/date-range-search"
  element={
    // <PrivateRoute>
      <DateRangeSearch />
    // </PrivateRoute>
  }
/>


<Route
  path="/profile-final"
  element={
    // <PrivateRoute>
      <ProfileCard />
    // </PrivateRoute>
  }
/>



        {/* Fallback route for unmatched paths */}
        <Route path="*" element={<NotFoundView />} />
      </Routes>
      </StyledEngineProvider>
    </div>

  );
}

export default App;
