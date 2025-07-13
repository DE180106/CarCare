import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Table, Alert, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    console.log("Stored user from localStorage:", storedUser);
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    } else {
      setError("Bạn cần đăng nhập để xem lịch sử đặt lịch.");
      setLoading(false);
    }
  }, []);

  // Lấy danh sách bookings từ API
  useEffect(() => {
    if (loggedInUser) {
      const fetchBookings = async () => {
        try {
          setLoading(true);
          console.log("Fetching bookings for userId:", loggedInUser.id);
          const response = await axios.get("http://localhost:9999/Bookings", {
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
          });
          console.log("API response:", response.data);
          const userBookings = response.data.filter(
            (booking) => booking.userId === loggedInUser.id
          );
          console.log("Filtered bookings:", userBookings);
          setBookings(userBookings);
          setLoading(false);
        } catch (err) {
          console.error("Lỗi khi lấy danh sách đặt lịch:", err);
          setError("Không thể tải dữ liệu đặt lịch. Vui lòng thử lại sau. Chi tiết: " + err.message);
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [loggedInUser]);

  // Hàm hiển thị màu sắc cho trạng thái
  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "text-success";
      case "pending":
        return "text-warning";
      case "cancelled":
        return "text-danger";
      default:
        return "";
    }
  };

  // Hàm chuyển trạng thái sang tiếng Việt
  const translateStatus = (status) => {
    switch (status) {
      case "completed":
        return "Đã hoàn thành";
      case "pending":
        return "Đang chờ";
      case "cancelled":
        return "Đã huỷ";
      default:
        return status;
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            <i className="bi bi-car-front-fill me-2"></i>
            CarCare
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Trang chủ
              </Nav.Link>
              <Nav.Link as={Link} to="/services">
                Dịch vụ
              </Nav.Link>
              <Nav.Link as={Link} to="/garages">
                Garage
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                Giới thiệu
              </Nav.Link>
              <Nav.Link as={Link} to="/contact">
                Liên hệ
              </Nav.Link>
              <Nav.Link as={Link} to="/booking">
                Đặt lịch
              </Nav.Link>
              <Nav.Link as={Link} to="/booking/history" active>
                Lịch sử đặt lịch
              </Nav.Link>
              {loggedInUser ? (
                <>
                  <Nav.Link disabled className="text-light">
                    <i className="bi bi-person-circle me-1"></i>
                    {loggedInUser.fullName}
                  </Nav.Link>
                  <Button
                    variant="outline-light"
                    className="ms-2"
                    onClick={() => {
                      localStorage.removeItem("loggedInUser");
                      window.location.reload();
                    }}
                  >
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline-light"
                    className="ms-2"
                    as={Link}
                    to="/login"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    variant="primary"
                    className="ms-2"
                    as={Link}
                    to="/register"
                  >
                    Đăng ký
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="py-5">
        <h2 className="text-center mb-4 fw-bold">Lịch sử đặt lịch</h2>

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        {loading ? (
          <p className="text-center">Đang tải dữ liệu...</p>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Mã đặt lịch</th>
                  <th>Dịch vụ</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{booking.id}</td>
                      <td>{booking.serviceType}</td>
                      <td>
                        {new Date(booking.date).toLocaleDateString("vi-VN")} {booking.time}
                      </td>
                      <td className={getStatusClass(booking.status)}>
                        {translateStatus(booking.status)}
                      </td>
                      <td>{booking.note || "Không có"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Bạn chưa có lịch đặt nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row>
            <Col md={4}>
              <h5 className="fw-bold mb-3">CarCare</h5>
              <p>
                Kết nối chủ xe với các garage uy tín. Dịch vụ đặt lịch nhanh
                chóng, tiện lợi.
              </p>
            </Col>
            <Col md={2}>
              <h6 className="fw-bold">Liên kết</h6>
              <ul className="list-unstyled">
                <li>
                  <Link to="/" className="text-white text-decoration-none">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-white text-decoration-none"
                  >
                    Dịch vụ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/garages"
                    className="text-white text-decoration-none"
                  >
                    Garage
                  </Link>
                </li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="fw-bold">Điều khoản</h6>
              <ul className="list-unstyled">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-white text-decoration-none"
                  >
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-use"
                    className="text-white text-decoration-none"
                  >
                    Điều khoản sử dụng
                  </Link>
                </li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="fw-bold">Liên hệ</h6>
              <ul className="list-unstyled">
                <li>
                  <i className="bi bi-envelope me-2"></i> contact@carcare.vn
                </li>
                <li>
                  <i className="bi bi-telephone me-2"></i> 0900 123 456
                </li>
                <li>
                  <i className="bi bi-geo-alt me-2"></i> TP.Hà Nội
                </li>
              </ul>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="text-center">
            <small>
              © 2025 CarCare. Bản quyền thuộc về công ty TNHH CarCare.
            </small>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default BookingHistory;