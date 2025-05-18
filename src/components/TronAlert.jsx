// components/TronAlert.jsx
import React, { useEffect } from "react";
import "./TronAlert.css";

const TronAlert = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000); // auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`tron-alert ${type}`}>
      <span>{message}</span>
    </div>
  );
};

export default TronAlert;
