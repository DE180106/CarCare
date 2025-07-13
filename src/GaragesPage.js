import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import data from './data.json';

const GaragesPage = () => {
  const garages = data.Garages;

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Tất cả Garage</h2>
      <Row>
        {garages.map((garage) => (
          <Col key={garage.id} md={6} lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={garage.imageUrl || `https://via.placeholder.com/300x200?text=${garage.name}`}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{garage.name}</Card.Title>
                <Card.Text>{garage.address}</Card.Text>
                <Button variant="outline-primary" as={Link} to={`/garage/${garage.id}`}>
                  Xem chi tiết
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GaragesPage;
