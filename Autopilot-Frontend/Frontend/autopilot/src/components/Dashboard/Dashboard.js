import React, { useState } from 'react';
import './Dashboard.css';
import packagerIcon from '../../assets/icons/packager.svg'
import navigationIcon from '../../assets/icons/navigation.png';
import databaseIcon from '../../assets/icons/database.png';
import shellIcon from '../../assets/icons/shell.png';
import networkIcon from '../../assets/icons/network.svg'
import codeIcon from '../../assets/icons/code.svg';
import githubIcon from '../../assets/icons/github.svg';
import troubleShootingIcon from '../../assets/icons/troubleshooting.svg';
import usersIcon from '../../assets/icons/users.svg';
import AgentModal from './AgentModal';
import Monitoring from './Monitoring/Monitoring';
import Logs from './Logs/Logs';

const AgentCard = ({ name, iconPath, onClick }) => {
  return (
    <div className={`agent-card ${name}`} onClick={onClick}>
      <div className="agent-icon">
        <img src={iconPath} alt={`${name} Icon`} />
      </div>
      <div className="agent-info">
        <h3 className="agent-name text-gray-900 dark:text-gray-100">{name}</h3>
        <h4 className="text-gray-700 dark:text-gray-100">Agent</h4> 
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [modalInfo, setModalInfo] = useState({ isOpen: false, name: '', icon: '', description: '' });

  const openModal = (name) => {
    const agent = agentDetails[name];
    setModalInfo({ isOpen: true, name, icon: agent.icon, description: agent.description });
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, name: '', icon: '', description: '' });
  };

  return (
    <>
    <div className='dashboard'>
    <Monitoring/>
    <Logs/>
      <h2 className="dashboard-title text-gray-900 dark:text-gray-100">Agents</h2>
      <div className="agent-grid">
        {Object.keys(agentDetails).map((agentName) => (
          <AgentCard
          key={agentName}
          name={agentName}
          iconPath={agentDetails[agentName].icon}
          onClick={() => openModal(agentName)}
          />
        ))}
      </div>
      <AgentModal
        isOpen={modalInfo.isOpen}
        onClose={closeModal}
        name={modalInfo.name}
        icon={modalInfo.icon}
        description={modalInfo.description}
        />
    </div>
    </>
  );
};


const agentDetails = {
  Packager: {
    icon: packagerIcon,
    description: (
      <>
        <p>The <b>Package Management Agent</b> provides tools to install, remove, and update software packages on a Linux system, 
        as well as manage package dependencies.</p>
        <ul>
          <li><b>search_packages:</b> Search for available software packages.</li>
          <li><b>clean_package_cache:</b> Clear the package cache to free up space.</li>
          <li><b>install_packages:</b> Install one or more software packages.</li>
          <li><b>update_packages:</b> Update system packages to their latest versions.</li>
          <li><b>list_dependencies:</b> List dependencies of installed packages.</li>
          <li><b>list_installed_packages:</b> View a list of installed packages.</li>
          <li><b>remove_packages:</b> Uninstall specified packages.</li>
          <li><b>remove_full_packages:</b> Uninstall packages and their dependencies.</li>
        </ul>
      </>
    ),
  },
  Network: {
    icon: networkIcon,
    description: (
      <>
        <p>The <b>Network Agent</b> offers tools to manage network interfaces, identify devices on the network, and run a local HTTP server, 
        making it easier to control and monitor network activity.</p>
        <ul>
          <li><b>list_wifi_networks:</b> List nearby Wi-Fi networks.</li>
          <li><b>list_interfaces:</b> View available network interfaces.</li>
          <li><b>list_network_hosts:</b> Identify devices on the network by IP and MAC addresses.</li>
          <li><b>enable_interface:</b> Enable a specific network interface.</li>
          <li><b>disable_interface:</b> Disable a specific network interface.</li>
          <li><b>start_http_server:</b> Start a local HTTP server in a directory.</li>
          <li><b>kill_http_server:</b> Stop the currently running HTTP server.</li>
          <li><b>ssh_to_host:</b> Connect to a remote host via SSH and run commands.</li>
        </ul>
      </>
    ),
  },
  Navigation: {
    icon: navigationIcon,
    description: (
      <>
        <p>The <b>Navigation Agent</b> helps you interact with various online services by allowing you to perform web searches, 
        find images and videos, check weather forecasts, and get directions.</p>
        <ul>
          <li><b>search_google:</b> Search for web content on Google.</li>
          <li><b>search_google_news:</b> Find news articles on Google News.</li>
          <li><b>search_google_images:</b> Find images through Google.</li>
          <li><b>search_youtube_videos:</b> Locate YouTube videos by title.</li>
          <li><b>search_weather_forecast:</b> Get weather information for a specific location.</li>
          <li><b>get_top_search_result:</b> Fetch the top result from a Google search.</li>
          <li><b>get_directions:</b> Get driving or walking directions via Google Maps.</li>
        </ul>
      </>
    ),
  },
  Database: {
    icon: databaseIcon,
    description: <>The <b>Database Agent</b> manages data storage and retrieval,
    ensuring efficient access to databases and structured data.
    </>,
  },
  Shell: {
    icon: shellIcon,
    description: <>  
    The <b>Linux Shell Agent</b> allows you to execute shell commands directly 
    on your Linux system, making it easy to interact with the operating system through the command line.,
  </>
  },
  Coding: {
    icon: codeIcon,
    description: <>  
    "The <b>Coding Agent</b> supports various coding and development tools to
    help with programming tasks and code management.",
  </>
  },
  Github: {
    icon: githubIcon,
    description: (
      <>
        <p>The <b>GitHub Agent</b> enables management of GitHub repositories, including creating, modifying, and managing files and descriptions without leaving the system.</p>
        <ul>
          <li><b>create_repository:</b> Create a new repository on GitHub.</li>
          <li><b>delete_repository:</b> Delete an existing GitHub repository.</li>
          <li><b>modify_repository:</b> Modify the description of a GitHub repository.</li>
          <li><b>remove_repository_file:</b> Delete a file from a GitHub repository.</li>
          <li><b>add_repository_file:</b> Add a file to a repository on GitHub.</li>
          <li><b>update_repository_file:</b> Update an existing file in a GitHub repository.</li>
          <li><b>read_repository_file:</b> Read the content of a file in a repository.</li>
          <li><b>show_repo_content:</b> Display the contents of a repository.</li>
        </ul>
      </>
    ),
  },
  Troubleshooting: {
    icon: troubleShootingIcon,
    description: <>  
    "The <b>Troubleshooting Agent</b> helps identify and resolve technical issues within 
    the system, ensuring smooth operations.,
    </>
  },
  Users: {
    icon: usersIcon,
    description: (
      <>
        <p>The <b>Users & Groups Agent</b> helps manage user accounts and groups on a 
        Linux system, providing tools to create, remove, 
        and modify users and groups.</p>
        <ul>
          <li><b>create_users:</b> Create one or more users with random passwords.</li>
          <li><b>remove_users:</b> Remove users from the system.</li>
          <li><b>add_groups:</b> Create new user groups.</li>
          <li><b>remove_groups:</b> Remove existing groups.</li>
          <li><b>add_group_users:</b> Add users to specific groups.</li>
          <li><b>change_password:</b> Change the password for a user.</li>
        </ul>
      </>
    ),
  },
};

export default Dashboard;
