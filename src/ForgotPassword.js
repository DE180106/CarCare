import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from './data.json';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1); // 1: xác minh, 2: đổi mật khẩu
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = () => {
    const foundUser = data.Users.find(u => u.email === email && u.phone === phone);
    if (!foundUser) {
      setErrorMsg('Email hoặc số điện thoại không khớp.');
    } else {
      setUser(foundUser);
      setStep(2);
      setErrorMsg('');
    }
  };

  const handlePasswordChange = () => {
    fetch(`http://localhost:9999/Users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword })
    })
      .then(res => {
        if (res.ok) {
          setSuccessMsg('Đổi mật khẩu thành công! Đang chuyển hướng...');
          setTimeout(() => {
            navigate('/'); // 👉 về trang chủ
          }, 2000); // chờ 2 giây cho người dùng đọc thông báo
        } else {
          setErrorMsg('Không thể cập nhật mật khẩu. Vui lòng thử lại.');
        }
      });
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Quên mật khẩu</h2>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {step === 1 && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Email đã đăng ký</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập số điện thoại đã đăng ký"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          <Button onClick={handleVerify} variant="primary">
            Xác minh
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <p><strong>Số điện thoại của bạn:</strong> {user.phone.replace(/^(\d{3})(\d{3})(\d{3,4})$/, '*******$3')}</p>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Button onClick={handlePasswordChange} variant="success">
            Đặt lại mật khẩu
          </Button>
        </>
      )}
    </Container>
  );
};

export default ForgotPassword;
