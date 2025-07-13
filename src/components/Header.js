
import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(JSON.parse(user));
    } else {
      setLoggedInUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="bi bi-car-front-fill me-2"></i>
          CarCare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/services">Dịch vụ</Nav.Link>
            <Nav.Link as={Link} to="/garages">Garage</Nav.Link>
            <Nav.Link as={Link} to="/about">Giới thiệu</Nav.Link>
            <Nav.Link as={Link} to="/contact">Liên hệ</Nav.Link>

            {/* Hiện nút dashboard nếu là gara */}
            {loggedInUser?.role === 'garage' && (
              <Nav.Link as={Link} to="/garage/dashboard">
                Quản lý Gara
              </Nav.Link>
            )}

            {loggedInUser ? (
              <>
                <Nav.Link disabled className="text-light">
                  <i className="bi bi-person-circle me-1"></i>{loggedInUser.fullName}
                </Nav.Link>
                <Button variant="outline-light" className="ms-2" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-light" className="ms-2" as={Link} to="/login">
                  Đăng nhập
                </Button>
                <Button variant="primary" className="ms-2" as={Link} to="/register">
                  Đăng ký
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
