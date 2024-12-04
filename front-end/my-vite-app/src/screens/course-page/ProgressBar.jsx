import React from 'react';
import './ProgressBar.css'; // Create this CSS file for styling

function ProgressBar({ percentage }) {
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${percentage}%` }}
      >
        <span className="progress-bar-text">{percentage}% Completed</span>
      </div>
    </div>
  );
}

export default ProgressBar;