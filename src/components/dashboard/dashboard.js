import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { FaSearch } from "react-icons/fa"; // Search icon
import ClipLoader from "react-spinners/ClipLoader";
import LoadingText from './LoadingText';
import Loader from "react-js-loader";

import { IoPeople } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaBuildingCircleXmark } from "react-icons/fa6";
import { FaBuildingCircleExclamation } from "react-icons/fa6";
import { IoMdCloudUpload } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdPending, MdCancel, MdMargin } from "react-icons/md";
import apiServices from '../../ApiServices/ApiServices';
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { curveCardinal } from 'd3-shape';
import {
  Chart as ChartJS,
 BarElement,
 ArcElement,
 LineElement,
 PointElement,
 CategoryScale,
 LinearScale,
  Legend,
} from 'chart.js';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { company, month, document_count } = payload[0].payload; // Extract relevant data
      
      return (
        <div style={{
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "5px",
          fontSize:"10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        }}>
          <>
          <p><strong>📌 Company:</strong> {company}</p>
          <p><strong>📅 Month:</strong> {month}</p>
          <p style={{ color: "red" }}><strong>📑 Documents Uploaded:</strong> {document_count}</p>
        </>
        </div>
      );
    }
    return null;
  };

  
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
      <h1 className='dashboard-h1'>{title}</h1>
    </div>
  );

  const DashboardApp = () => {
        const [chartDataforadminn, setChartDataforadmin] = useState([]);


    const role = localStorage.getItem('role');

//MOCK DATA FOR ADMIN CLIENT

const mockData = {
  UPLOADER: { count: 10, label: "Uploaders" },
  VIEWER: { count: 15, label: "Viewers" },
  APPROVER: { count: 8, label: "Approvers" },
};
const mockDataTable = [
  { id: 1, companyName: "Smart Tech", username: "tech_admin", month: "Jan", docCount: 12, fileSize: 500, role: "UPLOADER" },
  { id: 2, companyName: "Smart Tech", username: "code_viewer", month: "Jan", docCount: 20, fileSize: 800, role: "VIEWER" },
  { id: 3, companyName: "Smart Tech", username: "data_approver", month: "Feb", docCount: 18, fileSize: 700, role: "APPROVER" },
  { id: 4, companyName: "Smart Tech", username: "cloud_uploader", month: "Feb", docCount: 25, fileSize: 950, role: "UPLOADER" },
  { id: 5, companyName: "Smart Tech", username: "web_viewer", month: "Mar", docCount: 10, fileSize: 400, role: "VIEWER" },
  { id: 6, companyName: "Smart Tech", username: "smart_approver", month: "Mar", docCount: 15, fileSize: 600, role: "APPROVER" },
];

  // 📌 Group Data by Month based on Role

const totalUsers = Object.values(mockData).reduce((acc, role) => acc + role.count, 0);  
    // 🔹 Default: Show "Users" (sum of all roles)
    const [selectedRole, setSelectedRole] = useState("USERS");
    const [userData, setUserData] = useState({ count: totalUsers, label: "Users" });



    useEffect(() => {
      const initialData = mockDataTable.map((item) => ({
        name: item.username,
        docCount: item.docCount,
        fileSize: item.fileSize,
      }));
      setChartDataforadmin(initialData);
    }, []);




    const filteredMockData = selectedRole === "USERS"
    ? mockDataTable  // Show all users when "Users" is selected
    : mockDataTable.filter((item) => item.role === selectedRole);
  
    useEffect(() => {
      const filteredData = mockDataTable.filter((data) => data.role === selectedRole);
  
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
        const monthIndex = groupedData.findIndex((data) => data.month === item.month);
        if (monthIndex !== -1) groupedData[monthIndex].docCount += item.docCount;
      });
  
      setChartData(groupedData);
    }, [selectedRole]);

 


    const [selectedYear, setSelectedYear] = useState('2023');
    const [OrgCount,setOrgCount] = useState([]);
    const [count, setCount] = useState([]);
     const [chartData, setChartData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [loadingPercentage, setLoadingPercentage] = useState(0); // Track loading progress
     

    const [searchTerm, setSearchTerm] = useState("");
     const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
  const [yearMonth,setYearMonth] = useState([])
    const [month, setMonth] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [uniqueYears, setUniqueYears] = useState([]); // Store unique years for dropdown
    const [isLoading, setIsLoading] = useState(false);
  
    const [rowLimit, setRowLimit] = useState('4');
    const username = localStorage.getItem('name') || "User";
    const [data, setData] = useState([]);
  
  




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
              lineDataResponse1
            ] = await Promise.all([
              apiServices.organizationCount(),
              apiServices.companyCount(),
              apiServices.MonthYearCompany(),
              apiServices.getlinedata(),
              apiServices.getlinedata()
            ]);
      
            // 🔹 Organization Count
            if (orgCountResponse) {
              const dashboard = orgCountResponse.map(db => ({
                org_name: db.organization_name,
                username: db.organization_user,
                doc_count: db.total_files_all,
                doc_size: db.total_file_size_all,
                emp: db.total_employees
              }));
              setCompanyData(dashboard);
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
                deleted_org_count: companyCountResponse.deleted_org_count || 0
              });
            }
      
            // 🔹 Year-Month-Company Data Processing
            if (yearMonthCompanyResponse) {
              const extractedYears = [...new Set(yearMonthCompanyResponse.flatMap(company => company.years.map(year => year.year)))];
              setUniqueYears(extractedYears);
              setYearMonth(yearMonthCompanyResponse);
      
              // Map Month Names to Short Names
              const monthShortNames = {
                "January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr",
                "May": "May", "June": "Jun", "July": "Jul", "August": "Aug",
                "September": "Sep", "October": "Oct", "November": "Nov", "December": "Dec"
              };
      
              const allMonths = Object.values(monthShortNames);
      
              const formattedData = yearMonthCompanyResponse.flatMap(company =>
                company.years.flatMap(year => {
                  const monthDataMap = new Map(year.monthly_document_counts.map(monthData => [
                    monthShortNames[monthData.month] || monthData.month,
                    monthData.document_count
                  ]));
      
                  return allMonths.map(shortMonth => ({
                    company: company.organization_name,
                    year: year.year,
                    month: shortMonth,
                    document_count: monthDataMap.get(shortMonth) || 0
                  }));
                })
              );
      
              setChartData(formattedData);
            }
      
            // 🔹 Line Chart Data Processing
            if (lineDataResponse) {
              const companyTrends = lineDataResponse.map(ct => ({
                count: ct.count,
                month: ct.month,
                year: ct.year
              }));
      
              setData(companyTrends);
              const uniqueYears = [...new Set(companyTrends.map(ct => ct.year))];
              setSelectedYear(uniqueYears[0] || '2023');
      
              const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
              const filteredData = companyTrends.filter(ct => ct.year === selectedYear);
      
              const monthDataMap = filteredData.reduce((acc, curr) => {
                acc[curr.month] = curr.count;
                return acc;
              }, {});
      
              const finalCounts = allMonths.map(month => monthDataMap[month] || 0);
      
              setMonth(allMonths);
              setCount(finalCounts);
            }
            const endTime = performance.now(); // End timing
            const executionTime = endTime - startTime;
            const minLoadingTime = 3000; // **Ensure minimum 3 seconds of loading**
            const remainingTime = minLoadingTime - executionTime;
    
            // Wait for remaining time before showing content
            setTimeout(() => {
              clearInterval(interval);
              setLoadingPercentage(100); // Ensure 100% before hiding loading
              setTimeout(() => setIsLoading(false), 500); // Smooth transition delay
            }, remainingTime > 0 ? remainingTime : 0);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchAllData();
      }, []);
      


      // if (isLoading) {
      //   return (
      //     <div className="loading-overlay">
      //     {/* <LoadingText progress={loadingPercentage} /> */}
      //   </div>
      //   );
      // }






  // Handle role selection change
  const handleRoleChange = (e) => {
    const selected = e.target.value;
    setSelectedRole(selected);
    setUserData(selected === "USERS" ? { count: totalUsers, label: "Users" } : mockData[selected]);
  
    // ✅ Update chart data on role change
    const updatedData = selected === "USERS"
      ? mockDataTable
      : mockDataTable.filter((item) => item.role === selected);
  
    setChartDataforadmin(updatedData.map((item) => ({
      name: item.username,
      docCount: item.docCount,
      fileSize: item.fileSize,
    })));
  };
  


      const openModal = (company) => {
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
        const sortedData = [...companyData].sort((a, b) => parseFloat(a.doc_size) - parseFloat(b.doc_size));
        setCompanyData(sortedData);
      };
      
      const sortDescending = () => {
        const sortedData = [...companyData].sort((a, b) => parseFloat(b.doc_size) - parseFloat(a.doc_size));
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
  const isAdminOrDocumentRole = ['ADMIN', 'UPLOADER', 'APPROVER', 'REVIEWER', 'VIEWER'].includes(role);
  const companyNames = [...new Set(companyData.map((item) => item.org_name))];
  const filteredCompanies = companyNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );
    // 🔹 **Filter data based on Search Input**
    const filteredData = selectedCompany
    ? chartData.filter((item) => item.company === selectedCompany)
    : chartData.filter((item) => filteredCompanies.includes(item.company));
      
    {/* Apply body opacity when loading */}
{isLoading && (
  <div style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    zIndex: 9999, // Ensure it's above everything
    background: "rgba(255, 255, 255, 0.8)", // Light overlay effect
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}>
    <Loader type="box-up" bgColor={'#000b58'} color={'#000b58'} size={100} />
    <p style={{ color: "#000b58", fontSize: "16px", fontWeight: "bold", marginTop: "10px" }}>
      Loading...
    </p>
  </div>
)}

