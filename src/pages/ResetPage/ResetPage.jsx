import React, { useEffect, useState } from "react";
import "./ResetPage.css";
import { getUserFromToken, resetUser } from "../../apis/auth";
import { useNavigate } from "react-router-dom";

const ResetPage = () => {
  const [userDetails, setUserDetails] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    setUserDetails(user);
    setName(user?.name || "");
  }, []);

  const updateUser = async () => {
    try {
      // console.log("before", userDetails);
      await resetUser(name, currentPassword, newPassword, email);

      // Refetch the updated user details
      const updatedUser = getUserFromToken();

      // Update userDetails and reset form fields
      setUserDetails(updatedUser);
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setCurrentPassword("");
      setNewPassword("");
      localStorage.removeItem("token");
      navigate("/login");
      // console.log("after", updatedUser);
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
          type="email"
          value={email}
          placeholder={userDetails?.email}
          onChange={(e) => setEmail(e.target.value)}
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
