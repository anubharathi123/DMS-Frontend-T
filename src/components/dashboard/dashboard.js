import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { IoPeople } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { IoMdCloudUpload } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdPending, MdCancel, MdMargin } from "react-icons/md";
import apiServices from '../../ApiServices/ApiServices';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import donutData from './donutData';

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
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
  const [month, setMonth] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [rowLimit, setRowLimit] = useState('3');
  const username = localStorage.getItem('name') || "User";
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiServices.organizationCount();
        console.log("API Response:", response);
  
        if (response) {
          const dashboard = response.map(db => ({
            org_name: db.organization_name,
            username: db.organization_user,
            doc_count: db.total_files_all,
            doc_size: db.total_file_size_all,
          }));
  
          setCompanyData(dashboard);  
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []); // ✅ Removed `companyData` from dependencies
  
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await apiServices.companyCount();
        console.log("company Response:", response);
  
        if (response) {
          setOrgCount({
            totalCompanies: response.organization_count || 0,
            activeCompanies: response.active_org_count || 0,
            inactiveCompanies: response.deleted_org_count || 0,
            clientAdmins: response.user_count || 0,
            totalDocuments: response.document_count || 0,
            approvedDocuments: response.approved_count || 0,
            pendingDocuments: response.pending_count || 0,
            rejectedDocuments: response.rejected_count || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchCount();
  }, []); // ✅ Removed companyData from dependencies
  
  // Monitor companyData state updates
  useEffect(() => {
    console.log("Updated Company Data:", companyData);
  }, [companyData]);
  
 
  // const handleRowLimitChange = (e) => {
  //   const value = e.target.value.trim() === "" ? 1 : parseInt(e.target.value, 10);
  //   if (!isNaN(value) && value > 0) {
  //     setRowLimit(value);
  //   }
  // };
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
  
  // Define titles for each role
  const roleTitles = {
    PRODUCT_OWNER: "Dashboard",
    PRODUCT_ADMIN: "Dashboard",
    ADMIN: "Dashboard",
    UPLOADER: "Uploader Dashboard",
    APPROVER: "Approver Dashboard",
    REVIEWER: "Reviewer Dashboard",
    VIEWER: "Viewer Dashboard",
  };
// // Calculate total documents to get percentages
// const totalDocs = OrgCount.approvedDocuments + OrgCount.pendingDocuments + OrgCount.rejectedDocuments;

// // Ensure no division by zero
// const approvedPercentage = totalDocs ? ((OrgCount.approvedDocuments / totalDocs) * 100).toFixed(1) : 0;
// const pendingPercentage = totalDocs ? ((OrgCount.pendingDocuments / totalDocs) * 100).toFixed(1) : 0;
// const rejectedPercentage = totalDocs ? ((OrgCount.rejectedDocuments / totalDocs) * 100).toFixed(1) : 0;

// const donutData = {
//   labels: [
//     `Approved (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
//     `Pending (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
//     `Rejected (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
//     // `Pending (${pendingPercentage}%)`,
//     // `Rejected (${rejectedPercentage}%)`
//   ],
//   datasets: [
//     {
//       data: [OrgCount.approvedDocuments, OrgCount.pendingDocuments, OrgCount.rejectedDocuments],
//       backgroundColor: ['#077E8C', '#F7CB73', '#D9512C'],
//       borderWidth: 3,
//       cutout: '',
//     },
//   ],
// };
//   // 🟠 Doughnut Chart (Total Uploads)
//   const totalDocs = OrgCount.approvedDocuments + OrgCount.pendingDocuments + OrgCount.rejectedDocuments;

// const chartOptions = {
//   responsive: true,
//   plugins: {
//     legend: { display: true },
//     datalabels: {
//       color: "#fff",
//       font: { weight: "bold", size: 14 },
//       formatter: (value, ctx) => {
//         let percentage = totalDocs ? ((value / totalDocs) * 100).toFixed(1) : 0;
//         return `${percentage}%`; // Show percentage inside chart
//       },
//     },
//   },
// };
const donutData = {
  
  labels: [
    `Approved (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
    `Pending (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
    `Rejected (${((OrgCount.approvedDocuments / OrgCount.totalDocuments) * 100).toFixed(1)}%)`,
    // `Pending (${pendingPercentage}%)`,
    // `Rejected (${rejectedPercentage}%)`
  ],
  datasets: [
    {
      
      data: [OrgCount.approvedDocuments, OrgCount.pendingDocuments, OrgCount.rejectedDocuments],
      backgroundColor: ['#077E8C', '#F7CB73', '#D9512C'],
      borderWidth: 3,
      cutout: '',
    },
  ],
};
// 🟠 Doughnut Chart (Total Uploads)
const totalDocs = OrgCount.approvedDocuments + OrgCount.pendingDocuments + OrgCount.rejectedDocuments;

const chartOptions = {
  
  responsive: true,
  plugins: {
    legend: { display: true },
    datalabels: {
      color: "#fff",
      font: { weight: "bold", size: 14 },
      formatter: (value, ctx) => {
        let percentage = totalDocs ? ((value / totalDocs) * 100).toFixed(1) : 0;
        return `${percentage}%`; // Show percentage inside chart
      },
    },
  },
};





  // 🔵 Line Chart (Growth Rate)
  
//   useEffect(() => {
//   const fetchlineData = async () => {
//     try {
//       const response = await apiServices.getlinedata();
//       console.log("company Trends:", response);
//       if(response) {
//         const companytrends = response.map(ct => ({
//           count: ct.count,
//           month: ct.month,
//           year:  ct.year,
//         }));
//         setData(response)
//         setSelectedYear(companytrends.map(ct =>ct.year));
//         setCount(companytrends.map(ct => ct.count));
//         setMonth(companytrends.map(ct => ct.month));
//         console.log("Company Trends:", companytrends);
//         console.log("selectedYear:", selectedYear);
//         console.log("count:", count);
//         console.log("month:", month);
//         console.log("response:", response);
//       }
//     } 

//     catch {

//     } finally {

//     }

//   };
//   fetchlineData();
// })


useEffect(() => {
  const fetchlineData = async () => {
    try {
      const response = await apiServices.getlinedata();
      console.log("Company Trends API Response:", response);

      if (response && response.length > 0) {
        const companyTrends = response.map(ct => ({
          count: ct.count,
          month: ct.month,
          year: ct.year,
        }));

        setData(companyTrends);

        // Extract unique years and set the first one as default
        const uniqueYears = [...new Set(companyTrends.map(ct => ct.year))];
        const defaultYear = uniqueYears[0] || '2023';
        setSelectedYear(defaultYear);

        // Ensure all months are present
        const allMonths = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const filteredData = companyTrends.filter(ct => ct.year === defaultYear);

        // Create a mapping of existing data
        const monthDataMap = filteredData.reduce((acc, curr) => {
          acc[curr.month] = curr.count;
          return acc;
        }, {});

        // Fill missing months with zero
        const finalCounts = allMonths.map(month => monthDataMap[month] || 0);

        setMonth(allMonths);
        setCount(finalCounts);

        console.log("Processed Company Trends:", finalCounts);
      }
    } catch (error) {
      console.error("Error fetching company trends:", error);
    }
  };

  fetchlineData();
}, []);


const lineData = {
  labels: month, // Ensures all 12 months are listed
  datasets: [
    {
      label: `Growth Rate (${selectedYear})`,
      data: count, // Includes counts for all months, missing ones filled with 0
      borderColor: '#1661a9',
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: '#0d6abf',
      pointRadius: 3,
    },
  ],
};


// const chartOptions = {
//   responsive: true,
//   scales: {
//     y: {
//       ticks: {
//         callback: function (value) {
//           return Math.round(value); // Ensures only integer values are displayed
//         },
//         precision: 0, // Forces the display of whole numbers only
//       },
//     },
//   },
//   plugins: {
//     legend: { display: false },
//     tooltip: { backgroundColor: '#333', titleColor: '#fff' },
//   },
// };

  // const chartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: { display: false },
  //     tooltip: { backgroundColor: '#333', titleColor: '#fff' },
  //   },
    
  // };
  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
  
    const filteredData = data.filter(ct => ct.year === year);
  
    const monthDataMap = filteredData.reduce((acc, curr) => {
      acc[curr.month] = curr.count;
      return acc;
    }, {});
  
    const finalCounts = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ].map(month => monthDataMap[month] || 0);
  
    setMonth([
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]);
    setCount(finalCounts);
  };
  

  // Check if the role should have the cards displayed
  const isAdminOrDocumentRole = ['ADMIN', 'UPLOADER', 'APPROVER', 'REVIEWER', 'VIEWER'].includes(role);


  return (
    <div className='dashboard-body'>
      <div className='dashboard-container' >
       {/* <Dashboard title="Visionboard" />*/}
        <h2 className='dashboard-h2'>Welcome, {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()} </h2>

        {(role === 'PRODUCT_OWNER' || role === 'PRODUCT_ADMIN') && (
          <>
            <div className="cards-container">
           
              <Card title="Total Companies" value={OrgCount.totalCompanies} icon={<HiBuildingOffice2 />}  />
              <Card title="Active Companies" value={OrgCount.activeCompanies} icon={<HiBuildingOffice2 style={{ color: 'green'}} />} />
              <Card title="Inactive Companies" value={OrgCount.inactiveCompanies} icon={<HiBuildingOffice2 style={{ color: '#b22d2d' }} />}/>
              <Card title="Users" value={OrgCount.clientAdmins} icon={<IoPeople />} />
            </div>
              
            <div className="charts-container">
              <div className="chart">
                <p className='dashboard_text'><center>Company File Size</center></p>
                <div className='dashboard-btngrp'>
                  <button className='dashboard-top' onClick={sortAscending}><FaArrowUp /></button>
                  <button className='dashboard-bottom' onClick={sortDescending}><FaArrowDown /></button>
                  <input type='number' value={rowLimit} className='dashboard_num-input' onChange={handleRowLimitChange}/>
                </div>
                
                <div className='dashboard-table-container' style={{ maxHeight: '250px', overflowY: rowLimit > 5 ? 'scroll' : 'auto', position: "relative", bottom: "25px"}}>
                <table className='dashboard_table'>
                <thead className='dashboard_thead'>
                    <tr>
                      <th className='dashboard-table-th'>Company Name</th>
                      <th className='dashboard-table-th'>Username</th>
                      <th className='dashboard-table-th'>Doc Count</th>
                      <th className='dashboard-table-th'>File Size (KB)</th>
                    </tr>
                    </thead>
                    <tbody className='dashboard-tbody'>
                    {companyData.slice(0, rowLimit === "" ? companyData.length : rowLimit).map((company, index) => (
                    <tr key={index} className='dashboard-table-row hover:bg-gray-50'>
                      <td className='dashboard-table-td'>{company.org_name}</td>
                      <td className='dashboard-table-td'>{company.username}</td>
                      <td className='dashboard-table-td'>{company.doc_count}</td>
                      <td className='dashboard-table-td'>{company.doc_size}</td>
                    </tr>
              ))}
            </tbody>
                </table>
                </div>
              </div>
              {data.map}
              <div className="chart">
                <p className='dashboard_text'><center>Company Trends</center></p>
                <center>
                <div className="slicer">
                  <label className='dashboard-year-selector'>Select Year: </label>
                  <select className="dashboard-year-select" value={selectedYear} onChange={handleYearChange}>
  {[...new Set(data.map(ct => ct.year))].map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
</select>

                </div>
                </center>
                <Line className="dashboard-linedata" data={lineData} options={chartOptions} />
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
                <Pie data={donutData} options={chartOptions} />

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value = 1, icon, role, bgColor }) => {
  const cardStyle = {
    backgroundColor: ['ADMIN', 'UPLOADER', 'REVIEWER', 'VIEWER'].includes(role) ? bgColor : "",
    marginTop: ['UPLOADER', 'REVIEWER', 'VIEWER'].includes(role) ? "10%" : "",
  };
    
  
  

  return (
    <div className="card" style={cardStyle}>
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
