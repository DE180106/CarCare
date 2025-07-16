import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Modal, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  const services = [
    {
      id: 1,
      name: 'Bảo dưỡng định kỳ',
      description: 'Kiểm tra tổng thể định kỳ cho xe của bạn',
      price: '300,000 - 800,000 VNĐ',
      duration: '1-2 giờ',
      icon: 'bi-tools',
      details: [
        'Kiểm tra hệ thống phanh',
        'Kiểm tra lốp xe và áp suất',
        'Kiểm tra đèn chiếu sáng',
        'Kiểm tra nước làm mát',
        'Kiểm tra dầu động cơ',
        'Kiểm tra hệ thống điện'
      ],
      image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      name: 'Thay nhớt động cơ',
      description: 'Dịch vụ thay nhớt nhanh chóng, tiện lợi',
      price: '150,000 - 400,000 VNĐ',
      duration: '30-45 phút',
      icon: 'bi-droplet',
      details: [
        'Thay dầu động cơ mới',
        'Thay lọc dầu',
        'Kiểm tra mức dầu',
        'Tư vấn loại dầu phù hợp',
        'Kiểm tra rò rỉ dầu'
      ],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      name: 'Vệ sinh nội thất',
      description: 'Làm sạch và chăm sóc nội thất xe',
      price: '200,000 - 500,000 VNĐ',
      duration: '1-1.5 giờ',
      icon: 'bi-brush',
      details: [
        'Vệ sinh ghế da/nỉ',
        'Vệ sinh taplo và nội thất',
        'Hút bụi toàn bộ xe',
        'Vệ sinh kính trong',
        'Khử mùi nội thất'
      ],
      image: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      name: 'Kiểm tra hệ thống điện',
      description: 'Chẩn đoán và sửa chữa hệ thống điện',
      price: '100,000 - 300,000 VNĐ',
      duration: '45 phút - 1 giờ',
      icon: 'bi-lightning',
      details: [
        'Kiểm tra ắc quy',
        'Kiểm tra hệ thống đánh lửa',
        'Kiểm tra đèn chiếu sáng',
        'Kiểm tra hệ thống sạc',
        'Chẩn đoán lỗi điện tử'
      ],
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      name: 'Cân bằng động',
      description: 'Cân bằng lốp, bảo vệ lốp xe',
      price: '80,000 - 150,000 VNĐ',
      duration: '30-45 phút',
      icon: 'bi-circle',
      details: [
        'Cân bằng 4 bánh xe',
        'Kiểm tra độ mòn lốp',
        'Kiểm tra áp suất lốp',
        'Tư vấn thay lốp mới',
        'Kiểm tra la-zăng'
      ],
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop'
    },
    {
      id: 6,
      name: 'Đồng sơn',
      description: 'Sửa chữa và phục hồi sơn xe chuyên nghiệp',
      price: '500,000 - 2,000,000 VNĐ',
      duration: '2-5 giờ',
      icon: 'bi-palette',
      details: [
        'Sửa chữa vết xước',
        'Phục hồi sơn bị phai',
        'Sơn lại toàn bộ xe',
        'Đánh bóng chuyên nghiệp',
        'Bảo vệ sơn lâu dài'
      ],
      image: 'https://images.unsplash.com/photo-1563694983011-6f4d90358083?w=400&h=250&fit=crop'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const handleBookService = (service) => {
    if (!user) {
      alert('Vui lòng đăng nhập để đặt dịch vụ!');
      navigate('/login');
      return;
    }
    navigate('/booking', { state: { selectedService: service } });
  };

  const handleShowDetails = (service) => {
    setSelectedService(service);
    setShowModal(true);
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
              <Nav.Link as={Link} to="/garages">Garage</Nav.Link>
              <Nav.Link as={Link} to="/map">Tìm Gara</Nav.Link>
              <Nav.Link as={Link} to="/services" active>Dịch vụ</Nav.Link>
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

      {/* Hero Section */}
      <div className="hero-section text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-5 fw-bold mb-3">
                <i className="bi bi-wrench-adjustable me-3"></i>
                Dịch vụ chăm sóc xe
              </h1>
              <p className="lead mb-4">
                Khám phá các dịch vụ chăm sóc xe chuyên nghiệp với chất lượng cao và giá cả hợp lý
              </p>
              <Button variant="light" size="lg" onClick={() => navigate('/')}>
                <i className="bi bi-house-door me-2"></i>
                Quay lại trang chủ
              </Button>
            </Col>
            <Col md={4} className="text-end">
              <i className="bi bi-tools display-1"></i>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Services Grid */}
      <Container className="py-5">
        <Row>
          {services.map((service) => (
            <Col lg={4} md={6} key={service.id} className="mb-4">
              <Card className="h-100 shadow-sm service-card">
                <Card.Img 
                  variant="top" 
                  src={service.image} 
                  alt={service.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className="service-icon me-3">
                      <i className={`bi ${service.icon}`}></i>
                    </div>
                    <div>
                      <Card.Title className="mb-1">{service.name}</Card.Title>
                      <Card.Text className="text-muted small mb-0">{service.description}</Card.Text>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Giá:</span>
                      <Badge bg="primary">{service.price}</Badge>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Thời gian:</span>
                      <Badge bg="secondary">{service.duration}</Badge>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="d-grid gap-2">
                      <Button 
                        variant="outline-primary" 
                        onClick={() => handleShowDetails(service)}
                      >
                        <i className="bi bi-info-circle me-2"></i>
                        Chi tiết
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => handleBookService(service)}
                      >
                        <i className="bi bi-calendar-check me-2"></i>
                        Đặt lịch ngay
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Service Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`bi ${selectedService?.icon} me-2`}></i>
            {selectedService?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <>
              <Row>
                <Col md={4}>
                  <img 
                    src={selectedService.image} 
                    alt={selectedService.name}
                    className="img-fluid rounded mb-3"
                  />
                </Col>
                <Col md={8}>
                  <h5>Mô tả dịch vụ</h5>
                  <p>{selectedService.description}</p>
                  
                  <div className="mb-3">
                    <strong>Giá:</strong> <Badge bg="primary" className="ms-2">{selectedService.price}</Badge>
                  </div>
                  <div className="mb-3">
                    <strong>Thời gian:</strong> <Badge bg="secondary" className="ms-2">{selectedService.duration}</Badge>
                  </div>
                </Col>
              </Row>

              <h5 className="mt-4">Chi tiết dịch vụ:</h5>
              <ul className="list-unstyled">
                {selectedService.details.map((detail, index) => (
                  <li key={index} className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {detail}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => {
            setShowModal(false);
            handleBookService(selectedService);
          }}>
            <i className="bi bi-calendar-check me-2"></i>
            Đặt lịch ngay
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col md={4}>
              <h5 className="fw-bold mb-3">CarCare</h5>
              <p>Kết nối chủ xe với các garage uy tín. Dịch vụ đặt lịch nhanh chóng, tiện lợi.</p>
            </Col>
            <Col md={2}>
              <h6 className="fw-bold">Liên kết</h6>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white text-decoration-none">Trang chủ</Link></li>
                <li><Link to="/services" className="text-white text-decoration-none">Dịch vụ</Link></li>
                <li><Link to="/garages" className="text-white text-decoration-none">Garage</Link></li>
                <li><Link to="/contact" className="text-white text-decoration-none">Liên hệ</Link></li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="fw-bold">Dịch vụ</h6>
              <ul className="list-unstyled">
                <li><span className="text-white">Bảo dưỡng định kỳ</span></li>
                <li><span className="text-white">Thay nhớt động cơ</span></li>
                <li><span className="text-white">Vệ sinh nội thất</span></li>
                <li><span className="text-white">Sửa chữa chuyên nghiệp</span></li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="fw-bold">Liên hệ</h6>
              <ul className="list-unstyled">
                <li><i className="bi bi-envelope me-2"></i> contact@carcare.vn</li>
                <li><i className="bi bi-telephone me-2"></i> 0900 123 456</li>
                <li><i className="bi bi-geo-alt me-2"></i> TP.Hà Nội</li>
              </ul>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="text-center">
            <small>© 2025 CarCare. Bản quyền thuộc về công ty TNHH CarCare.</small>
          </div>
        </Container>
      </footer>

      {/* Custom Styles */}
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .service-card {
          transition: all 0.3s ease;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .service-icon {
          width: 50px;
          height: 50px;
          background: #e9f2ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #0d6efd;
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;
