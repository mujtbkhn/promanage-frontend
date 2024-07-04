import React, { useState } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../apis/auth";
import ART from "../../images/Art.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    setErrors({});
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setErrors({ general: "Please fill out all fields" });
      return;
    }

    try {
      const data = await registerUser(name, email, password);
      // console.log(data);
      navigate("/");
    } catch (error) {
      if (error.response) {
        if (error.response.data.message === "Email already exists") {
          setErrors({ email: "Email already registered" });
        } else {
          setErrors({ general: error.response.data.message });
        }
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="register__container">
      <div className="register__left">
        <img src={ART} alt="" />
        <h1>Welcome aboard my friend</h1>
        <p>just a couple of clicks and we start</p>
      </div>
      <div className="register__right">
        <h1>Register</h1>
        <div className="register__form">
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
          {errors.general && <p className="error">{errors.general}</p>}
          <button onClick={handleRegister}>
            <span>Register</span>
          </button>
          <p>Have an account?</p>
          <button onClick={() => navigate("/login")}>
            <span>Log in</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
