

// import React from 'react';
// import './dashboard.css';
// import { IoPeople } from "react-icons/io5";
// import { HiBuildingOffice2 } from "react-icons/hi2";
// import { IoMdCloudUpload } from "react-icons/io";
// import { IoIosCheckmarkCircle } from "react-icons/io";
// import { MdPending } from "react-icons/md";
// import { MdCancel } from "react-icons/md";
// import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   BarElement,
//   ArcElement,
//   LineElement,
//   PointElement, // Ensure PointElement is registered
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

// const Dashboard = ({ role }) => {
//   return (
//     <div className="dashboard">
//       {role === 'PRODUCT_OWNER' && (
//         <h1 className='ProductOwner-h1'>Product Owner Dashboard</h1>
//       )}
//       {role === 'ADMIN' && (
//         <h1 className='Admin-h1'>Admin Dashboard</h1>
//       )}
//       {role === 'UPLOADER' && (
//         <h1 className='Uploader-h1'>Uploader Dashboard</h1>
//       )}
//       {role === 'REVIEWER' && (
//         <h1 className='Reviewer-h1'>Reviewer Dashboard</h1>
//       )}
//       {role === 'APPROVER' && (
//         <h1 className='Approver-h1'>Approver Dashboard</h1>
//       )}
//     </div>
//   );
// };

// const DashboardApp = () => {
//   const role = localStorage.getItem('role'); // Get the role of the user from localStorage

//   const barData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Company Registrations',
//         data: [5000, 6000, 7000, 8000, 9000, 10000],
//         backgroundColor: '#CCDAF1',
//       },
//     ],
//   };

//   const donutData = {
//     labels: ['Active', 'Inactive'],
//     datasets: [
//       {
//         data: [70, 30],
//         backgroundColor: ['#CCF0E7', '#FBCCD4'],
//       },
//     ],
//   };

//   const lineData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Growth Rate',
//         data: [5, 10, 15, 20, 25, 30],
//         borderColor: '#9BA4AB',
//         fill: false,
//       },
//     ],
//   };

//   const pieData = {
//     labels: ['Accepted', 'Pending', 'Rejected'],
//     datasets: [
//       {
//         data: [60, 25, 15],
//         backgroundColor: [
//           '#CCF0E7',
//           '#FEF2CC',
//           '#FBCCD4',
//         ],
//       },
//     ],
//   };

//   return (
//     <div className='dashboard-body'>
//       <div className='dashboard-container'>
//         <Dashboard role={role} />
//         {role === 'PRODUCT_OWNER' && (
//           <>
//             <div className="cards-container">
//               <Card role={role} className='dashboard-card' title="Total Companies" value="34,567" icon={<HiBuildingOffice2 />} />
//               <Card role={role} className='dashboard-card' title="Active Companies" value="22,345" icon={<HiBuildingOffice2 style={{ color: 'green' }}/>} />
//               <Card role={role} className='dashboard-card' title="Inactive Companies" value="1,234" icon={<HiBuildingOffice2 style={{ color: '#b22d2d' }}/>} />
//               <Card role={role} className='dashboard-card' title="Client Admin" value="23,456" icon={<IoPeople />} />
//             </div>
           

// <div className="charts-container">
//   <div className="bar-chart">
//     <Bar data={barData} options={{ responsive: true }} />
//   </div>
//   <div className="doughnut-chart">
//     <Doughnut data={donutData} options={{ responsive: true }} />
//   </div>
//   <div className="line-chart">
//     <Line data={lineData} options={{ responsive: true }} />
//   </div>
// </div>




//           </>
//         )}
//         {role === 'ADMIN' && (
//           <>
//             <div className="cards-container">
//               <Card role={role} className='dashboard-card' title="Total Document" value="21,234" icon={<IoMdCloudUpload />} />
//               <Card role={role} className='dashboard-card' title="Accepted Document" value="18,234" icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} />
//               <Card role={role} className='dashboard-card' title="Pending Document" value="1,000" icon={<MdPending style={{ color: '#dd651b' }} />} />
//               <Card role={role} className='dashboard-card' title="Rejected Document" value="2,000" icon={<MdCancel style={{ color: '#b22d2d' }} />} />
//             </div>
//             <div className="charts-container">
//             <div className="pie-chart">
//               <Pie data={pieData} options={{ responsive: true }} />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const Card = ({ title, value, icon, role }) => {
//   let cardStyle;
//   if (role === 'APPROVER') {
//     cardStyle = { backgroundColor: '#CCDAF1' };
//   } else if (role === 'UPLOADER') {
//     cardStyle = { backgroundColor: '#CCDAF1' };
//   } else if (role === 'REVIEWER') {
//     cardStyle = { backgroundColor: '#CCDAF1' };
//   }

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
import { MdPending } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
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

