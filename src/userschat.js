import React, { useState, useEffect } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Card,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";

function Contact() {
  const { garageId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [threadId, setThreadId] = useState(null);

  const [loggedInUser, setLoggedInUser] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!garageId || !loggedInUser) return; 
    const fetchChatThread = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:9999/ChatThreads");
        if (!response.ok) throw new Error("Failed to fetch chat threads");

        const data = await response.json();
        const thread = data.find(
          (t) =>
            t.participants.userId === loggedInUser.id &&
            t.participants.garageId === garageId
        );

        if (thread) {
          setThreadId(thread.id);
          setMessages(thread.messages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatThread();
  }, [garageId, loggedInUser]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      sender: "user",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      let updatedThread;
      if (threadId) {
        const response = await fetch(
          `http://localhost:9999/ChatThreads/${threadId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch existing thread");
        }
        const threadData = await response.json();
        updatedThread = {
          ...threadData,
          messages: [...threadData.messages, newMsg],
        };

        const updateResponse = await fetch(
          `http://localhost:9999/ChatThreads/${threadId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedThread),
          }
        );
        if (!updateResponse.ok) {
          throw new Error("Failed to update thread");
        }
      } else {
        const response = await fetch("http://localhost:9999/ChatThreads");
        if (!response.ok) {
          throw new Error("Failed to fetch existing threads");
        }
        const allThreads = await response.json();

        const maxId = allThreads.reduce((max, thread) => {
          const num = parseInt(thread.id.replace("c", ""), 10);
          return isNaN(num) ? max : Math.max(max, num);
        }, 0);

        const nextId = `c${maxId + 1}`;

        updatedThread = {
          id: nextId,
          participants: {
            userId: loggedInUser.id,
            garageId: garageId,
          },
          messages: [newMsg],
        };

        const createResponse = await fetch(
          "http://localhost:9999/ChatThreads",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedThread),
          }
        );
        if (!createResponse.ok) {
          throw new Error("Failed to create new thread");
        }

        const createdThread = await createResponse.json();
        setThreadId(createdThread.id);
      }

      setMessages(updatedThread.messages);
      setNewMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải chat...</div>;
  if (error)
    return <div className="text-danger text-center mt-5">Lỗi: {error}</div>;

  return (
    <>
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
                      navigate("/login"); 
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

      <Container className="my-5">
        <Card>
          <Card.Header as="h4">
            Chat với Garage {garageId} (User {loggedInUser?.id})
          </Card.Header>
          <Card.Body>
            <div
              style={{
                height: "400px",
                overflowY: "auto",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
              }}
            >
              {messages.length === 0 ? (
                <p className="text-muted text-center">
                  Chưa có tin nhắn nào. Bắt đầu chat ngay!
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex flex-column mb-3 ${
                      msg.sender === "user" ? "align-items-end" : "align-items-start"
                    }`}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "10px 15px",
                        borderRadius: "18px",
                        backgroundColor:
                          msg.sender === "user" ? "#007bff" : "#e9ecef",
                        color: msg.sender === "user" ? "white" : "black",
                      }}
                    >
                      <strong>
                        {msg.sender === "user" ? "Bạn" : "Garage"}:{" "}
                      </strong>
                      {msg.message}
                    </div>
                    <small className="text-muted mt-1">
                      {new Date(msg.timestamp).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          </Card.Body>
          <Card.Footer>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <InputGroup>
                <Form.Control
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                />
                <Button variant="primary" onClick={sendMessage}>
                  Gửi
                </Button>
              </InputGroup>
            </Form>
          </Card.Footer>
        </Card>
      </Container>

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
    </>
  );
}

export default Contact;
