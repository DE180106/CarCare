import React from 'react';

const StaffCard = ({ staff }) => (
  <div className="card mb-3">
    <div className="card-body">
      <h6>{staff.name}</h6>
      <p>Kỹ năng: {staff.skills.join(', ')}</p>
      <p>Nhiệm vụ hiện tại: {staff.assignedTask}</p>
      <p>Booking ID: {staff.bookingId}</p>
    </div>
  </div>
);

export default StaffCard;
