
// import React, { useState } from 'react';
// import './dashboard.css';
// import { IoPeople } from "react-icons/io5";
// import { HiBuildingOffice2 } from "react-icons/hi2";
// import { IoMdCloudUpload } from "react-icons/io";
// import { IoIosCheckmarkCircle } from "react-icons/io";
// import { MdPending, MdCancel } from "react-icons/md";
// import { Bar, Doughnut, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   BarElement,
//   ArcElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   BarElement,
//   ArcElement,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// );

// const Dashboard = ({ role }) => (
//   <div className="dashboard">
//     <h1 className=  {`${role}-h1`}>{role} Dashboard</h1>
//   </div>
// );

// const DashboardApp = () => {
//   const role = localStorage.getItem('role');
//   const [selectedYear, setSelectedYear] = useState('2023');

//   // 🟢 Bar Chart (Company Registrations)
//   const barData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Company Registrations',
//         data: [5000, 6000, 7000, 8000, 9000, 10000],
//         backgroundColor: '#6691D6',
//         borderRadius: 8,
//       },
//     ],
//   };

//   // 🟠 Doughnut Chart (Total Uploads)
//   const donutData = {
//     labels: ['Total Uploads', 'Pending Documents', 'Rejected Documents'],
//     datasets: [
//       {
//         data: [50000, 10000, 5000],
//         backgroundColor: ['#336CC9', '#99B5E4', '#6691D6'],
//         borderWidth: 3,
//         cutout: '70%',
//       },
//     ],
//   };

//   // 🔵 Line Chart (Growth Rate)
//   const lineData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     datasets: [
//       {
//         label: `Growth Rate (${selectedYear})`,
//         data: selectedYear === '2023' ? 
//           [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] : 
//           [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
//         borderColor: '#99B5E4',
//         borderWidth: 1,
//         tension: 0.4,
//         pointBackgroundColor: '#336CC9',
//         pointRadius: 3,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: { backgroundColor: '#333', titleColor: '#fff' },
//     },
//     scales: {
//       x: { grid: { display: false } },
//       y: { grid: { color: 'rgba(0, 0, 0, 0.1)' } },
//     },
//   };

//   // Check if the role should have the cards displayed
//   const isAdminOrDocumentRole = ['ADMIN', 'UPLOADER', 'APPROVER', 'REVIEWER'].includes(role);

//   return (
//     <div className='dashboard-body'>
//       <div className='dashboard-container'>
//         <Dashboard role={role} />

//         {role === 'PRODUCT_OWNER' && (
//           <>
//             <div className="cards-container">
//               <Card title="Total Companies" value="34,567" icon={<HiBuildingOffice2 />} role={role} />
//               <Card title="Active Companies" value="22,345" icon={<HiBuildingOffice2 style={{ color: 'green' }} />} role={role} />
//               <Card title="Inactive Companies" value="1,234" icon={<HiBuildingOffice2 style={{ color: '#b22d2d' }} />} role={role} />
//               <Card title="Client Admin" value="23,456" icon={<IoPeople />} role={role} />
//             </div>
//             <div className="charts-container">
//               <div className="chart">
//                 <Bar data={barData} options={chartOptions} />
//               </div>
//               <div className="chart">
//                 <Doughnut data={donutData} options={chartOptions} />
//               </div>
//               <div className="chart">
//                 <div className="slicer">
//                   <label className='dashboard-year-selector'>Select Year: </label>
//                   <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
//                     <option value="2023">2023</option>
//                     <option value="2024">2024</option>
//                   </select>
//                 </div>
//                 <Line data={lineData} options={chartOptions} />
//               </div>
//             </div>
//           </>
//         )}

