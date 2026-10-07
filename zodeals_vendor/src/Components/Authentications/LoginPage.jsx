import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginBackground from "../../assets/images/loginbackground.jpg";
import SigninIcon from "../../assets/images/signinIcon.png";
import { hosturl } from "../libs/Constant";
import { ToastContainer, toast } from 'react-toastify';

const LoginForm = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();
    const location = useLocation();
    const [redirectMessage, setRedirectMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const messageFromRedirect = location.state?.message;

        if (messageFromRedirect) {
            setRedirectMessage(messageFromRedirect);
            toast.error(messageFromRedirect);

            const timer = setTimeout(() => {
                setRedirectMessage(null);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const onFinish = async (values) => {
        try {
            setErrorMessage("");
            const payload = {
                email: values.email,
                password: values.password,
                role: "vendor",
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
                localStorage.setItem("is_store_created", JSON.stringify(data.result.is_store_created));
                localStorage.setItem("is_first_time_user", JSON.stringify(data.result.is_first_time_user));
                navigate("/dashboard");
            } else {
                setErrorMessage(data.displayMessage || "Invalid email or password");
            }
        } catch (error) {
            setErrorMessage(error?.response.data?.displayMessage||"Something went wrong. Please try again.");
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
            <div
                style={{
                    flex: isMobile ? "none" : "7",
                    backgroundColor: "#003366",
                    backgroundImage: `url(${LoginBackground})`,
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
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        padding: 20,
                        width: isMobile ? "100%" : 400,
                        maxWidth: 400,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "white",
                        borderRadius: 10,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    }}
                >
                    {redirectMessage && (
                        <div style={{
                            color: 'white',
                            backgroundColor: 'red',
                            padding: '10px',
                            borderRadius: '5px',
                            textAlign: 'center',
                            marginBottom: '20px'
                        }}>
                            {redirectMessage}
                        </div>
                    )}

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

                        <Form.Item style={{ textAlign: "center", marginTop: 10 }}>
                            <span style={{ color: "white" }}>
                                Don’t have an account?{" "}
                                <Link to="/signup" style={{ color: "#ffc107", fontWeight: "bold" }}>
                                    Sign up
                                </Link>
                            </span>
                        </Form.Item>
                    </Form>
                </Card>
            </div>

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
            <ToastContainer position="top-center" />
        </div>
    );
};

export default LoginForm;