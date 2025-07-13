import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from './data.json'; // Nhập data.json làm dữ liệu dự phòng

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("loggedInUser"));
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking'); // Trạng thái API: checking, online, offline

  // API endpoint (có thể thay đổi nếu cổng khác 9999)
  const API_BASE_URL = 'http://localhost:9999';

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

  // Kiểm tra trạng thái API
  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Users`, {
        method: 'HEAD', // Chỉ kiểm tra kết nối
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        setApiStatus('online');
        console.log('API đang hoạt động.');
      } else {
        setApiStatus('offline');
        console.warn('API không hoạt động:', response.status, response.statusText);
      }
    } catch (err) {
      setApiStatus('offline');
      console.error('Lỗi khi kiểm tra API:', err);
    }
  };

  // Lấy danh sách người dùng từ API hoặc dùng dữ liệu dự phòng
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log(`Đang lấy danh sách người dùng từ API (${API_BASE_URL}/Users)...`);
      const fetchedUsers = await fetchWithRetry(`${API_BASE_URL}/Users`, {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000), // Thời gian chờ 10 giây
      });
      console.log('Dữ liệu API:', fetchedUsers);

      // Đảm bảo dữ liệu trả về là mảng
      if (!Array.isArray(fetchedUsers)) {
        throw new Error('Dữ liệu API không phải là mảng');
      }

      // Lọc bỏ tài khoản garage (role: "garage")
      const filteredUsers = fetchedUsers.filter(user => !user.role || user.role !== 'garage');
      console.log('Danh sách người dùng sau khi lọc:', filteredUsers);

      if (filteredUsers.length === 0) {
        console.warn('Không tìm thấy người dùng thường trong API. Sử dụng dữ liệu dự phòng.');
        const fallbackUsers = data.Users.filter(user => !user.role || user.role !== 'garage');
        setUsers(fallbackUsers);
        setError('Không tìm thấy người dùng trong API. Đang sử dụng dữ liệu dự phòng. Vui lòng kiểm tra server JSON tại http://localhost:9999.');
        setApiStatus('offline');
      } else {
        setUsers(filteredUsers);
        setError('');
        setApiStatus('online');
      }
    } catch (err) {
      console.error('Lỗi khi lấy người dùng:', err);
      const fallbackUsers = data.Users.filter(user => !user.role || user.role !== 'garage');
      setUsers(fallbackUsers);
      setError(`Lỗi khi lấy danh sách người dùng: ${err.message}. Đang sử dụng dữ liệu dự phòng. Vui lòng đảm bảo server JSON đang chạy tại ${API_BASE_URL}.`);
      setApiStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
    fetchUsers();
  }, []);

  // Xử lý xóa người dùng
  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      console.log(`Đang xóa người dùng với ID: ${userId}`);
      const response = await fetch(`${API_BASE_URL}/Users/${userId}`, {
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

  // Xử lý xem chi tiết người dùng
  const handleViewDetails = (user) => {
    console.log('Xem chi tiết người dùng:', user);
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    console.log('Đăng xuất admin...');
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  // Thử lại API
  const handleRetryApi = () => {
    setError('');
    setApiStatus('checking');
    fetchUsers();
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

      <Container className="mt-5">
        <h2>Chào mừng, Quản trị viên!</h2>
        <p>Quản lý người dùng, garage, đặt lịch và phản hồi tại đây.</p>

        <div className="mb-3">
          <strong>Trạng thái API: </strong>
          {apiStatus === 'checking' && <span>Đang kiểm tra...</span>}
          {apiStatus === 'online' && <span className="text-success">Đang hoạt động</span>}
          {apiStatus === 'offline' && (
            <span className="text-danger">
              Không hoạt động{' '}
              <Button variant="link" size="sm" onClick={handleRetryApi}>
                Thử lại
              </Button>
            </span>
          )}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <span className="ms-2">Đang tải danh sách người dùng...</span>
          </div>
        ) : (
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
                          onClick={() => handleViewDetails(user)}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
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

        {/* Modal chi tiết người dùng */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết người dùng</Modal.Title>
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
            ) : (
              <p>Không có người dùng được chọn.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default AdminDashboard;