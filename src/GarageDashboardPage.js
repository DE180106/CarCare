import React, { useState } from 'react';
import SidebarGarage from './components/SidebarGarage';
import BookingCard from './components/BookingCard';
import ChatBox from './components/ChatBox';
import FeedbackCard from './components/FeedbackCard';
import RepairDetail from './components/RepairDetail';
import StaffCard from './components/StaffCard';
import Header from './components/Header';
import Footer from './components/Footer';
import data from './data.json';

const GarageDashboardPage = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const garageId = loggedInUser?.id;
  const [section, setSection] = useState('bookings');

  if (!loggedInUser || loggedInUser.role !== 'garage') {
    return <p className="text-center mt-5 text-danger">Bạn không có quyền truy cập trang này.</p>;
  }

  const bookings = data.Bookings.filter(b => b.garageId === garageId);
  const chats = data.ChatThreads.filter(c => c.participants.garageId === garageId);
  const feedbacks = data.Feedback.filter(f => f.garageId === garageId);
  const repairs = data.GarageDashboard.RepairDetails.filter(r => bookings.map(b => b.id).includes(r.bookingId));
  const staff = data.GarageDashboard.Staff;

  return (
    <>
      <Header />
      <div className="d-flex">
        <SidebarGarage onSelect={setSection} />
        <div className="p-4 flex-grow-1">
          {section === 'bookings' && (
            <>
              <h4 className="mb-3">📅 Lịch sửa chữa</h4>
              {bookings.map(b => <BookingCard key={b.id} booking={b} />)}
            </>
          )}

          {section === 'feedback' && (
            <>
              <h4 className="mb-3">⭐ Phản hồi khách hàng</h4>
              {feedbacks.map(f => <FeedbackCard key={f.id} feedback={f} />)}
            </>
          )}

          {section === 'chats' && (
            <>
              <h4 className="mb-3">💬 Tin nhắn</h4>
              {chats.map(c => <ChatBox key={c.id} chat={c} />)}
            </>
          )}

          {section === 'repairs' && (
            <>
              <h4 className="mb-3">🔧 Chi tiết sửa chữa</h4>
              {repairs.map(r => <RepairDetail key={r.bookingId} repair={r} />)}
            </>
          )}

          {section === 'staff' && (
            <>
              <h4 className="mb-3">👨‍🔧 Nhân viên</h4>
              {staff.map(s => <StaffCard key={s.id} staff={s} />)}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GarageDashboardPage;
