import React, { useState } from "react";
import "./Settings.css";

const Settings = ( ) => {
  const [logging, setLogging] = useState(false);
  const [feedback, setFeedback] = useState(false);

  return (
    <div className="settings-container">
      <div className="settings-panel">

        <div className="settings-item">
          <div>
            <h3 className="settings-label">Logging</h3>
            <p className="settings-description">
              Show the process of Autopilot and actions taken
            </p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={logging}
              onChange={() => setLogging(!logging)}
              className="sr-only"
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="settings-item">
          <div>
            <h3 className="settings-label">Feedback</h3>
            <p className="settings-description">Display the warning pop-up</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={feedback}
              onChange={() => setFeedback(!feedback)}
              className="sr-only"
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
