import React, { useEffect, useRef } from 'react';
import './dashboard.css';
import { Chart, ArcElement, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, PieController, LineController, BarController } from 'chart.js';

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

const App = () => {
  return (
    <div className='dashboard-container'>
      <Dashboard />
      <div className="cards-container">
        <Card title="Total Sales" value="$1,234,567" />
        <Card title="Total Users" value="12,345" />
        <Card title="Total Orders" value="1,234" />
        <Card title="Total Revenue" value="$123,456" />
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

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>
        <center>Dashboard</center>
      </h1>
      <p>
        <strong>Number Of Companies</strong>
      </p>
    </div>
  );
};

const Card = ({ title, value }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{value}</p>
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

export default App;