import React, { useEffect, useState, useRef } from "react";
import "./dashboard.css";
import { FaSearch } from "react-icons/fa"; // Search icon
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
} from "recharts";
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

// const CompanyDetailsModal = ({ company, onClose }) => {
//   if (!company) return null;

//   return (
//     <div style={{
//       position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
//       backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
//     }}>
//       <h3>Company Details</h3>
//       <p><strong>Company:</strong> {company.company}</p>
//       <p><strong>📑 Documents:</strong> {company.document_count}</p>
//       <p><strong>📁 Size:</strong> {company.file_size}</p>
//       <button onClick={onClose} style={{ marginTop: "10px", cursor: "pointer" }}>Close</button>
//     </div>
//   );
// };

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


  //MOCK DATA FOR ADMIN CLIENT

  const mockData = {
    UPLOADER: { count: 10, label: "Uploaders" },
    VIEWER: { count: 15, label: "Viewers" },
    APPROVER: { count: 8, label: "Approvers" },
  };
  const mockDataTable = [
    {
      id: 1,
      companyName: "Smart Tech",
      username: "tech_admin",
      month: "Jan",
      docCount: 12,
      fileSize: 500,
      role: "UPLOADER",
    },
    {
      id: 2,
      companyName: "Smart Tech",
      username: "code_viewer",
      month: "Jan",
      docCount: 20,
      fileSize: 800,
      role: "VIEWER",
    },
    {
      id: 3,
      companyName: "Smart Tech",
      username: "data_approver",
      month: "Feb",
      docCount: 18,
      fileSize: 700,
      role: "APPROVER",
    },
    {
      id: 4,
      companyName: "Smart Tech",
      username: "cloud_uploader",
      month: "Feb",
      docCount: 25,
      fileSize: 950,
      role: "UPLOADER",
    },
    {
      id: 5,
      companyName: "Smart Tech",
      username: "web_viewer",
      month: "Mar",
      docCount: 10,
      fileSize: 400,
      role: "VIEWER",
    },
    {
      id: 6,
      companyName: "Smart Tech",
      username: "smart_approver",
      month: "Mar",
      docCount: 15,
      fileSize: 600,
      role: "APPROVER",
    },
  ];

  // 📌 Group Data by Month based on Role

  const totalUsers = Object.values(mockData).reduce(
    (acc, role) => acc + role.count,
    0
  );
  // 🔹 Default: Show "Users" (sum of all roles)
  const [selectedRole, setSelectedRole] = useState("USERS");
  const [userData, setUserData] = useState({
    count: totalUsers,
    label: "Users",
  });

  useEffect(() => {
    const initialData = mockDataTable.map((item) => ({
      name: item.username,
      docCount: item.docCount,
      fileSize: item.fileSize,
    }));
    setChartDataforadmin(initialData);
  }, []);

  const filteredMockData =
    selectedRole === "USERS"
      ? mockDataTable // Show all users when "Users" is selected
      : mockDataTable.filter((item) => item.role === selectedRole);

  useEffect(() => {
    const filteredData = mockDataTable.filter(
      (data) => data.role === selectedRole
    );

    const groupedData = [
      { month: "Jan", docCount: 0 },
      { month: "Feb", docCount: 0 },
      { month: "Mar", docCount: 0 },
      { month: "Apr", docCount: 0 },
      { month: "May", docCount: 0 },
      { month: "Jun", docCount: 0 },
      { month: "Jul", docCount: 0 },
      { month: "Aug", docCount: 0 },
      { month: "Sep", docCount: 0 },
      { month: "Oct", docCount: 0 },
      { month: "Nov", docCount: 0 },
      { month: "Dec", docCount: 0 },
    ];

    filteredData.forEach((item) => {
      const monthIndex = groupedData.findIndex(
        (data) => data.month === item.month
      );
      if (monthIndex !== -1) groupedData[monthIndex].docCount += item.docCount;
    });

    setChartData(groupedData);
  }, [selectedRole]);

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
const [tableforadmin,settableforadmin] = useState("")
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

  const [isTooltipSticky, setIsTooltipSticky] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [modalOpenChart, setmodalOpenChart] = useState(false);
  const [rowLimit, setRowLimit] = useState("5");
  const [chartcomapny, setchartcomapny] = useState("");
  const [DashboardStats, setDashboardStats] = useState({});
  const username = localStorage.getItem("name") || "User";
  const [data, setData] = useState([]);
  console.log("!!!!!!!!!!!!!!!!!!!!!!",organizationId)
  const filteredDataAdmin = filteredMockData.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTermAdmin.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTermAdmin.toLowerCase())
  );

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

  console.log("Aswin",tableforadmin.users)
  const role = localStorage.getItem("role");

  const isAdminOrDocumentRole = [
    "ADMIN",
    "UPLOADER",
    "APPROVER",
    "REVIEWER",
    "VIEWER",
  ].includes(role);
  const companyNames = [...new Set(companyData.map((item) => item.org_name))];
  const filteredCompanies = companyNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isAdminOrDocumentRole) {
      const fetchDashboardData = async () => {
        try {
          const response = await apiServices.MonthYearCompany();
          console.log("Raw Data:", response);
  
          const monthMap = {
            January: "Jan", February: "Feb", March: "Mar", April: "Apr",
            May: "May", June: "Jun", July: "Jul", August: "Aug",
            September: "Sep", October: "Oct", November: "Nov", December: "Dec"
          };
  
          const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
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
              fileSizeMB: found ? convertFileSizeToMB(found.file_size) : 0
            };
          });
  
          console.log("Transformed Data with File Sizes:", transformedData);
          setDashboardData(transformedData);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
  const details =async()=>{
    const details_data = await apiServices.details();
    console.log(details_data)
  }
  details();
      fetchDashboardData();
    }
  }, [isAdminOrDocumentRole]);

  const fetchIndividualAdmin = async (organizationId) => {
    try {

      console.log(organizationId)
      const response = await apiServices.tableIndividual(organizationId); // GET request
      settableforadmin(response)
      console.log("Individual Admin Response:", response);



    } catch (error) {
      console.error("Error fetching individual admin data:", error);
    }
  };

  useEffect(() => {
    if (organizationId) { // Ensure it's only called when the ID is available
      fetchIndividualAdmin(organizationId);
    }
  }, [organizationId]); // Only runs when `organizationId` changes
  
   
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiServices.details();
        console.log(response)
        const id = response?.details?.[1]?.id;
        if (id) {
          setOrganizationId(id);
         } else {
          console.warn("No organization ID found.");
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();


  }, []);
  
  
  
 
 
 
 
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const response = await apiServices.DashboardView();
      console.log("Dashboard data:", response);
      setDashboardStats(response)
     } catch (err) {
      console.error("Error fetching dashboard data:", err);
     } finally {
      setIsLoading(false);
    }
  };

  fetchDashboardData();
}, []);






