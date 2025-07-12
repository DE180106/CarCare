import React from 'react';
import HomePage from './HomePage';
import { Button, Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser")); // Lưu khi login
  const userName = user?.fullName || "Người dùng";

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <>
      {/* Navbar riêng cho Dashboard */}
      

      {/* Giao diện chính (ẩn navbar mặc định của HomePage) */}
      <HomePage hideNavbar={true} />
    </>
  );
};

export default UserDashboard;
