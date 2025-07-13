import React from 'react';
import { Nav } from 'react-bootstrap';

const SidebarGarage = ({ onSelect }) => (
  <Nav className="flex-column bg-dark text-white p-3" style={{ minHeight: "100vh", width: "250px" }}>
    <Nav.Link onClick={() => onSelect('bookings')} className="text-white">📅 Lịch sửa chữa</Nav.Link>
    <Nav.Link onClick={() => onSelect('feedback')} className="text-white">⭐ Phản hồi</Nav.Link>
    <Nav.Link onClick={() => onSelect('chats')} className="text-white">💬 Tin nhắn</Nav.Link>
    <Nav.Link onClick={() => onSelect('repairs')} className="text-white">🔧 Thông tin sửa chữa</Nav.Link>
    <Nav.Link onClick={() => onSelect('staff')} className="text-white">👨‍🔧 Nhân viên</Nav.Link>
  </Nav>
);

export default SidebarGarage;
