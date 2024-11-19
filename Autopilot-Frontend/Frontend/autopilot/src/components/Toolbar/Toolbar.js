import React, { useState} from "react";
import { Tooltip } from 'react-tooltip';
import "./Toolbar.css";

import cryptographyIcon from "../../assets/icons/cryptography.png";
import databaseIcon from "../../assets/icons/database.png";
import terminalIcon from "../../assets/icons/terminal.png";
import emailIcon from "../../assets/icons/email.png";
import navigationIcon from "../../assets/icons/navigation.png";
import checklistIcon from "../../assets/icons/checklist.png";
import codeIcon from "../../assets/icons/code.png";
import scriptIcon from "../../assets/icons/script.png";
import calculatorIcon from "../../assets/icons/calculator.png";
import searchIcon from "../../assets/icons/search.png";
import feedbackIcon from "../../assets/icons/feedback.svg";

const Toolbar = () => {
  const icons = [
    { src: databaseIcon, alt: "Database" },
    { src: cryptographyIcon, alt: "Cryptography" },
    { src: terminalIcon, alt: "Terminal" },
    { src: emailIcon, alt: "Email" },
    { src: navigationIcon, alt: "Navigation" },
    { src: checklistIcon, alt: "Checklist" },
    { src: codeIcon, alt: "Code" },
    { src: scriptIcon, alt: "Script" },
    { src: calculatorIcon, alt: "Calculator" },
    { src: searchIcon, alt: "Search" },
  ];

  const [feedbackActive, setFeedbackActive] = useState(false);

  return (
    <>
      <div className="toolbar-main">
        <div className="feedback-dev">
          <div
            className={`toolbar-icon feedback ${feedbackActive ? "active" : ""}`}
            onClick={() => setFeedbackActive(!feedbackActive)}
            data-tooltip-id={`feedback-tooltip`} 
            data-tooltip-content={`${feedbackActive? "Activated" : "Deactivated"}`}
            data-tooltip-place="left"
            >
            <img src={feedbackIcon} alt={"feedback"} />
            <Tooltip 
            id={`feedback-tooltip`}
            key={feedbackActive ? "active" : "inactive"}
            offset={20} 
            style={{
            fontSize: "18px",
            borderRadius: "5px",
            backgroundColor: feedbackActive ? "#1F68FF" : "#1E1E1E",
            }}/>
          </div>
        </div>
        <div className="toolbar">
          {icons.map((icon, index) => (
            <Agent src={icon.src} index={index} alt={icon.alt} />
          ))}
        </div>
        </div>
    </>
  );
};

function Agent({ src, alt, index }) {
  const [agentActive, setAgentActive] = useState(false);

  function activateAgent() {
    setAgentActive(!agentActive);
  }

  return (
    <>
    <div
      key={index}
      className={`toolbar-icon ${agentActive ? "active" : ""}`}
      onClick={() => activateAgent()}
      data-tooltip-id={`agent-tooltip-${index}`} 
      data-tooltip-content={`${agentActive? "Activated" : "Deactivated"}`}
      data-tooltip-place="left"
      >
      <img src={src} alt={alt} />
      <Tooltip 
      id={`agent-tooltip-${index}`}
      key={agentActive ? "active" : "inactive"}
      offset={20} 
      style={{
        fontSize: "18px",
        borderRadius: "5px",
        backgroundColor: agentActive ? "#1F68FF" : "#1E1E1E",
      }}/>
    </div>
    </>
  );
}

export default Toolbar;
