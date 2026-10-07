import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { hosturl } from "../libs/Constant";

const { Title } = Typography;

const AgentManager = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${hosturl}/admin/agents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAgents(res.data.result);
    } catch (err) {
      message.error("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (agent = null) => {
    setIsEditing(!!agent);
    setCurrentAgent(agent);
    form.setFieldsValue(
      agent || {
        name: "",
        email: "",
        phoneNumber: "",
        code: "",
        pan: "",
        address: "",
        city: "",
        pincode: "",
        upi: "",
      }
    );
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setCurrentAgent(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing) {
        await axios.patch(
          `${hosturl}/admin/agent/${currentAgent._id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        message.success("Agent updated");
      } else {
        await axios.post(`${hosturl}/admin/agent`, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        message.success("Agent added");
      }

      fetchAgents();
      handleCancel();
    } catch (err) {
      const backendMessage =
        err?.response?.data?.displayMessage ||
        err?.response?.data?.message;

      // Field level error UI
      if (backendMessage?.toLowerCase().includes("phone")) {
        form.setFields([{ name: "phoneNumber", errors: [backendMessage] }]);
        return;
      }

      if (backendMessage?.toLowerCase().includes("email")) {
        form.setFields([{ name: "email", errors: [backendMessage] }]);
        return;
      }

      if (backendMessage?.toLowerCase().includes("code")) {
        form.setFields([{ name: "code", errors: [backendMessage] }]);
        return;
      }

      if (backendMessage?.toLowerCase().includes("pan")) {
        form.setFields([{ name: "pan", errors: [backendMessage] }]);
        return;
      }

      message.error(backendMessage || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${hosturl}/admin/agent/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("Agent deleted");
      fetchAgents();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  const AgentTransactions = () => {
    navigate("/agent/transactions");
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone Number", dataIndex: "phoneNumber" },
    { title: "Code", dataIndex: "code" },
    { title: "PAN", dataIndex: "pan" },
    { title: "City", dataIndex: "city" },
    { title: "UPI", dataIndex: "upi" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this agent?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 24, background: "#fff", borderRadius: 8 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Agent Management
          </Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary" onClick={() => showModal()}>
              Add Agent
            </Button>
            <Button onClick={AgentTransactions}>Agent Transactions</Button>
          </Space>
        </Col>
      </Row>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={agents}
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
        scroll={{ x: true }}
      />

      <Modal
        title={isEditing ? "Edit Agent" : "Add Agent"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText={isEditing ? "Update" : "Create"}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Agent Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter agent name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^\d{10}$/,
                message: "Phone number must be exactly 10 digits",
              },
            ]}
          >
            <Input placeholder="Enter phone number" maxLength={10} />
          </Form.Item>

          <Form.Item name="code" label="Agent Code">
            <Input placeholder="Enter agent code (optional)" />
          </Form.Item>

          <Form.Item
            name="pan"
            label="PAN"
            rules={[
              {
                pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message: "Enter valid PAN (ABCDE1234F)",
              },
            ]}
          >
            <Input placeholder="Enter PAN" maxLength={10} />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea placeholder="Enter address" rows={2} />
          </Form.Item>

          <Form.Item name="city" label="City">
            <Input placeholder="Enter city" />
          </Form.Item>

          <Form.Item
            name="pincode"
            label="Pincode"
            rules={[
              {
                pattern: /^\d{6}$/,
                message: "Pincode must be 6 digits",
              },
            ]}
          >
            <Input placeholder="Enter pincode" maxLength={6} />
          </Form.Item>

          <Form.Item name="upi" label="UPI ID">
            <Input placeholder="Enter UPI ID" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AgentManager;
