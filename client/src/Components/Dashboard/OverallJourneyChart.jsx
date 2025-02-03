import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { color } from 'chart.js/helpers';

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

const OverallJourneyChart = ({ journeys }) => {
  const chartData = {
    labels: journeys.map(journey => journey.name),
    datasets: [
      {
        label: 'Journey Progress',
        color:'#ffff',
        data: journeys.map(journey => journey.progress),
        fill: true,
        // backgroundColor: '#6366f1',
        backgroundColor: '#111827',
        borderColor: '#4f46e5',
      },
    ],
  };

//   const options = {
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 100,
//       },
//     },
//   };


const options = {
    scales: {
      x: {
        ticks: {
          color: 'white', 
        },
        grid: {
            color: '#7a7979c2', 
          },
      },
      y: {
        ticks: {
          color: 'white', 
        },
        grid: {
            color: '#7a7979c2', 
          },
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white', // Color of the legend text
        },
      },
    },
  };


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-primary-200 mb-4">Overall Journey Progress</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default OverallJourneyChart;