//         {(isAdminOrDocumentRole) && (
//           <>
//             <div className="cards-container">
//               <Card title="Total Documents" value="21,234" icon={<IoMdCloudUpload />} role={role} />
//               <Card title="Accepted Documents" value="18,234" icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} role={role} />
//               <Card title="Pending Documents" value="1,000" icon={<MdPending style={{ color: '#dd651b' }} />} role={role} />
//               <Card title="Rejected Documents" value="2,000" icon={<MdCancel style={{ color: '#b22d2d' }} />} role={role} />
//             </div>
//             {role === 'ADMIN' && (
//               <div className="chart">
//                 <Doughnut data={donutData} options={chartOptions} />
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const Card = ({ title, value, icon, role }) => {
//   // Inline style for Uploader, Approver, and Reviewer roles
//   const cardStyle = role === 'UPLOADER' || role === 'APPROVER' || role === 'REVIEWER'
//     ? { backgroundColor: '#CCDAF1' }
//     : {};

//   return (
//     <div className="card" style={cardStyle}>
//       <div className="card-title">
//         <div className="card-icon">{icon}</div>
//         <div className="card-info">
//           <h2>{title}</h2>
//           <p>{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardApp;









import React, { useState } from 'react';
import './dashboard.css';
import { IoPeople } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { IoMdCloudUpload } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdPending, MdCancel } from "react-icons/md";
import { Bar, Doughnut, Line } from 'react-chartjs-2';
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

  // Define titles for each role
  const roleTitles = {
    PRODUCT_OWNER: "Product Owner Dashboard",
    ADMIN: "Admin Dashboard",
    UPLOADER: "Uploader Dashboard",
    APPROVER: "Approver Dashboard",
    REVIEWER: "Reviewer Dashboard",
  };

  // 🟢 Bar Chart (Company Registrations)
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Company Registrations',
        data: [5000, 6000, 7000, 8000, 9000, 10000],
        backgroundColor: '#6691D6',
        borderRadius: 8,
      },
    ],
  };

  // 🟠 Doughnut Chart (Total Uploads)
  const donutData = {
    labels: ['Total Uploads', 'Pending Documents', 'Rejected Documents'],
    datasets: [
      {
        data: [50000, 10000, 5000],
        backgroundColor: ['#336CC9', '#f0ec05', '#ff0101'],
        borderWidth: 3,
        cutout: '70%',
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
          [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
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
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0, 0, 0, 0.1)' } },
    },
  };

  // Check if the role should have the cards displayed
  const isAdminOrDocumentRole = ['ADMIN', 'UPLOADER', 'APPROVER', 'REVIEWER'].includes(role);

  return (
    <div className='dashboard-body'>
      <div className='dashboard-container'>
        <Dashboard title={roleTitles[role]} />

        {role === 'PRODUCT_OWNER' && (
          <>
            <div className="cards-container">
              <Card title="Total Companies" value="34,567" icon={<HiBuildingOffice2 />} role={role} />
              <Card title="Active Companies" value="22,345" icon={<HiBuildingOffice2 style={{ color: 'green' }} />} role={role} />
              <Card title="Inactive Companies" value="1,234" icon={<HiBuildingOffice2 style={{ color: '#b22d2d' }} />} role={role} />
              <Card title="Client Admin" value="23,456" icon={<IoPeople />} role={role} />
            </div>
            <div className="charts-container">
              <div className="chart">
                <Bar data={barData} options={chartOptions} />
              </div>
              <div className="chart">
                <Doughnut data={donutData} options={chartOptions} />
              </div>
              <div className="chart">
                <div className="slicer">
                  <label className='dashboard-year-selector'>Select Year: </label>
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <Line data={lineData} options={chartOptions} />
              </div>
            </div>
          </>
        )}

        {(isAdminOrDocumentRole) && (
          <>
            <div className="cards-container">
              <Card title="Total Documents" value="21,234" icon={<IoMdCloudUpload />} role={role} />
              <Card title="Accepted Documents" value="18,234" icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} role={role} />
              <Card title="Pending Documents" value="1,000" icon={<MdPending style={{ color: '#dd651b' }} />} role={role} />
              <Card title="Rejected Documents" value="2,000" icon={<MdCancel style={{ color: '#b22d2d' }} />} role={role} />
            </div>
            {role === 'ADMIN' && (
              <div className="chart">
                <Doughnut data={donutData} options={chartOptions} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, role }) => {
  // Inline style for Uploader, Approver, and Reviewer roles
  const cardStyle = role === 'UPLOADER' || role === 'APPROVER' || role === 'REVIEWER'
    ? { backgroundColor: '#CCDAF1' }
    : {};

  return (
    <div className="card" style={cardStyle}>
      <div className="card-title">
        <div className="card-icon">{icon}</div>
        <div className="card-info">
          <h2>{title}</h2>
          <p>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;
