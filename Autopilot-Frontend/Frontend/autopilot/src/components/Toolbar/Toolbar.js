import React, { useState, useEffect } from "react";
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
import searchIcon from "../../assets/icons/search.png";
import feedbackIcon from "../../assets/icons/feedback.svg";
import ToolbarAgent from "./ToolbarAgent";

const Toolbar = () => {
  const icons = [
    { src: databaseIcon, alt: "Users" },
    { src: cryptographyIcon, alt: "Monitor" },
    { src: terminalIcon, alt: "Network" },
    { src: emailIcon, alt: "Github" },
    { src: navigationIcon, alt: "Navigation" },
    { src: checklistIcon, alt: "Packages" },
    { src: codeIcon, alt: "Coder" },
    { src: scriptIcon, alt: "Shell" },
    { src: searchIcon, alt: "Troubleshooter" },
  ];

  const [toolbarDictionary, setToolbarDictionary] = useState({});
  const [feedbackActive, setFeedbackActive] = useState(false);  

  useEffect(() => {
    getToolbar({setToolbarDictionary}); 
  }, []);

  useEffect(() => {
    getFeedback({setFeedbackActive});
  }, []);

  return (
    <>
      <div className="toolbar-main">
        <div className="feedback-dev">
          <div
              className={`toolbar-icon feedback ${feedbackActive ? "active" : ""}`}
              onClick={() => runFeedback({feedbackActive, setFeedbackActive})}
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
            <ToolbarAgent key={icon.alt} src={icon.src} index={index} alt={icon.alt}
              toolbarDictionary={toolbarDictionary}
              setToolbarDictionary={setToolbarDictionary}
            />
          ))}
        </div>
        </div>
    </>
  );
};


async function getToolbar({setToolbarDictionary}) {
  const url = "http://127.0.0.1:8000/toolbar";
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      const agentsArray =  Object.fromEntries(
        Object.entries(data).map(entry => [entry[0], entry[1]])
      );
      setToolbarDictionary(agentsArray);
    } else {
      console.error("Error getting toolbar:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

const getFeedback = async ({setFeedbackActive}) => {
  const url = "http://127.0.0.1:8000/feedback";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      switch (data.feedback) {
        case "Off":
          setFeedbackActive(false);
          break;
        case "On":
          setFeedbackActive(true);
          break;
        default:
          break;
      }
    } else {
      console.error("Error updating feedback:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};


async function runFeedback({feedbackActive ,setFeedbackActive}) {
  const url = "http://127.0.0.1:8000/feedback";

  const feedbackData = feedbackActive ? "Off" : "On";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    });

    if (response.ok) {
      setFeedbackActive(!feedbackActive);
    } else {
      console.error("Error updating feedback:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}



export default Toolbar;
