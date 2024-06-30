import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../apis/auth";
import ART from "../../images/Art.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const getLoggedInUser = async () => {
    try {
      const data = await loginUser(email, password);
      console.log(data);
      navigate("/");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
      console.error("Login Error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getLoggedInUser();
    }
  };

  return (
    <div className="login__container">
      <div className="login__left">
        <img src={ART} alt="" />
        <h1>Welcome aboard my friend</h1>
        <p>just a couple of clicks and we start</p>
      </div>
      <div className="login__right">
        <h1>Login</h1>
        <div className="login__form">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {error && <p className="error">{error}</p>}
          <button onClick={getLoggedInUser}>
            <span>Login</span>
          </button>
          <p>Don't have an account?</p>
          <button onClick={() => navigate("/register")}>
            <span>Register</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
