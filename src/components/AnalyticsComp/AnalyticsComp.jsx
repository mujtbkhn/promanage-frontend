import React from "react";
import DOT from "../../images/dot.png";
import "./AnalyticsComp.css"

const AnalyticsComp = ({ name, value }) => {
  return (
    <div className="analytics-comp">
      <div className="analytics-name">
        <img src={DOT} alt="" />
        <p>{name}</p>
      </div>
      <div className="analytics-value">
        <p>{value}</p>
      </div>
    </div>
  );
};

export default AnalyticsComp;
