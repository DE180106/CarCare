import React from 'react';

const BookingCard = ({ booking }) => (
  <div className="card mb-3">
    <div className="card-body">
      <h6>Dịch vụ: {booking.serviceType}</h6>
      <p>Thời gian: {new Date(booking.date).toLocaleDateString()} - {booking.time}</p>
      <p>Trạng thái: <strong>{booking.status}</strong></p>
    </div>
  </div>
);

export default BookingCard;
