import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import data from './data.json';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const matchedUser = data.Users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) {
      setErrorMsg('Email hoặc mật khẩu không chính xác.');
    } else {
      localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/user/dashboard";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Đăng nhập</h2>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid mb-3">
              <Button variant="primary" type="submit">
                Đăng nhập
              </Button>
            </div>

            <div className="text-center">
              <p>
                Chưa có tài khoản?{' '}
                <Link to="/register">Đăng ký ngay</Link>
              </p>
              <p>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
