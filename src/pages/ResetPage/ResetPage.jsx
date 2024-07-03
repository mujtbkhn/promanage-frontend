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
    setName(user?.name || "");
  }, []);

  const updateUser = async () => {
    try {
      console.log("before", userDetails);
      const updatedUser = await resetUser(name, currentPassword, newPassword);
      setUserDetails(updatedUser);
      setName(updatedUser.name);
      setCurrentPassword("");
      setNewPassword("");
      console.log("after", updatedUser);
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
          value={name}
          placeholder={userDetails?.name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          value={currentPassword}
          placeholder="Old Password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          value={newPassword}
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={updateUser}>
          <span>Update</span>
        </button>
      </div>
    </div>
  );
};

export default ResetPage;
