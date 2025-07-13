import React from 'react';

const FeedbackCard = ({ feedback }) => (
  <div className="card mb-3">
    <div className="card-body">
      <h6>⭐ {feedback.rating} sao</h6>
      <p>{feedback.comment}</p>
      <small>🕒 {new Date(feedback.timestamp).toLocaleString()}</small>
    </div>
  </div>
);

export default FeedbackCard;
