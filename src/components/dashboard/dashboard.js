import React, { useEffect, useState } from "react";
import "./dashboard.css";
// import ClipLoader from "react-spinners/ClipLoader";
import Loader from "react-js-loader";
import {
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import apiServices from "../../ApiServices/ApiServices";
// import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
} from "chart.js";
import CardAnalytics from "./CardAnalytics";
import MonthlyDocumentChart from "./MonthlyDocumentChart";
import UserPieChart from "./UserPieChart";
import ProgressBarChart from "./ProgressBarChart";
import FileSizeTrendsChart from "./FileSizeTrendsChart";
import CompanyTable from "./CompanyTable";
import { useParams } from "react-router-dom";
import DeclarationDeatilsMonthly from "./DeclarationDeatilsMonthly";

// Register ChartJS components
ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  ChartDataLabels
);

const Dashboard = ({ title }) => (
  <div className="dashboard">
    <h1 className="dashboard-h1">{title}</h1>
  </div>
);

const DashboardApp = () => {
  // State management
  const { id } = useParams();
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState(id);
  const username = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role");

  // Data states
  const [DashboardStats, setDashboardStats] = useState({});
  const [companyData, setCompanyData] = useState([]);
  const [orgCount, setOrgCount] = useState({});
  const [tableforadmin, settableforadmin] = useState({});
  const [dashboardData, setDashboardData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [lineChartData, setLineChartData] = useState([]);
  const [enquiryData, setEnquiryData] = useState({});
  const [msiData, setMsiData] = useState({});
  const [openModalData, setOpenModalData] = useState(null); // Manages modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedReportYear, setSelectedReportYear] = useState("");
  const [rowLimit, setRowLimit] = useState(5);
  const [uniqueReportYears, setUniqueReportYears] = useState([]);
  const [orgSummary, setOrgSummary] = useState(null);

  // User role checks
  const isUploader = role === "UPLOADER";
  const isReviewer = role === "REVIEWER";
  const isViewer = role === "VIEWER";
  const isAdmin = role === "ADMIN";

  const isAdminOrDocumentRole = ["ADMIN", "UPLOADER", "APPROVER", "REVIEWER", "VIEWER"].includes(role);
  const isProductOwner = ["PRODUCT_OWNER", "PRODUCT_ADMIN"].includes(role);

  // User statistics
  const [totalUsers, setTotalUsers] = useState(0);
  const [uploaderCount, setUploaderCount] = useState(0);
  const [reviewerCount, setReviewerCount] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [client, setclient] = useState(0);
  const [adminProgress, setAdminProgress] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(null);


  // Fetch organization details
  const fetchOrganizationDetails = async () => {
    try {
      const response = await apiServices.details();
      const orgId = response?.details?.[7]?.id || response?.details?.[1]?.id;
      if (orgId) {
        setOrganizationId(orgId);
        console.log("Organization ID set:", orgId);
      } else {
        console.warn("No organization ID found in response");
      }
    } catch (error) {
      console.error("Error fetching organization details:", error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiServices.DashboardView();
        console.log("Dashboard data:", response);
        
        // Process the response appropriately
        const processedData = typeof response === 'number' ? 
          { count: response } : 
          response;
        
        setDashboardStats(processedData);
  
        if (role === "ADMIN") {
          const response1 = await apiServices.details();
          const orgId = response1?.details?.[7]?.id || response1?.details?.[1]?.id;
          console.log("Organization ID:", orgId);
          
          if (orgId) {
            setOrganizationId(orgId);
            const summaryData = await fetchOrganizationSummary(orgId); // Note the await here
            console.log("Organization ID set:", orgId, summaryData);
            console.log("Summary Data:", summaryData);
            if (summaryData) {
              setDashboardStats(prev => ({
                ...prev,
                ...summaryData  // Merge with existing stats
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
  
    fetchDashboardData();
  }, []);

  const fetchOrganizationSummary = async (orgid) => {
    try {
      console.log("Fetching organization summary for ID:", orgid);
      const response = await apiServices.organizationIdDetails1(orgid);
      console.log("Organization summary response:", response);  
      
      const summaryData = {
        org_name: response?.details?.company_name || 'N/A',
        username: response?.summary?.org_username || 'N/A',
        doc_count: response?.summary?.organization_document_count ?? 0,
        dec_count: response?.summary?.declaration_count ?? 0,
        doc_size: response?.summary?.org_filesize || '0.0 MB',
        emp: response?.summary?.org_user_count ?? 0
      };
    // const matchedOrg = summaryData.find(item => item.id === orgid);
    // if (matchedOrg) {
    //   console.log("✅ Matched Organization from map:", matchedOrg);
    //   // You can attach or merge data if needed
    //   summaryData.extra_info = matchedOrg.extra_info || null;
    // } else {
    //   console.warn("⚠️ No matching organization found in map");
    // }
      console.log("🧾 Summary Extracted:", summaryData);
      setOrgSummary(summaryData);
      
      return summaryData; // Return the full object, not just dec_count
    } catch (error) {
      console.error("❌ Error fetching organization summary:", error);
      return null;
    }
  };
  

  useEffect(() => {
    // First fetch the org ID
    fetchOrganizationDetails();
  }, []);

  // useEffect(() => {
  //   // Once ID is set, fetch summary
  //   if (organizationId) {
  //     fetchOrganizationSummary(organizationId);
  //   }
  // }, [organizationId]);

  // const fetchDeclarationCount = async () => {
  //   try {
  //     const declarationCountResponse = await apiServices.organizationIdDetails();
  //     if (declarationCountResponse) {
  //       const declarationCount = declarationCountResponse.map((dc) => ({  
  //         // org_name: dc.organization_name,
  //         // username: dc.organization_user,   
  //         // doc_count: dc.total_files_all,
  //         // doc_size: dc.total_file_size_all,
  //         // emp: dc.total_employees,
  //       }));
  //       setCompanyData(declarationCount);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching organization details:", error); 
  //   }
  // };

  // Fetch individual admin data
  const fetchIndividualAdminData = async (orgId) => {
    if (!orgId) return;
    
    try {
      const response = await apiServices.tableIndividual(orgId);
      settableforadmin(response);
      
      // Calculate user statistics
      const total = response?.users?.length || 0;
      const uploaders = response.users.filter(u => u.role === "UPLOADER").length;
      const reviewers = response.users.filter(u => u.role === "REVIEWER").length;
      const viewers = response.users.filter(u => u.role === "VIEWER").length;
      
      setTotalUsers(total);
      setUploaderCount(uploaders);
      setReviewerCount(reviewers);
      setViewerCount(viewers);

      // Calculate file size statistics
      const uploadedSizes = response?.users?.map(user => user.uploaded_files_size_mb || 0);
      const totalUploadedSize = uploadedSizes.reduce((acc, size) => acc + size, 0);
      setAdminProgress(totalUploadedSize);

      const totalSizeMB = response?.users?.reduce((acc, user) => {
        if (user.role === "UPLOADER") {
          return acc + (user.uploaded_files_size_mb || 0) + 
                 (user.approved_files_size_mb || 0) + 
                 (user.rejected_files_size_mb || 0);
        }
        return acc;
      }, 0);
      setclient(totalSizeMB);
    } catch (error) {
      console.error("Error fetching individual admin data:", error);
    }
  };
const fetchOrganizationCount= async () => {
  try {
    const orgCountResponse = await apiServices.organizationCount();
    // console.log(orgCountResponse, "orgCountResponse");
    if (orgCountResponse) {
      const dashboard = orgCountResponse.map(db => ({
        org_id : db.organization_id,
        org_name: db.organization_name,
        username: db.organization_user,
        doc_count: db.total_files_all,
        doc_size: db.total_file_size_all,
        emp: db.total_employees,
      }));
      setCompanyData(dashboard);
    }
  } catch (error) {
    console.error("Error fetching organization details:", error);
  }
}

const companyCount= async () => {
  try {
    const companyCountResponse = await apiServices.companyCount();
    console.log(companyCountResponse, "companyCountResponse");
    if (companyCountResponse) {
      setOrgCount({
        totalCompanies: companyCountResponse?.total_organizations || 0,
        activeCompanies: companyCountResponse?.active_org_count || 0,
        inactiveCompanies: companyCountResponse?.inactive_org_count || 0,
        clientAdmins: companyCountResponse?.user_count || 0,
        totalDocuments: companyCountResponse?.document_count || 0,
        approvedDocuments: companyCountResponse?.approved_count || 0,
        pendingDocuments: companyCountResponse?.pending_org_count || 0,
        rejectedDocuments: companyCountResponse?.rejected_count || 0,
        user_count: companyCountResponse?.user_count || 0,
        deleted_org_count: companyCountResponse?.deleted_org_count || 0,
      });
      console.log(companyCountResponse?.employee_count || 0, "companyCountResponse");
    }
  } catch (error) {
    console.error("Error fetching organization details:", error);
  }
}
  // Fetch all dashboard data
  const fetchAllDashboardData = async () => {
    const startTime = performance.now();
    setIsLoading(true);
    setLoadingPercentage(0);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingPercentage(prev => (prev < 90 ? prev + 1 : prev));
    }, 100);

    try {
      const [
        // orgCountResponse,
        // companyCountResponse,
        yearMonthCompanyResponse,
        lineDataResponse,
        dashboardResponse,
        userCountResponse,
      ] = await Promise.all([
        // apiServices.organizationCount(),
        // apiServices.companyCount(),
        apiServices.MonthYearCompany(),
        apiServices.getlinedata(),
        apiServices.DashboardView(),
        // apiServices.msi_Enquiry(),
      ]);

      // Process organization count data
      // if (orgCountResponse) {
      //   const dashboard = orgCountResponse.map(db => ({
      //     org_name: db.organization_name,
      //     username: db.organization_user,
      //     doc_count: db.total_files_all,
      //     doc_size: db.total_file_size_all,
      //     emp: db.total_employees,
      //   }));
      //   setCompanyData(dashboard);
      // }

      // Process company count statistics
      // if (companyCountResponse) {
      //   setOrgCount({
      //     totalCompanies: companyCountResponse.total_organizations || 0,
      //     activeCompanies: companyCountResponse.active_org_count || 0,
      //     inactiveCompanies: companyCountResponse.inactive_org_count || 0,
      //     clientAdmins: companyCountResponse.user_count || 0,
      //     totalDocuments: companyCountResponse.document_count || 0,
      //     approvedDocuments: companyCountResponse.approved_count || 0,
      //     pendingDocuments: companyCountResponse.pending_org_count || 0,
      //     rejectedDocuments: companyCountResponse.rejected_count || 0,
      //     user_count: companyCountResponse.user_count || 0,
      //     deleted_org_count: companyCountResponse.deleted_org_count || 0,
      //   });
      // }

      // Process dashboard statistics
      if (dashboardResponse) {
        setDashboardStats(dashboardResponse);
        console.log("Raw dashboard response:", dashboardResponse); 
      }

      // Process line chart data
      if (lineDataResponse) {
        const trends = lineDataResponse.map(ct => ({
          count: ct.count,
          month: ct.month,
          year: ct.year,
        }));
        setLineChartData(trends);
        const uniqueYears = [...new Set(trends.map(ct => ct.year))];
        setSelectedYear(uniqueYears[0] || "2023");
      }

      // Process year-month-company data
      if (yearMonthCompanyResponse) {
        const monthShort = {
          January: "Jan", February: "Feb", March: "Mar", April: "Apr",
          May: "May", June: "Jun", July: "Jul", August: "Aug",
          September: "Sep", October: "Oct", November: "Nov", December: "Dec"
        };

        const formatted = {};
        const years = new Set();

        yearMonthCompanyResponse.forEach(company => {
          company.years.forEach(year => {
            years.add(year.year);
            if (!formatted[year.year]) formatted[year.year] = {};
            
            Object.values(monthShort).forEach(m => {
              if (!formatted[year.year][m]) {
                formatted[year.year][m] = { companies: [] };
              }
            });

            year.monthly_document_counts.forEach(monthData => {
              const short = monthShort[monthData.month] || monthData.month;
              formatted[year.year][short].companies.push({
                companyname: company.organization_name,
                Doccount: monthData.document_count || 0,
                FileSize: monthData.file_size || "N/A",
              });
            });
          });
        });

        setUniqueReportYears([...years]);
        setChartData(formatted);
      }

      // Process MSI and enquiry data
      if (userCountResponse) {
        setEnquiryData(userCountResponse);
        setMsiData(userCountResponse);
      }

      // Ensure minimum loading time of 2 seconds
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(2000 - elapsed, 0);

      setTimeout(() => {
        clearInterval(progressInterval);
        setLoadingPercentage(100);
        setTimeout(() => setIsLoading(false), 300);
      }, remaining);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      clearInterval(progressInterval);
      setIsLoading(false);
    }
  };

  // Fetch monthly document data for admin roles
  const fetchMonthlyDocumentData = async () => {
    if (!isAdminOrDocumentRole) return;
    
    try {
      const response = await apiServices.MonthYearCompany();
      const monthMap = {
        January: "Jan", February: "Feb", March: "Mar", April: "Apr",
        May: "May", June: "Jun", July: "Jul", August: "Aug",
        September: "Sep", October: "Oct", November: "Nov", December: "Dec"
      };

      const allMonths = Object.values(monthMap);
      const existingData = response.flatMap(org => 
        org.years.flatMap(yearData => yearData.monthly_document_counts)
      );

      const convertFileSizeToMB = (sizeString) => {
        if (!sizeString) return 0;
        const [value, unit] = sizeString.split(" ");
        const size = parseFloat(value);
        if (unit === "GB") return size * 1024;
        if (unit === "KB") return size / 1024;
        return size;
      };

      const transformedData = allMonths.map(shortMonth => {
        const found = existingData.find(m => monthMap[m.month] === shortMonth);
        return {
          month: shortMonth,
          docCount: found ? found.document_count : 0,
          fileSizeMB: found ? convertFileSizeToMB(found.file_size) : 0,
        };
      });

      setDashboardData(transformedData);
    } catch (error) {
      console.error("Error fetching monthly document data:", error);
    }
  };

  // Initial data fetching
  useEffect(() => {
    fetchOrganizationDetails();
    fetchAllDashboardData();
    fetchMonthlyDocumentData();
    fetchOrganizationCount();
    companyCount();
  }, []);

  // Fetch individual admin data when organizationId changes
  useEffect(() => {
    if (organizationId) {
      fetchIndividualAdminData(organizationId);
    }
  }, [organizationId]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="loading-popup">
        <div className="loading-popup-content">
          <Loader
            type="box-up"
            bgColor={"#000b58"}
            color={"#000b58"}
            size={100}
          />
          <p>{loadingPercentage}% Loading...</p>
        </div>
      </div>
    );
  }



  const handleOpenModalData = (company) => {
    fetchOrganizationSummary(company.org_id); // Fetch summary for the clicked company
    console.log("Clicked Data:", company); // Debugging
    setOpenModalData(company);
  };

   // Function to close the modal
   const closeModalData = () => {
    setOpenModalData(null);
  };

  const openModal = (company) => {
    console.log("model opening");
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  const handleRowLimitChange = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setRowLimit(companyData.length); // Show all rows if input is empty
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue > 0) {
        setRowLimit(parsedValue);
      }
    }
  };

  const sortAscending = () => {
    const sortedData = [...companyData].sort(
      (a, b) => parseFloat(a.doc_size) - parseFloat(b.doc_size)
    );
    setCompanyData(sortedData);
  };

  const sortDescending = () => {
    const sortedData = [...companyData].sort(
      (a, b) => parseFloat(b.doc_size) - parseFloat(a.doc_size)
    );
    setCompanyData(sortedData);
  };

  ChartJS.register(ArcElement, Legend, ChartDataLabels);


  // Prepare chart data
  const chartDataArray = Object.entries(chartData).flatMap(([year, months]) =>
    Object.entries(months).flatMap(([month, data]) =>
      data.companies
        ? data.companies.map(company => ({
            year,
            month,
            company: company.companyname,
            document_count: company.Doccount,
            file_size: company.FileSize,
          }))
        : []
    )
  );

  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const groupedData = allMonths.map(month => {
    const existingEntry = chartDataArray.filter(item => item.month === month);
    return {
      month,
      total_documents: existingEntry.length
        ? existingEntry.reduce((sum, item) => sum + item.document_count, 0)
        : 0,
      total_file_size: existingEntry.length
        ? existingEntry.reduce((sum, item) => sum + (parseFloat(item.file_size) || 0), 0)
        : 0,
      companies: existingEntry.length
        ? existingEntry.map(item => ({
            company: item.company,
            document_count: item.document_count,
            file_size: item.file_size,
          }))
        : [],
    };
  });

  console.log(client,"dinu")
  const formattedData = chartDataArray.reduce((acc, item) => {
    const { year, month, company, document_count, file_size } = item;

    if (!acc[year]) {
      acc[year] = {}; // Initialize year if not present
    }

    acc[year][month] = {
      companyname: company,
      Doccount: document_count, // Now only a number
      FileSize: file_size, // Ensure file size is included
    };

    return acc;
  }, {});

  const OrganizationDashboard = ({ organizationId }) => {
    const [orgDetails, setOrgDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchOrgDetails = async () => {
        try {
          const data = await apiServices.organizationIdDetails(organizationId);
          console.log("Organization Full Data:", data); // 🔍 Console log full class data
          setOrgDetails(data);
        } catch (err) {
          console.error("Failed to fetch organization details:", err);
          setError("Failed to load data");
        } finally {
          setLoading(false);
        }
      };
  
      if (organizationId) {
        fetchOrgDetails();
      }
    }, [organizationId]);
  
    if (loading) return <p>Loading organization details...</p>;
    if (error) return <p>{error}</p>;
  
    const summary = orgDetails.summary;
    console.log("Summary:", summary); // 🔍

    return ( 
      ""
    )
  };    


  const detailsoforg = (clickedMonth) => {
    if (clickedMonth) {
      // Find data for the clicked month
      const clickedData = groupedData.find(
        (data) => data.month === clickedMonth
      );

      if (clickedData) {
        console.log(clickedData);
        openModal(clickedData); // Open modal with clicked data
      }
    }
  };

  const selectedCompanyData =
  selectedCompany && selectedCompany !== "All Companies"
    ? groupedData.filter((item) =>
        item.companies.some((c) => c.company === selectedCompany)
      )
    : groupedData; // ✅ Show full data when "All Companies" is selected

// ✅ Check if there's no data for the selection
const isDataEmpty = selectedCompanyData.every(
  (item) => item.total_documents === 0
);

  // Calculate total file size in MB
  const totalFileSizeMB = companyData.reduce(
    (acc, cur) => acc + (parseFloat(cur.doc_size) || 0), 0
  ) / 1024;

  return (
    <div className="dashboard-body boy bg">
      <div className="dashboard-container">
        <h2
          className={isAdminOrDocumentRole ? "dashboard-h2" : "dashboard-h2-1"}
          style={{
            // marginTop: isUploader ? "0px" : isReviewer ? "0px" : isViewer ? "" : isAdminOrDocumentRole ? "135px" : "0px",
            position: "relative",
            bottom: isUploader ? "20px" : "",
          }}
        >
          Welcome, {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}
        </h2>

        {/* Product Owner/Admin Dashboard */}
        {isProductOwner && (
          <>
            <div className="cards-container bg">
              <CardAnalytics OrgCount={orgCount} />
              <UserPieChart 
                userCount={orgCount?.user_count || 0} 
                enquiryCount={enquiryData?.enquiry_count || 0} 
                msiCount={msiData?.msi_pending_count || 0} 
              />
              <ProgressBarChart totalSize={totalFileSizeMB} />
            </div>

            <div className="charts-container bg">
              <div className="chart">
                <div className="dashboard-btngrp">
                  <button className="dashboard-top" onClick={() => {
                    const sorted = [...companyData].sort((a, b) => 
                      parseFloat(a.doc_size) - parseFloat(b.doc_size)
                    );
                    setCompanyData(sorted);
                  }}>
                    <FaArrowUp />
                  </button>
                  <button className="dashboard-bottom" onClick={() => {
                    const sorted = [...companyData].sort((a, b) => 
                      parseFloat(b.doc_size) - parseFloat(a.doc_size))
                    setCompanyData(sorted);
                  }}>
                    <FaArrowDown />
                  </button>
                </div>

                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search Company..."
                    className="dashboard-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <CompanyTable
                orgSummary={orgSummary}
                  companyData={companyData}
                  setCompanyData={setCompanyData}
                  isLoading={isLoading}
                  handleOpenModalData={handleOpenModalData}
                  openModalData={openModalData}
                  closeModalData={closeModalData}
                  rowLimit={rowLimit}
                  setRowLimit={setRowLimit}
                  searchTerm={searchTerm}
                />
              </div>

              <FileSizeTrendsChart
                selectedReportYear={selectedReportYear}
                setmodalOpenChart={setIsModalOpen}
                setchartcomapny={setSelectedCompany}
                chartcomapny={selectedCompany}
                modalOpenChart={isModalOpen}
                setSelectedReportYear={setSelectedReportYear}
                uniqueReportYears={uniqueReportYears}
                companyData={companyData}
                groupedData={groupedData}
                setSelectedCompany={setSelectedCompany}
              />
            </div>
          </>
        )}

        {/* Admin/Document Role Dashboard */}
        {(isAdminOrDocumentRole || isUploader) && (
          <div className="dashboard-cards-container-fit-1">
            <CardAnalytics
              DashboardStats={DashboardStats}
              isAdminOrDocumentRole={isAdminOrDocumentRole || isUploader}
            />
            {isAdmin ?
            <UserPieChart
              userCount={totalUsers}
              uploadCount={uploaderCount}
              reviewerCount={reviewerCount}
              viewerCount={viewerCount}
              isAdminOrDocumentRole={isAdminOrDocumentRole || isUploader}
            />:""
            }
            <ProgressBarChart
              client={client}
              totalSize={totalFileSizeMB}
              isUploader={isUploader}
              isReviewer={isReviewer}
              isViewer = {isViewer}
              isAdminOrDocumentRole={isAdminOrDocumentRole}
            />
          </div>
        )}

        {/* Admin Document Management */}
        {isAdminOrDocumentRole && (
          <div className="admin-dashboard-container">
            <div className="chart-container">
            {/* <div className="aswin"> */}
              <CompanyTable
                companyData={companyData}
                isLoading={isLoading}
                rowLimit={rowLimit}
                setCompanyData={setCompanyData}
                searchTerm={searchTerm}
                isAdminOrDocumentRole={isAdminOrDocumentRole}
                tableforadmin={tableforadmin}
                setRowLimit={setRowLimit}
              />
            
            </div>
            <div className="trend-chart-container">
              <MonthlyDocumentChart
                selectedReportYear={selectedReportYear}
                setmodalOpenChart={setIsModalOpen}
                setchartcomapny={setSelectedCompany}
                chartcomapny={selectedCompany}
                modalOpenChart={isModalOpen}
                setSelectedReportYear={setSelectedReportYear}
                uniqueReportYears={uniqueReportYears}
                groupedData={groupedData}
                isAdminOrDocumentRole={isAdminOrDocumentRole}
                dashboardData={dashboardData}
              />
              {isAdmin ?
              <DeclarationDeatilsMonthly />
              :""
}
            </div>
            </div>
            
          // </div>
        )}
      </div>
    </div>
  );
};

export default DashboardApp;