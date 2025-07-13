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
    role: 'user', // Mặc định là user
    carMake: '',
    carModel: '',
    licensePlate: ''
  });

  const [preview, setPreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'avatarFile') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const newUser = {
      id: `u${Date.now()}`,
      ...formData,
      car: {
        make: formData.carMake,
        model: formData.carModel,
        licensePlate: formData.licensePlate
      }
    };

    try {
      const res = await fetch('http://localhost:9999/Users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        setSuccessMsg('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErrorMsg('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setErrorMsg('Có lỗi khi gửi yêu cầu.');
    }
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
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Select name="role" value={formData.role} onChange={handleChange}>
                    <option value="user">Người dùng</option>
                    <option value="garage">Gara</option>
                    <option value="admin">Quản trị viên</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control type="file" name="avatarFile" accept="image/*" onChange={handleChange} />
                  {preview && (
                    <div className="mt-2">
                      <img src={preview} alt="Preview" height="100" className="rounded" />
                    </div>
                  )}
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
