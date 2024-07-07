import React, { useEffect, useState } from "react";
import AnalyticsComp from "../../components/AnalyticsComp/AnalyticsComp";
import { getAnalytics } from "../../apis/todo";
import "./Analytics.css";
import Loader from "../../components/Loader/Loader";

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        const analyticsArray = Object.entries(data);
        setAnalytics(analyticsArray);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div>
      <h1>Analytics</h1>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="analytics-container">
          {analytics.map((analytic, index) => (
            <AnalyticsComp key={index} name={analytic[0]} value={analytic[1]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;
