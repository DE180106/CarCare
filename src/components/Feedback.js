import React from 'react';

const Feedback = ({ feedback }) => (
  <div className="card mb-2">
    <div className="card-body">
      <p>⭐ {feedback.rating} sao</p>
      <p>{feedback.comment}</p>
    </div>
  </div>
);

export default Feedback;
