import React, { useState, useEffect } from "react";
import "./loading.css";

const LoadingText = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 5 : 100));
    }, 40); // Adjust speed

    return () => clearInterval(interval);
  }, []);

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
