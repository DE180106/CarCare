import React, { useState, useEffect, useRef } from 'react';
import { Container, Navbar, Nav, Button, Table, Modal, Alert, Row, Col, Nav as NavBS, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from './data.json'; // Nhập data.json làm nguồn dữ liệu gốc

const GarageDashboard = () => {
  const navigate = useNavigate();
  const garage = JSON.parse(localStorage.getItem("loggedInUser"));
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [repairDetails, setRepairDetails] = useState([]);
  const [chatThreads, setChatThreads] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);

  // Kiểm tra quyền garage
  useEffect(() => {
    if (!garage || garage.role !== 'garage') {
      console.warn('Truy cập garage bị từ chối. Chuyển hướng đến trang đăng nhập.');
      navigate('/login');
    } else {
      console.log('Garage đã đăng nhập:', garage);
    }
  }, [garage, navigate]);

  // Tải dữ liệu từ localStorage hoặc data.json
  useEffect(() => {
    try {
      // Kiểm tra và tải dữ liệu lịch đặt
      const storedBookings = JSON.parse(localStorage.getItem('bookings')) || (data.Bookings && Array.isArray(data.Bookings) ? data.Bookings : []);
      const loadedBookings = storedBookings.filter(booking => booking.garageId === garage?.id);
      if (!Array.isArray(loadedBookings)) {
        setError('Dữ liệu lịch đặt không hợp lệ.');
        setBookings([]);
      } else {
        setBookings(loadedBookings);
      }

      // Kiểm tra và tải dữ liệu phản hồi
      const storedFeedbacks = JSON.parse(localStorage.getItem('feedbacks')) || (data.Feedback && Array.isArray(data.Feedback) ? data.Feedback : []);
      const loadedFeedbacks = storedFeedbacks.filter(feedback => feedback.garageId === garage?.id);
      if (!Array.isArray(loadedFeedbacks)) {
        setError('Dữ liệu phản hồi không hợp lệ.');
        setFeedbacks([]);
      } else {
        setFeedbacks(loadedFeedbacks);
      }

      // Kiểm tra và tải dữ liệu chi tiết sửa chữa
      const storedRepairDetails = JSON.parse(localStorage.getItem('repairDetails')) || (data.GarageDashboard?.RepairDetails && Array.isArray(data.GarageDashboard.RepairDetails) ? data.GarageDashboard.RepairDetails : []);
      const loadedRepairDetails = storedRepairDetails.filter(repair => 
        loadedBookings.some(booking => booking.id === repair.bookingId)
      );
      if (!Array.isArray(loadedRepairDetails)) {
        setError('Dữ liệu chi tiết sửa chữa không hợp lệ.');
        setRepairDetails([]);
      } else {
        setRepairDetails(loadedRepairDetails);
      }

      // Kiểm tra và tải dữ liệu cuộc trò chuyện
      const storedChatThreads = JSON.parse(localStorage.getItem('chatThreads')) || (data.ChatThreads && Array.isArray(data.ChatThreads) ? data.ChatThreads : []);
      const loadedChatThreads = storedChatThreads.filter(chat => chat.participants?.garageId === garage?.id);
      if (!Array.isArray(loadedChatThreads)) {
        setError('Dữ liệu cuộc trò chuyện không hợp lệ.');
        setChatThreads([]);
      } else {
        setChatThreads(loadedChatThreads);
      }

      // Kiểm tra và tải dữ liệu nhân viên
      const storedStaff = JSON.parse(localStorage.getItem('staff')) || (data.GarageDashboard?.Staff && Array.isArray(data.GarageDashboard.Staff) ? data.GarageDashboard.Staff : []);
      if (!Array.isArray(storedStaff)) {
        setError('Dữ liệu nhân viên không hợp lệ.');
        setStaff([]);
      } else {
        setStaff(storedStaff);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      setError('Lỗi không xác định khi tải dữ liệu.');
    }
  }, [garage]);

  // Tự động cuộn xuống cuối khung chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedChat]);

  // Xử lý cập nhật trạng thái lịch đặt
  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    if (!window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái lịch đặt ${bookingId} thành ${newStatus}?`)) return;
    try {
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      setBookings(updatedBookings);
      const allBookings = JSON.parse(localStorage.getItem('bookings')) || (data.Bookings || []);
      const updatedAllBookings = allBookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      localStorage.setItem('bookings', JSON.stringify(updatedAllBookings));
      alert('Cập nhật trạng thái thành công.');
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      setError(`Lỗi khi cập nhật trạng thái: ${err.message}`);
    }
  };

  // Xử lý gửi tin nhắn mới
  const handleSendMessage = (chatId) => {
    if (!newMessage.trim()) {
      setError('Vui lòng nhập nội dung tin nhắn.');
      return;
    }

    try {
      const updatedChats = chatThreads.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                sender: 'garage',
                message: newMessage,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return chat;
      });
      setChatThreads(updatedChats);
      localStorage.setItem('chatThreads', JSON.stringify(updatedChats));
      setSelectedChat(updatedChats.find(chat => chat.id === chatId));
      setNewMessage('');
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
      setError(`Lỗi khi gửi tin nhắn: ${err.message}`);
    }
  };

  // Xử lý xóa cuộc trò chuyện
  const handleDeleteChat = (chatId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này?')) return;
    try {
      const updatedChats = chatThreads.filter(chat => chat.id !== chatId);
      setChatThreads(updatedChats);
      localStorage.setItem('chatThreads', JSON.stringify(updatedChats));
      setSelectedChat(null);
      alert('Xóa cuộc trò chuyện thành công.');
    } catch (err) {
      console.error('Lỗi khi xóa cuộc trò chuyện:', err);
      setError(`Lỗi khi xóa cuộc trò chuyện: ${err.message}`);
    }
  };

  // Xử lý xem chi tiết
  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setSelectedFeedback(null);
    setSelectedRepair(null);
    setSelectedChat(null);
    setSelectedStaff(null);
    setShowDetailsModal(true);
  };

  const handleViewFeedbackDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setSelectedBooking(null);
    setSelectedRepair(null);
    setSelectedChat(null);
    setSelectedStaff(null);
    setShowDetailsModal(true);
  };

  const handleViewRepairDetails = (repair) => {
    setSelectedRepair(repair);
    setSelectedBooking(null);
    setSelectedFeedback(null);
    setSelectedChat(null);
    setSelectedStaff(null);
    setShowDetailsModal(true);
  };

  const handleViewChatDetails = (chat) => {
    setSelectedChat(chat);
    setSelectedBooking(null);
    setSelectedFeedback(null);
    setSelectedRepair(null);
    setSelectedStaff(null);
    setNewMessage('');
  };

  const handleViewStaffDetails = (staff) => {
    setSelectedStaff(staff);
    setSelectedBooking(null);
    setSelectedFeedback(null);
    setSelectedRepair(null);
    setSelectedChat(null);
    setShowDetailsModal(true);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Trang Gara</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link>
              <i className="bi bi-person-circle me-1"></i>{garage?.fullName || 'Gara'}
            </Nav.Link>
            <Button variant="outline-light" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="mt-5">
        <Row>
          {/* Sidebar */}
          <Col md={2} className="bg-light p-3">
            <h4>Menu</h4>
            <NavBS className="flex-column">
              <NavBS.Link active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} className="mb-2">
                Lịch đặt
              </NavBS.Link>
              <NavBS.Link active={activeTab === 'feedbacks'} onClick={() => setActiveTab('feedbacks')} className="mb-2">
                Phản hồi
              </NavBS.Link>
              <NavBS.Link active={activeTab === 'repairs'} onClick={() => setActiveTab('repairs')} className="mb-2">
                Chi tiết sửa chữa
              </NavBS.Link>
              <NavBS.Link active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} className="mb-2">
                Trò chuyện
              </NavBS.Link>
              <NavBS.Link active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} className="mb-2">
                Nhân viên
              </NavBS.Link>
            </NavBS>
          </Col>

          {/* Nội dung chính */}
          <Col md={10}>
            <h2>Chào mừng, {garage?.fullName}!</h2>
            <p>Quản lý lịch đặt, phản hồi, chi tiết sửa chữa, trò chuyện và nhân viên tại đây.</p>
            <p><strong>Email:</strong> {garage?.email || 'Không có'}</p>
            <p><strong>Điện thoại:</strong> {garage?.phone || 'Không có'}</p>
            <p><strong>Địa chỉ:</strong> {garage?.address || 'Không có'}</p>

            {error && <Alert variant="danger">{error}</Alert>}

            {activeTab === 'bookings' && (
              <>
                <h3 className="mt-4">Danh sách lịch đặt</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>ID Người dùng</th>
                      <th>Loại dịch vụ</th>
                      <th>Ngày</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">Không tìm thấy lịch đặt.</td>
                      </tr>
                    ) : (
                      bookings.map(booking => (
                        <tr key={booking.id}>
                          <td>{booking.id}</td>
                          <td>{booking.userId}</td>
                          <td>{booking.serviceType}</td>
                          <td>{new Date(booking.date).toLocaleDateString()}</td>
                          <td>{booking.time}</td>
                          <td>{booking.status}</td>
                          <td>
                            <Button variant="info" size="sm" className="me-2" onClick={() => handleViewBookingDetails(booking)}>
                              Xem chi tiết
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleUpdateBookingStatus(booking.id, booking.status === 'pending' ? 'confirmed' : 'completed')}
                              disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                            >
                              {booking.status === 'pending' ? 'Xác nhận' : 'Hoàn thành'}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </>
            )}

            {activeTab === 'feedbacks' && (
              <>
                <h3 className="mt-4">Danh sách phản hồi</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>ID Người dùng</th>
                      <th>Điểm đánh giá</th>
                      <th>Bình luận</th>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">Không tìm thấy phản hồi.</td>
                      </tr>
                    ) : (
                      feedbacks.map(feedback => (
                        <tr key={feedback.id}>
                          <td>{feedback.id}</td>
                          <td>{feedback.userId}</td>
                          <td>{feedback.rating}</td>
                          <td>{feedback.comment}</td>
                          <td>{feedback.timestamp ? new Date(feedback.timestamp).toLocaleString() : 'Chưa có'}</td>
                          <td>
                            <Button variant="info" size="sm" onClick={() => handleViewFeedbackDetails(feedback)}>
                              Xem chi tiết
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </>
            )}

            {activeTab === 'repairs' && (
              <>
                <h3 className="mt-4">Chi tiết sửa chữa</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID Đặt lịch</th>
                      <th>Loại dịch vụ</th>
                      <th>Bộ phận sử dụng</th>
                      <th>Thời gian sửa chữa</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repairDetails.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">Không tìm thấy chi tiết sửa chữa.</td>
                      </tr>
                    ) : (
                      repairDetails.map(repair => (
                        <tr key={repair.bookingId}>
                          <td>{repair.bookingId}</td>
                          <td>{repair.serviceType}</td>
                          <td>{repair.partsUsed?.join(', ') || 'Không có'}</td>
                          <td>{repair.duration}</td>
                          <td>
                            <Button variant="info" size="sm" onClick={() => handleViewRepairDetails(repair)}>
                              Xem chi tiết
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </>
            )}

            {activeTab === 'chats' && (
              <>
                <h3 className="mt-4">Trò chuyện</h3>
                <Row>
                  {/* Danh sách cuộc trò chuyện */}
                  <Col md={4} className="border-end" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <h5>Danh sách khách hàng</h5>
                    {chatThreads.length === 0 ? (
                      <p className="text-center">Không có cuộc trò chuyện nào.</p>
                    ) : (
                      chatThreads.map(chat => (
                        <div
                          key={chat.id}
                          className={`p-3 border-bottom ${selectedChat?.id === chat.id ? 'bg-light' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleViewChatDetails(chat)}
                        >
                          <strong>ID Người dùng: {chat.participants?.userId || 'Không xác định'}</strong>
                          <p className="mb-0 text-truncate">{chat.messages?.[chat.messages.length - 1]?.message || 'Không có tin nhắn'}</p>
                          <small>{chat.messages?.[chat.messages.length - 1]?.timestamp ? new Date(chat.messages[chat.messages.length - 1].timestamp).toLocaleString() : 'Chưa có'}</small>
                          <Button
                            variant="danger"
                            size="sm"
                            className="float-end"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.id);
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      ))
                    )}
                  </Col>

                  {/* Nội dung cuộc trò chuyện */}
                  <Col md={8}>
                    {selectedChat ? (
                      <>
                        <h5>Trò chuyện với ID: {selectedChat.participants?.userId || 'Không xác định'}</h5>
                        <div
                          ref={chatContainerRef}
                          className="chat-container"
                          style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', backgroundColor: '#f9f9f9' }}
                        >
                          {selectedChat.messages?.map((msg, index) => (
                            <div
                              key={index}
                              className={`mb-2 ${msg.sender === 'garage' ? 'text-end' : 'text-start'}`}
                            >
                              <div
                                style={{
                                  display: 'inline-block',
                                  maxWidth: '70%',
                                  padding: '8px 12px',
                                  borderRadius: '10px',
                                  backgroundColor: msg.sender === 'garage' ? '#0084ff' : '#e5e5ea',
                                  color: msg.sender === 'garage' ? '#fff' : '#000',
                                }}
                              >
                                <p className="mb-0">{msg.message}</p>
                                <small>{new Date(msg.timestamp).toLocaleString()}</small>
                              </div>
                            </div>
                          )) || <p>Không có tin nhắn.</p>}
                        </div>
                        <Form
                          className="mt-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage(selectedChat.id);
                          }}
                        >
                          <InputGroup>
                            <Form.Control
                              type="text"
                              placeholder="Nhập tin nhắn..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <Button variant="primary" type="submit">
                              Gửi
                            </Button>
                          </InputGroup>
                        </Form>
                      </>
                    ) : (
                      <p className="text-center">Chọn một cuộc trò chuyện để bắt đầu.</p>
                    )}
                  </Col>
                </Row>
              </>
            )}

            {activeTab === 'staff' && (
              <>
                <h3 className="mt-4">Danh sách nhân viên</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Kỹ năng</th>
                      <th>Công việc được giao</th>
                      <th>ID Đặt lịch</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">Không tìm thấy nhân viên.</td>
                      </tr>
                    ) : (
                      staff.map(staffMember => (
                        <tr key={staffMember.id}>
                          <td>{staffMember.id}</td>
                          <td>{staffMember.name}</td>
                          <td>{staffMember.skills?.join(', ') || 'Không có'}</td>
                          <td>{staffMember.assignedTask || 'Không có'}</td>
                          <td>{staffMember.bookingId || 'Không có'}</td>
                          <td>
                            <Button variant="info" size="sm" onClick={() => handleViewStaffDetails(staffMember)}>
                              Xem chi tiết
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </>
            )}

            {/* Modal chi tiết */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>
                  {selectedBooking ? 'Chi tiết lịch đặt' :
                   selectedFeedback ? 'Chi tiết phản hồi' :
                   selectedRepair ? 'Chi tiết sửa chữa' :
                   selectedChat ? 'Chi tiết trò chuyện' :
                   selectedStaff ? 'Chi tiết nhân viên' : 'Chi tiết'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedBooking ? (
                  <>
                    <p><strong>ID:</strong> {selectedBooking.id}</p>
                    <p><strong>ID Người dùng:</strong> {selectedBooking.userId}</p>
                    <p><strong>Loại dịch vụ:</strong> {selectedBooking.serviceType}</p>
                    <p><strong>Ngày:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</p>
                    <p><strong>Thời gian:</strong> {selectedBooking.time}</p>
                    <p><strong>Trạng thái:</strong> {selectedBooking.status}</p>
                    <p><strong>Ghi chú:</strong> {selectedBooking.note || 'Không có'}</p>
                  </>
                ) : selectedFeedback ? (
                  <>
                    <p><strong>ID:</strong> {selectedFeedback.id}</p>
                    <p><strong>ID Người dùng:</strong> {selectedFeedback.userId}</p>
                    <p><strong>Điểm đánh giá:</strong> {selectedFeedback.rating}</p>
                    <p><strong>Bình luận:</strong> {selectedFeedback.comment}</p>
                    <p><strong>Thời gian:</strong> {selectedFeedback.timestamp ? new Date(selectedFeedback.timestamp).toLocaleString() : 'Chưa có'}</p>
                  </>
                ) : selectedRepair ? (
                  <>
                    <p><strong>ID Đặt lịch:</strong> {selectedRepair.bookingId}</p>
                    <p><strong>Loại dịch vụ:</strong> {selectedRepair.serviceType}</p>
                    <p><strong>Bộ phận sử dụng:</strong></p>
                    <ul>
                      {selectedRepair.partsUsed?.map((part, index) => (
                        <li key={index}>{part}</li>
                      )) || <li>Không có</li>}
                    </ul>
                    <p><strong>Thời gian sửa chữa:</strong> {selectedRepair.duration}</p>
                  </>
                ) : selectedChat ? (
                  <>
                    <p><strong>ID:</strong> {selectedChat.id}</p>
                    <p><strong>ID Người dùng:</strong> {selectedChat.participants?.userId || 'Không xác định'}</p>
                    <p><strong>Tin nhắn:</strong></p>
                    <ul>
                      {selectedChat.messages?.map((msg, index) => (
                        <li key={index}>
                          <strong>{msg.sender === 'user' ? 'Người dùng' : 'Garage'}:</strong> {msg.message} ({new Date(msg.timestamp).toLocaleString()})
                        </li>
                      )) || <li>Không có tin nhắn</li>}
                    </ul>
                  </>
                ) : selectedStaff ? (
                  <>
                    <p><strong>ID:</strong> {selectedStaff.id}</p>
                    <p><strong>Tên:</strong> {selectedStaff.name}</p>
                    <p><strong>Kỹ năng:</strong></p>
                    <ul>
                      {selectedStaff.skills?.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      )) || <li>Không có</li>}
                    </ul>
                    <p><strong>Công việc được giao:</strong> {selectedStaff.assignedTask || 'Không có'}</p>
                    <p><strong>ID Đặt lịch:</strong> {selectedStaff.bookingId || 'Không có'}</p>
                  </>
                ) : (
                  <p>Không có dữ liệu được chọn.</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                  Đóng
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>

        {/* CSS tùy chỉnh cho giao diện chat */}
        <style>{`
          .chat-container::-webkit-scrollbar {
            width: 8px;
          }
          .chat-container::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 4px;
          }
          .chat-container::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
        `}</style>
      </Container>
    </>
  );
};

export default GarageDashboard;