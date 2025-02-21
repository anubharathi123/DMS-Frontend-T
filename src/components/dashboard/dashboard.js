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
  const [companyData, setCompanyData] = useState([]);
  const [rowLimit, setRowLimit] = useState('3');
  const username = localStorage.getItem('name') || "User";
  // const [data, setData] = useState([])

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
  
        if (response ) {
          // const { organization_count, user_count, active_org_count, inactive_org_count } = response[0];
          setOrgCount({
            totalCompanies: response.organization_count || 0,
            activeCompanies: response.active_org_count || 0,
            inactiveCompanies: response.inactive_org_count || 0,
            clientAdmins: response.user_count || 0,
            totalDocuments:response.document_count || 0,
            approvedDocuments:response.approved_count || 0,
            pendingDocuments:response.pending_count || 0, 
            rejectedDocuments:response.rejected_count || 0,
          });}
          console.log(OrgCount)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchCount();
  }, [companyData]); // ✅ Removed `companyData` from dependencies
  
  // Monitor companyData state updates
  useEffect(() => {
    console.log("Updated Company Data:", companyData);
  }, [companyData]);
  
 
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
    PRODUCT_OWNER: "Dashboard",
    PRODUCT_ADMIN: "Dashboard",
    ADMIN: "Dashboard",
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
        backgroundColor: ['#5C8FE0', '#6691D6', '#99B5E4'],
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
        borderColor: '#1661a9',
        borderWidth: 1,
        tension: 0.4,
        pointBackgroundColor: '#0d6abf',
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
        <Dashboard title="Dashboard" />
        <h2 className='dashboard-h2'>Welcome, {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()} </h2>

        {(role === 'PRODUCT_OWNER' || role === 'PRODUCT_ADMIN') && (
          <>
            <div className="cards-container">
           
              <Card title="Total Companies" value={OrgCount.totalCompanies} icon={<HiBuildingOffice2 />} bgColor="#E6F0FA" />
              <Card title="Active Companies" value={OrgCount.activeCompanies} icon={<HiBuildingOffice2 style={{ color: 'green'}} />} bgColor="#E6F0FA"/>
              <Card title="Inactive Companies" value={OrgCount.inactiveCompanies} icon={<HiBuildingOffice2 style={{ color: '#b22d2d' }} />} bgColor="#E6F0FA"/>
              <Card title="Client Admin" value={OrgCount.clientAdmins} icon={<IoPeople />} bgColor="#E6F0FA " />
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
                      <th className='dashboard-table-th'>File Size (Kb)</th>
                    </tr>
                    </thead>
                    <tbody className='dashboard-tbody'>
                    {companyData.slice(0, rowLimit).map((company, index) => (
                    <tr key={index} className='dashboard-table-row hover:bg-gray-50'>
                      <td className='dashboard-table-td'>{company.org_name}</td>
                      <td className='dashboard-table-td'>{company.username}</td>
                      <td className='dashboard-table-td'>{company.doc_count}</td>
                      <td className='dashboard-table-td'>{company.doc_size} Kb</td>
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
              <Card title="Total Documents" value={OrgCount.totalDocuments} icon={<IoMdCloudUpload />} role={role}  />
              <Card title="Approved Documents" value={OrgCount.approvedDocuments} icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} role={role} />
              <Card title="Pending Documents" value={OrgCount.pendingDocuments} icon={<MdPending style={{ color: '#dd651b' }} />} role={role} />
              <Card title="Rejected Documents" value={OrgCount.rejectedDocuments} icon={<MdCancel style={{ color: '#b22d2d' }} />} role={role} />
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
