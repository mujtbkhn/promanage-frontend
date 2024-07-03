import React, { useEffect, useState } from "react";
import AnalyticsComp from "../../components/AnalyticsComp/AnalyticsComp";
import { getAnalytics } from "../../apis/todo";
import "./Analytics.css"; // Make sure to import the CSS file

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        // console.log("Analytics data:", data); // Log the data to inspect its structure
        const analyticsArray = Object.entries(data); // Convert the object to an array of key-value pairs
        setAnalytics(analyticsArray);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div>
      <h1>Analytics</h1>
      <div className="analytics-container">
        {analytics.map((analytic, index) => (
          <AnalyticsComp key={index} name={analytic[0]} value={analytic[1]} />
        ))}
      </div>
    </div>
  );
};

export default Analytics;
