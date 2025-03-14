import React from "react";
import "./loading.css";

const LoadingText = ({ progress }) => {
  return (
    <div className="flex-container">
      <h1 className="loading-text" style={{ "--progress": `${progress}%` }}>
        loading...
      </h1>
      <span className="loading-percent">{progress}%</span>
    </div>
  );
};

export default LoadingText;
