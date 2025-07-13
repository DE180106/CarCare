import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    productModel: "",
    vehicleKm: "",
    licensePlate: "",
    services: [],
    note: "",
    garageId: "",
    scheduleDate: "",
    scheduleTime: "",
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [carModels, setCarModels] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [availableGarages, setAvailableGarages] = useState([]);
  const [allGarages, setAllGarages] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [users, setUsers] = useState([]);

  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Bắt đầu tải dữ liệu ban đầu...");
        const usersResponse = await fetch("http://localhost:9999/Users", {
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(5000),
        });
        if (!usersResponse.ok) {
          console.error(
            "Lỗi khi lấy Users:",
            usersResponse.status,
            usersResponse.statusText
          );
          throw new Error(
            `Lỗi khi lấy dữ liệu Users: ${usersResponse.status} ${usersResponse.statusText}`
          );
        }
        const usersData = await usersResponse.json();
        console.log("Dữ liệu Users:", usersData);
        setUsers(usersData);
        const models = [
          ...new Set(
            usersData
              .filter((user) => user.car && user.car.make && user.car.model)
              .map((user) => `${user.car.make} ${user.car.model}`)
          ),
        ];
        setCarModels(models.length > 0 ? models : ["Không có mẫu xe nào"]);
        console.log("Danh sách mẫu xe:", models);

        const garagesResponse = await fetch("http://localhost:9999/Garages", {
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(5000),
        });
        if (!garagesResponse.ok) {
          console.error(
            "Lỗi khi lấy Garages:",
            garagesResponse.status,
            garagesResponse.statusText
          );
          throw new Error(
            `Lỗi khi lấy dữ liệu Garages: ${garagesResponse.status} ${garagesResponse.statusText}`
          );
        }
        const garagesData = await garagesResponse.json();
        console.log("Dữ liệu Garages:", garagesData);
        setAllGarages(garagesData);
        setAvailableGarages(garagesData);
        const servicesSet = new Set();
        garagesData.forEach((garage) => {
          if (garage.services) {
            garage.services.forEach((service) => servicesSet.add(service));
          }
        });
        setAllServices([...servicesSet]);
        console.log("Danh sách dịch vụ:", [...servicesSet]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", error);
        setStatusMessage("Lỗi khi tải dữ liệu ban đầu: " + error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lookupUser = () => {
      if (
        formData.fullName.trim() &&
        formData.phone.trim() &&
        users.length > 0
      ) {
        console.log(
          "Tìm kiếm người dùng với:",
          formData.fullName,
          formData.phone
        );
        const user = users.find(
          (u) => u.fullName === formData.fullName && u.phone === formData.phone
        );
        if (user) {
          console.log("Tìm thấy người dùng:", user);
          setFormData((prev) => ({
            ...prev,
            email: user.email || "",
            productModel:
              user.car && user.car.make && user.car.model
                ? `${user.car.make} ${user.car.model}`
                : "",
            licensePlate:
              user.car && user.car.licensePlate ? user.car.licensePlate : "",
          }));
          setErrors((prev) => ({
            ...prev,
            email: undefined,
            productModel: undefined,
            licensePlate: undefined,
          }));
          setStatusMessage("");
        } else {
          console.log("Không tìm thấy người dùng");
          setFormData((prev) => ({
            ...prev,
            email: "",
            productModel: "",
            licensePlate: "",
          }));
          setStatusMessage(
            "Không tìm thấy thông tin người dùng. Vui lòng nhập đầy đủ thông tin thủ công."
          );
        }
      } else {
        setStatusMessage("");
      }
    };
    lookupUser();
  }, [formData.fullName, formData.phone, users]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (type === "checkbox") {
        const services = checked
          ? [...prev.services, value]
          : prev.services.filter((s) => s !== value);
        return { ...prev, services };
      }
      return { ...prev, [name]: value };
    });

    validateField(
      name,
      type === "checkbox"
        ? checked
          ? [...formData.services, value]
          : formData.services.filter((s) => s !== value)
        : value
    );
    console.log("Dữ liệu form sau khi thay đổi:", formData);
    console.log("Lỗi sau khi thay đổi:", errors);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fullName":
        if (!value.trim()) newErrors.fullName = "Họ tên là bắt buộc.";
        else if (value.length > 80)
          newErrors.fullName = "Họ tên không được vượt quá 80 ký tự.";
        else delete newErrors.fullName;
        break;
      case "phone":
        if (!value.trim()) newErrors.phone = "Số điện thoại là bắt buộc.";
        else if (!/^\d{10}$/.test(value))
          newErrors.phone = "Số điện thoại phải là 10 chữ số.";
        else delete newErrors.phone;
        break;
      case "email":
        if (!value.trim()) newErrors.email = "Email là bắt buộc.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = "Email không hợp lệ.";
        else delete newErrors.email;
        break;
      case "productModel":
        if (!value) newErrors.productModel = "Mẫu xe là bắt buộc.";
        else delete newErrors.productModel;
        break;
      case "licensePlate":
        if (!value.trim()) newErrors.licensePlate = "Biển số xe là bắt buộc.";
        else if (!/^[A-Za-z0-9-.]{5,10}$/.test(value))
          newErrors.licensePlate =
            "Biển số xe không hợp lệ (chỉ chấp nhận chữ, số, dấu gạch ngang và dấu chấm).";
        else delete newErrors.licensePlate;
        break;
      case "services":
        if (value.length === 0)
          newErrors.services = "Vui lòng chọn ít nhất một dịch vụ.";
        else delete newErrors.services;
        break;
      case "garageId":
        if (!value) newErrors.garageId = "Gara là bắt buộc.";
        else delete newErrors.garageId;
        break;
      case "scheduleDate":
        if (!value) newErrors.scheduleDate = "Ngày là bắt buộc.";
        else if (
          new Date(value) < new Date(new Date().toISOString().split("T")[0])
        )
          newErrors.scheduleDate = "Ngày phải từ hôm nay trở đi.";
        else delete newErrors.scheduleDate;
        break;
      case "scheduleTime":
        if (!value) newErrors.scheduleTime = "Giờ là bắt buộc.";
        else delete newErrors.scheduleTime;
        break;
      default:
        break;
    }

    console.log(`Validate trường ${name}:`, value, "Lỗi mới:", newErrors);
    setErrors(newErrors);
  };

  useEffect(() => {
    if (formData.services.length > 0) {
      const filteredGarages = allGarages.filter((garage) =>
        formData.services.every(
          (service) => garage.services && garage.services.includes(service)
        )
      );
      setAvailableGarages(filteredGarages);
      console.log("Danh sách garage sau khi lọc:", filteredGarages);
    } else {
      setAvailableGarages(allGarages);
      console.log("Đặt lại danh sách garage:", allGarages);
    }
  }, [formData.services, allGarages]);

  useEffect(() => {
    if (formData.garageId && formData.scheduleDate) {
      const selectedGarage = allGarages.find((g) => g.id === formData.garageId);
      if (selectedGarage) {
        setAvailableTimes(selectedGarage.availableSlots || []);
        console.log("Khung giờ khả dụng:", selectedGarage.availableSlots);
      } else {
        setAvailableTimes([]);
        console.log("Không tìm thấy garage với ID:", formData.garageId);
      }
    }
  }, [formData.garageId, formData.scheduleDate, allGarages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    console.log("Form được gửi với dữ liệu:", formData);

    try {
      const newErrors = {};
      const requiredFields = [
        "fullName",
        "phone",
        "email",
        "productModel",
        "licensePlate",
        "services",
        "garageId",
        "scheduleDate",
        "scheduleTime",
      ];
      requiredFields.forEach((field) => {
        validateField(field, formData[field]);
        if (errors[field]) newErrors[field] = errors[field];
      });
      setErrors(newErrors);
      console.log("Lỗi validate:", newErrors);
      if (Object.keys(newErrors).length > 0) {
        console.log("Validate form thất bại, lỗi:", newErrors);
        setStatusMessage("Vui lòng kiểm tra lại các trường thông tin.");
        return;
      }

      console.log("Tìm userId từ Users...");
      const user = users.find(
        (u) => u.fullName === formData.fullName && u.phone === formData.phone
      );
      if (!user) {
        console.log(
          "Không tìm thấy người dùng với fullName:",
          formData.fullName,
          "và phone:",
          formData.phone
        );
        setStatusMessage(
          "Không tìm thấy người dùng. Vui lòng kiểm tra họ tên và số điện thoại."
        );
        return;
      }
      console.log("Tìm thấy userId:", user.id);

      console.log("Kiểm tra ID booking cuối cùng...");
      const bookingsResponse = await fetch("http://localhost:9999/Bookings", {
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      });
      if (!bookingsResponse.ok) {
        console.error(
          "Lỗi khi lấy Bookings:",
          bookingsResponse.status,
          bookingsResponse.statusText
        );
        throw new Error(
          `Lỗi khi lấy dữ liệu Bookings: ${bookingsResponse.status} ${bookingsResponse.statusText}`
        );
      }
      const bookings = await bookingsResponse.json();
      console.log("Danh sách Bookings:", bookings);

      let newBookingId = "b1";
      if (bookings.length > 0) {
        const lastBookingId = bookings[bookings.length - 1].id;
        const lastNumber = parseInt(lastBookingId.replace("b", ""), 10);
        newBookingId = `b${lastNumber + 1}`;
      }

      console.log("ID booking mới:", newBookingId);

      console.log("Kiểm tra lịch trùng lặp...");
      const isDuplicate = bookings.some(
        (booking) =>
          booking.garageId === formData.garageId &&
          booking.date === new Date(formData.scheduleDate).toISOString() &&
          booking.time === formData.scheduleTime
      );
      if (isDuplicate) {
        console.log(
          "Tìm thấy lịch trùng:",
          formData.garageId,
          formData.scheduleDate,
          formData.scheduleTime
        );
        setStatusMessage("Khung giờ này đã được đặt. Vui lòng chọn giờ khác.");
        return;
      }

      const booking = {
        id: newBookingId,
        userId: user.id,
        garageId: formData.garageId,
        date: new Date(formData.scheduleDate).toISOString(),
        time: formData.scheduleTime,
        serviceType: formData.services.join(", "),
        status: "pending",
        note: formData.note || "",
      };
      console.log("Gửi yêu cầu POST với booking:", booking);

      const response = await fetch("http://localhost:9999/Bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.error(
          "Lỗi khi tạo booking:",
          response.status,
          response.statusText
        );
        throw new Error(
          `Lỗi khi tạo booking: ${response.status} ${response.statusText}`
        );
      }

      const newBooking = await response.json();
      console.log("Tạo booking thành công:", newBooking);

      setStatusMessage("Đặt lịch thành công!");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        productModel: "",
        vehicleKm: "",
        licensePlate: "",
        services: [],
        note: "",
        garageId: "",
        scheduleDate: "",
        scheduleTime: "",
      });
      setErrors({});

      if (window.bootstrap && window.bootstrap.Modal) {
        const modalElement = document.getElementById(
          "schedule-maintenance-popup"
        );
        if (modalElement) {
          const modal = new window.bootstrap.Modal(modalElement);
          modal.show();
        }
      } else {
        alert("Đặt lịch thành công!");
      }
    } catch (error) {
      console.error("Lỗi không xác định trong handleSubmit:", error);
      setStatusMessage("Lỗi khi gửi yêu cầu: " + error.message);
    }
  };

  return (
    <div>
      {/* Header */}
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
      <div className="dat-lich-bao-duong py-5">
        <Container>
          <h2 className="text-center mb-4">Đặt Lịch Dịch Vụ</h2>
          {statusMessage && (
            <div
              className={`alert ${
                statusMessage.includes("thành công")
                  ? "alert-success"
                  : "alert-danger"
              } text-center mb-4`}
              role="alert"
            >
              {statusMessage}
            </div>
          )}
          <form className="schedule-maintenance-form" onSubmit={handleSubmit}>
            <Row>
              {/* Customer Information */}
              <Col lg={6} xs={12} className="mb-4">
                <h5 className="mb-3">
                  <span className="badge bg-primary me-2">1</span>Thông tin
                  khách hàng
                </h5>
                <div className="form-group mb-3">
                  <label htmlFor="fullName">
                    Họ tên <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.fullName ? "is-invalid" : ""
                      }`}
                      maxLength="80"
                      placeholder="Nhập họ và tên"
                      required
                    />
                    <span className="input-group-text">
                      {formData.fullName.length}/80
                    </span>
                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="phone">
                    Số điện thoại <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    maxLength="10"
                    placeholder="Nhập số điện thoại (10 số)"
                    required
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    maxLength="80"
                    placeholder="vidu@gmail.com"
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </Col>

              <Col lg={6} xs={12} className="mb-4">
                <h5 className="mb-3">
                  <span className="badge bg-primary me-2">2</span>Thông tin xe
                </h5>
                <div className="form-group mb-3">
                  <label htmlFor="productModel">
                    Mẫu xe <span className="text-danger">*</span>
                  </label>
                  <select
                    name="productModel"
                    id="productModel"
                    value={formData.productModel}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.productModel ? "is-invalid" : ""
                    }`}
                    required
                  >
                    <option value="">Chọn mẫu xe</option>
                    {carModels.map((model, idx) => (
                      <option key={idx} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  {errors.productModel && (
                    <div className="invalid-feedback">
                      {errors.productModel}
                    </div>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="vehicleKm">Số Km</label>
                  <input
                    type="text"
                    id="vehicleKm"
                    name="vehicleKm"
                    value={formData.vehicleKm}
                    onChange={handleChange}
                    className="form-control"
                    maxLength="10"
                    placeholder="Nhập số km"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="licensePlate">
                    Biển số xe <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.licensePlate ? "is-invalid" : ""
                    }`}
                    maxLength="10"
                    placeholder="Nhập biển số xe"
                    required
                  />
                  {errors.licensePlate && (
                    <div className="invalid-feedback">
                      {errors.licensePlate}
                    </div>
                  )}
                </div>
              </Col>

              <Col lg={6} xs={12} className="mb-4">
                <h5 className="mb-3">
                  <span className="badge bg-primary me-2">3</span>Dịch vụ
                </h5>
                <div className="form-group mb-3">
                  <label>
                    Dịch vụ <span className="text-danger">*</span>
                  </label>
                  <div className="border p-3 rounded">
                    {allServices.map((service, idx) => (
                      <div className="form-check" key={idx}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="services"
                          id={`service_${idx}`}
                          value={service}
                          onChange={handleChange}
                          checked={formData.services.includes(service)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`service_${idx}`}
                        >
                          {service}
                        </label>
                      </div>
                    ))}
                    {errors.services && (
                      <div className="text-danger mt-2">{errors.services}</div>
                    )}
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="note">Ghi chú</label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    className="form-control"
                    maxLength="255"
                    placeholder="Nhập ghi chú (nếu có)"
                    rows="3"
                  />
                </div>
              </Col>

              <Col lg={6} xs={12} className="mb-4">
                <h5 className="mb-3">
                  <span className="badge bg-primary me-2">4</span>Địa điểm và
                  Thời gian
                </h5>
                <div className="form-group mb-3">
                  <label htmlFor="garageId">
                    Gara <span className="text-danger">*</span>
                  </label>
                  <select
                    name="garageId"
                    id="garageId"
                    value={formData.garageId}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.garageId ? "is-invalid" : ""
                    }`}
                    required
                    disabled={formData.services.length === 0}
                  >
                    <option value="">Chọn gara</option>
                    {availableGarages
                      .filter((g) => g.status === "open")
                      .map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} - {g.address}
                        </option>
                      ))}
                  </select>
                  {errors.garageId && (
                    <div className="invalid-feedback">{errors.garageId}</div>
                  )}

                  {formData.services.length > 0 &&
                    availableGarages.length === 0 && (
                      <div className="text-danger mt-2">
                        Không có gara nào đáp ứng tất cả dịch vụ đã chọn. Vui
                        lòng chọn ít dịch vụ hơn hoặc thử lại sau.
                      </div>
                    )}
                </div>
                <div className="form-group mb-3">
                  <label>
                    Thời gian <span className="text-danger">*</span>
                  </label>
                  <Row>
                    <Col xs={6}>
                      <input
                        type="date"
                        id="scheduleDate"
                        name="scheduleDate"
                        value={formData.scheduleDate}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.scheduleDate ? "is-invalid" : ""
                        }`}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                      {errors.scheduleDate && (
                        <div className="invalid-feedback">
                          {errors.scheduleDate}
                        </div>
                      )}
                    </Col>
                    <Col xs={6}>
                      <select
                        id="scheduleTime"
                        name="scheduleTime"
                        value={formData.scheduleTime}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.scheduleTime ? "is-invalid" : ""
                        }`}
                        required
                        disabled={!formData.garageId || !formData.scheduleDate}
                      >
                        <option value="">Chọn giờ</option>
                        {availableTimes.map((time, idx) => (
                          <option key={idx} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {(!formData.garageId || !formData.scheduleDate) && (
                        <div className="text-muted mt-1">
                          Vui lòng chọn gara và ngày trước để hiển thị giờ.
                        </div>
                      )}

                      {errors.scheduleTime && (
                        <div className="invalid-feedback">
                          {errors.scheduleTime}
                        </div>
                      )}
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col xs={12} className="text-center">
                <button type="submit" className="btn btn-primary">
                  Gửi yêu cầu
                </button>
              </Col>
            </Row>
          </form>
        </Container>
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

export default BookingForm;
