import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
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
  );
};

export default Footer;
