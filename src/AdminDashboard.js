import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Table, Modal, Alert, Spinner, Row, Col, Nav as NavBS } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from './data.json'; // Nhập data.json làm dữ liệu dự phòng

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("loggedInUser"));
  const [users, setUsers] = useState([]);
  const [garages, setGarages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // Quản lý tab hiện tại (users hoặc garages)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Hàm gọi API với cơ chế thử lại
  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Thử gọi API lần ${i + 1}: ${url}`);
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
      } catch (err) {
        if (i < retries - 1) {
          console.warn(`Thử lại lần ${i + 1} cho ${url}...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw err;
        }
      }
    }
  };

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!admin || admin.role !== 'admin') {
      console.warn('Truy cập admin bị từ chối. Chuyển hướng đến trang đăng nhập.');
      navigate('/login');
    } else {
      console.log('Admin đã đăng nhập:', admin);
    }
  }, [admin, navigate]);

  // Lấy danh sách người dùng từ API hoặc dữ liệu dự phòng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('Đang lấy danh sách người dùng từ API[](http://localhost:9999/Users)...');
        const fetchedUsers = await fetchWithRetry('http://localhost:9999/Users', {
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000),
        });
        console.log('Dữ liệu API (Users):', fetchedUsers);

        if (!Array.isArray(fetchedUsers)) {
          throw new Error('Dữ liệu API không phải là mảng');
        }

        const filteredUsers = fetchedUsers.filter(user => !user.role || user.role !== 'garage');
        console.log('Danh sách người dùng sau khi lọc:', filteredUsers);

        if (filteredUsers.length === 0) {
          console.warn('Không tìm thấy người dùng thường trong API. Sử dụng dữ liệu dự phòng.');
          const fallbackUsers = data.Users.filter(user => !user.role || user.role !== 'garage');
          setUsers(fallbackUsers);
          setError('Không tìm thấy người dùng trong API. Đang sử dụng dữ liệu dự phòng.');
        } else {
          setUsers(filteredUsers);
          setError('');
        }
      } catch (err) {
        console.error('Lỗi khi lấy người dùng:', err);
        const fallbackUsers = data.Users.filter(user => !user.role || user.role !== 'garage');
        setUsers(fallbackUsers);
        setError(`Lỗi khi lấy danh sách người dùng: ${err.message}. Đang sử dụng dữ liệu dự phòng.`);
      }
    };

    // Lấy danh sách garage từ API hoặc dữ liệu dự phòng
    const fetchGarages = async () => {
      try {
        console.log('Đang lấy danh sách garage từ API[](http://localhost:9999/Garages)...');
        const fetchedGarages = await fetchWithRetry('http://localhost:9999/Garages', {
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000),
        });
        console.log('Dữ liệu API (Garages):', fetchedGarages);

        if (!Array.isArray(fetchedGarages)) {
          throw new Error('Dữ liệu API không phải là mảng');
        }

        if (fetchedGarages.length === 0) {
          console.warn('Không tìm thấy garage trong API. Sử dụng dữ liệu dự phòng.');
          setGarages(data.Garages);
          setError(prev => prev ? `${prev} Không tìm thấy garage trong API. Đang sử dụng dữ liệu dự phòng.` : 'Không tìm thấy garage trong API. Đang sử dụng dữ liệu dự phòng.');
        } else {
          setGarages(fetchedGarages);
          setError('');
        }
      } catch (err) {
        console.error('Lỗi khi lấy garage:', err);
        setGarages(data.Garages);
        setError(prev => prev ? `${prev} Lỗi khi lấy danh sách garage: ${err.message}. Đang sử dụng dữ liệu dự phòng.` : `Lỗi khi lấy danh sách garage: ${err.message}. Đang sử dụng dữ liệu dự phòng.`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchGarages();
  }, []);

  // Xử lý xóa người dùng
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      console.log(`Đang xóa người dùng với ID: ${userId}`);
      const response = await fetch(`http://localhost:9999/Users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Không thể xóa người dùng: ${response.status} ${response.statusText}`);
      }
      setUsers(users.filter(user => user.id !== userId));
      console.log(`Người dùng ${userId} đã được xóa thành công.`);
      setError('');
      alert('Xóa người dùng thành công.');
    } catch (err) {
      console.error('Lỗi khi xóa người dùng:', err);
      setError(`Lỗi khi xóa người dùng: ${err.message}`);
    }
  };

  // Xử lý xóa garage
  const handleDeleteGarage = async (garageId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa garage này?')) return;

    try {
      console.log(`Đang xóa garage với ID: ${garageId}`);
      const response = await fetch(`http://localhost:9999/Garages/${garageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Không thể xóa garage: ${response.status} ${response.statusText}`);
      }
      setGarages(garages.filter(garage => garage.id !== garageId));
      console.log(`Garage ${garageId} đã được xóa thành công.`);
      setError('');
      alert('Xóa garage thành công.');
    } catch (err) {
      console.error('Lỗi khi xóa garage:', err);
      setError(`Lỗi khi xóa garage: ${err.message}`);
    }
  };

  // Xử lý xem chi tiết người dùng
  const handleViewUserDetails = (user) => {
    console.log('Xem chi tiết người dùng:', user);
    setSelectedUser(user);
    setSelectedGarage(null);
    setShowDetailsModal(true);
  };

  // Xử lý xem chi tiết garage
  const handleViewGarageDetails = (garage) => {
    console.log('Xem chi tiết garage:', garage);
    setSelectedGarage(garage);
    setSelectedUser(null);
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
              <NavBS.Link
                active={activeTab === 'users'}
                onClick={() => setActiveTab('users')}
                className="mb-2"
              >
                Danh sách người dùng
              </NavBS.Link>
              <NavBS.Link
                active={activeTab === 'garages'}
                onClick={() => setActiveTab('garages')}
              >
                Danh sách garage
              </NavBS.Link>
            </NavBS>
          </Col>

          {/* Nội dung chính */}
          <Col md={10}>
            <h2>Chào mừng, Quản trị viên!</h2>
            <p>Quản lý người dùng, garage, đặt lịch và phản hồi tại đây.</p>

            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
                <span className="ms-2">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <>
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
                                <Button
                                  variant="info"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleViewUserDetails(user)}
                                >
                                  Xem chi tiết
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
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
                                <Button
                                  variant="info"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleViewGarageDetails(garage)}
                                >
                                  Xem chi tiết
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteGarage(garage.id)}
                                >
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
              </>
            )}

            {/* Modal chi tiết người dùng hoặc garage */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedUser ? 'Chi tiết người dùng' : 'Chi tiết garage'}</Modal.Title>
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