import axios from 'axios';
import DocumentList from '../components/document list/DocumentList';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

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
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required.');
    }
    return handleResponse(apiClient.post('auth/register/', userData));
  },
  login: async (credentials) => {
    if (!credentials.username || !credentials.password) {
      throw new Error('Email and password are required for login.');
    }
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
  resendOTP: async () => {
    return handleResponse(apiClient.put('auth/otp/'));
  },
  details: async () => {
    return handleResponse(apiClient.get('details/'));
  },
  resetPassword: async (data) => {
    if (!data.email) {
      throw new Error('Email, OTP, and new password are required for password reset.');
    }
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
      localStorage.removeItem('token');
    } catch (error) {
      console.warn('Error logging out:', error.message);
    }
  },

  // Organization APIs
  createOrganization: async (data) => {
    if (!data.name || !data.owner_email) {
      throw new Error('Organization name and owner email are required.');
    }
    return handleResponse(apiClient.post('organizations/', data));
  },
  getOrganizations: async () => handleResponse(apiClient.get('organizations/')),
  getOrganizationById: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required.');
    }
    return handleResponse(apiClient.get(`organizations/${orgId}/`));
  },
  freezeOrganization: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to freeze an organization.');
    }
    return handleResponse(apiClient.post(`organizations/${orgId}/freeze/`));
  },
  resumeOrganization: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to resume an organization.');
    }
    return handleResponse(apiClient.post(`organizations/${orgId}/resume/`));
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
  getEmployees: async (orgId) => {
    if (!orgId) {
      throw new Error('Organization ID is required to fetch employees.');
    }
    return handleResponse(apiClient.get(`organizations/${orgId}/employees/`));
  },
  freezeEmployee: async (orgId, employeeId) => {
    if (!orgId || !employeeId) {
      throw new Error('Organization ID and employee ID are required to freeze an employee.');
    }
    return handleResponse(apiClient.post(`organizations/${orgId}/employees/${employeeId}/freeze/`));
  },
  resumeEmployee: async (orgId, employeeId) => {
    if (!orgId || !employeeId) {
      throw new Error('Organization ID and employee ID are required to resume an employee.');
    }
    return handleResponse(apiClient.post(`organizations/${orgId}/employees/${employeeId}/resume/`));
  },

  // Document APIs
  uploadDocument: async (data) => {
    if (!data.file || !data.metadata) {
      throw new Error('File and metadata are required to upload a document.');
    }
    return handleResponse(apiClient.post('documents/upload/', data));
  },
  getDocuments: async () => handleResponse(apiClient.get('documents/')),
  getDocumentById: async (docId) => {
    if (!docId) {
      throw new Error('Document ID is required.');
    }
    return handleResponse(apiClient.get(`documents/${docId}/`));
  },
  verifyDocument: async (docId) => {
    if (!docId) {
      throw new Error('Document ID is required to verify a document.');
    }
    return handleResponse(apiClient.post(`documents/${docId}/verify/`));
  },
  reuploadDocument: async (docId, data) => {
    if (!docId || !data.file) {
      throw new Error('Document ID and file are required for re-uploading.');
    }
    return handleResponse(apiClient.post(`documents/${docId}/reupload/`, data));
  },
  DocumentList: async (docId, data) => {
    if (!docId || !data.file) {
      throw new Error('Document ID and file are required for viewing the status of document.');
    }
    return handleResponse(apiClient.post(`documents/${docId}/DocumentList/`, data));
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