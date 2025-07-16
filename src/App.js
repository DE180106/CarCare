import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import các trang chính
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserDashboard from './UserDashboard';
import ForgotPassword from './ForgotPassword';
import GarageListPage from './GarageListPage';
import FeedbackPage from './Feedback';
import BookingForm from './booking';
import BookingHistory from './BookingHistory';


// Import các trang quản trị và garage
import AdminDashboard from './AdminDashboard';
import GarageDashboard from './GarageDashboard';
import GarageReviews from './GarageReviews';

// Import các trang phụ
import StoreSystem from './map';
import Contact from './userschat';
import AboutPage from './AboutPage';

function App() {
  return (
    <Routes>
      {/* Trang chính */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Trang liên quan đến garage và đặt lịch */}
      <Route path="/garages" element={<GarageListPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/booking" element={<BookingForm />} />
      <Route path="/booking/history" element={<BookingHistory />} />
      <Route path="/garage/:id/reviews" element={<GarageReviews />} />

      {/* Trang quản trị và garage */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/garage/dashboard" element={<GarageDashboard />} />

      {/* Trang phụ */}
      <Route path="/map" element={<StoreSystem />} />
      <Route path="/userschat/:garageId" element={<Contact />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;