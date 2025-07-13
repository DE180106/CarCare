// src/AdminDashboard.js
import React from 'react';
import { Container, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Trang quản trị</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link disabled>
              <i className="bi bi-person-circle me-1"></i>{admin?.fullName}
            </Nav.Link>
            <Button variant="outline-light" onClick={handleLogout}>Đăng xuất</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h2>Chào mừng Quản trị viên!</h2>
        <p>Quản lý người dùng, garage, đặt lịch, phản hồi tại đây.</p>
        {/* Bạn có thể thêm các component CRUD tại đây sau */}
      </Container>
    </>
  );
};

export default AdminDashboard;
