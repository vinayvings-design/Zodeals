import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import LoginBackground from "../../assets/images/loginbackground.jpg";
import SigninIcon from "../../assets/images/signinIcon.png";
import { useNavigate } from "react-router-dom";
import { hosturl } from "../libs/Constant";

const LoginForm = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFinish = async (values) => {
    try {
      setErrorMessage("");

      const payload = {
        email: values.email,
        password: values.password,
        role: "admin",
      };

      const response = await fetch(`${hosturl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.result.token);
        localStorage.setItem("role", data.result.role);
        navigate("/dashboard");
      } else {
        setErrorMessage(data.displayMessage || "Invalid email or password");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        width: "100vw", margin: 0, padding: 0
      }}
    >
      {/* Login Form */}
      <div
        style={{
          flex: isMobile ? "none" : "7",
          backgroundColor: "#102E50",
          // backgroundImage: `url(${LoginBackground})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? 20 : 0,
        }}
      >
        <Card
          bordered={false}
          style={{
            backgroundColor: "transparent",
            padding: 10,
            width: isMobile ? "100%" : 400,
            maxWidth: 370,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
            borderRadius: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <Form name="login" layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<label style={{ color: "white" }}>Email address:</label>}
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input
                placeholder="Enter your email"
                style={{ height: 45, fontSize: 16 }}
              />
            </Form.Item>

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
                style={{ height: 45, fontSize: 16 }}
              />
            </Form.Item>

            <Form.Item>
              {errorMessage && (
                <Alert
                  message={errorMessage}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  height: 45,
                  backgroundColor: "#ffc107",
                  border: "none",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginTop: 10,
                }}
              >
                Submit
              </Button>
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
        }}
      >
        <img
          src={SigninIcon}
          alt="Sign In Illustration"
          style={{
            width: isMobile ? "100%" : "80%",
            maxWidth: "750px",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default LoginForm;
