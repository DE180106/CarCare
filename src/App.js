import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserDashboard from './UserDashboard';
import ForgotPassword from './ForgotPassword';
import GarageListPage from './GarageListPage';
import FeedbackPage from './Feedback';
import BookingForm from './booking';
import BookingHistory from './BookingHistory'; // Thêm import BookingHistory
import AdminDashboard from './AdminDashboard';
import GarageDashboard from './GarageDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/garages" element={<GarageListPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/booking" element={<BookingForm />} />
      <Route path="/booking/history" element={<BookingHistory />} /> {/* Thêm route này */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/garage/dashboard" element={<GarageDashboard />} />
    </Routes>
  );
}

export default App;