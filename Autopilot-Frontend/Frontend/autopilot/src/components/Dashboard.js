// src/components/Dashboard.js
import React from 'react';

const Dashboard = () => {
  const items = [
    { name: 'Cryptography Agent', icon: '🔒' },
    { name: 'Script Agent', icon: '📜' },
    // Add more items as needed
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-blue-200 dark:bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {item.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
