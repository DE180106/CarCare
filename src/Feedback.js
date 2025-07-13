import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [garages, setGarages] = useState([]);
  const [garageId, setGarageId] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    // Lấy danh sách garage
    fetch("http://localhost:9999/Garages")
      .then(res => res.json())
      .then(data => setGarages(data))
      .catch(err => console.error("Lỗi tải garage:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      setError("Bạn cần đăng nhập để gửi đánh giá.");
      return;
    }

    if (!garageId || !rating || !comment) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const feedback = {
      id: Date.now(),
      userId: user.id,
      garageId,
      rating: parseInt(rating),
      comment
    };

    fetch("http://localhost:9999/Feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback)
    })
      .then(res => {
        if (res.ok) {
          alert("Gửi đánh giá thành công!");
          navigate("/");
        } else {
          setError("Gửi đánh giá thất bại.");
        }
      })
      .catch(err => {
        console.error("Lỗi khi gửi:", err);
        setError("Có lỗi xảy ra khi gửi đánh giá.");
      });
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Gửi đánh giá Garage</h2>

      {error && <Alert variant="danger">{error}</Alert>}

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
