import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Row, Col, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import LoginBackground from "../../assets/images/loginbackground.jpg";
import SigninIcon from "../../assets/images/signupIcon.png";
import { hosturl } from "../libs/Constant";

const SignUpPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
const [formMessage, setFormMessage] = useState(null);
const [messageType, setMessageType] = useState(null); // 'success' | 'error'
const [form] = Form.useForm();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

const onFinish = async (values) => {
  const vendorDetails = {
    name: values.fullname,
    email: values.email,
    phoneNumber: values.phonenumber,
    businessName: values.businessname,
    password: values.password,
  };

  try {
    const response = await axios.post(`${hosturl}/vendor`, vendorDetails, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201 && response.data.status) {
      setFormMessage("Account created successfully! Redirecting to login in 5 seconds...");
      setMessageType("success");

      form.resetFields(); // ✅ Reset the form here

      setTimeout(() => {
        navigate('/',{replace:true});
      }, 5000);
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      setFormMessage(error.response.data.displayMessage||"Invalid input. Please check your details.");
    } else {
      setFormMessage(error.response.data.displayMessage);
    }
    setMessageType("error");
    console.error("Sign-up error:", error);
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
      {/* Sign-Up Form */}
      <div
        style={{
          flex: isMobile ? "none" : "7",
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
          <Form name="signup" layout="vertical" onFinish={onFinish}   form={form}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={<label style={{ color: "white" }}>Full Name:</label>}
                  name="fullname"
                  rules={[{ required: true, message: "Please enter your full name!" }]}
                >
                  <Input placeholder="Enter your full name" style={{ height: 40, fontSize: 15 }} />
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
                  <Input placeholder="Enter your phone number" maxlength={10} style={{ height: 40, fontSize: 15 }} />
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
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ height: 40, fontSize: 15 }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
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
                        {formMessage && (
  <div
    style={{
      marginBottom: 16,
      padding: 12,
      backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
      color: messageType === "success" ? "#155724" : "#721c24",
      border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
      borderRadius: 4,
    }}
  >
    {formMessage}
  </div>
)}

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

      {/* Illustration Section */}
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
            width: "100%",
            maxWidth: "700px",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
