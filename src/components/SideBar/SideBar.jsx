import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SideBar.css";
import LOGOO from "../../images/logoo.png";
import LOGOUT from "../../images/Logout.png";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const SideBar = () => {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openLogoutModal = () => {
    setLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setLogoutModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar__main">
      <div
        onClick={() => {
          navigate("/");
        }}
        className="flex"
      >
        <img src={LOGOO} alt="Logo" />
        <h1>Pro Manage</h1>
      </div>
      <div className="main">
        <div>
          <div
            onClick={() => {
              navigate("/");
            }}
            className={`flex ${isActive("/") ? "active" : ""}`}
          >
            <img
              width="32"
              height="32"
              src="https://img.icons8.com/external-creatype-outline-colourcreatype/64/1A1A1A/external-dashboard-essential-ui-v1-creatype-outline-colourcreatype.png"
              alt="Dashboard"
            />
            <p>Board</p>
          </div>
          <div
            onClick={() => {
              navigate("/analytics");
            }}
            className={`flex ${isActive("/analytics") ? "active" : ""}`}
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios/50/1A1A1A/database--v1.png"
              alt="Analytics"
            />
            <p>Analytics</p>
          </div>
          <div
            onClick={() => {
              navigate("/reset");
            }}
            className={`flex ${isActive("/reset") ? "active" : ""}`}
          >
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/ios/50/1A1A1A/settings--v1.png"
              alt="Settings"
            />
            <p>Settings</p>
          </div>
        </div>
        <div>
          <div className="flex" onClick={openLogoutModal}>
            <img src={LOGOUT} alt="Logout" />
            <p>Log out</p>
          </div>
        </div>
      </div>
      <Modal open={logoutModalOpen} onClose={closeLogoutModal} center classNames={{ modal: 'custom-modal' }}>
        <div className="modal__content">
          <h2>Are you sure you want to logout?</h2>
          <div className="modal__actions">
            <button className="modal__button save" onClick={handleLogout}>
              <span> Yes, Logout</span>
            </button>
            <button className="modal__button cancel" onClick={closeLogoutModal}>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SideBar;
