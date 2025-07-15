import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navbar, Container, Nav, Button, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const API_ENDPOINTS = {
  garages: "http://localhost:9999/Garages",
};

const fetchData = async (url) => {
  const token = sessionStorage.getItem("authToken");
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return { error: "Không thể tải dữ liệu gara. Vui lòng thử lại sau." };
  }
};

const StoreSystem = () => {
  const [garages, setGarages] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const location = useLocation();
  const [userPosition, setUserPosition] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const userIcon = new L.Icon({
    iconUrl: "/car-icon.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchData(API_ENDPOINTS.garages);
      if (data.error) {
        setError(data.error);
      } else {
        setGarages(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Không thể lấy vị trí người dùng:", error);
      }
    );
  }

  useEffect(() => {
    if (
      !loading &&
      garages.length > 0 &&
      !mapInstanceRef.current &&
      mapRef.current
    ) {
      const avgLat =
        garages.reduce((sum, g) => sum + parseFloat(g.latitude), 0) /
        garages.length;
      const avgLng =
        garages.reduce((sum, g) => sum + parseFloat(g.longitude), 0) /
        garages.length;

      mapInstanceRef.current = L.map(mapRef.current, {
        scrollWheelZoom: false,
      }).setView([avgLat, avgLng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      const layerGroup = L.layerGroup().addTo(mapInstanceRef.current);
      garages.forEach((garage) => {
        if (garage.latitude && garage.longitude) {
          L.marker(
            [parseFloat(garage.latitude), parseFloat(garage.longitude)],
            {
              icon: L.icon({
                iconUrl:
                  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              }),
            }
          )
            .addTo(layerGroup)
            .bindPopup(
              `
              <div style="padding: 4px;">
                <strong>${garage.name}</strong><br/>
                ${garage.address}<br/>
                Đánh giá: ${garage.rating} ⭐
              </div>
            `
            )
            .on("click", () => setSelectedShop(garage));
        }
      });
      if (userPosition) {
        L.marker([userPosition.lat, userPosition.lng], { icon: userIcon })
          .addTo(layerGroup)
          .bindPopup("Vị trí của bạn");
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, garages]);

  useEffect(() => {
    if (mapInstanceRef.current && selectedShop) {
      const lat = parseFloat(selectedShop.latitude);
      const lng = parseFloat(selectedShop.longitude);

      mapInstanceRef.current.setView([lat, lng], 15);
      L.marker([lat, lng], {
        icon: L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconSize: [30, 50],
          iconAnchor: [15, 50],
        }),
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `
          <div style="padding: 4px;">
            <strong>${selectedShop.name}</strong><br/>
            ${selectedShop.address}<br/>
            Đánh giá: ${selectedShop.rating} ⭐
          </div>
        `
        )
        .openPopup();
    }
  }, [selectedShop]);

  const handleShopSelect = (shop) => setSelectedShop(shop);

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
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-4">
            Hệ Thống Cửa Hàng
          </h1>

          {loading && <p className="text-center">Đang tải dữ liệu...</p>}
          {error && <p className="text-center text-danger">{error}</p>}

          <div className="row g-4">
            {/* Form chọn cửa hàng */}
            <div className="col-md-4 bg-white rounded shadow p-4">
              <h2 className="text-lg font-semibold mb-2">Tìm Cửa Hàng</h2>
              {userPosition && (
                <p className="text-center text-muted mb-3">
                  Vị trí của bạn: {userPosition.lat.toFixed(5)},{" "}
                  {userPosition.lng.toFixed(5)}
                </p>
              )}

              <label className="text-sm block mb-1">Chọn cửa hàng</label>
              <select
                className="form-select"
                onChange={(e) => {
                  const shop = garages.find((g) => g.name === e.target.value);
                  handleShopSelect(shop);
                }}
                value={selectedShop?.name || ""}
              >
                <option value="">Chọn cửa hàng</option>
                {garages
                  .filter((g) => g.status === "open")
                  .map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
              </select>
              {loggedInUser && selectedShop && (
                <Link
                  to={`/userschat/${selectedShop.id}`}
                  className="btn btn-success mt-3"
                >
                  <i className="bi bi-chat-dots me-1"></i> Nhắn tin với gara
                </Link>
              )}

              {selectedShop && (
                <div className="mt-4 text-sm">
                  <p>
                    <strong>Địa chỉ:</strong> {selectedShop.address}
                  </p>
                  <p>
                    <strong>Đánh giá:</strong> {selectedShop.rating} ⭐
                  </p>
                  {selectedShop.phone && (
                    <p>
                      <strong>Điện thoại:</strong> {selectedShop.phone}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bản đồ */}
            <div className="col-md-8">
              <div
                ref={mapRef}
                style={{ height: "400px", width: "100%" }}
                className="rounded shadow"
              ></div>
            </div>
          </div>
        </div>
      </div>

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

export default StoreSystem;
