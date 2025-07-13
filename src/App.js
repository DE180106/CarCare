import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'; 

import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserDashboard from './UserDashboard'; // Bạn đã tạo file này rồi
import ForgotPassword from './ForgotPassword';
import GarageListPage from './GarageListPage';
import FeedbackPage from './Feedback';
import BookingForm from './booking';


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
      
      <Route path="/booking" element={<BookingForm />} /> // ✅ sửa từ "/book" thành "/booking"


    </Routes>
  );
}

export default App;
//a