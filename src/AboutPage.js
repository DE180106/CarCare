// AboutPage.js
import React from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  // Dummy data cho team
  const team = [
    { id: 1, name: 'Trương Văn Lâm', role: 'Founder / CEO', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 2, name: 'Nguyễn Thị Hạnh', role: 'COO', avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: 3, name: 'Lê Minh Tuấn', role: 'CTO', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 4, name: 'Phạm Thu Trang', role: 'Head of Marketing', avatar: 'https://i.pravatar.cc/150?img=45' }
  ];

  return (
    <div className="about-page">
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
              <Nav.Link as={Link} to="/services">Dịch vụ</Nav.Link>
              <Nav.Link as={Link} to="/about" active>Giới thiệu</Nav.Link>
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
      <section className="hero-section text-white d-flex align-items-center">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <h1 className="display-4 fw-bold mb-3">Về CarCare</h1>
              <p className="lead mb-4">
                Từ năm 2025, CarCare cam kết kết nối chủ xe với các garage uy tín nhất,
                đảm bảo trải nghiệm bảo dưỡng <strong>nhanh chóng – minh bạch – tiết kiệm</strong>.
              </p>
              <Button variant="primary" size="lg" as={Link} to="/register">
                Bắt đầu trải nghiệm <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <Card className="shadow-sm h-100 border-0">
                <Card.Body className="p-4">
                  <h3 className="fw-bold mb-3">
                    <i className="bi bi-bullseye me-2 text-primary"></i>Sứ mệnh
                  </h3>
                  <p className="mb-0">
                    Đưa dịch vụ chăm sóc ô tô chất lượng cao trở nên <em>đơn giản và minh bạch</em> cho mọi chủ xe
                    tại Việt Nam thông qua nền tảng đặt lịch, so sánh giá và quản lý lịch sử bảo dưỡng.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm h-100 border-0">
                <Card.Body className="p-4">
                  <h3 className="fw-bold mb-3">
                    <i className="bi bi-eye me-2 text-primary"></i>Tầm nhìn
                  </h3>
                  <p className="mb-0">
                    Trở thành hệ sinh thái chăm sóc xe hơi số 1 Đông Nam Á,
                    giúp hơn <strong>10 triệu</strong> chủ xe tối ưu chi phí và thời gian bảo dưỡng vào năm 2030.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Core Values */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Giá trị cốt lõi</h2>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="h-100 text-center shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="icon-circle mx-auto mb-3">
                    <i className="bi bi-shield-lock"></i>
                  </div>
                  <h5 className="fw-semibold mb-2">Uy tín</h5>
                  <p className="small text-muted mb-0">Bảo đảm thông tin chính xác, minh bạch về giá và chất lượng.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="h-100 text-center shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="icon-circle mx-auto mb-3">
                    <i className="bi bi-clock-history"></i>
                  </div>
                  <h5 className="fw-semibold mb-2">Nhanh chóng</h5>
                  <p className="small text-muted mb-0">Đặt lịch chỉ trong 60 giây, xác nhận tức thì.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="h-100 text-center shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="icon-circle mx-auto mb-3">
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <h5 className="fw-semibold mb-2">Tiết kiệm</h5>
                  <p className="small text-muted mb-0">So sánh giá từ nhiều garage, cam kết chi phí hợp lý.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="h-100 text-center shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="icon-circle mx-auto mb-3">
                    <i className="bi bi-people"></i>
                  </div>
                  <h5 className="fw-semibold mb-2">Cộng đồng</h5>
                  <p className="small text-muted mb-0">Hệ thống đánh giá thật từ người dùng giúp lựa chọn dễ dàng.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Statistics */}
      <section className="py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Thành tựu đạt được</h2>
          <Row className="text-center gy-4">
            <Col xs={6} md={3}>
              <h2 className="display-6 fw-bold text-primary">350+</h2>
              <p className="mb-0 text-muted">Garage đối tác</p>
            </Col>
            <Col xs={6} md={3}>
              <h2 className="display-6 fw-bold text-primary">25,000+</h2>
              <p className="mb-0 text-muted">Lượt đặt thành công</p>
            </Col>
            <Col xs={6} md={3}>
              <h2 className="display-6 fw-bold text-primary">4.8 / 5</h2>
              <p className="mb-0 text-muted">Điểm hài lòng</p>
            </Col>
            <Col xs={6} md={3}>
              <h2 className="display-6 fw-bold text-primary">20+</h2>
              <p className="mb-0 text-muted">Tỉnh thành</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Roadmap */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Lộ trình phát triển</h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold">2023</span>
                      <span>25%</span>
                    </div>
                    <ProgressBar now={25} variant="primary" animated />
                    <small className="text-muted">Ra mắt MVP – 100 garage đầu tiên</small>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold">2024</span>
                      <span>50%</span>
                    </div>
                    <ProgressBar now={50} variant="primary" animated />
                    <small className="text-muted">Phủ sóng 10 tỉnh thành, tích hợp ví điện tử</small>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold">2025</span>
                      <span>75%</span>
                    </div>
                    <ProgressBar now={75} variant="primary" animated />
                    <small className="text-muted">AI đề xuất lịch bảo dưỡng thông minh</small>
                  </div>
                  <div className="mb-0">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold">2030</span>
                      <span>100%</span>
                    </div>
                    <ProgressBar now={100} variant="primary" animated />
                    <small className="text-muted">Mở rộng Đông Nam Á – 10 triệu người dùng</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team */}
      <section className="py-5">
        <Container>
          <h2 className="text-center fw-bold mb-5">Đội ngũ của chúng tôi</h2>
          <Row className="g-4">
            {team.map(member => (
              <Col xs={6} md={3} key={member.id}>
                <Card className="border-0 text-center shadow-sm h-100">
                  <Card.Img 
                    variant="top" 
                    src={member.avatar} 
                    alt={member.name} 
                    style={{ objectFit: 'cover', height: '180px' }} 
                  />
                  <Card.Body>
                    <h6 className="fw-bold mb-1">{member.name}</h6>
                    <small className="text-muted">{member.role}</small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta-section text-white text-center py-5">
        <Container>
          <h2 className="fw-bold mb-3">Sẵn sàng đồng hành cùng CarCare?</h2>
          <p className="lead mb-4">
            Đăng ký tài khoản và trải nghiệm dịch vụ đặt lịch bảo dưỡng chỉ trong vài giây.
          </p>
          <Button variant="light" size="lg" as={Link} to="/register">
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
                <li><Link to="/contact" className="text-white text-decoration-none">Liên hệ</Link></li>
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

      {/* Inline Styles */}
      <style>{`
        .hero-section {
          background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg');
          background-size: cover;
          background-position: center;
          padding: 120px 0;
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #e9f2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #0d6efd;
        }

        .cta-section {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
