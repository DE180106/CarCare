// src/GarageReviews.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const GarageReviews = () => {
  const { id } = useParams();
  const [garage, setGarage] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderStars = (rating) => {
    return Array(5).fill().map((_, i) => (
      <i key={i} className={`bi ${i < rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`} />
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [garageRes, feedbackRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:9999/Garages/${id}`),
          axios.get(`http://localhost:9999/Feedback?garageId=${id}`),
          axios.get(`http://localhost:9999/Users`)
        ]);

        setGarage(garageRes.data);
        setFeedbacks(feedbackRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.fullName || `User ${userId}`;
  };

  if (loading) {
    return <Container className="mt-5 text-center"><Spinner animation="border" /> Đang tải...</Container>;
  }

  if (!garage) {
    return <Container className="mt-5">Garage không tồn tại.</Container>;
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Đánh giá về: {garage.name}</h2>
      <p><i className="bi bi-geo-alt-fill me-1"></i>{garage.address}</p>

      {feedbacks.length === 0 ? (
        <p>Chưa có đánh giá nào cho gara này.</p>
      ) : (
        feedbacks.map((fb) => (
          <Card key={fb.id} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <strong>{getUserName(fb.userId)}</strong>
                <div>{renderStars(fb.rating)}</div>
              </div>
              <Card.Text>{fb.comment}</Card.Text>
            </Card.Body>
          </Card>
        ))
      )}

      <Button as={Link} to="/" variant="secondary" className="mt-3">
        <i className="bi bi-arrow-left"></i> Quay về Trang chủ
      </Button>
    </Container>
  );
};

export default GarageReviews;
