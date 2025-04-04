import React, { useEffect, useState, useRef } from "react";
import "./dashboard.css";
 import ClipLoader from "react-spinners/ClipLoader";
import LoadingText from "./LoadingText";
import Loader from "react-js-loader";

import { IoPeople } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaBuildingCircleXmark } from "react-icons/fa6";
import { FaBuildingCircleExclamation } from "react-icons/fa6";
import { IoMdCloudUpload } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdPending, MdCancel, MdMargin } from "react-icons/md";
import apiServices from "../../ApiServices/ApiServices";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Bar,
} from "recharts";
import { ComposedChart } from "recharts";

import { curveCardinal } from "d3-shape";
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
  
 

ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend
);

const Dashboard = ({ title }) => (
  <div className="dashboard">
    <h1 className="dashboard-h1">{title}</h1>
  </div>
);

const DashboardApp = () => {
  const [chartDataforadminn, setChartDataforadmin] = useState([]);
  const [adminProgress, setAdminProgress] = useState(0); // total uploaded size (MB)

  const [selectedYear, setSelectedYear] = useState("2023");
  const [OrgCount, setOrgCount] = useState([]);
  const [count, setCount] = useState([]);

  const [chartData, setChartData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0); // Track loading progress
  const [stickyTooltip, setStickyTooltip] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalData, setOpenModalData] = useState(null); // Manages modal state
  const [organizationId, setOrganizationId] = useState("");
  const [tableforadmin, settableforadmin] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [yearMonth, setYearMonth] = useState([]);
  const [month, setMonth] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]); // Store unique years for dropdown
  const [isLoading, setIsLoading] = useState(false);
  const [searchTermAdmin, setSearchTermAdmin] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedReportYear, setSelectedReportYear] = useState(""); // Renamed state
  const [uniqueReportYears, setUniqueReportYears] = useState([]); // Renamed state for unique years
  const [hoveredTooltip, setHoveredTooltip] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [UploaderCount, setUploaderCount] = useState(0);
  const [ReviewerCount, setReviewerCount] = useState(0);
  const [viewerCount, setviewerCount] = useState(0);
  const [client, setclient] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState([])
  const [MsiCount, setMsiCount] = useState([])

  const [isTooltipSticky, setIsTooltipSticky] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [modalOpenChart, setmodalOpenChart] = useState(false);
  const [rowLimit, setRowLimit] = useState(5);
  const [chartcomapny, setchartcomapny] = useState("");
  const [DashboardStats, setDashboardStats] = useState({});
  const username = localStorage.getItem("name") || "User";
  const [data, setData] = useState([]);
  console.log("!!!!!!!!!!!!!!!!!!!!!!", DashboardStats);

  const CustomTooltip = ({
    active,
    payload,
    isSticky,
    setIsSticky,
    onCompanyClick,
  }) => {
    if ((active || isSticky) && payload && payload.length) {
      const monthData = payload[0].payload;

      return (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.y - 50, // Adjust Y position
            left: tooltipPosition.x + 10, // Adjust X position
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent tooltip from closing when clicked
        >
          <p>
            <strong>📅 Month:</strong> {monthData.month}
          </p>
          <hr />
          <strong>Company Breakdown:</strong>
          {monthData.companies.map((company, index) => (
            <div
              key={index}
              style={{ paddingLeft: "10px", borderBottom: "1px solid #ddd" }}
            >
              <p
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => onCompanyClick(company)}
              >
                📌 <strong>{company.company}</strong>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  console.log("Aswin", tableforadmin.users);
  const role = localStorage.getItem("role");
  const isUploader = role === "UPLOADER";
  const isAdminOrDocumentRole = [
    "ADMIN",
    "UPLOADER",
    "APPROVER",
    "REVIEWER",
    "VIEWER",
  ].includes(role);
  const companyNames = [...new Set(companyData.map((item) => item.org_name))];
  const filteredCompanies = companyNames.filter((name) =>
    name?.toLowerCase().includes((searchTerm || "").toLowerCase())
  );
  

  useEffect(() => {
    if (isAdminOrDocumentRole) {
      const fetchDashboardData = async () => {
        try {
          const response = await apiServices.MonthYearCompany();
          console.log("Raw Data:", response);

          const monthMap = {
            January: "Jan",
            February: "Feb",
            March: "Mar",
            April: "Apr",
            May: "May",
            June: "Jun",
            July: "Jul",
            August: "Aug",
            September: "Sep",
            October: "Oct",
            November: "Nov",
            December: "Dec",
          };

          const allMonths = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          const existingData = response.flatMap((org) =>
            org.years.flatMap((yearData) => yearData.monthly_document_counts)
          );

          const convertFileSizeToMB = (sizeString) => {
            if (!sizeString) return 0;
            const [value, unit] = sizeString.split(" ");
            const size = parseFloat(value);

            if (unit === "GB") return size * 1024;
            if (unit === "KB") return size / 1024;
            return size;
          };

          const transformedData = allMonths.map((shortMonth) => {
            const found = existingData.find(
              (m) => monthMap[m.month] === shortMonth
            );
            return {
              month: shortMonth,
              docCount: found ? found.document_count : 0,
              fileSizeMB: found ? convertFileSizeToMB(found.file_size) : 0,
            };
          });

          console.log("Transformed Data with File Sizes:", transformedData);
          setDashboardData(transformedData);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
      const details = async () => {
        const details_data = await apiServices.details();
        console.log(details_data);
      };
      details();
      fetchDashboardData();
    }
  }, [isAdminOrDocumentRole]);

  const fetchIndividualAdmin = async (organizationId) => {
    try {
      const response = await apiServices.tableIndividual(organizationId);
      settableforadmin(response);
  
      // ✅ Total user count for Pie Chart
      const totalUsersCount = response?.users?.length || 0;
      const UploaderCount = response.users.filter((u) => u.role === "UPLOADER").length || 0;
      const ReviewerCount = response.users.filter((u) => u.role === "REVIEWER").length || 0;
      const ViewerCount = response.users.filter((u) => u.role === "VIEWER").length || 0;
      // const ApproverCount = response.users.filter((u) => u.role === "APPROVER").length || 0;

      // console.log("Uploader Count:", UploaderCount);
      // console.log("Reviewer Count:", ReviewerCount);
      // console.log("Viewer Count:", ViewerCount);
      // console.log("Approver Count:", ApproverCount);

      setTotalUsers(totalUsersCount);
      setUploaderCount(UploaderCount);
      setReviewerCount(ReviewerCount);
      setviewerCount(ViewerCount);

      // console.log("Uploader Response:",UploaderCount);
      // const ReviewerCount = 
      // const ViewerCount = 
      // setTotalUsers(totalUsersCount);
      // setUploaderCount(UploaderCount);
  
      console.log("User Response",response.users);
  
      // ✅ Uploaded file size total (from uploaded_files_size_mb)
      const uploadedSizes = response?.users?.map(user => user.uploaded_files_size_mb || 0);
      const totalUploadedSize = uploadedSizes.reduce((acc, size) => acc + size, 0);
      setAdminProgress(totalUploadedSize); // ✅ new state for uploaded size
  
      // ✅ Total of all file sizes (you can customize this logic)
      const allFileSizes = response?.users?.map(user => 
        (user.uploaded_files_size_mb || 0) + 
        (user.approved_files_size_mb || 0) + 
        (user.rejected_files_size_mb || 0)       );

      console.log(allFileSizes,"sheik")
      const totalSizeMB = allFileSizes.reduce((acc, size) => acc + size, 0);
      console.log(totalSizeMB,"abi")
      const totalSizeMB1 = response?.users?.reduce((acc, user) => {
        if (user.role === "UPLOADER") {
          const uploadedSize = user.uploaded_files_size_mb || 0;
          const approvedSize = user.approved_files_size_mb || 0;
          const rejectedSize = user.rejected_files_size_mb || 0;
          return acc + uploadedSize + approvedSize + rejectedSize;
        }
        return acc;
      }, 0);
      setclient(totalSizeMB1);
  
    } catch (error) {
      console.error("Error fetching individual admin data:", error);
    }
  };
  
  
  

  useEffect(() => {
    if (organizationId) {
      // Ensure it's only called when the ID is available
      fetchIndividualAdmin(organizationId);
    }
  }, [organizationId]); // Only runs when `organizationId` changes

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiServices.details();
        console.log(response);
        const id = response?.details?.[1]?.id;
        if (id) {
          setOrganizationId(id);
        } else {
          console.warn("No organization ID found.");
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };
    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiServices.DashboardView();
        console.log("Dashboard data:", response);
        setDashboardStats(response);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      const startTime = performance.now();
      setIsLoading(true);
      setLoadingPercentage(0);

      // Simulated progress bar up to 90%
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 1;
        if (progress <= 100) setLoadingPercentage(progress);
        else clearInterval(progressInterval);
      }, 100);

      try {
        const [
          orgCountResponse,
          companyCountResponse,
          yearMonthCompanyResponse,
          lineDataResponse,
          detailsResponse,
          dashboardResponse,
          userCountResponse,
        ] = await Promise.all([
          apiServices.organizationCount(),
          apiServices.companyCount(),
          apiServices.MonthYearCompany(),
          apiServices.getlinedata(),
          apiServices.details(),
          apiServices.DashboardView(),
          apiServices.msi_Enquiry(),
        ]);

        // 🟩 1. Set Org Count
        if (orgCountResponse) {
          const dashboard = orgCountResponse.map((db) => ({
            org_name: db.organization_name,
            username: db.organization_user,
            doc_count: db.total_files_all,
            doc_size: db.total_file_size_all,
            emp: db.total_employees,
          }));
          setCompanyData(dashboard);
        }

        // 🟩 2. Company Count Stats
        if (companyCountResponse) {
          setOrgCount({
            totalCompanies: companyCountResponse.total_organizations || 0,
            activeCompanies: companyCountResponse.active_org_count || 0,
            inactiveCompanies: companyCountResponse.inactive_org_count || 0,
            clientAdmins: companyCountResponse.user_count || 0,
            totalDocuments: companyCountResponse.document_count || 0,
            approvedDocuments: companyCountResponse.approved_count || 0,
            pendingDocuments: companyCountResponse.pending_org_count || 0,
            rejectedDocuments: companyCountResponse.rejected_count || 0,
            user_count: companyCountResponse.user_count || 0,
            deleted_org_count: companyCountResponse.deleted_org_count || 0,
          });
        }

        // 🟩 3. Dashboard Stats for Admin
        if (dashboardResponse) setDashboardStats(dashboardResponse);

        // 🟩 4. Line Chart
        if (lineDataResponse) {
          const trends = lineDataResponse.map((ct) => ({
            count: ct.count,
            month: ct.month,
            year: ct.year,
          }));
          setData(trends);
          const uniqueYears = [...new Set(trends.map((ct) => ct.year))];
          setSelectedYear(uniqueYears[0] || "2023");

          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          const monthData = trends.filter((ct) => ct.year === selectedYear);
          const mapped = monthData.reduce((acc, cur) => {
            acc[cur.month] = cur.count;
            return acc;
          }, {});
          setMonth(months);
          setCount(months.map((m) => mapped[m] || 0));
        }

        // 🟩 5. Year-Month-Company Chart
        if (yearMonthCompanyResponse) {
          const monthShort = {
            January: "Jan",
            February: "Feb",
            March: "Mar",
            April: "Apr",
            May: "May",
            June: "Jun",
            July: "Jul",
            August: "Aug",
            September: "Sep",
            October: "Oct",
            November: "Nov",
            December: "Dec",
          };
          const allMonths = Object.values(monthShort);
          const formatted = {};
          const years = new Set();

          yearMonthCompanyResponse.forEach((company) => {
            company.years.forEach((year) => {
              years.add(year.year);
              if (!formatted[year.year]) formatted[year.year] = {};
              allMonths.forEach((m) => {
                if (!formatted[year.year][m]) {
                  formatted[year.year][m] = { companies: [] };
                }
              });

              year.monthly_document_counts.forEach((monthData) => {
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

        // 🟩 6. Details (to get Organization ID)
        if (detailsResponse) {
          const id = detailsResponse?.details?.[1]?.id;
          if (id) setOrganizationId(id);
        }

        if(userCountResponse) {
          setCount({
            enquiryCount:userCountResponse.enquiry_count || 0,
            msiCount:userCountResponse.msi_pending_count || 0,
          })
          setEnquiryCount(userCountResponse);
          setMsiCount(userCountResponse);
          console.log("Msi Enquiry:", userCountResponse)
        }

        // ⏱️ Delay to ensure minimum 10s loading
        const endTime = performance.now();
        const elapsed = endTime - startTime;
        const remaining = Math.max(10000 - elapsed, 0);

        setTimeout(() => {
          clearInterval(progressInterval);
          setLoadingPercentage(100);
          setIsLoading(false);
        }, remaining);
      } catch (err) {
        console.error("🔥 Dashboard Load Error:", err);
        clearInterval(progressInterval);
        setIsLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

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

  // Handle role selection change

  // Function to open the modal with selected row data
  const handleOpenModalData = (company) => {
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

 

  // Check if the role should have the cards displayed

  const chartDataArray = Object.entries(chartData).flatMap(([year, months]) =>
    Object.entries(months).flatMap(([month, data]) =>
      data.companies
        ? data.companies.map((company) => ({
            year,
            month,
            company: company.companyname,
            document_count: company.Doccount, // Keep count
            file_size: company.FileSize, // Ensure file size is included
          }))
        : []
    )
  );

  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const groupedData = allMonths.map((month) => {
    // Find data for the current month
    const existingEntry = chartDataArray.filter((item) => item.month === month);

    return {
      month,
      total_documents: existingEntry.length
        ? existingEntry.reduce((sum, item) => sum + item.document_count, 0)
        : 0, // ✅ Set to 0 if no data

      total_file_size: existingEntry.length
        ? existingEntry.reduce(
            (sum, item) => sum + (parseFloat(item.file_size) || 0),
            0
          )
        : 0, // ✅ Set to 0 if no data

      companies: existingEntry.length
        ? existingEntry.map((item) => ({
            company: item.company,
            document_count: item.document_count,
            file_size: item.file_size,
          }))
        : [], // ✅ Empty array for missing months
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

  // console.log(formattedData);
  // datas for chatrs for product owner

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

   

  const filteredData = companyData.filter(
    (company) =>
      company.org_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalFileSizeMB =
    companyData.reduce((acc, cur) => acc + (parseFloat(cur.doc_size) || 0), 0) /
    1024;
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

  return (
    <div className="dashboard-body boy bg">
      <div className="dashboard-container">
        {/* <Dashboard title="Visionboard" />*/}

        {isAdminOrDocumentRole ? (
          <h2
            className="dashboard-h2"
            style={{ marginTop: "130px", position: "relative" }}
          >
            Welcome,{" "}
            {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}{" "}
          </h2>
        ) : (
          <h2 className="dashboard-h2-1">
            Welcome,{" "}
            {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}{" "}
          </h2>
        )}

        {(role === "PRODUCT_OWNER" || role === "PRODUCT_ADMIN") && (
          <>
            <div className="cards-container bg">
              <CardAnalytics OrgCount={OrgCount} />
              <UserPieChart userCount={OrgCount?.user_count || 0 } enquiryCount={enquiryCount?.enquiry_count || 0} msiCount={MsiCount?.msi_pending_count || 0 }/>
              <ProgressBarChart totalSize={totalFileSizeMB} />
            </div>

            <div className="charts-container bg">
              {data.map}

              <div className="chart">
                <div
                  className="dashboard-btngrp"
                  style={{
                    marginBottom: "-10px",
                    marginTop: "40px",
                    position: "relative",
                  }}
                >
                  <button className="dashboard-top" onClick={sortAscending}>
                    <FaArrowUp />
                  </button>
                  <button className="dashboard-bottom" onClick={sortDescending}>
                    <FaArrowDown />
                  </button>
                
                </div>

                <div
                  className="search-container"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    zIndex: "999",
                    top: "-55px",
                  }}
                >
                  
             
                    <input
                      type="text"
                      placeholder="Search Company..."
                      className="dashboard-search"
                      value={searchTerm}
      
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "180px" , // Expands when focused
                        height: "20px",
                        border: "none",
                        borderBottom: "1px solid #ccc", // Single-line effect
                        background: "transparent",
                        outlineColor: "none",
                        fontSize: "14px",
                        transition: "width 0.3s ease-in-out",
                      }}
                    />
               
                </div>

                {/* //table for owner/ */}       
                <CompanyTable
  companyData={companyData}
  setCompanyData={setCompanyData} // ✅ You must add this line!
  isLoading={isLoading}
  rowLimit={rowLimit}
   setRowLimit={setRowLimit}
  searchTerm={searchTerm}
  handleOpenModalData={handleOpenModalData}
  openModalData={openModalData}
  closeModalData={closeModalData}
  searchTermAdmin={searchTermAdmin}
  setSearchTermAdmin={setSearchTermAdmin}
  isSearchFocused={isSearchFocused}
  setIsSearchFocused={setIsSearchFocused}
  tableforadmin={tableforadmin}
/>



              </div>
              <FileSizeTrendsChart
                selectedReportYear={selectedReportYear}
                setSelectedReportYear={setSelectedReportYear}
                uniqueReportYears={uniqueReportYears}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                companyData={companyData}
                modalOpenChart={modalOpenChart}
                setmodalOpenChart={setmodalOpenChart}
                chartcomapny={chartcomapny}
                setchartcomapny={setchartcomapny}
                groupedData={groupedData}
                setModalData={setModalData}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
              />
            </div>
          </>
        )}

        {/* ADMINROLE */}

        {(isAdminOrDocumentRole || isUploader) && (
  <>
    <CardAnalytics
      DashboardStats={DashboardStats}
      isAdminOrDocumentRole={isAdminOrDocumentRole || isUploader} // ✅ Support uploader
    />
    <UserPieChart
      userCount={totalUsers}
      uploadCount={UploaderCount}
      reviewerCount={ReviewerCount}
      viewerCount={viewerCount}
      enquiryCount={totalUsers}
      msiCount={totalUsers}
      isAdminOrDocumentRole={isAdminOrDocumentRole || isUploader}
    />
<ProgressBarChart
  client={client}
  totalSize={totalFileSizeMB}
  isUploader={isUploader}
  isAdminOrDocumentRole={isAdminOrDocumentRole}
/>

  </>
)}


        {isAdminOrDocumentRole && (
          <div className="admin-dashboard-container">
            {/* Left Side: Area Chart */}
            <div className="chart-container">

            <CompanyTable
        companyData={companyData}
        isLoading={isLoading}
        rowLimit={rowLimit}
        setCompanyData={setCompanyData} // ✅ You must add this line!

        searchTerm={searchTerm}
        handleOpenModalData={handleOpenModalData}
        openModalData={openModalData}
        closeModalData={closeModalData}
        isAdminOrDocumentRole={isAdminOrDocumentRole}
        searchTermAdmin={searchTermAdmin}
        setSearchTermAdmin={setSearchTermAdmin}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        tableforadmin={tableforadmin}
          setRowLimit={setRowLimit}
       />




            </div>

            {/* Right Side: Table */}
            <div className="aswin">
              {isAdminOrDocumentRole && (



                <><MonthlyDocumentChart
                  groupedData={groupedData}
                  setModalData={setModalData}
                  setIsModalOpen={setIsModalOpen}
                  setmodalOpenChart={setmodalOpenChart}
                  isAdminOrDocumentRole={isAdminOrDocumentRole}
                  dashboardData={dashboardData} />
                  </>


              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const role = localStorage.getItem("role");
const isAdminOrDocumentRole = [
  "ADMIN",
  "UPLOADER",
  "APPROVER",
  "REVIEWER",
  "VIEWER",
].includes(role);

const Card = ({ title, value = 1, icon, role, bgColor }) => {
  const cardStyle = {
    backgroundColor: ["ADMIN", "UPLOADER", "REVIEWER", "VIEWER"].includes(role)
      ? bgColor
      : "",
    marginTop: ["UPLOADER", "REVIEWER", "VIEWER"].includes(role) ? "10%" : "",
  };
  return (
    <div
      className={`${isAdminOrDocumentRole === "ADMIN" ? "card1" : "card"}`}
      style={cardStyle}
    >
      <div className="card-title">
        <div className="card-icon">{icon}</div>
        <div className="card-info">
          <h2>{title}</h2>
          <p>{value ?? 0}</p> {/* Ensures value is always displayed */}
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;
