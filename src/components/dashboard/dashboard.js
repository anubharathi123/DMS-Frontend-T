
// import React, { useEffect, useRef } from 'react';
// import './dashboard.css';
// import { Pie, Line, Bar } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, PieController, LineController, BarController } from 'chart.js';
// import { IoPeople } from "react-icons/io5";
// import { HiBuildingOffice2 } from "react-icons/hi2";

// Chart.register(ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, PieController, LineController, BarController);

// const samplePieData = {
//   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

// const sampleLineData = {
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//   datasets: [
//     {
//       label: 'Sales',
//       data: [65, 59, 80, 81, 56, 55, 40],
//       fill: false,
//       backgroundColor: 'rgba(75, 192, 192, 0.2)',
//       borderColor: 'rgba(75, 192, 192, 1)',
//     },
//   ],
// };

// const sampleBarData = {
//   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

// const DashboardApp = () => {
//   const role= localStorage.getItem('role')
//   return (
//     <div className='dashboard-container'>
//       <Dashboard />
//       <div className="cards-container">
//         <Card className='dashboard-card' title="Total Companies" value="34,567" icon={<HiBuildingOffice2 />} />
//         <Card className='dashboard-card' title="Active Companies" value="22,345" icon={<HiBuildingOffice2 />} />
//         <Card className='dashboard-card' title="Inactive Companies" value="1,234" icon={<HiBuildingOffice2 />} />
//         <Card className='dashboard-card' title="Client Admin" value="23,456" icon={<IoPeople />} />
//       </div>
//       <div className="chart-container">
//         <div className="chart">
//           <PieChart />
//         </div>
//         <div className="chart">
//           <LineChart />
//         </div>
//         <div className="chart">
//           <BarChart />
//         </div>
//       </div>
//     </div>
//   );
// };

// const Dashboard = () => {
//   return (
//     <div className="dashboard">
//       <h1 className='dashboard-h1'>
//         Dashboard
//       </h1>
//     </div>
//   );
// };

// const Card = ({ title, value, icon }) => {
//   return (
//     <div className="card">
//       <div className="card-title">
//         {/* Icon passed as a prop */}
//         <div className="card-icon">{icon}</div>

//         {/* Title and value aligned to the right */}
//         <div className="card-info">
//           <h2>{title}</h2>
//           <p>{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PieChart = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const chart = new Chart(chartRef.current, {
//       type: 'pie',
//       data: samplePieData,
//     });

//     return () => {
//       chart.destroy();
//     };
//   }, []);

//   return <canvas ref={chartRef}></canvas>;
// };

// const LineChart = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const chart = new Chart(chartRef.current, {
//       type: 'line',
//       data: sampleLineData,
//     });

//     return () => {
//       chart.destroy();
//     };
//   }, []);

//   return <canvas ref={chartRef}></canvas>;
// };

// const BarChart = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const chart = new Chart(chartRef.current, {
//       type: 'bar',
//       data: sampleBarData,
//     });

//     return () => {
//       chart.destroy();
//     };
//   }, []);

//   return <canvas ref={chartRef}></canvas>;
// };

// export default DashboardApp;











import React, { useEffect, useRef } from 'react';
import './dashboard.css';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, PieController, LineController, BarController } from 'chart.js';
import { IoPeople } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { IoMdCloudUpload } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdPending } from "react-icons/md";



Chart.register(ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, PieController, LineController, BarController);

const samplePieData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const sampleLineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
    },
  ],
};

const sampleBarData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const DashboardApp = () => {
  const role = localStorage.getItem('role'); // Get the role of the user from localStorage

  // Conditionally render the dashboard based on the role
  return (
    <div className='dashboard-container'>
      <Dashboard role={role} />
      <div className="cards-container">
        {role === 'PRODUCT_OWNER' && (
          <>
            <Card className='dashboard-card' title="Total Companies" value="34,567" icon={<HiBuildingOffice2 />} />
            <Card className='dashboard-card' title="Active Companies" value="22,345" icon={<HiBuildingOffice2 />} />
            <Card className='dashboard-card' title="Inactive Companies" value="1,234" icon={<HiBuildingOffice2 />} />
            <Card className='dashboard-card' title="Client Admin" value="23,456" icon={<IoPeople />} />

          </>
        )}
        {role === 'ADMIN' && (
          <>
          <Card className='dashboard-card' title="Total Uploads" value="21,234" icon={<IoMdCloudUpload />} />
          <Card className='dashboard-card' title="Accepted" value="18,234" icon={<IoIosCheckmarkCircle />} />
          <Card className='dashboard-card' title="Pending" value="1,000" icon={<MdPending />} />
          <Card className='dashboard-card' title="Rejected" value="2,000" icon={<HiBuildingOffice2 />} />

          </>
        )}
        
      </div>
      <div className="chart-container">
        <div className="chart">
          <PieChart />
        </div>
        <div className="chart">
          <LineChart />
        </div>
        <div className="chart">
          <BarChart />
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ role }) => {
  return (
    <div className="dashboard">
      <h1 className='dashboard-h1'>
        {role === 'PRODUCT_OWNER' && 'Product Owner Dashboard'}
        {role === 'ADMIN' && 'Admin Dashboard'}
        
      </h1>
    </div>
  );
};

const Card = ({ title, value, icon }) => {
  return (
    <div className="card">
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

const PieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'pie',
      data: samplePieData,
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: sampleLineData,
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

const BarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: sampleBarData,
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default DashboardApp;
