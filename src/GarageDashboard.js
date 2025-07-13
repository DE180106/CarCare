// src/GarageDashboard.js
import React, { useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GarageDashboard = () => {
  const navigate = useNavigate();
  const garage = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (!garage || garage.role !== 'garage') {
      navigate("/login");
    }
  }, [garage, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Trang Gara</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link disabled>
              <i className="bi bi-person-circle me-1"></i>{garage?.fullName}
            </Nav.Link>
            <Button variant="outline-light" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h3>Chào mừng {garage?.fullName}</h3>
        <p>Email: {garage?.email}</p>
        <p>Điện thoại: {garage?.phone}</p>
        <p>Địa chỉ: {garage?.address}</p>
        <hr />
        <p>Đây là giao diện dành riêng cho các gara.</p>
        <p>Bạn có thể thêm các chức năng như: xem lịch hẹn, quản lý nhân viên, trả lời phản hồi,...</p>
      </Container>
    </>
  );
};

export default GarageDashboard;
