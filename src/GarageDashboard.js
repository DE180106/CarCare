import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Table, Modal, Alert, Row, Col, Nav as NavBS } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from './data.json'; // Nhập data.json làm nguồn dữ liệu chính

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

  // Kiểm tra quyền garage
  useEffect(() => {
    if (!garage || garage.role !== 'garage') {
      console.warn('Truy cập garage bị từ chối. Chuyển hướng đến trang đăng nhập.');
      navigate('/login');
    } else {
      console.log('Garage đã đăng nhập:', garage);
    }
  }, [garage, navigate]);

  // Tải dữ liệu từ data.json
  useEffect(() => {
    try {
      // Lọc bookings theo garageId
      const loadedBookings = data.Bookings.filter(booking => booking.garageId === garage?.id);
      if (!Array.isArray(loadedBookings)) {
        setError('Dữ liệu lịch đặt trong data.json không hợp lệ.');
        setBookings([]);
      } else {
        setBookings(loadedBookings);
      }

      // Lọc feedbacks theo garageId
      const loadedFeedbacks = data.Feedback.filter(feedback => feedback.garageId === garage?.id);
      if (!Array.isArray(loadedFeedbacks)) {
        setError(prev => prev + ' Dữ liệu phản hồi trong data.json không hợp lệ.');
        setFeedbacks([]);
      } else {
        setFeedbacks(loadedFeedbacks);
      }

      // Lọc repairDetails theo bookings của garage
      const loadedRepairDetails = data.GarageDashboard.RepairDetails.filter(repair => 
        loadedBookings.some(booking => booking.id === repair.bookingId)
      );
      if (!Array.isArray(loadedRepairDetails)) {
        setError(prev => prev + ' Dữ liệu chi tiết sửa chữa trong data.json không hợp lệ.');
        setRepairDetails([]);
      } else {
        setRepairDetails(loadedRepairDetails);
      }

      // Lọc chatThreads theo garageId
      const loadedChatThreads = data.ChatThreads.filter(chat => chat.participants.garageId === garage?.id);
      if (!Array.isArray(loadedChatThreads)) {
        setError(prev => prev + ' Dữ liệu cuộc trò chuyện trong data.json không hợp lệ.');
        setChatThreads([]);
      } else {
        setChatThreads(loadedChatThreads);
      }

      // Lấy danh sách nhân viên
      const loadedStaff = data.GarageDashboard.Staff;
      if (!Array.isArray(loadedStaff)) {
        setError(prev => prev + ' Dữ liệu nhân viên trong data.json không hợp lệ.');
        setStaff([]);
      } else {
        setStaff(loadedStaff);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu từ data.json:', err);
      setError('Lỗi không xác định khi tải dữ liệu từ data.json.');
    }
  }, [garage]);

  // Xử lý cập nhật trạng thái lịch đặt
  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    if (!window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái lịch đặt ${bookingId} thành ${newStatus}?`)) return;
    try {
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      alert('Cập nhật trạng thái thành công.');
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      setError(`Lỗi khi cập nhật trạng thái: ${err.message}`);
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
    setShowDetailsModal(true);
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
    console.log('Đăng xuất garage...');
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Trang Gara</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link disabled>
              <i className="bi bi-person-circle me-1"></i>{garage?.fullName || 'Gara'}
            </Nav.Link>
            <Button variant="outline-light" onClick={handleLogout}>Đăng xuất</Button>
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
            <p>Email: {garage?.email}</p>
            <p>Điện thoại: {garage?.phone}</p>
            <p>Địa chỉ: {garage?.address}</p>

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
                <h3 className="mt-4">Danh sách trò chuyện</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>ID Người dùng</th>
                      <th>Tin nhắn mới nhất</th>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chatThreads.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">Không tìm thấy cuộc trò chuyện.</td>
                      </tr>
                    ) : (
                      chatThreads.map(chat => (
                        <tr key={chat.id}>
                          <td>{chat.id}</td>
                          <td>{chat.participants.userId}</td>
                          <td>{chat.messages[chat.messages.length - 1]?.message || 'Không có tin nhắn'}</td>
                          <td>{chat.messages[chat.messages.length - 1]?.timestamp ? new Date(chat.messages[chat.messages.length - 1].timestamp).toLocaleString() : 'Chưa có'}</td>
                          <td>
                            <Button variant="info" size="sm" onClick={() => handleViewChatDetails(chat)}>
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
                    <p><strong>ID Người dùng:</strong> {selectedChat.participants.userId}</p>
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
      </Container>
    </>
  );
};

export default GarageDashboard;