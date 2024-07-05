import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <SideBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
