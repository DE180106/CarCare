// src/GarageFeedbackPage.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GarageFeedbackPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const [garages, setGarages] = useState([]);
  const [garageId, setGarageId] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:9999/Garages')
      .then((res) => setGarages(res.data))
      .catch(() => alert("Lỗi khi lấy danh sách garage"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedback = {
      userId: user.id,
      garageId,
      comment,
      rating: parseInt(rating),
      createdAt: new Date().toISOString()
    };
    try {
      await axios.post('http://localhost:9999/Feedback', feedback);
      setSuccess(true);
      setTimeout(() => navigate('/user/dashboard'), 2000);
    } catch (err) {
      alert("Lỗi khi gửi đánh giá");
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="mb-4">Gửi đánh giá garage</h3>
      {success && <Alert variant="success">Đánh giá thành công!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Chọn garage</Form.Label>
          <Form.Select value={garageId} onChange={(e) => setGarageId(e.target.value)} required>
            <option value="">-- Chọn garage --</option>
            {garages.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Đánh giá</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Ý kiến của bạn"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Xếp hạng (1-5)</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">Gửi đánh giá</Button>
      </Form>
    </Container>
  );
};

export default GarageFeedbackPage;
