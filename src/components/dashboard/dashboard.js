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
import { TbBackground } from 'react-icons/tb';
import { colors } from '@mui/material';

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
  const [OrgCount,setOrgCount] = useState('');
  const [companyData, setCompanyData] = useState([
    { name: 'HCL', username: 'Arun', fileSize: 1000 },
    { name: 'Vdart', username: 'Harish', fileSize: 789 },
    { name: 'Accenture', username: 'Vignesh', fileSize: 665 },
    { name: 'Infosys', username: 'Surya', fileSize: 569 },
    { name: 'Wipro', username: 'Chandru', fileSize: 223 },
    { name: 'Cognizant', username: 'Prakash', fileSize: 446 },
    { name: 'Infotech', username: 'Karthik', fileSize: 998 },
    { name: 'SAP', username: 'Suresh', fileSize: 554 },
    { name: 'TCS', username: 'Aravind', fileSize: 232 },
    { name: 'IBM', username: 'Rangarajan', fileSize: 109 },
    { name: 'Fiorano', username: 'Ram', fileSize: 654 },
    { name: 'Zoho', username: 'Tamilselvan', fileSize: 451 },
    { name: 'Capgemini', username: 'Sundar', fileSize: 342 },
  ]);

  const [rowLimit, setRowLimit] = useState(companyData.length  || 10);
  const username = localStorage.getItem('name') || "User";

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiServices.getName();
        console.log(response,response.dashboard)
        console.log("API Response:", response)

        const dashboard = response.dashboard.map(db => ({
          org_count:db.organization_count || "",
          active_orgcount:db.active_user_count,
          inactive_orgcount:db.inactive_user_count,
          active_doc_count:db.active_document_count,
          inactive_doc_count:db.inactive_document_count,
        }));
        console.log(dashboard);
        setOrgCount(dashboard);
        if (response) {
          console.log("Fetched usernames:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchdata();

   
  }, []);
 
  const handleRowLimitChange = (e) => {
    const value = e.target.value.trim() === "" ? 1 : parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setRowLimit(value);
    }
  };

  const sortAscending = () => {
    const sortedData = [...companyData].sort((a, b) => a.fileSize - b.fileSize);
    setCompanyData(sortedData);
  };

  const sortDescending = () => {
    const sortedData = [...companyData].sort((a, b) => b.fileSize - a.fileSize);
    setCompanyData(sortedData);
  };

  // Define titles for each role
  const roleTitles = {
    PRODUCT_OWNER: "Product Owner Dashboard",
    PRODUCT_ADMIN: "Product Admin Dashboard",
    ADMIN: "Admin Dashboard",
    UPLOADER: "Uploader Dashboard",
    APPROVER: "Approver Dashboard",
    REVIEWER: "Reviewer Dashboard",
    VIEWER: "Viewer Dashboard",
  };

  // 🟠 Doughnut Chart (Total Uploads)
  const donutData = {
    labels: ['Total Uploads', 'Pending Documents', 'Rejected Documents'],
    datasets: [
      {
        data: [50000, 10000, 5000],
        backgroundColor: ['#336CC9', '#f0ec05', '#ff0101'],
        borderWidth: 3,
        cutout: '',
      },
    ],
  };

  // 🔵 Line Chart (Growth Rate)
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: `Growth Rate (${selectedYear})`,
        data: selectedYear === '2023' ?  
          [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] :
          [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65] ,
        borderColor: '#99B5E4',
        borderWidth: 1,
        tension: 0.4,
        pointBackgroundColor: '#336CC9',
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#333', titleColor: '#fff' },
    },
    
  };

  // Check if the role should have the cards displayed
  const isAdminOrDocumentRole = ['ADMIN', 'UPLOADER', 'APPROVER', 'REVIEWER', 'VIEWER'].includes(role);

  

  return (
    <div className='dashboard-body'>
      <div className='dashboard-container' >
        <Dashboard title={roleTitles[role]} />
        <h2 className='dashboard-h2'>Welcome Back, {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()} 👋</h2>

        {(role === 'PRODUCT_OWNER' || role === 'PRODUCT_ADMIN') && (
          <>
            <div className="cards-container">
              <Card title="Total Companies" value={OrgCount} icon={<HiBuildingOffice2 />} role={role} bgColor="#daeefe" />
              <Card title="Active Companies" value="22,345" icon={<HiBuildingOffice2 style={{ color: 'green' }} />} role={role} bgColor="#eed9ff"/>
              <Card title="Inactive Companies" value="1,234" icon={<HiBuildingOffice2 style={{ color: '#b22d2d' }} />} role={role} bgColor="#fff4d2"/>
              <Card title="Client Admin" value="23,456" icon={<IoPeople />} role={role} bgColor="#ffe8da" />
            </div>
            <div className="charts-container">
              <div className="chart">
                <p className='dashboard_text'><center>Company File Size</center></p>
                <div className='dashboard-btngrp'>
                  <button className='dashboard-top' onClick={sortAscending}><FaArrowUp /></button>
                  <button className='dashboard-bottom' onClick={sortDescending}><FaArrowDown /></button>
                  <input type='text' value={rowLimit} className='dashboard_num-input' onChange={handleRowLimitChange}/>
                </div>
                
                <div className='dashboard-table-container' style={{ maxHeight: '250px', overflowY: rowLimit > 5 ? 'scroll' : 'auto', position: "relative", bottom: "25px"}}>
                <table className='dashboard_table'>
                <thead className='dashboard_thead'>
                    <tr>
                      <th className='dashboard-table-th'>Company Name</th>
                      <th className='dashboard-table-th'>Username</th>
                      <th className='dashboard-table-th'>Doc Count</th>
                      <th className='dashboard-table-th'>File Size (Kb)</th>
                    </tr>
                    </thead>
                    <tbody className='dashboard-tbody'>
                    {companyData.slice(0, rowLimit).map((company, index) => (
                    <tr key={index} className='dashboard-table-row hover:bg-gray-50'>
                      <td className='dashboard-table-td'>{company.name}</td>
                      <td className='dashboard-table-td'>{company.username}</td>
                      <td className='dashboard-table-td'></td>
                      <td className='dashboard-table-td'>{company.fileSize} Kb</td>
                    </tr>
              ))}
            </tbody>
                </table>
                </div>
              </div>
              <div className="chart">
              <p className='dashboard_text'><center>Uploaded Documents</center></p>
                <Pie data={donutData} options={chartOptions} />
                <div className='piechart-text'>
                  <p className='piechart-data'><span className='color1'></span>  Total Uploads</p>
                  <p className='piechart-data'><span className='color2'></span>  Pending Documents</p>
                  <p className='piechart-data'><span className='color3'></span>  Rejected Documents</p>
                </div>
              </div>
              <div className="chart">
                <p className='dashboard_text'><center>Company Trends</center></p>
                <center>
                <div className="slicer">
                  <label className='dashboard-year-selector'>Select Year: </label>
                  <select className="dashboard-year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
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
            <div className="cards-container">
              <Card title="Total Documents" value="21,234" icon={<IoMdCloudUpload />} role={role}  />
              <Card title="Accepted Documents" value="18,234" icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} role={role} />
              <Card title="Pending Documents" value="1,000" icon={<MdPending style={{ color: '#dd651b' }} />} role={role} />
              <Card title="Rejected Documents" value="2,000" icon={<MdCancel style={{ color: '#b22d2d' }} />} role={role} />
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

const Card = ({ title, value, icon, role, bgColor}) => {
  // Inline style for Uploader, Approver, and Reviewer roles
  const cardStyle = {
    backgroundColor: bgColor,
    marginTop: role === 'UPLOADER' || role === 'APPROVER' || role === 'REVIEWER' || role === 'VIEWER' ? "10%" : "",
  }
    
  
  

  return (
    
    <div className="card" style={cardStyle}>
      <div className="card-title">
        <div className="card-icon">{icon}</div>
        <div className="card-info">
          <h2 >{title}</h2>
          <p>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;
