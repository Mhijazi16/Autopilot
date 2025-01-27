import React, { useState } from 'react';
import './Dashboard.css';
import packagerIcon from '../../assets/icons/packager.svg'
import navigationIcon from '../../assets/icons/navigation.png';
import processIcon from '../../assets/icons/processes.svg';
import shellIcon from '../../assets/icons/shell.png';
import networkIcon from '../../assets/icons/network.svg'
import codeIcon from '../../assets/icons/code.svg';
import githubIcon from '../../assets/icons/github.svg';
import filesystemIcon from '../../assets/icons/filesystem.svg';
import usersIcon from '../../assets/icons/users.svg';
import AgentModal from './AgentModal';
import Monitoring from './Monitoring/Monitoring';

const AgentCard = ({ name, iconPath, onClick }) => {
  return (
    <div className={`agent-card ${name}`} onClick={onClick}>
      <div className="agent-icon">
        <img src={iconPath} alt={`${name} Icon`} />
      </div>
      <div className="agent-info">
        <h3 className="agent-name">{name}</h3>
        <h4>Agent</h4> 
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
      <h2 className="dashboard-title">Agents</h2>
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
        <p>The Package Management Agent provides tools to install, remove, and update software packages on a Linux system, 
        as well as manage package dependencies.</p>
        <br/>
        <ul>
          <li><b>search packages:</b> Search for available software packages.</li>
          <li><b>clean package cache:</b> Clear the package cache to free up space.</li>
          <li><b>install packages:</b> Install one or more software packages.</li>
          <li><b>update packages:</b> Update system packages to their latest versions.</li>
          <li><b>list dependencies:</b> List dependencies of installed packages.</li>
          <li><b>list installed_packages:</b> View a list of installed packages.</li>
          <li><b>remove packages:</b> Uninstall specified packages.</li>
          <li><b>remove full packages:</b> Uninstall packages and their dependencies.</li>
        </ul>
      </>
    ),
  },
  Network: {
    icon: networkIcon,
    description: (
      <>
        <p>The Network Agent offers tools to manage network interfaces, identify devices on the network, and run a local HTTP server, 
        making it easier to control and monitor network activity.</p><br/>
        <ul>
          <li><b>list wifi networks:</b> List nearby Wi-Fi networks.</li>
          <li><b>list interfaces:</b> View available network interfaces.</li>
          <li><b>list network hosts:</b> Identify devices on the network by IP and MAC addresses.</li>
          <li><b>enable interface:</b> Enable a specific network interface.</li>
          <li><b>disable interface:</b> Disable a specific network interface.</li>
          <li><b>start http server:</b> Start a local HTTP server in a directory.</li>
          <li><b>kill http server:</b> Stop the currently running HTTP server.</li>
          <li><b>ssh to host:</b> Connect to a remote host via SSH and run commands.</li>
        </ul>
      </>
    ),
  },
  // Navigation: {
  //   icon: navigationIcon,
  //   description: (
  //     <>
  //       <p>The Navigation Agent helps you interact with various online services by allowing you to perform web searches, 
  //       find images and videos, check weather forecasts, and get directions.</p><br/>
  //       <ul>
  //         <li><b>search google:</b> Search for web content on Google.</li>
  //         <li><b>search google news:</b> Find news articles on Google News.</li>
  //         <li><b>search google images:</b> Find images through Google.</li>
  //         <li><b>search youtube videos:</b> Locate YouTube videos by title.</li>
  //         <li><b>search weather forecast:</b> Get weather information for a specific location.</li>
  //         <li><b>get top search result:</b> Fetch the top result from a Google search.</li>
  //         <li><b>get directions:</b> Get driving or walking directions via Google Maps.</li>
  //       </ul>
  //     </>
  //   ),
  // },
  Processes: {
    icon: processIcon,
    description: <>
    <p>The Processes & Services Agent provides powerful tools to manage system services and processes, ensuring seamless control over your system's operations.</p><br/>
    <ul>
      <li><b>start service:</b> Start a specified service on the system.</li>
      <li><b>stop service:</b> Stop a specified service running on the system.</li>
      <li><b>restart service:</b> Restart a service to apply changes or recover from issues.</li>
      <li><b>enable service:</b> Enable a service to start automatically on system boot.</li>
      <li><b>disable service:</b> Disable a service from starting automatically on system boot.</li>
      <li><b>show service status:</b> Display the current status of a specified service.</li>
      <li><b>kill process:</b> Terminate a specific process by its ID or name.</li>
      <li><b>list service logs:</b> View logs of a specific service to monitor or troubleshoot issues.</li>
      <li><b>run service in background:</b> Run a service or process in the background for uninterrupted operation.</li>
    </ul>

    </>,
  },
  Shell: {
    icon: shellIcon,
    description: <>
    <p>The Shell Agent provides the flexibility to execute custom commands, enabling advanced operations and tasks not covered by other agents.</p><br/>
    <ul>
      <li><b>run custom command:</b> Execute any specific shell command directly on the system.</li>
    </ul>

  </>
  },
  Coding: {
    icon: codeIcon,
    description: <>  
    <p>The Code Agent streamlines the execution and automation of code-related tasks, making it easier to manage and run programs directly from the system.</p><br/>
    <ul>
      <li><b>compile and run C/C++ files:</b> Compile C or C++ programs and execute them seamlessly.</li>
      <li><b>write and run scripts:</b> Create and execute Bash scripts or other programming language files.</li>
      <li><b>create cron jobs:</b> Schedule tasks and automate processes by setting up cron jobs.</li>
    </ul>

  </>
  },
  Github: {
    icon: githubIcon,
    description: (
      <>
        <p>The GitHub Agent enables management of GitHub repositories, including creating, 
        modifying, and managing files and descriptions without leaving the system.</p><br/>
        <ul>
          <li><b>create repository:</b> Create a new repository on GitHub.</li>
          <li><b>delete repository:</b> Delete an existing GitHub repository.</li>
          <li><b>modify repository:</b> Modify the description of a GitHub repository.</li>
          <li><b>remove repository_file:</b> Delete a file from a GitHub repository.</li>
          <li><b>add repository file:</b> Add a file to a repository on GitHub.</li>
          <li><b>update repository file:</b> Update an existing file in a GitHub repository.</li>
          <li><b>read repository file:</b> Read the content of a file in a repository.</li>
          <li><b>show repo content:</b> Display the contents of a repository.</li>
        </ul>
      </>
    ),
  },
  Filesystem: {
    icon: filesystemIcon,
    description: <>  
    <p>The Filesystem Agent offers essential tools to manage and interact with files and folders, enhancing productivity and organization on your system.</p><br/>
    <ul>
      <li><b>locate file or folder:</b> Find the path of a specific file or folder on the system.</li>
      <li><b>compress files:</b> Create compressed archives of files or folders for storage or sharing.</li>
      <li><b>decompress files:</b> Extract compressed files to access their contents.</li>
      <li><b>open file:</b> Open a specific file for viewing or editing.</li>
      <li><b>open folder:</b> Access a folder to browse its contents.</li>
      <li><b>open video:</b> Play a video file using the system's default player.</li>
      <li><b>open image:</b> View an image file with the default viewer.</li>
    </ul>

    </>
  },
  Users: {
    icon: usersIcon,
    description: (
      <>
        <p>The Users & Groups Agent helps manage user accounts and groups on a 
        Linux system, providing tools to create, remove, 
        and modify users and groups.</p><br/>
        <ul>
          <li><b>create users:</b> Create one or more users with random passwords.</li>
          <li><b>remove users:</b> Remove users from the system.</li>
          <li><b>add groups:</b> Create new user groups.</li>
          <li><b>remove groups:</b> Remove existing groups.</li>
          <li><b>add group users:</b> Add users to specific groups.</li>
          <li><b>change password:</b> Change the password for a user.</li>
        </ul>
      </>
    ),
  },
};

export default Dashboard;
