import React, { useEffect, useRef } from 'react';
import './dashboard.css';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const MyChart = () => {
  const chartRef = useRef(null);
}

const App = () => {
  return (
    <div className="dashboard-container">
      <Dashboard />
      <PieChart />
      <MyChart />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2 className='dashboard-h2'>
        Dashboard
      </h2>
      <p className='no-of-cmp'>
        Number Of Companies
      </p>
      <p className='active-cmp'>Active Companies: 126</p>
      <p className='inactive-cmp'>
        Inactive Companies: 32
        </p>
    </div>
  );
};

const PieChart = () => {
  const data = {
    labels: ['Blue', 'Orange'],
    datasets: [
      {
        data: [126, 32],
        backgroundColor: ['#023af2', '#e88b09'],
        hoverBackgroundColor: ['#023af2', '#e88b09'],
      },
    ],
  };

  return (
    <div className="piechart">
      <Pie data={data} />
    </div>
  );
};

export default App;
