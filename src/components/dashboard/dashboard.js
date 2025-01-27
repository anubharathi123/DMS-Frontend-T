import React, { useEffect, useRef } from 'react';
import './dashboard.css';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, PieController, LineController, BarController } from 'chart.js';
import { IoPeople } from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { IoMdCloudUpload } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdPending } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

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

const roleData = {
  labels: ['Uploader', 'Reviewer', 'Approver'],
  datasets: [
    {
      label: 'Number of Users',
      data: [100, 80, 50],  // Replace these values with dynamic data
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

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
            <div className="rolePieChart">
              <RolePieChart /> {/* Updated to render RolePieChart */}
            </div>
          </>
        )}

        {['UPLOADER', 'REVIEWER', 'APPROVER'].includes(role) && (
          <>
            <div className="cards-container">
              <Card role={role} className='dashboard-card' title="Total Document" value="21,234" icon={<IoMdCloudUpload />} />
              <Card role={role} className='dashboard-card' title="Accepted Document" value="18,234" icon={<IoIosCheckmarkCircle style={{ color: 'green' }} />} />
              <Card role={role} className='dashboard-card' title="Pending Document" value="1,000" icon={<MdPending style={{ color: '#dd651b' }} />} />
              <Card role={role} className='dashboard-card' title="Rejected Document" value="2,000" icon={<MdCancel style={{ color: '#b22d2d' }} />} />
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

// Create the RolePieChart component for ADMIN
const RolePieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'pie',
      data: roleData,
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            anchor: 'center',
            align: 'center',
            color: 'black',
            font: {
              weight: 'bold',
              size: 12,
            },
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1) + '%';
              return `${value} (${percentage})`; // Show both number and percentage
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return <canvas ref={chartRef} width="800" height="600"></canvas>;
};

export default DashboardApp;







