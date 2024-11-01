// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'; // Updated import path

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-blue-500 flex items-center space-x-2">
          <span>Autopilot</span>
        </h1>
        <nav className="mt-10">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center mt-4 py-2 px-6 ${
                isActive
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded'
              }`
            }
          >
            <HomeIcon className="h-6 w-6" />
            <span className="mx-3">Autopilot</span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center mt-4 py-2 px-6 ${
                isActive
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded'
              }`
            }
          >
            <ChartBarIcon className="h-6 w-6" />
            <span className="mx-3">Dashboard</span>
          </NavLink>
          <NavLink
            to="/monitoring"
            className={({ isActive }) =>
              `flex items-center mt-4 py-2 px-6 ${
                isActive
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded'
              }`
            }
          >
            <HeartIcon className="h-6 w-6" />
            <span className="mx-3">Monitoring</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
