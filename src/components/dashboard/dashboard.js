import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { FaSearch } from "react-icons/fa"; // Search icon
import ClipLoader from "react-spinners/ClipLoader";
import LoadingText from './LoadingText';

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
    const role = localStorage.getItem('role');
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
    const [isLoading, setIsLoading] = useState(true);
  
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
      


      if (isLoading) {
        return (
          <div className="loading-overlay">
          <LoadingText progress={loadingPercentage} />
        </div>
        );
      }


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
      
      const donutData = ({ OrgCount }) => {
        const totalDocs =
          OrgCount.approvedDocuments +
          OrgCount.pendingDocuments +
          OrgCount.rejectedDocuments;
      
        const donutData = {
          labels: [
            `Approved (${((OrgCount.approvedDocuments / totalDocs) * 100).toFixed(1)}%)`,
            `Pending (${((OrgCount.pendingDocuments / totalDocs) * 100).toFixed(1)}%)`,
            `Rejected (${((OrgCount.rejectedDocuments / totalDocs) * 100).toFixed(1)}%)`,
          ],
          datasets: [
            {
              data: [
                OrgCount.approvedDocuments,
                OrgCount.pendingDocuments,
                OrgCount.rejectedDocuments,
              ],
              backgroundColor: ["#077E8C", "#F7CB73", "#D9512C"],
              borderWidth: 3,
              cutout: "60%", // Adjust to control thickness
            },
          ],
        };
      
        const chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "right", // Keep legend on the right
              align: "center", // Align legend vertically in the middle
           
              labels: {
                usePointStyle: true, // Display legend as small circles
                boxWidth: 8, // Reduce dot size
                padding: 4, // Reduce spacing between legend items
              },
            },
            datalabels: {
              color: "#fff",
              font: { weight: "bold", size: 14 },
              formatter: (value, ctx) => {
                let totalDocs = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                let percentage = totalDocs ? ((value / totalDocs) * 100).toFixed(1) : 0;
                return `${percentage}%`;
              },
            },
          },
          layout: {
            padding: {
              // right: 250, // Adjust this value to bring legend closer
              align: "center", // Align legend vertically in the middle
              
              
      
             
            },
          },
        };
        
        
      
        return (
          <div className="w-[300px] mx-auto">
            <Doughnut data={donutData} options={chartOptions} />
          </div>
        );
      };


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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <LoadingText loading={isLoading} />
    </div>
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
  
          {(isAdminOrDocumentRole) && (
            <>
              <div className="cards-container1">
                <Card title="Total Documents" value={OrgCount.totalDocuments} icon={<IoMdCloudUpload />} role={role} bgColor={'#d2eafd'}  />
                <Card title="Approved Documents" value={OrgCount.approvedDocuments} icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} role={role} bgColor={'#AFE1AF'}/>
                <Card title="Pending Documents" value={OrgCount.pendingDocuments} icon={<MdPending style={{ color: '#dd651b' }} />} role={role} bgColor={'#fff3d0'}/>
                <Card title="Rejected Documents" value={OrgCount.rejectedDocuments} icon={<MdCancel style={{ color: '#b22d2d' }} />} role={role} bgColor={'#ffe5d6'} />
              </div>
              {role === 'ADMIN' && (
                <div className="chart">
                  {donutData({ OrgCount })}
  
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )}


    const Card = ({ title, value = 1, icon, role, bgColor }) => {
      const cardStyle = {
        backgroundColor: ['ADMIN', 'UPLOADER', 'REVIEWER', 'VIEWER'].includes(role) ? bgColor : "",
        marginTop: ['UPLOADER', 'REVIEWER', 'VIEWER'].includes(role) ? "10%" : "",
      }
      return (
        <div className="card " style={cardStyle}>
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
