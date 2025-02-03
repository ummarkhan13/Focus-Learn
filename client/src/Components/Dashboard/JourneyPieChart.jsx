import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Registering the required Chart.js components
ChartJS.register(
  ArcElement, // Required for Doughnut and Pie charts
  Tooltip,
  Legend,
  CategoryScale, // Required for Line charts
  LinearScale,
  PointElement,
  LineElement
);

const JourneyPieChart = ({ data, title }) => {
  const chartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: title,
        data: [data.completed, data.remaining],
        backgroundColor: ['#4f46e5', 'gray'],
        hoverBackgroundColor: [ '#6366f1','#6a7979c2'],
        
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'white', 
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
      <h4 className="text-lg font-medium text-primary-200 mb-4">{title}</h4>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default JourneyPieChart;
