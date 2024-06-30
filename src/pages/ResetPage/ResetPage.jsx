import React, { useEffect, useState } from "react";
import "./ResetPage.css";
import { getUserFromToken, resetUser } from "../../apis/auth";

const ResetPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const user = getUserFromToken();
    setUserDetails(user);
  }, []);

  const updateUser = async () => {
    try {
      const data = await resetUser(
        userDetails?.email,
        currentPassword,
        name,
        newPassword
      );
      console.log(data); // Log response for debugging
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="top">
      <div className="reset__main">
      <h1>Settings</h1>
        <input
          type="text"
          placeholder={userDetails?.name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Old Password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={updateUser}>
          <span>
          Update
          </span>
          </button>
      </div>
    </div>
  );
};

export default ResetPage;
