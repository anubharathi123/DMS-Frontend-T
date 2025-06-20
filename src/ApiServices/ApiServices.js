import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';
const API_URL1 = process.env.REACT_APP_API_URL || 'http://localhost:8000/';


export { API_URL1 };  // Ensure this is exported
// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Set a timeout for requests
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.message || error.message}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

const handleResponse = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An unexpected error occurred' };
  }
};




const authService = {
  // Authentication APIs
  register: async (userData) => {
    // if (!userData.email || !userData.password) {
    //   throw new Error('Email and password are required.');
    // }
    return handleResponse(apiClient.post('auth/register/', userData));
  },
  login: async (credentials) => {
    if (!credentials.username || !credentials.password) {
      throw new Error('Email and password are required for login.');
    }
    localStorage.removeItem('token');
    const response = await handleResponse(apiClient.post('auth/login/', credentials));
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },
  sendOTP: async () => {
    
    return handleResponse(apiClient.get('auth/otp/'));
  },
  verifyOTP: async (data) => {
    if (!data.otp) {
      throw new Error('Email and OTP are required for verification.');
    }
    return handleResponse(apiClient.post('auth/otp/', data));
  },
  profile: async (image) => {
    return handleResponse(apiClient.post('profileimage/', image));
  },
  media: async (url, params) => {
    return handleResponse(axios.get(`${API_URL1}${url}`, { params, responseType: 'blob' }));
},

  getprofile: async () => {
    return handleResponse(apiClient.get('profileimage/'));
  },
  delprofile: async (id) => {
    return handleResponse(apiClient.delete(`profileimage/${id}/`));
  },
  resendOTP: async () => {
    return handleResponse(apiClient.put('auth/otp/'));
  },
  details: async () => {
    return handleResponse(apiClient.get('details/'));
  },
  users: async () => {
    return handleResponse(apiClient.get('users/'));
  },

  // formenquiry: async (data) => {
  //   return handleResponse(apiClient.post('enquiry/', data));    
  // },

  getUsersbyId: async (id) => {
    return handleResponse(apiClient.get(`user_details/${id}/`))
  },

  getUsersbyId1: async (id) => {
    return handleResponse(apiClient.get(`user_detail/${id}/`))
  },

  deleteuser: async (id) => {
    return handleResponse(apiClient.delete(`auth/${id}/delete/`))
  },

  resetPassword: async (data) => {

    if (!data) {
      throw new Error('Email, OTP, and new password are required for password reset.');
    }
    localStorage.removeItem('token');
    console.log(data)
    const response = await handleResponse(apiClient.post('auth/reset/', data));
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },
  changePassword: async (data) => {
    // if (data.confirmPassword == !data.new_password) {
    //   throw new Error('Olpassword and new password are required.');
    // }
    const response = handleResponse(apiClient.post('auth/change-password/', data));
    return response
  },
  logout: async () => {
    try {
      await apiClient.post('auth/logout/');
      // localStorage.removeItem('token');
    } catch (error) {
      console.warn('Error logging out:', error.message);
    }
  },

  saveprofile: async (id,data) => {
    return handleResponse(apiClient.put(`auth/register/${id}/`,data))
  },

  companyCount: async (data) => {
    return handleResponse(apiClient.get('dashboard/', data))
  },

  organizationCount: async () => {
    return handleResponse(apiClient.get('organizations/dashboard/'))
  },

  organizationIdDetails: async (id) => {
    return handleResponse(apiClient.get(`owner/details`))   
  },
  organizationIdDetails1: async (id) => {
    return handleResponse(apiClient.get(`owner/${id}/details`))   
  },
  reviewerlist:async () => {
    return handleResponse(apiClient.get(`aprover_list/`))
  },
  assignedUser: async (userId, docId) => {
    console.log("📤 Calling API with:", userId, docId);
    if (!userId || !docId) {
      throw new Error('Both userId and docId are required.');
    }
    return handleResponse(
      apiClient.post(`assign-approver-document/${userId}/document/${docId}/`)
    );
  },

  MonthYearCompany: async () => {
    return handleResponse(apiClient.get('organization/state/')) 
  },
  tableIndividual: async (id) => {
    return handleResponse(apiClient.get(`dashboarduser/${id}/`));
  },
  
  enquire: async (data) => {
    return handleResponse(apiClient.post('enquiries/', data));
  },
  
  getEnquirydata:async (data) => {
    return handleResponse(apiClient.get('enquiries/', data))
  },

  

  notificationMarkasRead:async (id) => {
    console.log('id:', id)
    return handleResponse(apiClient.put(`notification_delivery/${id}/true/`))
  },

  notificationMarkasUnRead:async (id) => {
    return handleResponse(apiClient.get(`notification_delivery/${id}/false/`))

  },

  declarationDetailsMonthly:async () => {
    return handleResponse(apiClient.get(`declaration_details/month/`))
  },

  organizationCountDas: async () => {
    return handleResponse(apiClient.get('organizations/count/'))
  },
  

  //product admin...

  DashboardView: async () => {
    return handleResponse(apiClient.get('dashboard/'))
  },
  DeletedOrganizationList: async () => {
    return handleResponse(apiClient.get('organization/pending/'))
  },
  restoreOrganization: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to restore an organization.');
    }
    return handleResponse(apiClient.post(`organization/${orgId}/restore/`));
  },
  restoreAdmin: async (adminId) => {
  if (!adminId) {
    throw new Error('Admin ID is required to restore an admin.');
  }
  return handleResponse(apiClient.post(`product-admin/${adminId}/restore/`));
},

  msi_Enquiry: async () => {
    return handleResponse(apiClient.get(`total_mis_enquriy/`))
  },




  createAdmin: async (data) => {
    return handleResponse(apiClient.post('AdminCreation/',data))
  },

  getAdmins: async (data) => {
    return handleResponse(apiClient.get('admin/', data))
  },

  getAdminsbyID: async (id) => {
    return handleResponse(apiClient.get(`user_details/${id}/`))
  },

  updateAdmin: async (id,data) => {
    return handleResponse(apiClient.put(`auth/register/${id}/`,data))
  },

  deleteAdmin: async (id) => {
    return handleResponse(apiClient.delete(`auth/${id}/delete/`))
  },

  AdminList: async (data) => {
    return handleResponse(apiClient.post('AdminList/',data))
  },
  // OrgNotification: async (url) => {
  //   return handleResponse(apiClient.get(`organizations/${url}/`))
  // },
  OrgNotification: async () => {
    return handleResponse(apiClient.get(`notification_delivery/`))
  },
  // Organization APIs
  createOrganization: async (data) => {
    // if (!data.name || !data.owner_email) {
    //   throw new Error('Organization name and owner email are required.');
    // }
    return handleResponse(apiClient.post('organization/', data));
  },
  getOrganizations: async () => handleResponse(apiClient.get('organization/')),
  // pendingOrganizations: async () => handleResponse(apiClient.get('organization/pending/')),
  pendingMsiOrganizations: async () => handleResponse(apiClient.get('organization/pending/msi/')),
  approveOrganization: async (orgId) => { 
    if (!orgId) { 
      throw new Error('Organization ID is required to approve an organization.');
    }
    return handleResponse(apiClient.post(`organization/${orgId}/approve/`));
  },
  RestoreOrganizationdelete:async(orgId)=>{
    if(!orgId)
    {
      throw new Error('Organisation ID is required to delete an organization permanently');
    }
    return handleResponse(apiClient.post(`organization_undelete/${orgId}/`))
  },
  rejectOrganization: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to reject an organization.');
    }
    return handleResponse(apiClient.post(`organization/${orgId}/reject/`));  
  },

  approvemsiOrganization: async (orgId) => { 
    if (!orgId) { 
      throw new Error('Organization ID is required to approve an organization.');
    }
    return handleResponse(apiClient.post(`organization/${orgId}/approve/msi/`));
  },
  rejectmsiOrganization: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to reject an organization.');
    }
    return handleResponse(apiClient.post(`organization/${orgId}/reject/msi/`));  
  },
  
  OrganizationList: async (data) => {
    // if (!data.name || !data.owner_email) {
    //   throw new Error('Organization name and owner email are required.');
    // }
    return handleResponse(apiClient.post('OrganizationList/', data));
  },

  createuserOrganization: async (data) => {
    return handleResponse(apiClient.post('userorganization/', data));
  },

  rangesearch: async (data) => {
    console.log('data:', data);
  //   const startDate = data.startDate.toISOString().split('T')[0];  // Format to 'yyyy-MM-dd'
  // const endDate = data.endDate.toISOString().split('T')[0];      // Format to 'yyyy-MM-dd'


    return handleResponse(apiClient.get('documents/download-range/',data));
  },
  autobackup: async () => {
    // console.log('data:', data);
  //   const startDate = data.startDate.toISOString().split('T')[0];  // Format to 'yyyy-MM-dd'
  // const endDate = data.endDate.toISOString().split('T')[0];      // Format to 'yyyy-MM-dd'


    return handleResponse(apiClient.get('backup/auto/'));
  },
  backuplist:async () => {
    return handleResponse(apiClient.get('backuplist'))
  },
  backupdownload:async (id) => {
    return handleResponse(apiClient.get(`backup/download/${id}/`))
  },

  

  getlinedata:async () => {
    return handleResponse(apiClient.get('organizations/creation_stats/'))
  },
  
  getOrganizationById: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required.');
    }

    return handleResponse(apiClient.get(`organization_details/${orgId}/`));
  },
  freezeOrganization: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to freeze an organization.');
    }
    console.log('orgId:', orgId);
    return handleResponse(apiClient.post(`organizations/${orgId}/freeze/`));
  },
  resumeOrganization: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to resume an organization.');
    }
    return handleResponse(apiClient.post(`organizations/${orgId}/resume/`));
  },
  updateOrganization:async (orgId,Data) => {
    return handleResponse(apiClient.put(`organization_update/${orgId}/`,Data))
  },
  updateOrganizationmsi:async (orgId,Data) => {
    return handleResponse(apiClient.put(`organization_msi/${orgId}/`,Data))
  },
  deleteOrganization: async (orgId) => {
    return handleResponse(apiClient.delete(`organization_delete1/${orgId}/`));
  },

  permanentOrganizationdelete:async(orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to delete an organization permanently.');
    } 
    return handleResponse(apiClient.delete(`organization_delete/${orgId}/`))
  },

  addSubAdmin: async (orgId, data) => {
    if (!orgId || !data.email) {
      throw new Error('Organization ID and sub-admin email are required.');
    }
    return handleResponse(apiClient.post(`organizations/${orgId}/sub-admin/`, data));
  },
  addEmployee: async (orgId, data) => {
    if (!orgId || !data.name || !data.email) {
      throw new Error('Organization ID, employee name, and email are required.');
    }
    return handleResponse(apiClient.post(`organizations/${orgId}/employees/`, data));
  },

  organizationDocuments: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to fetch documents.');
    }
    return handleResponse(apiClient.post(`organization_details/${orgId}/details`))
  },
  
  getEmployees: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to fetch employees.');
    }
    return handleResponse(apiClient.get(`user_details/${orgId}/`));
  },
  freezeEmployee: async (orgId, employeeId) => {
    if (!orgId || !employeeId) {
      throw new Error('Organization ID and employee ID are required to freeze an employee.');
    }
    return handleResponse(apiClient.patch(`organizations/${orgId}/employees/${employeeId}/freeze/`));
  },
  resumeEmployee: async (orgId, employeeId) => {
    if (!orgId || !employeeId) {
      throw new Error('Organization ID and employee ID are required to resume an employee.');
    }
    return handleResponse(apiClient.patch(`organizations/${orgId}/employees/${employeeId}/resume/`));
  },

  // Document APIs
  uploadDocument: async (data) => {
    // console.log('data:', data); 
    return handleResponse(apiClient.post('documents/upload/', data));
  },
  getDocuments: async () => handleResponse(apiClient.get('documents/')),
  getDocumentsPending: async () => handleResponse(apiClient.get('pending-reviewer-document/')),

  checkdeclarationdoc: async (declaration) => handleResponse(apiClient.get(`documents/${Number(declaration)}/`)),

  getDocumentById: async (docId) => {
    if (!docId) {
      throw new Error('Document ID is required.');
    }
    return handleResponse(apiClient.get(`documents/${docId}/`));
  },
  verifyDocument: async (docId,data) => {
    if (!docId) {
      throw new Error('Document ID is required to verify a document.');
    }
    return handleResponse(apiClient.post(`documents/${docId}/verify/`,data));
  },
  reuploadDocument: async (docId, data) => {
    if (!docId || !data.file) {
      throw new Error('Document ID and file are required for re-uploading.');
    }
    return handleResponse(apiClient.post(`documents/${docId}/reupload/`, data));
  },

  // Document Approval & Rejection APIs
  approveDocument: async (docId) => {
    if (!docId) {
      throw new Error('Document ID is required to approve a document.');
    }
    return handleResponse(apiClient.post(`documents/${docId}/approve/`));
  },

 pendingDocument: async (docId) => {
  if (!docId) {
    throw new Error('Document ID is required.');
  }
  return handleResponse(apiClient.post(`documents/${docId}/pending/`));  // corrected endpoint
},


  rejectDocument: async (docId, reason) => {
    // if (!docId || !reason) {
    //   throw new Error('Document ID and rejection reason are required.');
    // }
    return handleResponse(apiClient.post(`documents/${docId}/reject/`, { reason }));
  },
  // Notifications APIs
  getNotifications: async () => handleResponse(apiClient.get('notifications/')),
  markNotificationAsRead: async (notificationId) => {
    if (!notificationId) {
      throw new Error('Notification ID is required to mark it as read.');
    }
    return handleResponse(apiClient.post(`notifications/${notificationId}/read/`));
  },

  // Audit Logs
  getAuditLogs: async () => handleResponse(apiClient.get('audit-logs/')),
  getDocumentAuditLogs: async (docId) => {
    if (!docId) {
      throw new Error('Document ID is required to fetch audit logs.');
    }
    return handleResponse(apiClient.get(`documents/${docId}/audit-logs/`));
  },

  // Search API
  search: async (query) => {
    if (!query) {
      throw new Error('Search query is required.');
    }
    return handleResponse(apiClient.get('search/', { params: { q: query } }));
  },
};

export default authService;
