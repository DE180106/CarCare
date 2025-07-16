import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    avatarUrl: '',
    carMake: '',
    carModel: '',
    licensePlate: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate đơn giản
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const newUser = {
      id: `u${Date.now()}`, // Tạo ID duy nhất
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
      avatarUrl: formData.avatarUrl,
      car: {
        make: formData.carMake,
        model: formData.carModel,
        licensePlate: formData.licensePlate
      }
    };

    fetch('http://localhost:9999/Users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(res => {
        if (res.ok) {
          setSuccessMsg('Đăng ký thành công! Chuyển đến trang đăng nhập...');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else {
          setErrorMsg('Đăng ký thất bại. Vui lòng thử lại.');
        }
      })
      .catch(() => setErrorMsg('Có lỗi xảy ra khi gửi yêu cầu.'));
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Link ảnh đại diện</Form.Label>
                  <Form.Control type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hãng xe</Form.Label>
                  <Form.Control type="text" name="carMake" value={formData.carMake} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dòng xe</Form.Label>
                  <Form.Control type="text" name="carModel" value={formData.carModel} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Biển số xe</Form.Label>
                  <Form.Control type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid mt-3">
              <Button type="submit" variant="primary">Đăng ký</Button>
            </div>

            <div className="text-center mt-3">
              <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
