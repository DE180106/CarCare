import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import data from './data.json';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [garages, setGarages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [garageId, setGarageId] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // Tự động xóa thông báo sau 5 giây
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Tải danh sách garage từ data.json
  useEffect(() => {
    try {
      if (!data.Garages || !Array.isArray(data.Garages)) {
        setError('Dữ liệu garage trong data.json không hợp lệ.');
        setGarages([]);
      } else {
        setGarages(data.Garages);
      }
    } catch (err) {
      console.error('Lỗi khi tải garage từ data.json:', err);
      setError('Lỗi không xác định khi tải dữ liệu garage.');
    }
  }, []);

  // Xử lý chọn garage
  const handleGarageSelect = (garageId) => {
    setGarageId(garageId);
    const garage = garages.find(g => g.id === garageId);
    setSelectedGarage(garage);
  };

  // Xử lý rating với star
  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  // Xử lý gửi feedback
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      setError('Bạn cần đăng nhập để gửi đánh giá.');
      return;
    }

    if (!garageId || !rating || !comment) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const ratingValue = parseInt(rating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setError('Đánh giá phải từ 1 đến 5 sao.');
      return;
    }

    const newFeedback = {
      id: Date.now().toString(),
      userId: user.id,
      garageId,
      rating: ratingValue,
      comment,
      timestamp: new Date().toISOString(),
    };

    try {
      setFeedbacks([...feedbacks, newFeedback]);
      setSuccess('Gửi đánh giá thành công! Cảm ơn bạn đã chia sẻ trải nghiệm.');
      setGarageId('');
      setRating('');
      setComment('');
      setSelectedGarage(null);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Lỗi khi lưu feedback:', err);
      setError('Có lỗi xảy ra khi gửi đánh giá.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  // Render stars
  const renderStars = (currentRating, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= (interactive ? (hoverRating || currentRating) : currentRating);
      stars.push(
        <i
          key={i}
          className={`bi ${isActive ? 'bi-star-fill' : 'bi-star'} ${
            interactive ? 'text-warning' : 'text-secondary'
          } ${interactive ? 'rating-star' : ''}`}
          style={interactive ? { cursor: 'pointer', fontSize: '1.5rem', margin: '0 2px' } : {}}
          onClick={interactive ? () => handleStarClick(i) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
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
              <Nav.Link as={Link} to="/services">Dịch vụ</Nav.Link>
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
                <Button variant="outline-light" className="ms-2" as={Link} to="/login">
                  Đăng nhập
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Header Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-5 fw-bold mb-3">
                <i className="bi bi-chat-heart me-3"></i>
                Gửi đánh giá Garage
              </h1>
              <p className="lead mb-0">
                Chia sẻ trải nghiệm của bạn để giúp cộng đồng lựa chọn garage tốt nhất
              </p>
            </Col>
            <Col md={4} className="text-end">
              <i className="bi bi-star-fill text-warning" style={{ fontSize: '4rem' }}></i>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            {/* Alerts */}
            {error && (
              <Alert variant="danger" className="d-flex align-items-center shadow-sm">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="d-flex align-items-center shadow-sm">
                <i className="bi bi-check-circle-fill me-2"></i>
                {success}
              </Alert>
            )}

            {/* Feedback Form */}
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-white border-0 px-4 py-4">
                <h4 className="mb-0 text-center">
                  <i className="bi bi-clipboard2-heart me-2 text-primary"></i>
                  Đánh giá dịch vụ
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  {/* Garage Selection */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-3">
                      <i className="bi bi-house-door me-2"></i>
                      Chọn garage đã sử dụng dịch vụ
                    </Form.Label>
                    <Form.Select 
                      value={garageId} 
                      onChange={(e) => handleGarageSelect(e.target.value)}
                      className="form-select-lg shadow-sm"
                      required
                    >
                      <option value="">-- Chọn garage để đánh giá --</option>
                      {garages.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} - {g.address}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Selected Garage Info */}
                  {selectedGarage && (
                    <Card className="mb-4 bg-light border-0">
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-building"></i>
                          </div>
                          <div>
                            <h6 className="mb-1 fw-bold">{selectedGarage.name}</h6>
                            <small className="text-muted">
                              <i className="bi bi-geo-alt me-1"></i>
                              {selectedGarage.address}
                            </small>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Rating Section */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-3">
                      <i className="bi bi-star me-2"></i>
                      Đánh giá chất lượng dịch vụ
                    </Form.Label>
                    <div className="text-center p-4 bg-light rounded-3">
                      <div className="mb-3">
                        {renderStars(rating, true)}
                      </div>
                      <div className="rating-labels">
                        {rating && (
                          <span className="badge bg-primary fs-6 px-3 py-2">
                            {rating === '1' && 'Rất tệ'}
                            {rating === '2' && 'Tệ'}
                            {rating === '3' && 'Bình thường'}
                            {rating === '4' && 'Tốt'}
                            {rating === '5' && 'Xuất sắc'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Form.Group>

                  {/* Comment Section */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-3">
                      <i className="bi bi-chat-dots me-2"></i>
                      Chia sẻ chi tiết về trải nghiệm
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Hãy chia sẻ chi tiết về chất lượng dịch vụ, thái độ nhân viên, giá cả, thời gian chờ đợi..."
                      className="shadow-sm"
                      required
                      style={{ resize: 'vertical' }}
                    />
                    <Form.Text className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Nhận xét chi tiết sẽ giúp người khác có lựa chọn tốt hơn
                    </Form.Text>
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      className="shadow-sm"
                      disabled={!garageId || !rating || !comment}
                    >
                      <i className="bi bi-send me-2"></i>
                      Gửi đánh giá
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/')}
                      size="lg"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Quay lại trang chủ
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Help Section */}
            <Card className="mt-4 border-0 bg-light">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-question-circle me-2"></i>
                  Hướng dẫn đánh giá
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Chọn garage mà bạn đã sử dụng dịch vụ
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Đánh giá từ 1-5 sao dựa trên trải nghiệm thực tế
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Chia sẻ chi tiết về chất lượng dịch vụ
                  </li>
                  <li>
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Đánh giá công bằng, trung thực
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <Container>
          <div className="text-center">
            <p className="mb-0">
              © 2025 CarCare. Bản quyền thuộc về công ty TNHH CarCare.
            </p>
          </div>
        </Container>
      </footer>

      {/* Custom CSS */}
      <style jsx>{`
        .rating-star:hover {
          transform: scale(1.2);
          transition: transform 0.2s ease-in-out;
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .form-select-lg:focus,
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          border: none;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
        }
        
        .bg-light {
          background-color: #f8f9fa !important;
        }
        
        .shadow-lg {
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
        }
        
        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
        }
      `}</style>
    </div>
  );
};

export default FeedbackPage;
