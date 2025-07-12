import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập gửi mail thành công
    setSubmitted(true);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Quên mật khẩu</h2>
          {submitted ? (
            <Alert variant="success">
              Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.
              <div className="text-center mt-3">
                <Button variant="link" onClick={() => navigate('/login')}>Quay lại đăng nhập</Button>
              </div>
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Nhập email của bạn</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="d-grid">
                <Button variant="primary" type="submit">
                  Gửi liên kết đặt lại mật khẩu
                </Button>
              </div>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
