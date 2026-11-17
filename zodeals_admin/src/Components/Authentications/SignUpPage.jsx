import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Row, Col, Alert } from "antd";
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import EyeTwoTone from '@ant-design/icons/EyeTwoTone';
import { Link, useNavigate } from "react-router-dom";
import { hosturl } from "../libs/Constant";
import LoginBackground from "../../assets/images/loginbackground.jpg";
import SigninIcon from "../../assets/images/signupIcon.png";

const SignUpPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Creates the one-and-only admin account. The server refuses if an admin already exists.
  const onFinish = async (values) => {
    setMsg({ type: "", text: "" });
    setLoading(true);
    try {
      const response = await fetch(`${hosturl}/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.fullname, email: values.email, password: values.password }),
      });
      let data = {};
      try { data = await response.json(); } catch (e) { data = {}; }
      if (response.ok) {
        setMsg({ type: "success", text: "Admin account created. Redirecting to login..." });
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMsg({ type: "error", text: data.displayMessage || "Could not create the admin account." });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Cannot reach the server right now. Please try again in a few minutes." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        width: "100vw",
        overflowX: "hidden",
        position: "relative",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Login Form */}
      <div
        style={{
          flex: isMobile ? "none" : "7",
          position: "relative",
          backgroundImage: `url(${LoginBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "20px" : "30px",
          minHeight: "100vh",
        }}
      >
        <Card
          bordered={false}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            width: "90%",
            maxWidth: 550,
            borderRadius: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            color: "white",
          }}
        >
          <Form name="signup" layout="vertical" onFinish={onFinish}>
            {msg.text ? <Alert type={msg.type} message={msg.text} showIcon style={{ marginBottom: 16 }} /> : null}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={<label style={{ color: "white" }}>Full Name:</label>}
                  name="fullname"
                  rules={[{ required: true, message: "Please enter your full name!" }]}
                >
                  <Input placeholder="Enter your fullname" style={{ height: 40, fontSize: 15 }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={<label style={{ color: "white" }}>Business Name:</label>}
                  name="businessname"
                  rules={[{ required: true, message: "Please enter your business name!" }]}
                >
                  <Input placeholder="Enter your business name" style={{ height: 40, fontSize: 15 }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={<label style={{ color: "white" }}>Email address:</label>}
                  name="email"
                  rules={[{ required: true, message: "Please enter your email!" }]}
                >
                  <Input placeholder="Enter your email" style={{ height: 40, fontSize: 15 }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={<label style={{ color: "white" }}>Phone Number:</label>}
                  name="phonenumber"
                  rules={[{ required: true, message: "Please enter your phone number!" }]}
                >
                  <Input placeholder="Enter your phone number" style={{ height: 40, fontSize: 15 }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<label style={{ color: "white" }}>Password:</label>}
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                style={{ height: 40, fontSize: 15 }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: "100%",
                  height: 40,
                  backgroundColor: "#ffc107",
                  border: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 15,
                  marginTop: 10,
                }}
              >
                Submit
              </Button>
            </Form.Item>

            <Form.Item style={{ textAlign: "center", marginTop: 10 }}>
              <span style={{ color: "white" }}>
                Already have an account?{" "}
                <Link to="/" style={{ color: "#ffc107", fontWeight: "bold" }}>
                  Login
                </Link>
              </span>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Illustration */}
      <div
        style={{
          flex: isMobile ? "none" : "5",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? 20 : 0,
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <img
          src={SigninIcon}
          alt="Sign In Illustration"
          style={{
            width: isMobile ? "100%" : "100%",
            maxWidth: "700px",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
