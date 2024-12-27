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
    <div>
      <Dashboard />
      <PieChart />
      <MyChart />
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
      <p2>Active Companies: 126</p2>
      <br></br>
      <br></br>
      <p3>
        <strong1>Inactive Companies: 32</strong1>
        </p3>
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
