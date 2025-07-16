import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import data from './data.json';

const GarageListPage = () => {
  const navigate = useNavigate();
  const [garages, setGarages] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    setGarages(data.Garages);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const handleBooking = (garageId) => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt lịch!");
      navigate("/login");
    } else {
      navigate(`/booking`);
    }
  };

  const handleFeedback = (garageId) => {
    if (!user) {
      alert("Vui lòng đăng nhập để gửi đánh giá!");
      navigate("/login");
    } else {
      navigate("/feedback");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${i <= rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div>
      {/* Navbar */}
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
              <Nav.Link as={Link} to="/garages" active>Garage</Nav.Link>
              <Nav.Link as={Link} to="/services">Dịch vụ</Nav.Link>
              <Nav.Link as={Link} to="/about">Giới thiệu</Nav.Link>
              <Nav.Link as={Link} to="/contact">Liên hệ</Nav.Link>
              {user ? (
                <>
                  <Nav.Link className="text-light">
                    <i className="bi bi-person-circle me-1"></i>{user.fullName}
                  </Nav.Link>
                  <Button variant="outline-light" className="ms-2" onClick={handleLogout}>
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline-light" className="ms-2" as={Link} to="/login">Đăng nhập</Button>
                  <Button variant="primary" className="ms-2" as={Link} to="/register">Đăng ký</Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Header */}
      <div className="bg-primary text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="fw-bold mb-0">
                <i className="bi bi-building me-2"></i>
                Danh sách Garage
              </h1>
              <p className="mb-0">Tìm và chọn garage phù hợp với nhu cầu của bạn</p>
            </Col>
            <Col xs="auto">
              <Button variant="outline-light" onClick={() => navigate('/')}>
                <i className="bi bi-house-door me-2"></i>
                Quay lại trang chủ
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Garage List */}
      <Container className="py-5">
        <Row>
          {garages.map((garage) => (
            <Col lg={4} md={6} key={garage.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                {/* Thêm hình ảnh garage */}
                <Card.Img 
                  variant="top" 
                  src={garage.imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(garage.name)}`}
                  alt={garage.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{garage.name}</Card.Title>
                  
                  <Card.Text className="text-muted mb-2">
                    <i className="bi bi-geo-alt me-2"></i>
                    {garage.address}
                  </Card.Text>

                  <div className="d-flex align-items-center mb-3">
                    {renderStars(Math.round(garage.rating))}
                    <span className="ms-2 fw-semibold">{garage.rating.toFixed(1)}</span>
                    <span className="text-muted ms-1">({Math.floor(Math.random() * 100) + 20} đánh giá)</span>
                  </div>

                  {/* Hiển thị dịch vụ */}
                  {garage.services && garage.services.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Dịch vụ:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {garage.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="badge bg-light text-dark border">
                            {service}
                          </span>
                        ))}
                        {garage.services.length > 3 && (
                          <span className="badge bg-light text-dark border">
                            +{garage.services.length - 3} khác
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="d-grid gap-2">
                      <Button 
                        variant="primary" 
                        onClick={() => handleBooking(garage.id)}
                      >
                        <i className="bi bi-calendar-check me-2"></i>
                        Đặt lịch
                      </Button>
                      <Button 
                        variant="outline-success" 
                        onClick={() => handleFeedback(garage.id)}
                      >
                        <i className="bi bi-chat-heart me-2"></i>
                        Gửi đánh giá
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {garages.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-building display-1 text-muted"></i>
            <h3 className="mt-3 text-muted">Không có garage nào</h3>
            <p className="text-muted">Vui lòng thử lại sau.</p>
          </div>
        )}
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <div className="text-center">
            <p className="mb-0">© 2025 CarCare. Bản quyền thuộc về công ty TNHH CarCare.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default GarageListPage;
