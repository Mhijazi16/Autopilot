import React, { useState, useEffect } from "react";
import { Tooltip } from 'react-tooltip';
import "./Toolbar.css";



function ToolbarAgent({ src, alt, index, toolbarDictionary, setToolbarDictionary }) {

    const [agentActive, setAgentActive] = useState(false);
    useEffect(() => {
      if (toolbarDictionary[alt] === "On") {
        setAgentActive(true);
      } 
    }, [toolbarDictionary, alt]);
  
    async function runAgent() {
      const updatedToolbar = {...toolbarDictionary};
      updatedToolbar[alt] = agentActive? "Off" : "On";
  
      try {
        const response = await fetch("http://127.0.0.1:8000/toolbar", 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedToolbar),
        })
  
        if(response.ok) {
          setToolbarDictionary(updatedToolbar);
          setAgentActive(!agentActive);
        }
        else {
          console.log("error loading agent!");
        }
      } catch (error) {
        console.log("error loading agent!");
      }
    }
  
    return (
      <>
      <div
        key={index}
        className={`toolbar-icon ${agentActive ? "active" : ""}`}
        onClick={runAgent}
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


  export default ToolbarAgent;