const Dashboard = ({ role }) => {
  return (
    <div className="dashboard">
      {role === 'PRODUCT_OWNER' && (
        <h1 className='ProductOwner-h1'>Product Owner Dashboard</h1>
      )}
      {role === 'ADMIN' && (
        <h1 className='Admin-h1'>Admin Dashboard</h1>
      )}
      {role === 'UPLOADER' && (
        <h1 className='Uploader-h1'>Uploader Dashboard</h1>
      )}
      {role === 'REVIEWER' && (
        <h1 className='Reviewer-h1'>Reviewer Dashboard</h1>
      )}
      {role === 'APPROVER' && (
        <h1 className='Approver-h1'>Approver Dashboard</h1>
      )}
    </div>
  );
};

const DashboardApp = () => {
  const role = localStorage.getItem('role'); // Get the role of the user from localStorage

  // State to store the selected year for the growth rate slicer
  const [selectedYear, setSelectedYear] = useState('2023');

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Company Registrations',
        data: [5000, 6000, 7000, 8000, 9000, 10000],
        backgroundColor: '#CCDAF1',
      },
    ],
  };

  const donutData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#CCF0E7', '#FBCCD4'],
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: `Growth Rate (${selectedYear})`,
        data:
          selectedYear === '2023'
            ? [5, 10, 15, 20, 25, 30]
            : [10, 15, 20, 25, 30, 35], // Example data for 2024
        borderColor: '#9BA4AB',
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: ['Accepted', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: [
          '#CCF0E7',
          '#FEF2CC',
          '#FBCCD4',
        ],
      },
    ],
  };

  return (
    <div className='dashboard-body'>
      <div className='dashboard-container'>
        <Dashboard role={role} />
        {role === 'PRODUCT_OWNER' && (
          <>
            <div className="cards-container">
              <Card role={role} className='dashboard-card' title="Total Companies" value="34,567" icon={<HiBuildingOffice2 />} />
              <Card role={role} className='dashboard-card' title="Active Companies" value="22,345" icon={<HiBuildingOffice2 style={{ color: 'green' }}/>} />
              <Card role={role} className='dashboard-card' title="Inactive Companies" value="1,234" icon={<HiBuildingOffice2 style={{ color: '#b22d2d' }}/>} />
              <Card role={role} className='dashboard-card' title="Client Admin" value="23,456" icon={<IoPeople />} />
            </div>
           
            <div className="charts-container">
              <div className="bar-chart">
                <Bar data={barData} options={{ responsive: true }} />
              </div>
              <div className="doughnut-chart">
                <Doughnut data={donutData} options={{ responsive: true }} />
              </div>
              <div className="line-chart">
                {/* Growth rate slicer */}
                <div className="slicer">
                  <label className='dashboard-year-selector' htmlFor="year-selector">Select Year: </label>
                  <select className='dashboard-year-selector'
                    id="year-selector"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <Line data={lineData} options={{ responsive: true }} />
              </div>
            </div>
          </>
        )}
        {role === 'ADMIN' && (
          <>
            <div className="cards-container">
              <Card role={role} className='dashboard-card' title="Total Document" value="21,234" icon={<IoMdCloudUpload />} />
              <Card role={role} className='dashboard-card' title="Accepted Document" value="18,234" icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} />
              <Card role={role} className='dashboard-card' title="Pending Document" value="1,000" icon={<MdPending style={{ color: '#dd651b' }} />} />
              <Card role={role} className='dashboard-card' title="Rejected Document" value="2,000" icon={<MdCancel style={{ color: '#b22d2d' }} />} />
            </div>
            <div className="charts-container">
              <div className="pie-chart">
                <Pie data={pieData} options={{ responsive: true }} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, role }) => {
  let cardStyle;
  if (role === 'APPROVER') {
    cardStyle = { backgroundColor: '#CCDAF1' };
  } else if (role === 'UPLOADER') {
    cardStyle = { backgroundColor: '#CCDAF1' };
  } else if (role === 'REVIEWER') {
    cardStyle = { backgroundColor: '#CCDAF1' };
  }

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
