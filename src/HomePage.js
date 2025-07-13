import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Carousel, Navbar, Nav, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import data from './data.json'; // Import data.json

// Style trong JavaScript bằng object styles
const styles = {
  heroSection: {
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://via.placeholder.com/1200x400?text=Hero+Image")', // Thay URL nếu có hình thực tế
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    padding: '100px 0',
    marginBottom: '50px'
  },
  featureCard: {
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
    height: '100%'
  },
  garageCard: {
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  serviceIcon: {
    fontSize: '2.5rem',
    color: '#007bff',
    marginBottom: '15px'
  }
};

// Dữ liệu tĩnh mẫu cho popularServices
const popularServices = [
  { name: 'Bảo dưỡng định kỳ', desc: 'Kiểm tra tổng thể định kỳ cho xe của bạn' },
  { name: 'Thay nhớt động cơ', desc: 'Dịch vụ thay nhớt nhanh chóng, tiện lợi' },
  { name: 'Vệ sinh nội thất', desc: 'Làm sạch và chăm sóc nội thất xe' },
  { name: 'Kiểm tra hệ thống điện', desc: 'Chẩn đoán và sửa chữa hệ thống điện' },
  { name: 'Cân bằng động', desc: 'Cân bằng lốp, bảo vệ lốp xe' },
  { name: 'Đồng sơn', desc: 'Sửa chữa và phục hồi sơn xe chuyên nghiệp' }
];

// Lấy dữ liệu từ data.json
const featuredGarages = data.Garages.slice(0, 6).map(garage => ({
  id: garage.id,
  name: garage.name,
  address: garage.address,
  rating: Math.round(garage.rating), // Làm tròn rating
  yearsActive: Math.floor(Math.random() * 10) + 5, // Giả lập, thay bằng dữ liệu thực nếu có
  services: garage.services,
  image: garage.imageUrl || `https://via.placeholder.com/300x200?text=${garage.name}`, // Dùng placeholder nếu imageUrl không hợp lệ
  description: 'Chuyên nghiệp, uy tín, giá cả hợp lý.'
}));

const testimonials = data.Feedback.slice(0, 5).map(feedback => ({
  id: feedback.id,
  name: data.Users.find(user => user.id === feedback.userId)?.fullName || `Khách hàng ${feedback.userId}`,
  comment: feedback.comment,
  rating: feedback.rating,
  avatar: data.Users.find(user => user.id === feedback.userId)?.avatarUrl || `https://via.placeholder.com/80?text=User+${feedback.userId}`
}));

const HomePage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        () => {
          setLocation('Hà Nội'); // Thay đổi mặc định thành Hà Nội
        }
      );
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Tìm kiếm garage tại: ${location || 'tất cả khu vực'} cho dịch vụ: ${serviceType || 'tất cả dịch vụ'}`);
  };

  const renderStars = (rating) => {
    return Array(5).fill().map((_, i) => (
      <i
        key={i}
        className={`bi ${i < rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}
      ></i>
    ));
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
              <Nav.Link as={Link} to="/" active>Trang chủ</Nav.Link>
              <Nav.Link as={Link} to="/services">Dịch vụ</Nav.Link>
              <Nav.Link as={Link} to="/garages">Garage</Nav.Link>
              <Nav.Link as={Link} to="/about">Giới thiệu</Nav.Link>
              <Nav.Link as={Link} to="/contact">Liên hệ</Nav.Link>
              <Nav.Link as={Link} to="/booking">Đặt lịch</Nav.Link>
              <Nav.Link as={Link} to="/booking/history">Lịch sử đặt lịch</Nav.Link> {/* Thêm nút này */}
              {loggedInUser ? (
                <>
                  <Nav.Link disabled className="text-light">
                    <i className="bi bi-person-circle me-1"></i>{loggedInUser.fullName}
                  </Nav.Link>
                  <Button variant="outline-light" className="ms-2" onClick={() => {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = '/';
                  }}>
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
      <section style={styles.heroSection}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-4 fw-bold mb-4">Chăm sóc xe hơi chuyên nghiệp</h1>
              <p className="lead mb-4">
                Kết nối với các garage uy tín nhất. Dễ dàng đặt lịch, so sánh giá cả và tìm kiếm dịch vụ phù hợp.
              </p>
              <div className="d-flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const user = localStorage.getItem("loggedInUser");
                    if (!user) {
                      localStorage.setItem("redirectAfterLogin", "/booking"); // Ghi nhớ trang cần chuyển sau login
                      window.location.href = "/login";
                    } else {
                      window.location.href = "/booking";
                    }
                  }}
                >
                  Đặt lịch ngay
                </Button>
                <Button variant="outline-light" size="lg" as={Link} to="/about">
                  Tìm hiểu thêm
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search Section */}
      <section className="mb-5">
        <Container>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5">
              <Form onSubmit={handleSearch}>
                <Row>
                  <Col md={5}>
                    <Form.Group controlId="location">
                      <Form.Label>Vị trí của bạn</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-geo-alt-fill"></i>
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Nhập địa chỉ hoặc để tự động xác định vị trí"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group controlId="serviceType">
                      <Form.Label>Loại dịch vụ</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-wrench"></i>
                        </span>
                        <Form.Select
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                        >
                          <option value="">Tất cả dịch vụ</option>
                          <option value="thay-dau">Thay dầu</option>
                          <option value="thay-lop">Thay lốp</option>
                          <option value="sua-dieu-hoa">Sửa điều hòa</option>
                          <option value="kiem-tra-ac-quy">Kiểm tra ắc quy</option>
                          <option value="can-bang-lop">Cân bằng lốp</option>
                          <option value="sua-dong-co">Sửa động cơ</option>
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button variant="primary" type="submit" className="w-100">
                      <i className="bi bi-search me-2"></i>Tìm kiếm
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Featured Services */}
      <section className="mb-5">
        <Container>
          <h2 className="text-center mb-4 fw-bold">Dịch vụ phổ biến</h2>
          <Row>
            {popularServices.map((service, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card style={styles.featureCard} className="h-100">
                  <Card.Body className="text-center">
                    <div style={styles.serviceIcon}>
                      <i className="bi bi-tools"></i>
                    </div>
                    <Card.Title className="fw-bold">{service.name}</Card.Title>
                    <Card.Text>{service.desc}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-center bg-transparent border-0">
                    <Button variant="outline-primary" as={Link} to="/services">Xem chi tiết</Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Garages */}
      <section className="mb-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Garage uy tín</h2>
            <div className="d-flex gap-2">
              <Link to="/garages" className="btn btn-link">Xem tất cả</Link>
              <Button
                variant="success"
                onClick={() => {
                  if (!loggedInUser) {
                    alert("Bạn cần đăng nhập để gửi đánh giá.");
                  } else {
                    window.location.href = "/feedback";
                  }
                }}
              >
                Gửi đánh giá Garage
              </Button>
            </div>
          </div>

          <Row>
            {featuredGarages.map((garage) => (
              <Col key={garage.id} lg={4} md={6} className="mb-4">
                <Card style={styles.garageCard} className="h-100">
                  <Card.Img
                    variant="top"
                    src={garage.image}
                    alt={`${garage.name} tại ${garage.address}`}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Card.Title className="mb-0">{garage.name}</Card.Title>
                      <div>
                        {renderStars(garage.rating)}
                        <span className="ms-2 text-muted">{garage.rating}.0</span>
                      </div>
                    </div>
                    <Card.Subtitle className="mb-2 text-muted">
                      <i className="bi bi-geo-alt-fill me-1"></i>{garage.address}
                    </Card.Subtitle>
                    <Card.Text>{garage.description}</Card.Text>
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="bi bi-clock-history me-1"></i>Hoạt động {garage.yearsActive} năm
                      </small>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {garage.services.slice(0, 4).map((service, i) => (
                        <span key={i} className="badge bg-light text-dark border">{service}</span>
                      ))}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0 pt-0">
                    <div className="d-flex justify-content-between">
                      <Button variant="outline-primary" size="sm" as={Link} to={`/garage/${garage.id}`}>Chi tiết</Button>
                      <Button variant="primary" size="sm" as={Link} to={`/booking/${garage.id}`}>Đặt lịch</Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light mb-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Khách hàng nói về chúng tôi</h2>

          <Carousel activeIndex={activeIndex} onSelect={setActiveIndex} indicadores={false}>
            {testimonials.map((testimonial) => (
              <Carousel.Item key={testimonial.id}>
                <div className="text-center px-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <img
                    src={testimonial.avatar}
                    alt={`Khách hàng ${testimonial.name}`}
                    className="rounded-circle mb-3"
                    width="80"
                  />
                  <div className="mb-3">{renderStars(testimonial.rating)}</div>
                  <blockquote className="blockquote">
                    <p className="lead">{testimonial.comment}</p>
                  </blockquote>
                  <footer className="blockquote-footer mt-3">{testimonial.name}</footer>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 mb-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container className="text-center">
          <h2 className="fw-bold mb-4">Sẵn sàng trải nghiệm dịch vụ?</h2>
          <p className="lead mb-4">
            Đăng ký tài khoản để đặt lịch nhanh chóng, theo dõi lịch sử bảo dưỡng và nhận nhiều ưu đãi.
          </p>
          <Button variant="primary" size="lg" as={Link} to="/register">
            Đăng ký ngay <i className="bi bi-arrow-right ms-2"></i>
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col md={4}>
              <h5 className="fw-bold mb-3">CarCare</h5>
              <p>
                Kết nối chủ xe với các garage uy tín. Dịch vụ đặt lịch nhanh chóng, tiện lợi.
              </p>
            </Col>
            <Col md={2}>
              <h6 className="fw-bold">Liên kết</h6>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white text-decoration-none">Trang chủ</Link></li>
                <li><Link to="/services" className="text-white text-decoration-none">Dịch vụ</Link></li>
                <li><Link to="/garages" className="text-white text-decoration-none">Garage</Link></li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="fw-bold">Điều khoản</h6>
              <ul className="list-unstyled">
                <li><Link to="/privacy-policy" className="text-white text-decoration-none">Chính sách bảo mật</Link></li>
                <li><Link to="/terms-of-use" className="text-white text-decoration-none">Điều khoản sử dụng</Link></li>
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
    </div>
  );
};

export default HomePage;