{/* Apply opacity to entire body when loading */}
<style>
  {isLoading ? "body { opacity: 0.3; pointer-events: none; }" : "body { opacity: 1; }"}
</style>

    return (
      <div className='dashboard-body boy bg'>
        <div className='dashboard-container' >
     
  
         {/* <Dashboard title="Visionboard" />*/}
          <h2 className='dashboard-h2'>Welcome, {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()} </h2>
  
  
  
      {(role === 'PRODUCT_OWNER' || role === 'PRODUCT_ADMIN') && (
        <>
              <div className="cards-container bg">
               
             
        <Card title="Total Companies" value={OrgCount.totalCompanies} icon={<HiBuildingOffice2 />} />
        <Card title="Active Companies" value={OrgCount.activeCompanies} icon={<HiBuildingOffice2 style={{ color: "green" }} />} />
        <Card title="Inactive Companies" value={OrgCount.inactiveCompanies} icon={<HiBuildingOffice2 style={{ color: "#b22d2d" }} />} />
        <Card title="Deleted Companies" value={OrgCount.deletedCompanies} icon={<FaBuildingCircleXmark style={{ color: "red" }} />} />
        <Card title="Pending Documents" value={OrgCount.pending_org_count} icon={<FaBuildingCircleExclamation style={{ color: "yellow" }} />} />
        <Card title="Users" value={OrgCount.user_count} icon={<IoPeople />} />
              </div>
  
  
  
  
  
  
  
  
              
                
              <div className="charts-container bg">
  
              {data.map}
                <div className="chart">
                <p className='dashboard_text'><center>File Size Trends</center></p>
                <center>
   
  
                <div className="slicer">
    {/* Year Selector Dropdown */}
    <div className="dropdown-container">
       <select 
        className="dashboard-year-select"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="">All Years</option>
        {uniqueYears.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </select>
    </div>
  
    {/* Company Selector Dropdown */}
    <div className="dropdown-container">
       <select 
        className="company-dropdown"
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
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
  
  
  
  
  
                  </center>
  
  
   <div className="chart">
    
  
   {filteredData.length > 0 ? (
    <ResponsiveContainer width="100%" height={250} className="abi">
    <AreaChart data={filteredData}>
      {/* Soft grid lines for better readability */}
      <CartesianGrid stroke="rgba(200, 200, 200, 0.3)" strokeDasharray="4 4" />
  
      {/* Modernized X & Y Axes */}
      <XAxis
        dataKey="month"
        tick={{
          fontSize: 13,
          fontWeight: "600",
          fill: "#4a4a4a",
        }}
        axisLine={{ stroke: "#ccc" }} // Soft axis line
        tickLine={false} // Hide tick lines for a cleaner look
      />
  
      <YAxis
        tick={{
          fontSize: 12,
          fontWeight: "600",
          fill: "#4a4a4a",
        }}
        axisLine={{ stroke: "#ccc" }}
        tickLine={false}
      />
  
      {/* Stylish Tooltip with a shadow effect */}
      <Tooltip
        content={<CustomTooltip />}
        wrapperStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "8px",
        }}
      />
  
      {/* Smooth and gradient-filled Area */}
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#007bff" stopOpacity={0.6} />
          <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
        </linearGradient>
      </defs>
  
      <Area
        type="monotone"
        dataKey="document_count"
        stroke="#007bff"
        strokeWidth={2}
        fill="url(#colorUv)"
        fillOpacity={0.7}
      />
    </AreaChart>
  </ResponsiveContainer>
  
      ) : (
        // Show a simple line if no relevant data found
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={[
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
          ]}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: "bold", fill: "#333" }} />
            <YAxis tick={{ fontSize: 12, fontWeight: "bold", fill: "#333" }} />
            <Tooltip />
            <Area type="monotone" dataKey="document_count" stroke="gray" fill="lightgray" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
        
        </div>
                </div>
  
  
  
  
  
  
  
  
  
                <div className="chart">
                  <p className='dashboard_text'><center>Company File Size</center></p>
                  <div className='dashboard-btngrp'>
                    
    <button className='dashboard-top' onClick={sortAscending}>
      <FaArrowUp />
    </button>
    <button className='dashboard-bottom' onClick={sortDescending}>
      <FaArrowDown />
    </button>
    <input 
      type='number' 
      value={rowLimit} 
      className='dashboard_num-input' 
      onChange={handleRowLimitChange}
    />
      
  </div>
  

  <div className="search-container" style={{ position: "relative", display: "inline-block",zIndex:"999",top:"-55px" }}>
        {!isFocused && !searchTerm ? (
          <FaSearch
            className="search-icon"
            style={{
              fontSize: "18px",
              color: "#888",
              cursor: "pointer",
              position: "absolute",
   zIndex:"-999",
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
  
                  
  <div className='dashboard-table-container' style={{ maxHeight: '250px', overflowY: rowLimit > 5 ? 'scroll' : 'auto', position: "relative", bottom: "25px"}}>
  
  
  
  
                  {isLoading ? (
<p>Loading..</p>
  ) : (() => {
    // Apply filtering first
    const filteredData = companyData.filter(
      (company) =>
        company.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return filteredData.length > 0 ? (
      <table className="dashboard_table">
        <thead className="dashboard_thead">
          <tr>
            <th className="dashboard-table-th">Company Name</th>
            <th className="dashboard-table-th">Username</th>
            <th className="dashboard-table-th">Doc Count</th>
            <th className="dashboard-table-th">File Size (KB)</th>
            <th className="dashboard-table-th">Users</th>
          </tr>
        </thead>
        <tbody className="dashboard-tbody">
          {filteredData
            .slice(0, rowLimit === "" ? filteredData.length : rowLimit)
            .map((company, index) => (
              <tr
                key={index}
                className="dashboard-table-row hover:bg-gray-50 cursor-pointer"
                onClick={() => openModal(company)}
              >
                <td className="dashboard-table-td">{company.org_name}</td>
                <td className="dashboard-table-td">{company.username}</td>
                <td className="dashboard-table-td">{company.doc_count}</td>
                <td className="dashboard-table-td">{company.doc_size}</td>
                <td className="dashboard-table-td">{company.emp}</td>
              </tr>
            ))}
        </tbody>
      </table>
    ) : (
      <p style={{ textAlign: "center", fontSize: "16px", color: "red" }}>No data found</p>
    );
  })()}
  
  
  
  
  
  
  
  
                  {isModalOpen && selectedCompany && (
          <div className="modal-overlay"style={{zIndex:"1"}}>
            <div className="modal-content">
              <h2>Company Details</h2>
              <p><strong>Company Name:</strong> {selectedCompany.org_name}</p>
              <p><strong>Username:</strong> {selectedCompany.username}</p>
              <p><strong>Document Count:</strong> {selectedCompany.doc_count}</p>
              <p><strong>File Size:</strong> {selectedCompany.doc_size} KB</p>
              <p><strong>Users:</strong> {selectedCompany.emp}</p>
              <button className="modal-close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
  
                  </div>
  </div>
  
              </div>
              
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
            </>
          )}

          {/* ADMINROLE */}
  
          {(isAdminOrDocumentRole) && (
            <>
             
             <div className="role-selector">
        <label>Select Role: </label>
        <select value={selectedRole} onChange={handleRoleChange}>
          <option value="USERS">Users</option> {/* Default option */}
          <option value="UPLOADER">Uploader</option>
          <option value="VIEWER">Viewer</option>
          <option value="APPROVER">Approver</option>
        </select>

      </div>
             <div className="cards-container1">
  <Card title="Total Documents" value={OrgCount.totalDocuments} icon={<IoMdCloudUpload />} bgColor={'#d2eafd'} />
  <Card title="Approved Documents" value={OrgCount.approvedDocuments} icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} bgColor={'#AFE1AF'} />
  <Card title="Pending Documents" value={OrgCount.pendingDocuments} icon={<MdPending style={{ color: '#dd651b' }} />} bgColor={'#fff3d0'} />
  <Card title="Rejected Documents" value={OrgCount.rejectedDocuments} icon={<MdCancel style={{ color: '#b22d2d' }} />} bgColor={'#ffe5d6'} />

  <Card title={userData.label} value={userData.count} icon={<IoPeople />} bgColor="#e0e0e0" />

</div>

              {/* {role === 'ADMIN' && (
                <div className="chart">
                  {donutData({ OrgCount })}
  
                </div>
              )} */}
            </>
          )}
    {(isAdminOrDocumentRole) && (
<div className="admin-dashboard-container">
  {/* Left Side: Area Chart */}
  <div className="chart-container">

  <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: "bold", fill: "#555" }} />
            <YAxis tick={{ fontSize: 12, fontWeight: "bold", fill: "#555" }} />
            
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div style={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    fontSize: "14px",
                    padding: "10px",
                    lineHeight: "1.5",
                  }}>
                    <p><strong>📅 Month:</strong> {payload[0].payload.month}</p>
                    <p><strong>📄 Documents Uploaded:</strong> {payload[0].payload.docCount}</p>
                  </div>
                );
              }
              return null;
            }} />

            <Legend verticalAlign="top" align="right" iconType="circle" />
            <defs>
              <linearGradient id="colorDocCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007bff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#007bff" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <Area type="monotone" dataKey="docCount" stroke="#007bff" strokeWidth={3} fill="url(#colorDocCount)" fillOpacity={0.7} />
          </AreaChart>
        </ResponsiveContainer>

   
  </div>

  {/* Right Side: Table */}
  <div className="table-container">
  {(isAdminOrDocumentRole) && (
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
        {filteredMockData.length > 0 ? (
          filteredMockData.map((user) => (
            <tr key={user.id}>
               <td>{user.username}</td>
              <td>{user.docCount}</td>
              <td>{user.fileSize}</td>
              <td>{user.role}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
              No data found for {selectedRole}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )}
</div>

</div>
 )}









        </div>
      </div>
    )}
 const role = localStorage.getItem("role")
    const isAdminOrDocumentRole = ['ADMIN', 'UPLOADER', 'APPROVER', 'REVIEWER', 'VIEWER'].includes(role);

    const Card = ({ title, value = 1, icon, role, bgColor }) => {
      const cardStyle = {
        backgroundColor: ['ADMIN', 'UPLOADER', 'REVIEWER', 'VIEWER'].includes(role) ? bgColor : "",
        marginTop: ['UPLOADER', 'REVIEWER', 'VIEWER'].includes(role) ? "10%" : "",
      }
      return (
        
        
<div className={`${isAdminOrDocumentRole === "ADMIN" ? "card1" : "card"}`} style={cardStyle}>
        
        
          
          <div className="card-title">
            <div className="card-icon">{icon}</div>
            <div className="card-info">
              <h2>{title}</h2>
              <p>{value ?? 0}</p> {/* Ensures value is always displayed */}
            </div>
          </div>
        </div>
      )}
      
      export default DashboardApp;
