import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from './data.json';

const GarageListPage = () => {
  const navigate = useNavigate();
  const [garages, setGarages] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ file data.json
    setGarages(data.Garages);
  }, []);

  const handleBooking = (garageId) => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      alert("Vui lòng đăng nhập để đặt lịch!");
      navigate("/login");
    } else {
      navigate(`/book/${garageId}`);
    }
  };

  const handleFeedback = (garageId) => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      alert("Vui lòng đăng nhập để gửi đánh giá!");
      navigate("/login");
    } else {
      navigate("/feedback");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={`bi ${i <= rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}></i>
      );
    }
    return stars;
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-center">Danh sách Garage</h2>
      <Row>
        {garages.map((garage) => (
          <Col key={garage.id} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={garage.imageUrl || 'https://via.placeholder.com/300x200'}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{garage.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{garage.address}</Card.Subtitle>
                <div className="mb-2">
                  {renderStars(Math.round(garage.rating))}
                  <span className="ms-2 text-muted">{garage.rating.toFixed(1)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <Button variant="primary" size="sm" onClick={() => handleBooking(garage.id)}>
                    Đặt lịch
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => handleFeedback(garage.id)}>
                    Gửi đánh giá
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GarageListPage;