useEffect(() => {
  const fetchDetails = async () => {
    try {
      const response = await apiServices.details();
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@",response)

      if (response) {
        setOrganizationId(response.details[1]?.id);
        console.log("Fetched Organization ID:", response);
      } else {
        console.warn("No ID found at index 1.");
      }
    } catch (err) {
      console.error("Error fetching details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchDetails();
});






 
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setLoadingPercentage(0);

        const startTime = performance.now(); // Start timing

        // **Simulate progress update every 100ms**
        const interval = setInterval(() => {
          setLoadingPercentage((prev) => (prev < 90 ? prev + 10 : prev)); // Increase in steps but stop at 90%
        }, 200);

        // Call all API requests in parallel
        const [
          orgCountResponse,
          companyCountResponse,
          yearMonthCompanyResponse,
          lineDataResponse,
           
  details

   
          
        ] = await Promise.all([
          apiServices.organizationCount(),
          apiServices.companyCount(),
          apiServices.MonthYearCompany(),
          apiServices.getlinedata(),
          apiServices.details()
         ]);

 
        
 
//  console.log(DashboardStats)
//         if (dashResponse) {
//           setDashboardStats({
//             employeeCount: orgCountResponse.employee_count || 0,
//             totalDocuments: orgCountResponse.document_count || 0,
//             approvedDocuments: orgCountResponse.approved_count || 0,
//             pendingDocuments: orgCountResponse.pending_count || 0,
//             rejectedDocuments: orgCountResponse.rejected_count || 0,
//           });
//         }

        console.log("2343234543",DashboardStats)
        
        // console.log("2343234543",companyCountResponse)
        // 🔹 Organization Count
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


 
        if(details){
          console.log(details)
        }
        


        // 🔹 Company Count
        if (companyCountResponse) {
          setOrgCount({
            totalCompanies: companyCountResponse.organization_count || 0,
            activeCompanies: companyCountResponse.active_org_count || 0,
            inactiveCompanies: companyCountResponse.deleted_org_count || 0,
            clientAdmins: companyCountResponse.user_count || 0,
            totalDocuments: companyCountResponse.document_count || 0,
            approvedDocuments: companyCountResponse.approved_count || 0,
            pendingDocuments: companyCountResponse.pending_org_count || 0,
            rejectedDocuments: companyCountResponse.rejected_count || 0,
            user_count: companyCountResponse.user_count || 0,
            deleted_org_count: companyCountResponse.deleted_org_count || 0,
          });
        }

        // 🔹 Year-Month-Company Data Processing
        // if (yearMonthCompanyResponse) {
        //   const extractedYears = [...new Set(yearMonthCompanyResponse.flatMap(company => company.years.map(year => year.year)))];
        //   setUniqueYears(extractedYears);
        //   setYearMonth(yearMonthCompanyResponse);

        //   // Map Month Names to Short Names
        //   const monthShortNames = {
        //     "January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr",
        //     "May": "May", "June": "Jun", "July": "Jul", "August": "Aug",
        //     "September": "Sep", "October": "Oct", "November": "Nov", "December": "Dec"
        //   };

        //   const allMonths = Object.values(monthShortNames);

        //   const formattedData = yearMonthCompanyResponse.flatMap(company =>
        //     company.years.flatMap(year => {
        //       const monthDataMap = new Map(year.monthly_document_counts.map(monthData => [
        //         monthShortNames[monthData.month] || monthData.month,
        //         monthData.document_count
        //       ]));

        //       return allMonths.map(shortMonth => ({
        //         company: company.organization_name,
        //         year: year.year,
        //         month: shortMonth,
        //         document_count: monthDataMap.get(shortMonth) || 0
        //       }));
        //     })
        //   );

        //   setChartData(formattedData);
        // }

        if (yearMonthCompanyResponse) {
          // Extract unique years for dropdown
          const extractedYears = [
            ...new Set(
              yearMonthCompanyResponse.flatMap((company) =>
                company.years.map((year) => year.year)
              )
            ),
          ];
          setUniqueReportYears(extractedYears);

          // Month name mapping
          const monthShortNames = {
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

          const allMonths = Object.values(monthShortNames); // Ensure all months are included
          const formattedData = {};

          yearMonthCompanyResponse.forEach((company) => {
            company.years.forEach((year) => {
              if (!formattedData[year.year]) {
                formattedData[year.year] = {}; // Initialize year object
              }

              // Initialize all 12 months to prevent missing values in the chart
              allMonths.forEach((shortMonth) => {
                if (!formattedData[year.year][shortMonth]) {
                  formattedData[year.year][shortMonth] = {
                    companies: [], // Store multiple companies
                  };
                }
              });

              // Fill actual data
              year.monthly_document_counts.forEach((monthData) => {
                const shortMonth =
                  monthShortNames[monthData.month] || monthData.month;

                // Push company data instead of overwriting
                formattedData[year.year][shortMonth].companies.push({
                  companyname: company.organization_name,
                  Doccount: monthData.document_count || 0,
                  FileSize: monthData.file_size || "N/A",
                });
              });
            });
          });

           setChartData(formattedData);
        }

        // console.log("COmapnieeeeeeeeeeee", yearMonthCompanyResponse); //year based datas for chart froowner

        // 🔹 Line Chart Data Processing
        if (lineDataResponse) {
          const companyTrends = lineDataResponse.map((ct) => ({
            count: ct.count,
            month: ct.month,
            year: ct.year,
          }));

          setData(companyTrends);
          const uniqueYears = [...new Set(companyTrends.map((ct) => ct.year))];
          setSelectedYear(uniqueYears[0] || "2023");

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

          const filteredData = companyTrends.filter(
            (ct) => ct.year === selectedYear
          );

          const monthDataMap = filteredData.reduce((acc, curr) => {
            acc[curr.month] = curr.count;
            return acc;
          }, {});

          const finalCounts = allMonths.map(
            (month) => monthDataMap[month] || 0
          );

          setMonth(allMonths);
          setCount(finalCounts);
        }

        const endTime = performance.now(); // End timing
        const executionTime = endTime - startTime;
        const minLoadingTime = 3000; // **Ensure minimum 3 seconds of loading**
        const remainingTime = minLoadingTime - executionTime;

        // Wait for remaining time before showing content
        setTimeout(
          () => {
            clearInterval(interval);
            setLoadingPercentage(100); // Ensure 100% before hiding loading
            setTimeout(() => setIsLoading(false), 500); // Smooth transition delay
          },
          remainingTime > 0 ? remainingTime : 0
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
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
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Handle role selection change
  const handleRoleChange = (e) => {
    const selected = e.target.value;
    setSelectedRole(selected);
    setUserData(
      selected === "USERS"
        ? { count: totalUsers, label: "Users" }
        : mockData[selected]
    );

    // ✅ Update chart data on role change
    const updatedData =
      selected === "USERS"
        ? mockDataTable
        : mockDataTable.filter((item) => item.role === selected);

    setChartDataforadmin(
      updatedData.map((item) => ({
        name: item.username,
        docCount: item.docCount,
        fileSize: item.fileSize,
      }))
    );
  };

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
      setRowLimit(""); // Show all rows if input is empty
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

  // const donutData = ({ OrgCount }) => {
  //   const totalDocs =
  //     OrgCount.approvedDocuments +
  //     OrgCount.pendingDocuments +
  //     OrgCount.rejectedDocuments;

  //   const donutData = {
  //     labels: [
  //       `Approved (${((OrgCount.approvedDocuments / totalDocs) * 100).toFixed(1)}%)`,
  //       `Pending (${((OrgCount.pendingDocuments / totalDocs) * 100).toFixed(1)}%)`,
  //       `Rejected (${((OrgCount.rejectedDocuments / totalDocs) * 100).toFixed(1)}%)`,
  //     ],
  //     datasets: [
  //       {
  //         data: [
  //           OrgCount.approvedDocuments,
  //           OrgCount.pendingDocuments,
  //           OrgCount.rejectedDocuments,
  //         ],
  //         backgroundColor: ["#077E8C", "#F7CB73", "#D9512C"],
  //         borderWidth: 3,
  //         cutout: "60%", // Adjust to control thickness
  //       },
  //     ],
  //   };

  //   const chartOptions = {
  //     responsive: true,
  //     plugins: {
  //       legend: {
  //         display: true,
  //         position: "right", // Keep legend on the right
  //         align: "center", // Align legend vertically in the middle

  //         labels: {
  //           usePointStyle: true, // Display legend as small circles
  //           boxWidth: 8, // Reduce dot size
  //           padding: 4, // Reduce spacing between legend items
  //         },
  //       },
  //       datalabels: {
  //         color: "#fff",
  //         font: { weight: "bold", size: 14 },
  //         formatter: (value, ctx) => {
  //           let totalDocs = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
  //           let percentage = totalDocs ? ((value / totalDocs) * 100).toFixed(1) : 0;
  //           return `${percentage}%`;
  //         },
  //       },
  //     },
  //     layout: {
  //       padding: {
  //         // right: 250, // Adjust this value to bring legend closer
  //         align: "center", // Align legend vertically in the middle

  //       },
  //     },
  //   };

  //   return (
  //     <div className="w-[300px] mx-auto">
  //       <Doughnut data={donutData} options={chartOptions} />
  //     </div>
  //   );
  // };

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

  // const groupedData = allMonths.map(month => {
  //   // Find data for the current month
  //   const existingEntry = chartDataArray.filter(item => item.month === month);

  //   return {
  //     month,
  //     total_documents: existingEntry.length
  //       ? existingEntry.reduce((sum, item) => sum + item.document_count, 0)
  //       : null, // Show null for missing months
  //     total_file_size: existingEntry.length
  //       ? existingEntry.reduce((sum, item) => sum + (parseFloat(item.file_size) || 0), 0) // Ensure it's a number
  //       : 0, // Default to 0 for missing months
  //     companies: existingEntry.length ? existingEntry.map(item => ({
  //       company: item.company,
  //       document_count: item.document_count,
  //       file_size: item.file_size
  //     })) : []
  //   };
  // });

  // ✅ Now, use `groupedData` in your chart instead of `chartDataArray`

  // console.log(filteredData);

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
        console.log(clickedData)
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

  // const CompanyDetailsModal = ({ company, onClose }) => {
  //   if (!company) return null;

  //   return (
  //     <div style={{
  //       position: "fixed",
  //       top: "50%",
  //       left: "50%",
  //       transform: "translate(-50%, -50%)",
  //       backgroundColor: "#fff",
  //       padding: "20px",
  //       borderRadius: "10px",
  //       boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
  //       zIndex: 1000
  //     }}>
  //       <h3>Company Details</h3>
  //       <p><strong>🏢 Company:</strong> {company.company}</p>
  //       <p><strong>📑 Documents:</strong> {company.document_count}</p>
  //       <p><strong>📂 File Size:</strong> {company.file_size}</p>
  //       <button
  //         onClick={onClose}
  //         style={{
  //           marginTop: "10px",
  //           cursor: "pointer",
  //           padding: "5px 10px",
  //           borderRadius: "5px",
  //           backgroundColor: "red",
  //           color: "white",
  //           border: "none"
  //         }}
  //       >
  //         Close
  //       </button>
  //     </div>
  //   );
  // };
  // {isModalOpen && (
  //   <CompanyDetailsModal company={modalData} onClose={() => setIsModalOpen(false)} />
  // )}







 










  return (
    <div className="dashboard-body boy bg">
      <div className="dashboard-container">
        {/* <Dashboard title="Visionboard" />*/}
      
      {isAdminOrDocumentRole ? 
        <h2 className="dashboard-h2" style={{marginTop:"70px",position:"relative"}}>
          Welcome,{" "}
          {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}{" "}
        </h2> :  <h2 className="dashboard-h2">
          Welcome,{" "}
          {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}{" "}
        </h2>
      }
      


        {(role === "PRODUCT_OWNER" || role === "PRODUCT_ADMIN") && (
          <>
            <div className="cards-container bg">
              <Card
                title="Total Companies"
                value={OrgCount.totalCompanies}
                icon={<HiBuildingOffice2 />}
              />
              <Card
                title="Active Companies"
                value={OrgCount.activeCompanies}
                icon={<HiBuildingOffice2 style={{ color: "green" }} />}
              />
              <Card
                title="Inactive Companies"
                value={OrgCount.inactiveCompanies}
                icon={<HiBuildingOffice2 style={{ color: "#b22d2d" }} />}
              />
              <Card
                title="Deleted Companies"
                value={OrgCount.deletedCompanies}
                icon={<FaBuildingCircleXmark style={{ color: "red" }} />}
              />
              <Card
                title="Pending Documents"
                value={OrgCount.pending_org_count}
                icon={
                  <FaBuildingCircleExclamation style={{ color: "yellow" }} />
                }
              />
              <Card
                title="Users"
                value={OrgCount.user_count}
                icon={<IoPeople />}
              />
            </div>

            <div className="charts-container bg">
              {data.map}
              <div className="chart">
                <p className="dashboard_text">
                  <center>File Size Trends</center>
                </p>
                <center>
                  <div className="slicer">
                    {/* Year Selector Dropdown */}
                    <div className="dropdown-container">
                      {/* Year Dropdown with New Name */}
                      <select
                        className="dashboard-year-select"
                        value={selectedReportYear}
                        onChange={(e) => setSelectedReportYear(e.target.value)}
                      >
                        {uniqueReportYears.map((year, index) => (
                          <option key={index} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Company Selector Dropdown */}
                    <div className="dropdown-container">
                      <select
                        className="company-dropdown"
                        value={selectedCompany || ""}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setSelectedCompany(
                            selectedValue === "" ? null : selectedValue
                          );
                        }}
                      >
                        <option value="">All Companies</option>
                        {companyData.map((company, index) => (
                          <option key={index} value={company.org_name}>
                            {company.org_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* //pop up for chart */}

                  <div>
                    {modalOpenChart && (
                      <div
                        style={{
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "#fff",
                          padding: "20px",
                          borderRadius: "10px",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                          minWidth: "320px",
                          zIndex: 1000,
                        }}
                      >
                        <h3 style={{ marginBottom: "10px" }}>
                          📅 <strong>Month:</strong> {modalOpenChart.month}
                        </h3>

                        {/* 📑 Total Documents and 📁 File Size (Updated Dynamically) */}
                        <p>
                          <strong>📑 Total Documents:</strong>{" "}
                          {chartcomapny
                            ? chartcomapny.document_count
                            : modalOpenChart.total_documents}
                        </p>
                        <p>
  <strong>🏚 Company:</strong>{" "}
  {chartcomapny
    ? chartcomapny.company // ✅ Corrected: Access the company name directly
    : modalOpenChart.companies[0]?.company} {/* ✅ Ensure array access is correct */}
</p>

                        <p>
                          <strong>📁 Total File Size:</strong>{" "}
                          {chartcomapny
                            ? chartcomapny.file_size
                            : modalOpenChart.total_file_size}
                        </p>

                        {modalOpenChart.companies.length > 1 && (
                          <>
                            <h4 style={{ marginTop: "15px" }}>
                              🏢 <strong>Select Company:</strong>
                            </h4>
                            <select
                              onChange={(e) => {
                                const selectedCompanyIndex =
                                  e.target.selectedIndex;
                                console.log(selectedCompanyIndex);
                                const selectedName =
                                  modalOpenChart.companies[
                                    selectedCompanyIndex
                                  ];
                                console.log(selectedName);
                                const foundCompany =
                                  modalOpenChart.companies.find(
                                    (c) => c.company === selectedName.company
                                  );
                                console.log(foundCompany, "fou0000nd");
                                setchartcomapny(foundCompany);
                              }}
                              value={chartcomapny?.company || ""}
                              style={{
                                width: "100%",
                                padding: "5px",
                                marginTop: "5px",
                              }}
                            >
                              {console.log(chartcomapny)}
                              {modalOpenChart.companies.map((company) => (
                                <option key={company.company}>
                                  {company.company}
                                </option>
                              ))}
                            </select>
                          </>
                        )}

                        <button
                          onClick={() => setmodalOpenChart(null)}
                          style={{
                            marginTop: "10px",
                            cursor: "pointer",
                            padding: "5px 10px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                          }}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </center>

                <div className="chart">
                  {groupedData.length > 0 ? (
                    <div>
                      <ResponsiveContainer width="100%" height={250} style={{marginTop:"-40px"}}>
                        {isDataEmpty ? (
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "16px",
                              color: "gray",
                              marginTop: "50px",
                            }}
                          >
                            No data available for{" "}
                            {selectedCompany || "this selection"} 📉
                          </div>
                        ) : (
                          <AreaChart
                            data={groupedData}
                            onClick={(event) => {
                              console.log("CLicked");

                              if (event.activeLabel) {
                                const clickedMonth = event.activeLabel;

                                // Find data for the clicked month
                                const clickedData = groupedData.find(
                                  (data) => data.month === clickedMonth
                                );

                                if (clickedData) {
                                  // openModal(clickedData)
                                  setmodalOpenChart(clickedData);
                                  console.log("✅ Clicked Data:", clickedData); // Log the data when clicked
                                }
                              }
                            }}
                          >
                            {/* 
onClick={(event) => {
if (event && event.activeLabel) {
const clickedMonth = event.activeLabel;

// Find data for the clicked month
const clickedData = groupedData.find(
(data) => data.month === clickedMonth
);

if (clickedData) {
openModal(clickedData)
console.log("✅ Clicked Data:", clickedData); // Log the data when clicked
}
}
}} */}
                            <CartesianGrid
                              stroke="rgba(200, 200, 200, 0.3)"
                              strokeDasharray="4 4"
                            />
                            <XAxis
                              dataKey="month"
                              tick={{ fontSize: 12, fontWeight: "bold" }}
                            />
                            <YAxis
                              tick={{ fontSize: 12, fontWeight: "bold" }}
                            />

<Tooltip
  content={({ active, payload }) => {
    if (active && payload && payload.length) { // ✅ Only active controls tooltip visibility
      const monthData = payload[0].payload;

      return (
        <div
          style={{
             backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            fontSize: "12px",
            zIndex: 9999,
          }}
        >
          <p>
            <strong>📅 Month:</strong> {monthData.month}
          </p>
          <strong>Company Breakdown:</strong>
          {monthData.companies.map((company, index) => (
            <div
              key={index}
              style={{
                paddingLeft: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <p
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setModalData(company);
                  setIsModalOpen(true);
                }}
              >
                📌 <strong>{company.company}</strong>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  }}
  cursor={{ stroke: "blue", strokeWidth: 2 }}
/>


                            <defs>
                              <linearGradient
                                id="colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#007bff"
                                  stopOpacity={0.6}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#007bff"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>

                            <Area
                              type="monotone"
                              dataKey="total_documents"
                              stroke="#007bff"
                              strokeWidth={2.5}
                              fill="url(#colorUv)"
                              fillOpacity={0.7}
                            />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>

                      {/* Show Modal when Company is Selected */}
                    </div>
                  ) : (
                    // Show a simple line if no relevant data found
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart
                        data={[
                          { month: "Jan", document_count: 0 },
                          { month: "Feb", document_count: 0 },
                          { month: "Mar", document_count: 0 },
                          { month: "Apr", document_count: 0 },
                          { month: "May", document_count: 0 },
                          { month: "Jun", document_count: 0 },
                          { month: "Jul", document_count: 0 },
                          { month: "Aug", document_count: 0 },
                          { month: "Sep", document_count: 0 },
                          { month: "Oct", document_count: 0 },
                          { month: "Nov", document_count: 0 },
                          { month: "Dec", document_count: 0 },
                        ]}
                      >
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis
                          dataKey="month"
                          tick={{
                            fontSize: 12,
                            fontWeight: "bold",
                            fill: "#333",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 12,
                            fontWeight: "bold",
                            fill: "#333",
                          }}
                        />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="document_count"
                          stroke="gray"
                          fill="lightgray"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {isModalOpen && (
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                    width: "350px",
                  }}
                >
                  {/* Ensure all values are properly accessed */}
                  {/* <h3>📊 Month: <span>{modalData.month}</span></h3> */}
                  {/* <p><strong>📄 Total Documents:</strong> {modalData.total_documents}</p>
<p><strong>📂 Total File Size:</strong> {modalData.total_file_size} MB</p> */}

                  <h4>🏢 Companies:</h4>
                  {/* Ensure modalData.companies is an array before mapping */}
                  {/* {Array.isArray(modalData.companies) && modalData.companies.length > 0 ? (
<ul style={{ padding: "0", listStyleType: "none" }}>
{modalData.companies.map((company, index) => (
<li key={index} style={{ marginBottom: "8px", padding: "5px", borderBottom: "1px solid #ddd" }}>
<strong>🏢 {company.company}</strong> <br />
📄 <strong>Documents:</strong> {company.document_count} <br />
📂 <strong>File Size:</strong> {company.file_size}
</li>
))}
</ul>
) : (
<p>No company data available</p>
)} */}
                  <p>No company data available</p>
                  <button
                    onClick={closeModal}
                    style={{
                      marginTop: "10px",
                      cursor: "pointer",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      width: "100%",
                    }}
                  >
                    Close
                  </button>
                </div>
              )}

              <div className="chart">
                <p className="dashboard_text">
                  <center>Company File Size</center>
                </p>
                <div className="dashboard-btngrp">
                  <button className="dashboard-top" onClick={sortAscending}>
                    <FaArrowUp />
                  </button>
                  <button className="dashboard-bottom" onClick={sortDescending}>
                    <FaArrowDown />
                  </button>
                  <input
                    type="number"
                    value={rowLimit}
                    className="dashboard_num-input"
                    onChange={handleRowLimitChange}
                  />
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
                  {!isFocused && !searchTerm ? (
                    <FaSearch
                      className="search-icon"
                      style={{
                        fontSize: "18px",
                        color: "#888",
                        cursor: "pointer",
                        position: "absolute",
                        zIndex: "-999",
                        transform: "translateY(-50%)",
                      }}
                      onClick={() => setIsFocused(true)}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="Search Company..."
                      className="dashboard-search"
                      value={searchTerm}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => {
                        if (!searchTerm) setIsFocused(false);
                      }}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: isFocused ? "180px" : "60px", // Expands when focused
                        height: "20px",
                        border: "none",
                        borderBottom: "1px solid #ccc", // Single-line effect
                        background: "transparent",
                        outlineColor: "none",
                        fontSize: "14px",
                        transition: "width 0.3s ease-in-out",
                      }}
                    />
                  )}
                </div>

                <div
                  className="dashboard-table-container"
                  style={{
                    maxHeight: "250px",
                    overflowY: rowLimit > 5 ? "scroll" : "auto",
                    position: "relative",
                    bottom: "25px",
                  }}
                >
                  {isLoading ? (
                    <p>Loading..</p>
                  ) : (
                    (() => {
                      // Apply filtering first
                      const filteredData = companyData.filter(
                        (company) =>
                          company.org_name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          company.username
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      );

                      return filteredData.length > 0 ? (
                        <table className="dashboard_table" >
                          <thead className="dashboard_thead">
                            <tr>
                              <th className="dashboard-table-th">
                                Company Name
                              </th>
                              <th className="dashboard-table-th">Username</th>
                              <th className="dashboard-table-th">Doc Count</th>
                              <th className="dashboard-table-th">
                                File Size (KB)
                              </th>
                              <th className="dashboard-table-th">Users</th>
                            </tr>
                          </thead>
                          <tbody className="dashboard-tbody">
                            {filteredData
                              .slice(
                                0,
                                rowLimit === "" ? filteredData.length : rowLimit
                              )
                              .map((company, index) => (
                                
                                 <tr
                                  key={index}
                                  className="dashboard-table-row hover:bg-gray-50 cursor-pointer"
                                  onClick={() => handleOpenModalData(company)}
                                >
                                  <td className="dashboard-table-td">
                                    {company.org_name}
                                  </td>
                                  <td className="dashboard-table-td">
                                    {company.username}
                                  </td>
                                  <td className="dashboard-table-td">
                                    {company.doc_count}
                                  </td>
                                  <td className="dashboard-table-td">
                                    {company.doc_size}
                                  </td>
                                  <td className="dashboard-table-td">
                                    {company.emp}
                                  </td>
                                </tr>
                              )) }
                          </tbody>
                        </table>
                      ) : (
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "16px",
                            color: "red",
                          }}
                        >
                          No data found
                        </p>
                      );
                    })()
                  )}

{openModalData && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            minWidth: "320px",
            zIndex: 1000,
          }}
        >
          <h3>📅 Organization: {openModalData.org_name}</h3>
          <p>
            <strong>👤 Username:</strong> {openModalData.username}
          </p>
          <p>
            <strong>📑 Total Documents:</strong> {openModalData.doc_count}
          </p>
          <p>
            <strong>📁 Total File Size:</strong> {openModalData.doc_size}
          </p>
          <p>
            <strong>👥 Employees:</strong> {openModalData.emp}
          </p>

          {/* Close Button */}
          <button
            onClick={closeModalData}
            style={{
              marginTop: "10px",
              cursor: "pointer",
              padding: "5px 10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Close
          </button>
        </div>
      )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ADMINROLE */}



















        {isAdminOrDocumentRole && (
  <>
    <div className="role-selector">
      <label>Select Role: </label>
      <select value={selectedRole} onChange={handleRoleChange}>
        <option value="USERS">Users</option>
        <option value="UPLOADER">Uploader</option>
        <option value="VIEWER">Viewer</option>
        <option value="APPROVER">Approver</option>
      </select>
    </div>
    <div className="cards-container1">
      <Card title="Total Documents" value={DashboardStats.document_count} icon={<IoMdCloudUpload />} bgColor={"#d2eafd"} />
      <Card title="Approved Documents" value={DashboardStats.approved_count} icon={<IoIosCheckmarkCircle style={{ color: "green" }} />} bgColor={"#AFE1AF"} />
      <Card title="Pending Documents" value={DashboardStats.pending_count} icon={<MdPending style={{ color: "#dd651b" }} />} bgColor={"#fff3d0"} />
      <Card title="Rejected Documents" value={DashboardStats.rejected_count} icon={<MdCancel style={{ color: "#b22d2d" }} />} bgColor={"#ffe5d6"} />
      <Card title="Employee Count" value={DashboardStats.employee_count} icon={<IoPeople />} bgColor="#e0e0e0" />
    </div>
  </>
)}

        {isAdminOrDocumentRole && (
          <div className="admin-dashboard-container">
            {/* Left Side: Area Chart */}
            <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={dashboardData}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fontWeight: "bold", fill: "#555" }}
              />
<YAxis 
  dataKey="fileSizeMB" 
  domain={[
    (dataMin) => Math.floor(Math.min(dataMin, 0)), 
    (dataMax) => Math.ceil(dataMax + (dataMax * 0.1))
  ]}
  tick={{ 
    fontSize: 10, 
    fontWeight: "bold", 
    fill: "#555",
    dx: -4 // Moves the labels slightly left to prevent overflow
  }} 
  tickFormatter={(val) => `${val.toFixed(2)} MB`} 
  width={50} // Increase Y-axis width to provide space for labels
/>


              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                          fontSize: "14px",
                          padding: "10px",
                          lineHeight: "1.5",
                        }}
                      >
                        <p><strong>📅 Month:</strong> {payload[0].payload.month}</p>
                        <p><strong>📄 Documents Uploaded:</strong> {payload[0].payload.docCount}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <defs>
  <linearGradient id="colorDocCount" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#007bff" stopOpacity={0.1} /> 
    <stop offset="5%" stopColor="#007bff" stopOpacity={0.1} />
  </linearGradient>
</defs>

              <Area
  type="monotone"
  dataKey="fileSizeMB" // Make sure this is set to display file sizes correctly
  stroke="#007bff" // Ensures the line is blue
  strokeWidth={4} // Increase thickness for better visibility
  dot={{ fill: "#007bff", r: 1 }} // Adds blue dots for data points
  fill="url(#colorDocCount)"
  fillOpacity={0.3} // Reduce fill opacity for a clearer line
/>

            </AreaChart>
          </ResponsiveContainer>
            </div>

            {/* Right Side: Table */}
            <div className="table-container">
              {isAdminOrDocumentRole && (
                <>
                  {/* 🔍 Search Input */}
                  <div
                    className="search-container"
                    style={{ marginBottom: "10px", textAlign: "right" }}
                  >
                    {!isSearchFocused && !searchTermAdmin ? (
                      <FaSearch
                        style={{
                          cursor: "pointer",
                          fontSize: "18px",
                          color: "#555",
                        }}
                        onClick={() => setIsSearchFocused(true)}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTermAdmin}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => {
                          if (!searchTermAdmin) setIsSearchFocused(false);
                        }}
                        onChange={(e) => setSearchTermAdmin(e.target.value)}
                        style={{
                          border: "none",
                          borderBottom: "2px solid #555",
                          outline: "none",
                          fontSize: "14px",
                          width: isSearchFocused ? "180px" : "60px",
                          transition: "width 0.3s ease-in-out",
                        }}
                      />
                    )}
                  </div>

                  {/* 📝 Table */}
                  <table className="company-data-table">
  <thead>
    <tr>
      <th>Username</th>
      <th>Doc Count</th>
      <th>File Size (KB)</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
  {console.log(tableforadmin?.users, "bala")} {/* Debugging log */}

  {tableforadmin?.users && tableforadmin.users.length > 0 ? (
    tableforadmin.users.map((user, index) => (
      <tr key={index}>
        <td>{user.username}</td>
        <td>{user.uploaded_files_count + user.approved_files_count}</td>
        <td>{((user.uploaded_files_size_mb + user.approved_files_size_mb) * 1024).toFixed(2)}</td>
        <td>{user.role}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
        No data found
      </td>
    </tr>
  )}
</tbody>

</table>


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
