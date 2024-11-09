import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Monitoring = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const data = {
      labels: ['CPU', 'Memory', 'Disk', 'Network', 'Power Usage'],
      datasets: [
        {
          label: 'Usage',
          data: [50, 75, 60, 80, 90],
          backgroundColor: 'rgba(37, 99, 235, 0.5)',
        },
      ],
    };

    const monitoringChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'gray',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'gray',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
          y: {
            ticks: {
              color: 'gray',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    });

    return () => {
      monitoringChart.destroy();
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
        Monitoring
      </h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default Monitoring;
