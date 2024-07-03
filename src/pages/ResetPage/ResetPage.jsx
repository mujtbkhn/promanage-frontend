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
    setName(user?.name || ""); // Initialize name with the user's current name
  }, []);

  const updateUser = async () => {
    try {
      const data = await resetUser(name, currentPassword, newPassword);
      console.log(data); // Log response for debugging
      // Update the state with the new name
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        name: name,
      }));
      // Clear the password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
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
