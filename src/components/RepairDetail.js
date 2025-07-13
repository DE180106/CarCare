import React from 'react';

const RepairDetail = ({ repair }) => (
  <div className="card mb-3">
    <div className="card-body">
      <h6>Booking ID: {repair.bookingId}</h6>
      <p>Dịch vụ: {repair.serviceType}</p>
      <p>Thời gian: {repair.duration}</p>
      <p>Phụ tùng: {repair.partsUsed.join(', ')}</p>
    </div>
  </div>
);

export default RepairDetail;