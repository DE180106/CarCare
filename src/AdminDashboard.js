import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Table, Modal, Alert, Row, Col, Nav as NavBS } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from './data.json'; // Nhập data.json làm nguồn dữ liệu chính

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("loggedInUser"));
  const [users, setUsers] = useState([]);
  const [garages, setGarages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [repairDetails, setRepairDetails] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState('');

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!admin || admin.role !== 'admin') {
      console.warn('Truy cập admin bị từ chối. Chuyển hướng đến trang đăng nhập.');
      navigate('/login');
    } else {
      console.log('Admin đã đăng nhập:', admin);
    }
  }, [admin, navigate]);

  // Tải dữ liệu từ data.json
  useEffect(() => {
    try {
      // Kiểm tra và gán dữ liệu người dùng
      const loadedUsers = data.Users.filter(user => !user.role || user.role !== 'garage');
      if (!Array.isArray(loadedUsers)) {
        setError('Dữ liệu người dùng trong data.json không hợp lệ.');
        setUsers([]);
      } else {
        setUsers(loadedUsers);
      }

      // Kiểm tra và gán dữ liệu garage
      const loadedGarages = data.Garages;
      if (!Array.isArray(loadedGarages)) {
        setError(prev => prev + ' Dữ liệu garage trong data.json không hợp lệ.');
        setGarages([]);
      } else {
        setGarages(loadedGarages);
      }

      // Kiểm tra và gán dữ liệu đặt lịch
      const loadedBookings = data.Bookings;
      if (!Array.isArray(loadedBookings)) {
        setError(prev => prev + ' Dữ liệu đặt lịch trong data.json không hợp lệ.');
        setBookings([]);
      } else {
        setBookings(loadedBookings);
      }

      // Kiểm tra và gán dữ liệu feedback
      const loadedFeedbacks = data.Feedback;
      if (!Array.isArray(loadedFeedbacks)) {
        setError(prev => prev + ' Dữ liệu feedback trong data.json không hợp lệ.');
        setFeedbacks([]);
      } else {
        setFeedbacks(loadedFeedbacks);
      }

      // Kiểm tra và gán dữ liệu lịch sử sửa chữa
      const loadedRepairDetails = data.GarageDashboard.RepairDetails;
      if (!Array.isArray(loadedRepairDetails)) {
        setError(prev => prev + ' Dữ liệu lịch sử sửa chữa trong data.json không hợp lệ.');
        setRepairDetails([]);
      } else {
        setRepairDetails(loadedRepairDetails);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu từ data.json:', err);
      setError('Lỗi không xác định khi tải dữ liệu từ data.json.');
    }
  }, []);

  // Xử lý xóa người dùng
  const handleDeleteUser = (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      console.log(`Đang xóa người dùng với ID: ${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      alert('Xóa người dùng thành công.');
    } catch (err) {
      console.error('Lỗi khi xóa người dùng:', err);
      setError(`Lỗi khi xóa người dùng: ${err.message}`);
    }
  };

  // Xử lý xóa garage
  const handleDeleteGarage = (garageId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa garage này?')) return;
    try {
      console.log(`Đang xóa garage với ID: ${garageId}`);
      setGarages(garages.filter(garage => garage.id !== garageId));
      alert('Xóa garage thành công.');
    } catch (err) {
      console.error('Lỗi khi xóa garage:', err);
      setError(`Lỗi khi xóa garage: ${err.message}`);
    }
  };

  // Xử lý xóa booking
  const handleDeleteBooking = (bookingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đặt lịch này?')) return;
    try {
      console.log(`Đang xóa đặt lịch với ID: ${bookingId}`);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      alert('Xóa đặt lịch thành công.');
    } catch (err) {
      console.error('Lỗi khi xóa đặt lịch:', err);
      setError(`Lỗi khi xóa đặt lịch: ${err.message}`);
    }
  };

  // Xử lý xóa feedback
  const handleDeleteFeedback = (feedbackId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa feedback này?')) return;
    try {
      console.log(`Đang xóa feedback với ID: ${feedbackId}`);
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId));
      alert('Xóa feedback thành công.');
    } catch (err) {
      console.error('Lỗi khi xóa feedback:', err);
      setError(`Lỗi khi xóa feedback: ${err.message}`);
    }
  };

  // Xử lý xem chi tiết
  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setSelectedGarage(null);
    setSelectedBooking(null);
    setSelectedFeedback(null);
    setSelectedRepair(null);
    setShowDetailsModal(true);
  };

  const handleViewGarageDetails = (garage) => {
    setSelectedGarage(garage);
    setSelectedUser(null);
    setSelectedBooking(null);
    setSelectedFeedback(null);
    setSelectedRepair(null);
    setShowDetailsModal(true);
  };

  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setSelectedUser(null);
    setSelectedGarage(null);
    setSelectedFeedback(null);
    setSelectedRepair(null);
    setShowDetailsModal(true);
  };

  const handleViewFeedbackDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setSelectedUser(null);
    setSelectedGarage(null);
    setSelectedBooking(null);
    setSelectedRepair(null);
    setShowDetailsModal(true);
  };

  const handleViewRepairDetails = (repair) => {
    setSelectedRepair(repair);
    setSelectedUser(null);
    setSelectedGarage(null);
    setSelectedBooking(null);
    setSelectedFeedback(null);
    setShowDetailsModal(true);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    console.log('Đăng xuất admin...');
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Trang Quản Trị</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link disabled>
              <i className="bi bi-person-circle me-1"></i>{admin?.fullName || 'Quản trị viên'}
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
              <NavBS.Link active={activeTab === 'users'} onClick={() => setActiveTab('users')} className="mb-2">
                Danh sách người dùng
              </NavBS.Link>
              <NavBS.Link active={activeTab === 'garages'} onClick={() => setActiveTab('garages')} className="mb-2">
                Danh sách garage
              </NavBS.Link>
              <NavBS.Link active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} className="mb-2">
                Lịch sử đặt lịch
              </NavBS.Link>
              <NavBS.Link active={activeTab === 'feedbacks'} onClick={() => setActiveTab('feedbacks')} className="mb-2">
                Danh sách feedback
              </NavBS.Link>
              <NavBS.Link active={activeTab === 'repairs'} onClick={() => setActiveTab('repairs')} className="mb-2">
                Lịch sử sửa chữa
              </NavBS.Link>
            </NavBS>
          </Col>

          {/* Nội dung chính */}
          <Col md={10}>
            <h2>Chào mừng, Quản trị viên!</h2>
            <p>Quản lý người dùng, garage, đặt lịch, phản hồi và lịch sử sửa chữa tại đây.</p>

            {error && <Alert variant="danger">{error}</Alert>}

            {activeTab === 'users' && (
              <>
                <h3 className="mt-4">Danh sách người dùng</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">Không tìm thấy người dùng.</td>
                      </tr>
                    ) : (
                      users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.fullName}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>
                            <Button variant="info" size="sm" className="me-2" onClick={() => handleViewUserDetails(user)}>
                              Xem chi tiết
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                              Xóa
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </>
            )}

            {activeTab === 'garages' && (
              <>
                <h3 className="mt-4">Danh sách garage</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên garage</th>
                      <th>Địa chỉ</th>
                      <th>Số điện thoại</th>
                      <th>Đánh giá</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {garages.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">Không tìm thấy garage.</td>
                      </tr>
                    ) : (
                      garages.map(garage => (
                        <tr key={garage.id}>
                          <td>{garage.id}</td>
                          <td>{garage.name}</td>
                          <td>{garage.address}</td>
                          <td>{garage.phone}</td>
                          <td>{garage.rating || 'Chưa có đánh giá'}</td>
                          <td>
                            <Button variant="info" size="sm" className="me-2" onClick={() => handleViewGarageDetails(garage)}>
                              Xem chi tiết
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteGarage(garage.id)}>
                              Xóa
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </>
            )}

            {activeTab === 'bookings' && (
              <>
                <h3 className="mt-4">Lịch sử đặt lịch</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>ID Người dùng</th>
                      <th>ID Garage</th>
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
                        <td colSpan="8" className="text-center">Không tìm thấy đặt lịch.</td>
                      </tr>
                    ) : (
                      bookings.map(booking => (
                        <tr key={booking.id}>
                          <td>{booking.id}</td>
                          <td>{booking.userId}</td>
                          <td>{booking.garageId}</td>
                          <td>{booking.serviceType}</td>
                          <td>{new Date(booking.date).toLocaleDateString()}</td>
                          <td>{booking.time}</td>
                          <td>{booking.status}</td>
                          <td>
                            <Button variant="info" size="sm" className="me-2" onClick={() => handleViewBookingDetails(booking)}>
                              Xem chi tiết
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteBooking(booking.id)}>
                              Xóa
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
                <h3 className="mt-4">Danh sách feedback</h3>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>ID Người dùng</th>
                      <th>ID Garage</th>
                      <th>Điểm đánh giá</th>
                      <th>Bình luận</th>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">Không tìm thấy feedback.</td>
                      </tr>
                    ) : (
                      feedbacks.map(feedback => (
                        <tr key={feedback.id}>
                          <td>{feedback.id}</td>
                          <td>{feedback.userId}</td>
                          <td>{feedback.garageId}</td>
                          <td>{feedback.rating}</td>
                          <td>{feedback.comment}</td>
                          <td>{feedback.timestamp ? new Date(feedback.timestamp).toLocaleString() : 'Chưa có'}</td>
                          <td>
                            <Button variant="info" size="sm" className="me-2" onClick={() => handleViewFeedbackDetails(feedback)}>
                              Xem chi tiết
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteFeedback(feedback.id)}>
                              Xóa
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
                <h3 className="mt-4">Lịch sử sửa chữa</h3>
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
                        <td colSpan="5" className="text-center">Không tìm thấy lịch sử sửa chữa.</td>
                      </tr>
                    ) : (
                      repairDetails.map(repair => (
                        <tr key={repair.bookingId}>
                          <td>{repair.bookingId}</td>
                          <td>{repair.serviceType}</td>
                          <td>{repair.partsUsed?.join(', ') || 'Không có'}</td>
                          <td>{repair.duration}</td>
                          <td>
                            <Button variant="info" size="sm" className="me-2" onClick={() => handleViewRepairDetails(repair)}>
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
                  {selectedUser ? 'Chi tiết người dùng' :
                   selectedGarage ? 'Chi tiết garage' :
                   selectedBooking ? 'Chi tiết đặt lịch' :
                   selectedFeedback ? 'Chi tiết feedback' :
                   selectedRepair ? 'Chi tiết sửa chữa' : 'Chi tiết'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedUser ? (
                  <>
                    <p><strong>ID:</strong> {selectedUser.id}</p>
                    <p><strong>Họ tên:</strong> {selectedUser.fullName}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Số điện thoại:</strong> {selectedUser.phone}</p>
                    <p><strong>Địa chỉ:</strong> {selectedUser.address || 'Không có'}</p>
                    <p><strong>Thông tin xe:</strong></p>
                    <ul>
                      <li><strong>Hãng xe:</strong> {selectedUser.car?.make || 'Không có'}</li>
                      <li><strong>Dòng xe:</strong> {selectedUser.car?.model || 'Không có'}</li>
                      <li><strong>Biển số:</strong> {selectedUser.car?.licensePlate || 'Không có'}</li>
                    </ul>
                    <p><strong>URL ảnh đại diện:</strong> {selectedUser.avatarUrl || 'Không có'}</p>
                  </>
                ) : selectedGarage ? (
                  <>
                    <p><strong>ID:</strong> {selectedGarage.id}</p>
                    <p><strong>Tên garage:</strong> {selectedGarage.name}</p>
                    <p><strong>Địa chỉ:</strong> {selectedGarage.address}</p>
                    <p><strong>Số điện thoại:</strong> {selectedGarage.phone}</p>
                    <p><strong>Giờ mở cửa:</strong> {selectedGarage.openingHours || 'Không có'}</p>
                    <p><strong>Đánh giá:</strong> {selectedGarage.rating || 'Chưa có đánh giá'}</p>
                    <p><strong>Trạng thái:</strong> {selectedGarage.status}</p>
                    <p><strong>Dịch vụ:</strong></p>
                    <ul>
                      {selectedGarage.services?.map((service, index) => (
                        <li key={index}>{service}</li>
                      )) || <li>Không có dịch vụ</li>}
                    </ul>
                    <p><strong>Khung giờ trống:</strong></p>
                    <ul>
                      {selectedGarage.availableSlots?.map((slot, index) => (
                        <li key={index}>{slot}</li>
                      )) || <li>Không có khung giờ trống</li>}
                    </ul>
                    <p><strong>URL ảnh:</strong> {selectedGarage.imageUrl || 'Không có'}</p>
                  </>
                ) : selectedBooking ? (
                  <>
                    <p><strong>ID:</strong> {selectedBooking.id}</p>
                    <p><strong>ID Người dùng:</strong> {selectedBooking.userId}</p>
                    <p><strong>ID Garage:</strong> {selectedBooking.garageId}</p>
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
                    <p><strong>ID Garage:</strong> {selectedFeedback.garageId}</p>
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

export default AdminDashboard;