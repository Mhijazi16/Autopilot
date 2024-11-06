import React, { useState } from 'react';
import './Dashboard.css';
import cryptographyIcon from '../../assets/icons/cryptography.png';
import scriptIcon from '../../assets/icons/script.png';
import navigationIcon from '../../assets/icons/navigation.png';
import databaseIcon from '../../assets/icons/database.png';
import terminalIcon from '../../assets/icons/terminal.png';
import codeIcon from '../../assets/icons/code.png';
import AgentModal from './AgentModal';

const agentDetails = {
  Cryptography: {
    icon: cryptographyIcon,
    description: "Handles encryption, decryption, and security protocols.",
  },
  Script: {
    icon: scriptIcon,
    description: "Automates tasks and manages scripts.",
  },
  Navigation: {
    icon: navigationIcon,
    description: "Assists in data retrieval and online searches.",
  },
  Database: {
    icon: databaseIcon,
    description: "Manages data storage and retrieval.",
  },
  Terminal: {
    icon: terminalIcon,
    description: "Provides command-line interface functionalities.",
  },
  Code: {
    icon: codeIcon,
    description: "Supports coding and development tools.",
  },
};

const AgentCard = ({ name, iconPath, onClick }) => {
  return (
    <div className="agent-card" onClick={onClick}>
      <div className="agent-icon">
        <img src={iconPath} alt={`${name} Icon`} />
      </div>
      <div className="agent-info">
        <h3 className="agent-name text-gray-900 dark:text-gray-100">{name}</h3>
        <h4 className="text-gray-600 dark:text-gray-400">Agent</h4> 
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
    <div>
      <h2 className="dashboard-title text-gray-900 dark:text-gray-100">Dashboard</h2>
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
  );
};

export default Dashboard;
