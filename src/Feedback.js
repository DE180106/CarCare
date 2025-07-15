import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from './data.json'; // Nhập data.json làm nguồn dữ liệu chính

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [garages, setGarages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]); // Lưu trữ feedback tạm thời
  const [garageId, setGarageId] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  // Xử lý gửi feedback
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra người dùng đã đăng nhập
    if (!user || !user.id) {
      setError('Bạn cần đăng nhập để gửi đánh giá.');
      return;
    }

    // Kiểm tra dữ liệu đầu vào
    if (!garageId || !rating || !comment) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // Kiểm tra rating hợp lệ
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
      // Lưu feedback vào state
      setFeedbacks([...feedbacks, newFeedback]);
      setSuccess('Gửi đánh giá thành công!');
      setGarageId('');
      setRating('');
      setComment('');
      setTimeout(() => navigate('/'), 2000); // Chuyển hướng sau 2 giây
    } catch (err) {
      console.error('Lỗi khi lưu feedback:', err);
      setError('Có lỗi xảy ra khi gửi đánh giá.');
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Gửi đánh giá Garage</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Chọn garage</Form.Label>
          <Form.Select value={garageId} onChange={(e) => setGarageId(e.target.value)} required>
            <option value="">-- Chọn garage --</option>
            {garages.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} - {g.address}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Đánh giá (1 đến 5 sao)</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            placeholder="Nhập số từ 1 đến 5"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nhận xét</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Gửi đánh giá
        </Button>
      </Form>
    </Container>
  );
};

export default FeedbackPage;