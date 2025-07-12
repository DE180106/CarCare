import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    car: {
      make: '',
      model: '',
      licensePlate: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.car) {
      setFormData({
        ...formData,
        car: {
          ...formData.car,
          [name]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registered:', formData);
    alert('Đăng ký thành công!');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 shadow">
            <h2 className="mb-4 text-center">Đăng ký tài khoản</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formId">
                <Form.Label>Mã người dùng</Form.Label>
                <Form.Control type="text" name="id" value={formData.id} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formFullName">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>

              <h5 className="mt-4">Thông tin xe</h5>
              <Form.Group className="mb-3" controlId="formMake">
                <Form.Label>Hãng xe</Form.Label>
                <Form.Control type="text" name="make" value={formData.car.make} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formModel">
                <Form.Label>Model xe</Form.Label>
                <Form.Control type="text" name="model" value={formData.car.model} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLicensePlate">
                <Form.Label>Biển số xe</Form.Label>
                <Form.Control type="text" name="licensePlate" value={formData.car.licensePlate} onChange={handleChange} required />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Đăng ký
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
